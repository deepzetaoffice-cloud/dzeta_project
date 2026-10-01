import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { seriousAxeViolations } from './helpers/axe';

// Display preferences and the CSS contract (P2 plan, C and F; docs/ai/13 §2.11). Most choices are set
// through localStorage, as a switch stores them; the switches themselves are tested where they live,
// in the mobile sheet and the mega menu's rail (DisplayControls).

const HOME = '/';
const MISSING = '/this-page-does-not-exist';

const html = (page: Page) => page.locator('html');

async function store(page: Page, values: Record<string, string>) {
  await page.goto(HOME);
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
  }, values);
}

// Records the theme and the page colour at the first frame the browser renders, before React runs.
async function recordFirstFrame(page: Page) {
  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      const root = document.documentElement;
      (window as unknown as { firstFrame: object }).firstFrame = {
        theme: root.dataset.theme ?? null,
        background: getComputedStyle(root).backgroundColor,
      };
    });
  });
}

const firstFrame = (page: Page) =>
  page.waitForFunction(() => (window as unknown as { firstFrame?: object }).firstFrame).then((h) => h.jsonValue());

const tokenColour = (page: Page, token: string) =>
  page.evaluate((name) => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${name})`;
    document.body.append(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  }, token);

// The WCAG contrast of each text element's computed colour on its first painted background.
const forcedContrasts = (page: Page) =>
  page.evaluate(() => {
    const channels = (colour: string) => colour.match(/[\d.]+/g)!.map(Number);
    const luminance = (colour: string) =>
      channels(colour)
        .slice(0, 3)
        .map((c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4))
        .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0);
    const background = (element: Element) => {
      for (let e: Element | null = element; e; e = e.parentElement) {
        const colour = getComputedStyle(e).backgroundColor;
        if (channels(colour)[3] !== 0) return colour;
      }
      return 'rgb(255, 255, 255)';
    };
    return [...document.querySelectorAll('h1, p, a, #glass')].map((element) => {
      const [light, dark] = [luminance(getComputedStyle(element).color), luminance(background(element))].sort(
        (a, b) => b - a,
      );
      return (light! + 0.05) / (dark! + 0.05);
    });
  });

// A header-like glass surface: glass-live, navy in both themes.
async function addGlass(page: Page) {
  await page.evaluate(() => {
    const glass = document.createElement('div');
    glass.id = 'glass';
    glass.className = 'dz-glass dz-glass--live';
    glass.dataset.theme = 'dark';
    glass.textContent = 'Glass';
    document.body.prepend(glass);
  });
  return page.locator('#glass');
}

// Low-end hints are Chromium-only navigator properties; these replace them before any script runs.
const lowMemory = (page: Page) =>
  page.addInitScript(() =>
    Object.defineProperty(Navigator.prototype, 'deviceMemory', { configurable: true, get: () => 1 }),
  );
const saveData = (page: Page) =>
  page.addInitScript(() =>
    Object.defineProperty(
      (window as unknown as { NetworkInformation: { prototype: object } }).NetworkInformation.prototype,
      'saveData',
      { configurable: true, get: () => true },
    ),
  );

// A choice made while the page is open, as a switch makes it: stored, then announced to the runtime,
// which applies it whether or not it had started yet.
const choose = (page: Page, key: string, value: string) =>
  page.evaluate(
    ({ k, v }) => {
      localStorage.setItem(k, v);
      window.dispatchEvent(new StorageEvent('storage', { key: k, newValue: v }));
    },
    { k: key, v: value },
  );

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test.describe('Theme', () => {
  test('a stored light choice paints light from the first frame, and holds across reloads', async ({ page }) => {
    await store(page, { 'dz-theme': 'light' });
    await recordFirstFrame(page);
    for (let visit = 0; visit < 2; visit++) {
      await page.reload();
      expect(await firstFrame(page)).toEqual({ theme: 'light', background: await tokenColour(page, '--dz-paper') });
    }
  });

  // Browsers use the first color-scheme meta. After hydration Next.js adds a second one at the end of
  // <head>; the runtime keeps it light too.
  test('the color-scheme meta follows light', async ({ page }) => {
    await store(page, { 'dz-theme': 'light' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    const metas = page.locator('meta[name="color-scheme"]');
    await expect(metas.first()).toHaveAttribute('content', 'light');
    for (const meta of await metas.all()) await expect(meta).toHaveAttribute('content', 'light');
    await expect(html(page)).toHaveCSS('color-scheme', 'light');
  });

  test('every first visit stays dark, whatever else is stored', async ({ page }) => {
    await store(page, { 'dz-theme': 'dark' });
    await page.reload();
    await expect(html(page)).not.toHaveAttribute('data-theme');
    await expect(page.locator('meta[name="color-scheme"]').first()).toHaveAttribute('content', 'dark');
  });

  test('the 404 honours the stored theme and Reduce effects', async ({ page }) => {
    await store(page, { 'dz-theme': 'light', 'dz-effects': 'reduced' });
    await recordFirstFrame(page);
    const response = await page.goto(MISSING);
    expect(response?.status()).toBe(404);
    expect(await firstFrame(page)).toMatchObject({ theme: 'light' });
    await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
  });

  test('a choice made in another tab applies here too', async ({ page, context }) => {
    await page.goto(HOME);
    const other = await context.newPage();
    await other.goto(HOME);
    await other.waitForLoadState('networkidle');
    await page.evaluate(() => localStorage.setItem('dz-theme', 'light'));
    await expect(html(other)).toHaveAttribute('data-theme', 'light');
    await expect(other.locator('meta[name="color-scheme"]').first()).toHaveAttribute('content', 'light');
  });
});

test.describe('Reduce effects', () => {
  test('is off by default, and the header glass is live', async ({ page }) => {
    await page.goto(HOME);
    await expect(html(page)).not.toHaveAttribute('data-effects');
    const glass = await addGlass(page);
    await expect(glass).toHaveCSS('backdrop-filter', /blur\(17px\) saturate\(1\.4\)/);
    await expect(glass).toHaveCSS('background-image', 'none');
  });

  test('a stored choice turns it on before the first paint: glass-frost, with its grain', async ({ page }) => {
    await store(page, { 'dz-effects': 'reduced' });
    await page.reload();
    await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
    const glass = await addGlass(page);
    await expect(glass).toHaveCSS('backdrop-filter', 'none');
    await expect(glass).toHaveCSS('background-image', /\/brand\/glass-grain\.svg/);
  });

  test('the grain downloads only when a frost surface shows', async ({ page }) => {
    const grain: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('glass-grain.svg')) grain.push(request.url());
    });
    await page.goto(HOME);
    await addGlass(page);
    await expect(page.locator('#glass')).toHaveCSS('backdrop-filter', /blur/);
    expect(grain).toEqual([]);

    await choose(page, 'dz-effects', 'reduced');
    await expect(page.locator('#glass')).toHaveCSS('backdrop-filter', 'none');
    await expect.poll(() => grain.length).toBe(1);
    const response = await page.request.get('/brand/glass-grain.svg');
    expect((await response.body()).length).toBeLessThanOrEqual(512);
  });

  for (const [setting, media] of [
    ['reduced motion', { reducedMotion: 'reduce' }],
    ['more contrast', { contrast: 'more' }],
    ['forced colours', { forcedColors: 'active' }],
  ] as const) {
    test(`${setting} turns it on, and a stored "full" can't turn it off`, async ({ page }) => {
      await store(page, { 'dz-effects': 'full' });
      await page.emulateMedia(media);
      await page.reload();
      await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
      const glass = await addGlass(page);
      await expect(glass).toHaveCSS('backdrop-filter', 'none');
    });
  }

  test('reduced transparency (Chromium only) turns it on, before the first paint', async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
    });
    await store(page, { 'dz-effects': 'full' });
    await page.reload();
    await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
  });

  for (const [hint, apply] of [
    ['low memory', lowMemory],
    ['Save-Data', saveData],
  ] as const) {
    test(`${hint} turns it on, and a stored "full" overrides it`, async ({ page }) => {
      await apply(page);
      await page.goto(HOME);
      await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
      await page.evaluate(() => localStorage.setItem('dz-effects', 'full'));
      await page.reload();
      await expect(html(page)).not.toHaveAttribute('data-effects');
    });
  }

  test('follows a device setting that changes while the page is open', async ({ page }) => {
    await page.goto(HOME);
    await page.waitForLoadState('networkidle');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(html(page)).not.toHaveAttribute('data-effects');
  });
});

test.describe('Switches (DisplayControls: the mobile sheet, the mega-menu rail)', () => {
  // The switches sit in the sheet below 1024 px, so a phone-sized window opens it first.
  async function openSheet(page: Page) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(HOME);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Menu' }).click();
    const sheet = page.getByRole('dialog', { name: 'Menu' });
    await expect(sheet).toBeVisible();
    return {
      effects: sheet.getByRole('switch', { name: 'Reduce effects' }),
      theme: sheet.getByRole('switch', { name: 'Light theme' }),
    };
  }

  test('each switch stores its choice, and applies it at once', async ({ page }) => {
    const { effects, theme } = await openSheet(page);
    await expect(effects).toHaveAttribute('aria-checked', 'false');
    // Its note explains a lock, so a switch that works isn't described by it.
    await expect(effects).toHaveAccessibleDescription('');

    await effects.click();
    await expect(effects).toHaveAttribute('aria-checked', 'true');
    await expect(html(page)).toHaveAttribute('data-effects', 'reduced');
    expect(await page.evaluate(() => localStorage.getItem('dz-effects'))).toBe('reduced');

    await theme.click();
    await expect(theme).toHaveAttribute('aria-checked', 'true');
    await expect(html(page)).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="color-scheme"]').first()).toHaveAttribute('content', 'light');
    expect(await page.evaluate(() => localStorage.getItem('dz-theme'))).toBe('light');
  });

  test('every copy shows the same state: the mega-menu rail and the sheet', async ({ page }) => {
    await page.goto('/shell-review');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Services' }).click();
    await page.locator('#dz-mega').getByRole('switch', { name: 'Light theme' }).click();
    const copies = page.locator('[data-dz-switch="theme"]');
    await expect(copies).toHaveCount(2);
    for (const copy of await copies.all()) await expect(copy).toHaveAttribute('aria-checked', 'true');
  });

  test('a device setting shows Reduce effects on and disabled, with its note, and a click changes nothing', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const { effects } = await openSheet(page);
    await expect(effects).toHaveAttribute('aria-checked', 'true');
    await expect(effects).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByText('Your device settings turn this on.').first()).toBeVisible();
    await expect(effects).toHaveAccessibleDescription('Your device settings turn this on.');
    // Playwright won't click an aria-disabled control, but a visitor can, so the click is dispatched.
    await effects.dispatchEvent('click');
    await expect(effects).toHaveAttribute('aria-checked', 'true');
    expect(await page.evaluate(() => localStorage.getItem('dz-effects'))).toBeNull();
  });
});

test.describe('Forced colours (0015)', () => {
  test('glass is a solid system surface, the focus ring stays 2 px solid, and axe passes', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(HOME);
    const glass = await addGlass(page);
    await expect(glass).toHaveCSS('backdrop-filter', 'none');
    await expect(glass).toHaveCSS('background-image', 'none');
    const alpha = await glass.evaluate((el) => {
      const probe = document.createElement('canvas').getContext('2d')!;
      probe.fillStyle = getComputedStyle(el).backgroundColor;
      probe.fillRect(0, 0, 1, 1);
      return probe.getImageData(0, 0, 1, 1).data[3];
    });
    expect(alpha).toBe(255);

    await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    await expect(focused).toHaveCount(1);
    await expect(focused).toHaveCSS('outline-style', 'solid');
    await expect(focused).toHaveCSS('outline-width', '2px');

    // The browser paints forced colours from the system palette. axe 4.13 reads the author's text
    // colour against the forced background, so its color-contrast rule reports pairs no one sees
    // (frost on white); it's replaced here by the colours the browser computes.
    expect(Math.min(...(await forcedContrasts(page)))).toBeGreaterThanOrEqual(4.5);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .disableRules(['color-contrast'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test('more contrast gives glass an opaque surface', async ({ page }) => {
    await page.emulateMedia({ contrast: 'more' });
    await page.goto(HOME);
    const glass = await addGlass(page);
    await expect(glass).toHaveCSS('background-color', await tokenColour(page, '--dz-navy-850'));
    await expect(glass).toHaveCSS('background-image', 'none');
  });
});

// Two ways the fx variant compiles to selectors that never match, so an effect would silently never
// run: at the top level (Tailwind writes :scope) and after a pseudo-element (an empty :where()).
test('the built CSS has no fx rule that can never match', async ({ page }) => {
  await page.goto(HOME);
  const css = await page.evaluate(async () => {
    const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
    return (await Promise.all(links.map(async (link) => (await fetch(link.href)).text()))).join('\n');
  });
  expect(css).toContain(':not([data-effects=reduced])');
  expect(css).not.toContain(':scope:where(');
  expect(css).not.toContain(':where()');
});

test('no serious or critical axe violations with glass, in the light theme and with Reduce effects', async ({
  page,
}) => {
  await store(page, { 'dz-theme': 'light', 'dz-effects': 'reduced' });
  await page.reload();
  await addGlass(page);
  expect(await seriousAxeViolations(page)).toEqual([]);
});
