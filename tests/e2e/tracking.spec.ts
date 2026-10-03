import { expect, test, type Locator, type Page } from '@playwright/test';
import { consentModeState } from '../../src/lib/tracking/consent';
import { dataLayer, events, fromCountry } from './helpers/tracking';

// Tracking on the production build (docs/ai/09 §4; P3 plan, M): the region hint, the consent defaults
// as dataLayer[0], page views, the tracked clicks exactly once, attribution and (from B7) the CSP.
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

// Clicks a control without following it: its own listener stops the navigation (a mail client, a new
// tab), and the click still reaches the tracking runtime's listener on the document.
async function clickInPlace(page: Page, target: Locator) {
  await target.evaluate((el) => el.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await target.click();
}

const tracked = async (page: Page) =>
  (await events(page)).filter((entry) => ['cta_click', 'contact_click', 'outbound_click'].includes(entry.event));

test.describe('Page views (09 §2.9; TrackingRuntime)', () => {
  test('one page_view per page, with its address, title and content group', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect
      .poll(async () => (await events(page)).filter((e) => e.event === 'page_view'))
      .toEqual([
        {
          event: 'page_view',
          page_location: 'http://localhost:3000/',
          page_title: await page.title(),
          content_group: 'home',
        },
      ]);
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    await expect
      .poll(async () => (await events(page)).filter((e) => e.event === 'page_view').map((e) => e.content_group))
      .toEqual(['shell-review']);
  });

  test.describe('in Europe (DE)', () => {
    test.use(fromCountry('DE'));
    test('the page view is in the data layer too: the tags wait for consent in GTM, not here', async ({ page }) => {
      await page.goto('/');
      await expect.poll(async () => (await events(page)).map((e) => e.event)).toEqual(['page_view']);
    });
  });
});

test.describe('Tracked clicks, each exactly once (09 §4)', () => {
  test('the header CTA: cta_click from the header, and contact_click while it is an email link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await clickInPlace(page, page.locator('header [data-cta="header"]'));
    await expect
      .poll(() => tracked(page))
      .toEqual([
        { event: 'cta_click', cta_id: 'book_audit', cta_location: 'header' },
        { event: 'contact_click', method: 'email' },
      ]);
  });

  test('the sticky bar’s and the finale’s CTAs report where they sit', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => scrollTo(0, 900));
    const sticky = page.locator('[data-fx-sticky] [data-cta]');
    await expect(sticky).toBeVisible();
    await clickInPlace(page, sticky);
    const finale = page.locator('footer [data-cta="primary"]');
    await finale.scrollIntoViewIfNeeded();
    await clickInPlace(page, finale);
    await expect
      .poll(async () => (await tracked(page)).filter((e) => e.event === 'cta_click').map((e) => e.cta_location))
      .toEqual(['sticky', 'finale']);
  });

  test('the mobile sheet’s CTA reports the sheet', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Menu' }).click();
    await clickInPlace(page, page.locator('dialog.dz-sheet [data-cta]'));
    await expect
      .poll(async () => (await tracked(page)).filter((e) => e.event === 'cta_click').map((e) => e.cta_location))
      .toEqual(['sheet']);
  });

  test('a social tile reports outbound_click with its domain; the footer’s email, contact_click only', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const linkedin = page.getByRole('link', { name: 'Deepzeta AI on LinkedIn', exact: true });
    await linkedin.scrollIntoViewIfNeeded();
    await clickInPlace(page, linkedin);
    await clickInPlace(page, page.locator('footer address a[href^="mailto:"]'));
    await expect
      .poll(() => tracked(page))
      .toEqual([
        { event: 'outbound_click', destination_domain: 'linkedin.com' },
        { event: 'contact_click', method: 'email' },
      ]);
  });
});

test.describe('Click IDs and campaign tags (09 §2.8; attribution.ts)', () => {
  const stored = (page: Page) =>
    page.evaluate(() => [localStorage.getItem('dz-attribution-first'), localStorage.getItem('dz-attribution-last')]);

  test('outside Europe they’re stored on the first action, first touch and last touch', async ({ page }) => {
    const scripts: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'script') scripts.push(request.url());
    });
    await page.goto('/?utm_source=test&gclid=TEST123');
    await page.waitForLoadState('networkidle');
    // Not in the first load (07 §2, 0021): nothing is stored until the visitor acts, and the code comes then
    expect(await stored(page)).toEqual([null, null]);
    const loaded = scripts.length;
    await page.keyboard.press('Tab');
    await expect.poll(() => scripts.length).toBeGreaterThan(loaded);
    await expect
      .poll(async () => (await stored(page)).map((raw) => raw && JSON.parse(raw).params))
      .toEqual([
        { gclid: 'TEST123', utm_source: 'test' },
        { gclid: 'TEST123', utm_source: 'test' },
      ]);
  });

  test.describe('in Europe (DE)', () => {
    test.use(fromCountry('DE'));
    test('nothing is stored until Accept, then both are', async ({ page }) => {
      await page.goto('/?utm_campaign=spring');
      await page.waitForLoadState('networkidle');
      expect(await stored(page)).toEqual([null, null]);
      await page.getByRole('button', { name: 'Accept all' }).click();
      await expect
        .poll(async () => (await stored(page)).map((raw) => raw && JSON.parse(raw).params))
        .toEqual([{ utm_campaign: 'spring' }, { utm_campaign: 'spring' }]);
    });
  });
});

// GTM (09 §2.1, C56; gtm.ts). 09 §4: GTM requests are answered by a stub, so tests never send data.
// The build carries the container only once NEXT_PUBLIC_GTM_ID is set at build time (C5: the owner's
// Vercel step; the CSP gains googletagmanager.com only then, security-headers.ts), so until then both
// cases skip — the runtime gets null and the loader never runs.
test.describe('The GTM loader (09 §2.1, C56; gtm.ts)', () => {
  const GTM_SCRIPT = /^https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-[A-Z0-9]+$/;

  // Routes every third-party request: the container's script is answered by a stub, any other
  // third-party host is aborted and recorded — nothing but the site's own origin and the container
  // may load in a test.
  async function stubThirdParties(page: Page) {
    const requests: string[] = [];
    await page.route('**/*', (route) => {
      const { hostname } = new URL(route.request().url());
      if (hostname === 'localhost' || hostname === '127.0.0.1') return route.continue();
      requests.push(route.request().url());
      if (hostname === 'www.googletagmanager.com')
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
      return route.abort();
    });
    return requests;
  }

  const buildHasGtm = (csp: string | undefined) => (csp ?? '').includes('googletagmanager.com');

  test('one container request after hydration, after the consent default, and nothing else third-party', async ({
    page,
  }) => {
    const requests = await stubThirdParties(page);
    const response = await page.goto('/');
    test.skip(!buildHasGtm(response?.headers()['content-security-policy']), 'no GTM ID in this build (C5 pending)');
    await page.waitForLoadState('networkidle');
    // The loader's gtm.start lands after the consent default (09 §2.2): the container only runs once
    // dataLayer[0] has set the Consent Mode state it reads.
    const layer = await dataLayer(page);
    expect(layer[0]).toEqual({ gtag: ['consent', 'default', GRANTED] });
    const start = layer.findIndex((entry) => typeof entry === 'object' && entry !== null && 'gtm.start' in entry);
    expect(start).toBeGreaterThan(0);
    expect(requests.filter((url) => GTM_SCRIPT.test(url))).toHaveLength(1);
    expect(requests.filter((url) => !GTM_SCRIPT.test(url))).toEqual([]);
  });

  test.describe('in Europe (DE)', () => {
    test.use(fromCountry('DE'));
    test('the container still loads while consent is denied: the tags wait inside GTM, not here', async ({ page }) => {
      const requests = await stubThirdParties(page);
      const response = await page.goto('/');
      test.skip(!buildHasGtm(response?.headers()['content-security-policy']), 'no GTM ID in this build (C5 pending)');
      await page.waitForLoadState('networkidle');
      expect((await dataLayer(page))[0]).toEqual({ gtag: ['consent', 'default', DENIED] });
      expect(requests.some((url) => GTM_SCRIPT.test(url))).toBe(true);
    });
  });
});

test.describe('The Content Security Policy, enforced (C53; security-headers.ts)', () => {
  test.use(fromCountry('DE'));

  test('is sent as an enforced policy, and nothing on Home or the review page breaks it', async ({ page }) => {
    // Every violation the browser reports, from the first byte of each page.
    await page.addInitScript(() => {
      const seen: string[] = [];
      (window as unknown as { __csp: string[] }).__csp = seen;
      document.addEventListener('securitypolicyviolation', (event) =>
        seen.push(`${event.violatedDirective} ${event.blockedURI}`),
      );
    });
    const violations = () => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);

    const response = await page.goto('/');
    expect(response?.headers()['content-security-policy']).toContain("object-src 'none'");
    expect(response?.headers()['content-security-policy-report-only']).toBeUndefined();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Choose settings' }).click();
    await expect(page.getByRole('dialog', { name: 'Privacy settings' })).toBeVisible();
    await page.keyboard.press('Escape');
    expect(await violations()).toEqual([]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Accept all' }).click();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    expect(await violations()).toEqual([]);
  });
});
