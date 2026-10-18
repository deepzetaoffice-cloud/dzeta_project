import { expect, test } from '@playwright/test';
import { shellContent } from '../../src/content/en/shell';
import { ROUTES } from '../../src/lib/routes';
import { siteConfig } from '../../src/lib/site-config';

// The conversion CTA set, v3 (decisions 0024 and 0033 §9; C82, C83; docs/design/conversion-path.md):
// the header's "Book a free AI audit" with its honest WhatsApp fallback until the audit page ships,
// the floating WhatsApp button with the desktop header, the Call link in the footer's contact block,
// and "Book a free AI audit" as the in-page and sticky CTA. The expected hrefs are derived from the one
// site config exactly as the components derive them — never typed here.

const waHref = `https://wa.me/${siteConfig.whatsapp?.replace(/\D/g, '')}`;

test.describe('The conversion CTA set (decisions 0024 and 0033)', () => {
  for (const path of ['/', '/shell-review']) {
    test(`${path}: the floating WhatsApp button shows with the desktop header, named`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);
      const float = page.locator('[data-wa-float] a');
      await expect(page.locator('[data-wa-float]')).toHaveCount(1);
      await expect(float).toBeVisible();
      await expect(float).toHaveAttribute('href', waHref);
      await expect(float).toHaveAccessibleName(shellContent.whatsappLabel);
    });
  }

  test('below 1,280 px the float gives way to the mobile header (C83)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('[data-wa-float]')).toBeHidden();
  });

  test('the Call link: the footer contact block, tel: and the number as real text', async ({ page }) => {
    await page.goto('/');
    const call = page.locator('footer address a[href^="tel:"]');
    await expect(call).toHaveCount(1);
    await expect(call).toHaveAttribute('href', `tel:${siteConfig.phone}`);
    await expect(call).toContainText(siteConfig.phone);
  });

  test('the header button: "Book a free AI audit", opening WhatsApp until the audit page ships (C82)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const header = page.locator('header [data-cta="header"]');
    await expect(header).toHaveText(shellContent.cta);
    if (!ROUTES.R002.live) await expect(header).toHaveAttribute('href', waHref);
  });

  test('"Book a free AI audit" is the in-page and sticky CTA', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    // The hero's in-page CTA carries the audit label and, until R002 ships, the audit email.
    const inPage = page.locator('main [data-cta]').first();
    await expect(inPage).toContainText(shellContent.cta);
    if (!ROUTES.R002.live) {
      const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(shellContent.ctaEmailSubject)}`;
      await expect(inPage).toHaveAttribute('href', mailto);
    }
    // The sticky bar shows once no in-page audit CTA is on screen, with the same label.
    await page.evaluate(() => scrollTo(0, 900));
    const sticky = page.locator('[data-fx-sticky] [data-cta]');
    await expect(sticky).toBeVisible();
    await expect(sticky).toContainText(shellContent.cta);
  });
});
