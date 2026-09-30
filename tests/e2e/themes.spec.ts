import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser, type Page } from '@playwright/test';

// Themes and fonts (docs/plans/2026-09-30-p0-design-tokens-themes-fonts.md; docs/ai/05 §1–§3).
// Colours are compared with the tokens' own resolved values, so the tests follow tokens.css.
// There's no "no preference" case: Media Queries 5 folds it into `prefers-color-scheme: light`, and
// Chromium reports it as light.
type Scheme = 'light' | 'dark';

async function openHome(browser: Browser, colorScheme: Scheme, path = '/') {
  const context = await browser.newContext({ colorScheme });
  const page = await context.newPage();
  await page.goto(path);
  return { page, close: () => context.close() };
}

// The colour a token paints as, computed by the browser (e.g. "rgb(1, 4, 19)").
const tokenColour = (page: Page, token: string) =>
  page.evaluate((name) => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${name})`;
    document.body.append(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  }, token);

const backgroundOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor);

async function seriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  return results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => `${violation.id}: ${violation.help}`);
}

test.describe('Themes', () => {
  for (const [scheme, token] of [
    ['dark', '--dz-navy'],
    ['light', '--dz-paper'],
  ] as const) {
    test(`a first visit with the system set to ${scheme} gets the ${scheme} theme`, async ({ browser }) => {
      const { page, close } = await openHome(browser, scheme);
      expect(await backgroundOf(page, 'html')).toBe(await tokenColour(page, token));
      expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe(scheme);
      await close();
    });
  }

  test("the visitor's data-theme wins over the system setting", async ({ browser }) => {
    const light = await openHome(browser, 'dark');
    await light.page.locator('html').evaluate((el) => el.setAttribute('data-theme', 'light'));
    expect(await backgroundOf(light.page, 'html')).toBe(await tokenColour(light.page, '--dz-paper'));
    await light.close();

    const dark = await openHome(browser, 'light');
    await dark.page.locator('html').evaluate((el) => el.setAttribute('data-theme', 'dark'));
    expect(await backgroundOf(dark.page, 'html')).toBe(await tokenColour(dark.page, '--dz-navy'));
    await dark.close();
  });

  test('a data-theme="dark" part of a light page stays navy, with its own text colour', async ({ browser }) => {
    const { page, close } = await openHome(browser, 'light');
    await page.locator('main').evaluate((main) => {
      const band = document.createElement('section');
      band.id = 'navy-band';
      band.dataset.theme = 'dark';
      band.textContent = 'Always navy';
      main.append(band);
    });
    expect(await backgroundOf(page, '#navy-band')).toBe(await tokenColour(page, '--dz-navy'));
    const [bandText, frost] = await Promise.all([
      page.locator('#navy-band').evaluate((el) => getComputedStyle(el).color),
      tokenColour(page, '--dz-frost'),
    ]);
    expect(bandText).toBe(frost);
    await close();
  });

  for (const scheme of ['dark', 'light'] as const) {
    for (const path of ['/', '/this-page-does-not-exist']) {
      test(`${path} has no serious or critical axe violations in the ${scheme} theme`, async ({ browser }) => {
        const { page, close } = await openHome(browser, scheme, path);
        expect(await seriousAxeViolations(page)).toEqual([]);
        await close();
      });
    }
  }

  test('the H1 is still the LCP element in the dark theme', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');
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
    await context.close();
  });
});

test.describe('Fonts (docs/ai/05 §3, docs/ai/07 §2)', () => {
  test('come from our own origin, never Google, with font-display: swap', async ({ page, baseURL }) => {
    const fontRequests: string[] = [];
    const googleRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'font') fontRequests.push(request.url());
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) googleRequests.push(request.url());
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    expect(googleRequests).toEqual([]);
    expect(fontRequests.length).toBeGreaterThan(0);
    for (const url of fontRequests) expect(new URL(url).origin).toBe(new URL(baseURL!).origin);

    const faces = await page.evaluate(() =>
      [...document.fonts].map((face) => ({ family: face.family, display: face.display })),
    );
    // next/font's "… Fallback" faces are local Arial with adjusted metrics; they download nothing.
    const brandFaces = faces.filter(
      (face) => /montserrat|jetbrains/i.test(face.family) && !/fallback/i.test(face.family),
    );
    expect(brandFaces.length).toBeGreaterThanOrEqual(2);
    for (const face of brandFaces) expect(face.display, face.family).toBe('swap');
  });

  test('only Montserrat is preloaded, and the H1 is set in it', async ({ page }) => {
    await page.goto('/');
    const preloads = page.locator('link[rel="preload"][as="font"]');
    await expect(preloads).toHaveCount(1);
    await expect(preloads).toHaveAttribute('href', /montserrat/);
    await page.evaluate(() => document.fonts.ready);
    const h1Font = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily);
    expect(h1Font.toLowerCase()).toContain('montserrat');
    expect(await page.evaluate(() => document.fonts.check('700 1em montserrat'))).toBe(true);
  });
});
