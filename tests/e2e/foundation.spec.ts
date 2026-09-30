import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { parseEnv } from '../../src/lib/env';
import { isIndexable, robotsRules } from '../../src/lib/seo/indexing';

// P0 foundation checks (docs/plans/2026-09-30-p0-foundation.md, allowed-files table).
const currentEnv = parseEnv(process.env);
const indexable = isIndexable(currentEnv);
// Only Vercel previews and development builds block crawlers (decision 0013, option 2).
const blocksCrawlers = robotsRules(currentEnv).disallow === '/';
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

  test('works with JavaScript off: the H1 and the copy are in the server HTML', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main p')).toHaveCount(2);
    await context.close();
  });

  // docs/ai/13 §3 rule 2: the LCP element is visible, unclipped and in its final position at first
  // paint. It has no entrance animation and never starts hidden, not even through an ancestor.
  test('the LCP element is the H1, and it is visible and in place from first paint', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    const h1 = page.locator('h1');
    await h1.waitFor({ state: 'attached' });
    const boxAtFirstPaint = await h1.boundingBox();

    const firstPaintStyle = await h1.evaluate((el) => {
      let opacity = 1;
      for (let node: Element | null = el; node; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity);
      }
      const s = getComputedStyle(el);
      return {
        opacity,
        visibility: s.visibility,
        animation: s.animationName,
        transform: s.transform,
        translate: s.translate,
        scale: s.scale,
        rotate: s.rotate,
        clipPath: s.clipPath,
      };
    });
    expect(firstPaintStyle).toEqual({
      opacity: 1,
      visibility: 'visible',
      animation: 'none',
      transform: 'none',
      translate: 'none',
      scale: 'none',
      rotate: 'none',
      clipPath: 'none',
    });

    await page.waitForLoadState('load');
    expect(await h1.boundingBox()).toEqual(boxAtFirstPaint);

    const lcpTag = await page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('no LCP entry within 3 s'), 3000);
          new PerformanceObserver((list) => {
            const entries = list.getEntries() as (PerformanceEntry & { element?: Element | null })[];
            resolve(entries.at(-1)?.element?.tagName ?? 'unknown');
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        }),
    );
    expect(lcpTag).toBe('H1');
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

  test(`noindex header and robots.txt match the deployment (indexable: ${indexable})`, async ({ request }) => {
    const home = await request.get('/');
    const robots = await (await request.get('/robots.txt')).text();
    expect(home.headers()['x-robots-tag']).toBe(indexable ? undefined : 'noindex');
    // Whole-line matches: "Disallow: /" must never pass for "Allow: /" or the other way round.
    if (blocksCrawlers) {
      expect(robots).toMatch(/^Disallow: \/$/m);
      expect(robots).not.toMatch(/^Allow:/m);
    } else {
      // Also while the pre-launch lock is on, so crawlers can read the noindex header.
      expect(robots).toMatch(/^Allow: \/$/m);
      expect(robots).toMatch(/^Disallow: \/api\/$/m);
      expect(robots).not.toMatch(/^Disallow: \/$/m);
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
