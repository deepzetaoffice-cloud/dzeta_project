import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser, type Page } from '@playwright/test';

// Themes and fonts (docs/plans/2026-09-30-p0-design-tokens-themes-fonts.md; docs/ai/05 §1–§3).
// Colours are compared with the tokens' own resolved values, so the tests follow tokens.css.
// Every first visit is dark, whatever the system setting; light comes only from data-theme, which the
// visitor's switch sets from P2 (owner decision 2026-09-30, decision 0015).
type Scheme = 'light' | 'dark';
type Theme = 'light' | 'dark';

async function openPage(
  browser: Browser,
  { colorScheme, theme, path = '/' }: { colorScheme: Scheme; theme?: Theme; path?: string },
) {
  const context = await browser.newContext({ colorScheme });
  const page = await context.newPage();
  await page.goto(path);
  if (theme) await page.locator('html').evaluate((el, value) => el.setAttribute('data-theme', value), theme);
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
  for (const colorScheme of ['dark', 'light'] as const) {
    test(`a first visit is dark, also when the system is set to ${colorScheme}`, async ({ browser }) => {
      const { page, close } = await openPage(browser, { colorScheme });
      expect(await backgroundOf(page, 'html')).toBe(await tokenColour(page, '--dz-navy'));
      expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe('dark');
      await close();
    });

    test(`data-theme="light" gives the light theme (system set to ${colorScheme})`, async ({ browser }) => {
      const { page, close } = await openPage(browser, { colorScheme, theme: 'light' });
      expect(await backgroundOf(page, 'html')).toBe(await tokenColour(page, '--dz-paper'));
      expect(await page.locator('html').evaluate((el) => getComputedStyle(el).colorScheme)).toBe('light');
      await close();
    });
  }

  test('a data-theme="dark" part of a light page stays navy, with its own text colour', async ({ browser }) => {
    const { page, close } = await openPage(browser, { colorScheme: 'light', theme: 'light' });
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

  // The LCP check (the H1, visible and in place at first paint) is in foundation.spec.ts, which runs
  // in the dark theme every first visit gets.
  for (const theme of ['dark', 'light'] as const) {
    for (const path of ['/', '/this-page-does-not-exist']) {
      test(`${path} has no serious or critical axe violations in the ${theme} theme`, async ({ browser }) => {
        const { page, close } = await openPage(browser, { colorScheme: 'light', theme, path });
        expect(await seriousAxeViolations(page)).toEqual([]);
        await close();
      });
    }
  }
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
    // document.fonts.check() is also true when no face matches the family, so look for a loaded face.
    const montserratLoaded = await page.evaluate(() =>
      [...document.fonts].some(
        (face) => /montserrat/i.test(face.family) && !/fallback/i.test(face.family) && face.status === 'loaded',
      ),
    );
    expect(montserratLoaded).toBe(true);
  });
});
