import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { LOCKED_LOGO_PATH, LOGO_URL, LOGO_VERSIONED_URL } from '../../src/lib/brand';
import { siteConfig } from '../../src/lib/site-config';
import { readToken } from '../../src/lib/tokens';

// P1 brand checks on the built site (docs/plans/2026-09-30-p1-brand-primitives.md, section E): the logo
// on Home, the head's icons and colours, the manifest and every file it lists. Headless Chromium
// doesn't request favicons itself (0014), so the files are fetched directly.
const NAVY = readToken('--dz-navy');
const UNKNOWN_URL = '/this-page-does-not-exist';
const IMMUTABLE = 'public, max-age=31536000, immutable';

// Width and height from a PNG's IHDR chunk.
const pngSize = (bytes: Buffer) => `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`;

test.describe('The logo on Home', () => {
  test('shows the locked logo, named "Deepzeta AI", in a navy header', async ({ page }) => {
    const logoResponse = page.waitForResponse((response) => new URL(response.url()).pathname === LOGO_URL);
    await page.goto('/');
    const response = await logoResponse;
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/svg+xml');
    // The versioned URL, kept for a year (P2 plan, E1–E2).
    expect(new URL(response.url()).search).toBe(new URL(LOGO_VERSIONED_URL, response.url()).search);
    expect(response.headers()['cache-control']).toBe(IMMUTABLE);

    const logo = page.getByRole('img', { name: siteConfig.brandName });
    await expect(logo).toBeVisible();
    await expect(
      page.locator('header[data-theme="dark"]').getByRole('img', { name: siteConfig.brandName }),
    ).toHaveCount(1);
    // Both crops show the same file; nothing is redrawn.
    await expect(logo.locator('image')).toHaveCount(2);
    for (const image of await logo.locator('image').all())
      await expect(image).toHaveAttribute('href', LOGO_VERSIONED_URL);
  });

  test('is kept for a year only at its current versioned URL', async ({ request }) => {
    expect((await request.get(LOGO_VERSIONED_URL)).headers()['cache-control']).toBe(IMMUTABLE);
    for (const url of [LOGO_URL, `${LOGO_URL}?v=00000000`])
      expect((await request.get(url)).headers()['cache-control'], url).not.toContain('immutable');
  });

  test('serves the locked file byte for byte', async ({ request }) => {
    const response = await request.get(LOGO_URL);
    expect(response.status()).toBe(200);
    expect(Buffer.from(await response.body()).equals(readFileSync(LOCKED_LOGO_PATH))).toBe(true);
  });

  test('never mirrors in Arabic: the mark stays left of the wordmark (11 §1)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    const [mark, wordmark] = await page
      .getByRole('img', { name: siteConfig.brandName })
      .locator('svg')
      .evaluateAll((svgs) => svgs.map((svg) => svg.getBoundingClientRect().left));
    expect(mark).toBeLessThan(wordmark ?? 0);
  });

  test('keeps its navy backing in forced-colours mode, so the white "Deep" stays visible', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/');
    const logo = page.getByRole('img', { name: siteConfig.brandName });
    await expect(logo).toHaveCSS('forced-color-adjust', 'none');
    await expect(logo).toHaveCSS('background-color', 'rgb(1, 4, 19)');
  });
});

test.describe('Head: icons and colours', () => {
  for (const [label, path] of [
    ['Home', '/'],
    ['the 404 page', UNKNOWN_URL],
  ] as const) {
    test(`${label} links the icons and the manifest, and sets the theme colours`, async ({ page }) => {
      await page.goto(path);
      const head = page.locator('head');
      await expect(head.locator('link[rel="icon"][href^="/favicon.ico"]')).toHaveCount(1);
      await expect(head.locator('link[rel="icon"][href^="/icon.png"][sizes="192x192"]')).toHaveCount(1);
      await expect(head.locator('link[rel="apple-touch-icon"][href^="/apple-icon.png"][sizes="180x180"]')).toHaveCount(
        1,
      );
      await expect(head.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
      await expect(head.locator('meta[name="theme-color"]')).toHaveAttribute('content', NAVY);
      await expect(head.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');
    });
  }

  test('every linked icon file exists', async ({ page, request }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('head link[rel="icon"], head link[rel="apple-touch-icon"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs).toHaveLength(3);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      expect(response.headers()['content-type'], href).toMatch(/^image\/(png|x-icon)/);
    }
  });
});

test.describe('The manifest', () => {
  test('names the brand, uses navy, and every icon it lists matches its declared size', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/manifest+json');
    const manifest = (await response.json()) as {
      name: string;
      display: string;
      theme_color: string;
      background_color: string;
      icons: { src: string; sizes: string; type: string; purpose: string }[];
    };
    expect(manifest.name).toBe(siteConfig.brandName);
    expect(manifest.display).toBe('browser');
    expect([manifest.theme_color, manifest.background_color]).toEqual([NAVY, NAVY]);
    expect(manifest.icons.map((icon) => icon.purpose)).toEqual(['any', 'any', 'maskable']);
    for (const icon of manifest.icons) {
      const file = await request.get(icon.src);
      expect(file.status(), icon.src).toBe(200);
      expect(file.headers()['content-type'], icon.src).toBe(icon.type);
      expect(pngSize(Buffer.from(await file.body())), icon.src).toBe(icon.sizes);
    }
  });

  test('/favicon.ico is served, so no page logs a favicon 404 (0014)', async ({ request }) => {
    const response = await request.get('/favicon.ico');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/x-icon');
  });
});
