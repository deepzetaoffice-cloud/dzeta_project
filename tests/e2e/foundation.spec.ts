import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { parseEnv } from '../../src/lib/env';
import { isIndexable } from '../../src/lib/seo/indexing';

// P0 foundation checks (docs/plans/2026-09-30-p0-foundation.md, allowed-files table).
const indexable = isIndexable(parseEnv(process.env));
const UNKNOWN_URL = '/this-page-does-not-exist';

async function seriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  return results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => `${violation.id}: ${violation.help}`);
}

test.describe('Home', () => {
  test('renders one H1 with lang and dir from the locale', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('works with JavaScript off, and the H1 is visible and in place at first paint', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'commit' });
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    // docs/ai/13 §3 rule 2: the LCP element never starts hidden or animates in.
    const style = await h1.evaluate((el) => {
      const s = getComputedStyle(el);
      return { opacity: s.opacity, visibility: s.visibility, animation: s.animationName };
    });
    expect(style).toEqual({ opacity: '1', visibility: 'visible', animation: 'none' });
    await context.close();
  });

  test('logs no console errors or CSP report-only violations', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || /Content Security Policy|Report Only/i.test(message.text())) {
        messages.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(messages).toEqual([]);
  });

  test('has no serious or critical axe violations', async ({ page }) => {
    await page.goto('/');
    expect(await seriousAxeViolations(page)).toEqual([]);
  });
});

test.describe('Headers and robots (docs/ai/06 §4, docs/ai/08 §1)', () => {
  test('security headers are set once, centrally, without deprecated ones', async ({ request }) => {
    const headers = (await request.get('/')).headers();
    expect(headers['content-security-policy-report-only']).toContain("default-src 'self'");
    expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['x-xss-protection']).toBeUndefined();
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test(`noindex header and robots.txt match the indexing mode (indexable: ${indexable})`, async ({ request }) => {
    const home = await request.get('/');
    const robots = await (await request.get('/robots.txt')).text();
    if (indexable) {
      expect(home.headers()['x-robots-tag']).toBeUndefined();
      expect(robots).toMatch(/Allow: \/\s/);
      expect(robots).toContain('Disallow: /api/');
    } else {
      expect(home.headers()['x-robots-tag']).toBe('noindex');
      expect(robots).toMatch(/Disallow: \/\s*$/);
    }
  });
});

test.describe('404', () => {
  test('an unknown URL returns 404 with noindex and a way home', async ({ page }) => {
    const response = await page.goto(UNKNOWN_URL);
    expect(response?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveCount(1);
    await page.getByRole('link', { name: /home page/ }).click();
    await expect(page).toHaveURL('/');
  });

  test('has no serious or critical axe violations', async ({ page }) => {
    await page.goto(UNKNOWN_URL);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });
});
