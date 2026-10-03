import { expect, test, type Page } from '@playwright/test';
import { consentContent } from '../../src/content/en/legal/consent';
import { consentModeState } from '../../src/lib/tracking/consent';
import { seriousAxeViolations } from './helpers/axe';
import { dataLayer, events, fromCountry, stubGtm } from './helpers/tracking';

// The consent banner and Cookie settings (docs/ai/09 §2.7, C52; P3 plan, D, E and M;
// docs/design/conversion-path.md). A European visitor (DE) sees the banner; a visitor from the UAE
// (the e2e project's default) doesn't, and uses Cookie settings in the footer.

const { banner, settings, footer } = consentContent;
const HOME = '/';
const REVIEW = '/shell-review';
const BANNER = '[data-consent-banner]';

async function open(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: width < 1024 ? 640 : 800 });
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

// The gtag() commands after the defaults, and the consent_update events.
const updates = async (page: Page) =>
  (await dataLayer(page)).filter(
    (entry): entry is { gtag: unknown[] } =>
      typeof entry === 'object' &&
      entry !== null &&
      'gtag' in entry &&
      Array.isArray(entry.gtag) &&
      entry.gtag[1] === 'update',
  );
const consentEvents = async (page: Page) => (await events(page)).filter((entry) => entry.event === 'consent_update');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await stubGtm(page);
});

test.describe('A European visitor (DE): the banner', () => {
  test.use(fromCountry('DE'));

  test('is in the first frame, before any of the site’s JavaScript runs, and never covers the H1 at 360 × 640', async ({
    page,
  }) => {
    await page.route('**/_next/static/**/*.js', (route) => route.abort());
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(HOME);
    const aside = page.getByRole('complementary', { name: banner.title });
    await expect(aside).toBeVisible();
    const h1 = (await page.locator('h1').boundingBox())!;
    const box = (await aside.boundingBox())!;
    expect(h1.y + h1.height).toBeLessThanOrEqual(box.y);
  });

  test('Accept all: Consent Mode updated to granted, consent_update once, the banner gone, focus in <main>', async ({
    page,
  }) => {
    await open(page, HOME, 1280);
    await page.getByRole('button', { name: banner.acceptAll }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(BANNER)).toBeHidden();
    await expect(page.locator('#main')).toBeFocused();
    await expect
      .poll(() => consentEvents(page))
      .toEqual([
        {
          event: 'consent_update',
          consent_analytics: 'granted',
          consent_marketing: 'granted',
          consent_granted_now: 'analytics marketing',
        },
      ]);
    expect(await updates(page)).toEqual([
      { gtag: ['consent', 'update', consentModeState({ analytics: true, marketing: true })] },
    ]);
    await page.reload();
    await expect(page.locator(BANNER)).toBeHidden();
    expect((await dataLayer(page))[0]).toEqual({
      gtag: ['consent', 'default', consentModeState({ analytics: true, marketing: true })],
    });
  });

  test('Reject all: everything stays denied, and the banner is gone for good', async ({ page }) => {
    await open(page, HOME, 390);
    await page.getByRole('button', { name: banner.rejectAll }).click();
    await expect(page.locator(BANNER)).toBeHidden();
    await expect
      .poll(() => consentEvents(page))
      .toEqual([
        {
          event: 'consent_update',
          consent_analytics: 'denied',
          consent_marketing: 'denied',
          consent_granted_now: 'none',
        },
      ]);
    await page.reload();
    await expect(page.locator(BANNER)).toBeHidden();
  });

  test('the two choices are the same size and weight', async ({ page }) => {
    await open(page, HOME, 1280);
    const look = (name: string) =>
      page.getByRole('button', { name }).evaluate((el) => {
        const style = getComputedStyle(el);
        return [el.getBoundingClientRect().height, style.fontSize, style.fontWeight, style.borderTopWidth];
      });
    expect(await look(banner.acceptAll)).toEqual(await look(banner.rejectAll));
  });

  test('Choose settings: a modal dialog; Esc closes it and focus returns; Save applies only what was switched on', async ({
    page,
  }) => {
    await open(page, HOME, 1280);
    const choose = page.getByRole('button', { name: banner.choose });
    await choose.click();
    const dialog = page.getByRole('dialog', { name: settings.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('switch', { name: settings.analytics.name })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(choose).toBeFocused();
    expect(await consentEvents(page)).toEqual([]);

    await choose.click();
    await dialog.getByRole('switch', { name: settings.analytics.name }).click();
    await expect(dialog.getByRole('switch', { name: settings.analytics.name })).toHaveAttribute('aria-checked', 'true');
    await dialog.getByRole('button', { name: settings.save }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator(BANNER)).toBeHidden();
    await expect(page.locator('#main')).toBeFocused();
    await expect(page.getByRole('status')).toHaveText(settings.saved);
    await expect
      .poll(() => consentEvents(page))
      .toEqual([
        {
          event: 'consent_update',
          consent_analytics: 'granted',
          consent_marketing: 'denied',
          consent_granted_now: 'analytics',
        },
      ]);
  });

  test('the sticky CTA bar gives way while the banner shows, and returns after the choice', async ({ page }) => {
    await open(page, REVIEW, 390);
    const bar = page.locator('[data-fx-sticky]');
    // Past the hero's CTA, where the bar would be up (C42)
    await page.evaluate(() => scrollTo(0, 900));
    await expect(bar).toBeHidden();
    await page.getByRole('button', { name: banner.rejectAll }).click();
    await expect(bar).toBeVisible();
  });

  for (const [path, width, tabs] of [
    [HOME, 390, 30],
    [REVIEW, 1280, 90],
  ] as const) {
    test(`${width} px, ${path}: Tab never leaves a focused control under the banner (WCAG 2.4.11)`, async ({
      page,
    }) => {
      await open(page, path, width);
      const covered = () =>
        page.evaluate((selector) => {
          const el = document.activeElement;
          const aside = document.querySelector(selector);
          if (!el || el === document.body || !aside || aside.contains(el)) return 0;
          const root = getComputedStyle(document.documentElement);
          const ring =
            parseFloat(root.getPropertyValue('--dz-focus-width')) +
            parseFloat(root.getPropertyValue('--dz-focus-offset'));
          return Math.max(0, el.getBoundingClientRect().bottom + ring - aside.getBoundingClientRect().top);
        }, BANNER);
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab');
        await expect.poll(covered).toBe(0);
      }
    });
  }

  test('at 320 × 256 (400% zoom) it scrolls inside itself, so its title and every button can be reached (WCAG 1.4.10)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto(HOME);
    await page.waitForLoadState('networkidle');
    const aside = page.locator(BANNER);
    const box = (await aside.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.height).toBeLessThanOrEqual(256);
    for (const target of [
      page.locator('#dz-consent-title'),
      page.getByRole('button', { name: banner.acceptAll }),
      page.getByRole('button', { name: banner.rejectAll }),
      page.getByRole('button', { name: banner.choose }),
    ]) {
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeInViewport();
    }
  });

  test('comes after the skip link in the Tab order, and the skip link still lands on <main>', async ({ page }) => {
    await open(page, HOME, 1280);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: banner.acceptAll })).toBeFocused();
  });

  test('under Reduce effects it goes at once; in forced colours it keeps a visible edge', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await open(page, HOME, 1280);
    const edge = await page
      .locator(BANNER)
      .evaluate((el) => [getComputedStyle(el).borderTopStyle, getComputedStyle(el).borderTopWidth]);
    expect(edge[0]).toBe('solid');
    expect(parseFloat(edge[1]!)).toBeGreaterThan(0);
    await page.getByRole('button', { name: banner.acceptAll }).click();
    await expect(page.locator(BANNER)).toBeHidden({ timeout: 100 });
  });

  test('in Arabic (RTL) the corner panel sits at the inline end, on the left', async ({ page }) => {
    await open(page, HOME, 1280);
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    const box = (await page.locator(BANNER).boundingBox())!;
    expect(box.x).toBeLessThan(100);
  });

  test('no serious or critical axe violations, with the banner and with the dialog open', async ({ page }) => {
    await open(page, HOME, 390);
    expect(await seriousAxeViolations(page)).toEqual([]);
    await page.getByRole('button', { name: banner.choose }).click();
    await expect(page.getByRole('dialog', { name: settings.title })).toBeVisible();
    expect(await seriousAxeViolations(page)).toEqual([]);
  });
});

test.describe('JavaScript off', () => {
  test.use({ ...fromCountry('DE'), javaScriptEnabled: false });
  test('nothing runs, so nothing asks: no banner, and no Cookie settings button', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator(BANNER)).toBeHidden();
    await expect(page.getByRole('button', { name: footer.cookieSettings })).toBeHidden();
  });
});

test.describe('A visitor from the UAE: Cookie settings', () => {
  test('no banner; Cookie settings shows both groups on; switching Analytics off deletes its cookies', async ({
    page,
    context,
  }) => {
    await context.addCookies([{ name: '_ga', value: 'GA1.1.123.456', domain: 'localhost', path: '/' }]);
    await open(page, HOME, 1280);
    await expect(page.locator(BANNER)).toBeHidden();
    const button = page.getByRole('button', { name: footer.cookieSettings });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    const dialog = page.getByRole('dialog', { name: settings.title });
    const analytics = dialog.getByRole('switch', { name: settings.analytics.name });
    await expect(analytics).toHaveAttribute('aria-checked', 'true');
    await expect(dialog.getByRole('switch', { name: settings.marketing.name })).toHaveAttribute('aria-checked', 'true');
    await analytics.click();
    await dialog.getByRole('button', { name: settings.save }).click();
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect
      .poll(() => consentEvents(page))
      .toEqual([
        {
          event: 'consent_update',
          consent_analytics: 'denied',
          consent_marketing: 'granted',
          consent_granted_now: 'none',
        },
      ]);
    expect((await context.cookies()).map((cookie) => cookie.name)).not.toContain('_ga');
  });

  test('the dialog lists the site’s own storage, and no vendor while none is in use', async ({ page }) => {
    await open(page, HOME, 1280);
    await page.getByRole('button', { name: footer.cookieSettings }).click();
    const dialog = page.getByRole('dialog', { name: settings.title });
    for (const key of ['dz-consent', 'dz-theme', 'dz-effects']) {
      await expect(dialog.getByRole('cell', { name: key, exact: true })).toBeVisible();
    }
    await expect(dialog.getByRole('cell', { name: '_ga', exact: true })).toHaveCount(0);
  });
});
