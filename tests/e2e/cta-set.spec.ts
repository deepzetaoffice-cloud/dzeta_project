import { expect, test } from '@playwright/test';
import { shellContent } from '../../src/content/en/shell';
import { ROUTES } from '../../src/lib/routes';
import { siteConfig } from '../../src/lib/site-config';

// The conversion CTA set (decision 0024; docs/plans/2026-10-07-cta-set.md; docs/design/conversion-path.md):
// WhatsApp as the primary floating CTA site-wide, the Call button in the footer's contact block, the
// header button "Deepzeta AI" with its honest WhatsApp fallback until the P7 agent bot, and "Book a
// free AI audit" kept as the deliberate in-page and sticky CTA. The contact page (R005) is itself the
// contact surface; its own plan asserts the float's exclusion there. The expected hrefs are derived
// from the one site config exactly as the components derive them — never typed here.

const waHref = `https://wa.me/${siteConfig.whatsapp?.replace(/\D/g, '')}`;

test.describe('The conversion CTA set (decision 0024)', () => {
  for (const path of ['/', '/shell-review']) {
    test(`${path}: the floating WhatsApp button is the one floating CTA`, async ({ page }) => {
      await page.goto(path);
      const float = page.locator('[data-wa-float] a');
      await expect(page.locator('[data-wa-float]')).toHaveCount(1);
      await expect(float).toBeVisible();
      await expect(float).toHaveAttribute('href', waHref);
      await expect(float).toHaveText(shellContent.whatsappLabel);
      // glass-frost with hover-outline, never the action gradient (C42): no CTA charge layer inside.
      await expect(float.locator('.dz-cta-charge')).toHaveCount(0);
      // The theme is on the wrapper, never on the link that takes focus (0015).
      await expect(float).not.toHaveAttribute('data-theme');
      // It is the only floating button: nothing else fixes itself to the corner beside it.
      await expect(page.locator('header [data-cta="header"]')).toHaveAttribute('href', waHref);
    });
  }

  test('the float lifts above the sticky CTA bar on a phone (the 360 px priority list)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => scrollTo(0, 900));
    const sticky = page.locator('[data-fx-sticky]');
    await expect(sticky).toBeVisible();
    const floatBox = await page.locator('[data-wa-float]').boundingBox();
    const stickyBox = await sticky.boundingBox();
    expect(floatBox, 'the float has a box').not.toBeNull();
    expect(stickyBox, 'the sticky bar has a box').not.toBeNull();
    expect(floatBox!.y + floatBox!.height, 'the float sits above the sticky bar').toBeLessThanOrEqual(stickyBox!.y);
  });

  test('the Call button: the footer contact block, tel: and the number as real text', async ({ page }) => {
    await page.goto('/');
    const call = page.locator('footer address a[href^="tel:"]');
    await expect(call).toHaveCount(1);
    await expect(call).toHaveAttribute('href', `tel:${siteConfig.phone}`);
    await expect(call).toContainText(shellContent.callLabel);
    await expect(call).toContainText(siteConfig.phone);
  });

  test('the header button: the brand name, opening WhatsApp until the P7 agent bot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const header = page.locator('header [data-cta="header"]');
    await expect(header).toHaveText(siteConfig.brandName);
    await expect(header).toHaveAttribute('href', waHref);
  });

  test('"Book a free AI audit" stays the deliberate in-page and sticky CTA', async ({ page }) => {
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
    // The sticky bar shows once no in-page primary CTA is on screen (the tracking tests' pattern),
    // and keeps the same label. At the very document end the finale's CTA takes over instead (C42).
    await page.evaluate(() => scrollTo(0, 900));
    const sticky = page.locator('[data-fx-sticky] [data-cta]');
    await expect(sticky).toBeVisible();
    await expect(sticky).toContainText(shellContent.cta);
  });
});
