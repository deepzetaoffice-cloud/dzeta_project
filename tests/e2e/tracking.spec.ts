import { expect, test } from '@playwright/test';
import { consentModeState } from '../../src/lib/tracking/consent';
import { dataLayer, fromCountry } from './helpers/tracking';

// Tracking on the production build (docs/ai/09 §4; P3 plan, M): the region hint, the consent defaults
// as dataLayer[0], and (from later steps) page views, events exactly once, attribution and the CSP.
// The e2e project's visitor is in the UAE unless a test says otherwise (playwright.config.ts).

const GRANTED = consentModeState({ analytics: true, marketing: true });
const DENIED = consentModeState({ analytics: false, marketing: false });

test.describe('The region hint (C52; region.ts)', () => {
  test('a page gets it, and the build’s own files and the logo don’t', async ({ request }) => {
    const hint = async (path: string, country: string) =>
      (await request.get(path, { headers: { 'x-vercel-ip-country': country } })).headers()['server-timing'];
    expect(await hint('/', 'AE')).toBe('dz-region;desc="row"');
    expect(await hint('/', 'FR')).toBe('dz-region;desc="eea"');
    expect(await hint('/this-page-does-not-exist', 'CH')).toBe('dz-region;desc="eea"');
    expect(await hint('/brand/deepzeta-logo.svg', 'AE')).toBeUndefined();
    expect(await hint('/robots.txt', 'AE')).toBeUndefined();
    const html = await (await request.get('/')).text();
    const chunk = html.match(/\/_next\/static\/[^"]+\.js/)?.[0];
    expect(chunk).toBeDefined();
    expect(await hint(chunk!, 'AE')).toBeUndefined();
  });
});

test.describe('Consent defaults before GTM (09 §2.2; consent-init.ts)', () => {
  test('outside Europe (AE): dataLayer[0] grants everything, and no banner is asked for', async ({ page }) => {
    await page.goto('/');
    const [first] = await dataLayer(page);
    expect(first).toEqual({ gtag: ['consent', 'default', GRANTED] });
    expect(await page.locator('html').getAttribute('data-consent')).toBeNull();
  });

  test.describe('in Europe (DE)', () => {
    test.use(fromCountry('DE'));
    test('dataLayer[0] denies everything, and the banner is asked for before the first paint', async ({ page }) => {
      // The attribute is read from the HTML as parsed, before any of the site's JavaScript runs.
      await page.route('**/_next/static/**/*.js', (route) => route.abort());
      await page.goto('/');
      expect(await page.locator('html').getAttribute('data-consent')).toBe('ask');
      const [first] = await dataLayer(page);
      expect(first).toEqual({ gtag: ['consent', 'default', DENIED] });
    });
  });

  test.describe('with no country (no hint)', () => {
    test.use({ extraHTTPHeaders: {} });
    test('counts as Europe', async ({ page }) => {
      await page.goto('/');
      expect(await page.locator('html').getAttribute('data-consent')).toBe('ask');
      expect((await dataLayer(page))[0]).toEqual({ gtag: ['consent', 'default', DENIED] });
    });
  });

  test('a stored choice wins over the region, and an old one stops counting', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('dz-consent', JSON.stringify({ v: 1, a: 1, m: 0, t: Date.now() })));
    await page.reload();
    expect((await dataLayer(page))[0]).toEqual({
      gtag: ['consent', 'default', consentModeState({ analytics: true, marketing: false })],
    });
    await page.evaluate(() =>
      localStorage.setItem('dz-consent', JSON.stringify({ v: 1, a: 0, m: 0, t: Date.now() - 366 * 864e5 })),
    );
    await page.reload();
    expect((await dataLayer(page))[0]).toEqual({ gtag: ['consent', 'default', GRANTED] });
  });
});
