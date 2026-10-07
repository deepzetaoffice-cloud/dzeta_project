import { expect, test, type Locator, type Page } from '@playwright/test';
import { navigation } from '../../src/content/en/navigation';
import { shellContent } from '../../src/content/en/shell';
import { ROUTES } from '../../src/lib/routes';
import { siteConfig } from '../../src/lib/site-config';
import { seriousAxeViolations } from './helpers/axe';

// The shell (P2 plan, O; docs/design/header.md, footer.md, conversion-path.md): the skip link, the
// header, the mega menu, the mobile sheet, the footer and the sticky CTA bar. Home shows what
// production shows, live links only; the review page shows every item, each a placeholder link. The
// exit gate's widths are 360, 390, 768 and 1280 px; 1024 and 1536 are checked for layout.

const HOME = '/';
const REVIEW = '/shell-review';
const MISSING = '/this-page-does-not-exist';
const PHONES = [360, 390, 768];
const DESKTOPS = [1024, 1280, 1536];
const SHEET = 'dialog.dz-sheet';
const MEGA = '#dz-mega';

async function open(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: width < 1024 ? 844 : 900 });
  await page.goto(path);
  // The runtime starts after hydration: the hand-off, the marker and the condense need it.
  await page.waitForLoadState('networkidle');
}

// Waits for every time-based animation. The journey line runs on the page's scroll timeline, so it
// finishes only at the page's end; it's left out.
const settled = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.timeline === document.timeline)
        .map((animation) => animation.finished),
    ),
  );

const socialName = (platform: string) => shellContent.socialLinkName(siteConfig.brandName, platform);

// Numbers the visible tab stops inside `scope` in document order, and returns how many there are.
const numberStops = (page: Page, scope: string) =>
  page.locator(scope).evaluate((root) => {
    const stops = [...root.querySelectorAll('a[href], button')].filter((el) => el.checkVisibility());
    stops.forEach((el, index) => el.setAttribute('data-stop', String(index)));
    return stops.length;
  });

const focusedStop = (page: Page) =>
  page.evaluate(() => {
    const active = document.activeElement;
    return active?.getAttribute('data-stop') ?? `${active?.tagName} "${active?.textContent?.trim()}"`;
  });

// Each visible control in `scope` whose tap area misses a 42 px cross around its centre (05 §7: 44 ×
// 44 px). The browser's own hit test decides, so a hit area that a pseudo-element adds counts, and
// anything covering the control shows up as a miss. Each control is scrolled to the middle of the
// window first, so its whole cross is on screen (at an edge, part of it would be outside).
const missedTargets = (page: Page, scope: string) =>
  page.locator(scope).evaluate((root) =>
    [...root.querySelectorAll('a[href], button')]
      .filter((el) => el.checkVisibility())
      .flatMap((el) => {
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        const box = el.getBoundingClientRect();
        const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
        const points = [
          [x, y - 21],
          [x, y + 21],
          [x - 21, y],
          [x + 21, y],
        ];
        const missed = points.some(([px, py]) => !el.contains(document.elementFromPoint(px!, py!)));
        return missed ? [(el.getAttribute('aria-label') ?? el.textContent ?? '').trim()] : [];
      }),
  );

// A theme belongs on containers, never on something that takes focus (0015).
const themedFocusables = (page: Page) =>
  page
    .locator('[data-theme]')
    .evaluateAll((elements) =>
      elements
        .filter((el) => el.matches('a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]'))
        .map((el) => el.outerHTML.slice(0, 80)),
    );

// The mega-menu button's expanded state, from Chromium's accessibility tree: the platform exposes it
// for a popover's invoker, and the markup never writes aria-expanded (P2 plan, I1).
async function expandedState(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  await cdp.detach();
  const button = nodes.find((node) => node.role?.value === 'button' && node.name?.value === navigation.servicesLabel);
  return button?.properties?.find((property) => property.name === 'expanded')?.value.value;
}

// The CTAs whose gradient shows on screen (05 §2, C42): visible, with the gradient layer lit, and inside
// the viewport.
const litCtas = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-cta]')]
      .filter((cta) => {
        const layer = cta.querySelector('.dz-cta-charge');
        if (!layer || !cta.checkVisibility() || Number(getComputedStyle(layer).opacity) === 0) return false;
        const box = cta.getBoundingClientRect();
        return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
      })
      .map((cta) => cta.dataset.cta),
  );

// How far the marker's main pixel sits from the centre of the nav item it marks, in px.
const markerOffset = (page: Page, item: string) =>
  page.evaluate((selector) => {
    const target = document.querySelector(selector)?.getBoundingClientRect();
    const pixel = document.querySelector('[data-fx-nav][data-hop] .dz-hop svg rect')?.getBoundingClientRect();
    if (!target || !pixel) return Infinity;
    return Math.abs(pixel.x + pixel.width / 2 - (target.x + target.width / 2));
  }, item);

async function store(page: Page, values: Record<string, string>) {
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
  }, values);
  await page.reload();
  await page.waitForLoadState('networkidle');
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

for (const path of [HOME, REVIEW]) {
  for (const width of [...PHONES, ...DESKTOPS]) {
    test(`${path} at ${width} px: the skip link comes first and lands on main; Tab walks the header in order`, async ({
      page,
    }) => {
      await open(page, path, width);
      const skip = page.getByRole('link', { name: shellContent.skipLink });
      await page.keyboard.press('Tab');
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();

      const stops = await numberStops(page, '[data-fx-header]');
      expect(stops).toBeGreaterThanOrEqual(width < 1024 ? 3 : 2);
      for (let stop = 0; stop < stops; stop++) {
        await page.keyboard.press('Tab');
        expect(await focusedStop(page)).toBe(String(stop));
      }

      await skip.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeFocused();
      expect(new URL(page.url()).hash).toBe('#main');

      expect(await missedTargets(page, '[data-fx-header]')).toEqual([]);
      expect(await themedFocusables(page)).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      ).toBeLessThanOrEqual(0);
    });
  }

  test(`${path} at 320 px reflows with no sideways scroll, with the sheet open too (WCAG 1.4.10)`, async ({ page }) => {
    await open(page, path, 320);
    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(await overflow()).toBeLessThanOrEqual(0);
    // The compact bar tightens below 360 px; its controls keep their tap areas.
    expect(await missedTargets(page, '[data-fx-header]')).toEqual([]);
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    await expect(page.locator(SHEET)).toBeVisible();
    expect(await page.locator(SHEET).evaluate((sheet) => sheet.scrollWidth - sheet.clientWidth)).toBeLessThanOrEqual(0);
    await settled(page);
    expect(await missedTargets(page, SHEET)).toEqual([]);
  });
}

test.describe('Mega menu (Services)', () => {
  for (const width of DESKTOPS) {
    test(`${width} px: Enter and Space open it, Tab walks it in order, Esc closes it and focus returns`, async ({
      page,
    }) => {
      await open(page, REVIEW, width);
      const button = page.getByRole('button', { name: navigation.servicesLabel });
      const panel = page.locator(MEGA);
      expect(await expandedState(page)).toBe(false);

      await button.focus();
      await page.keyboard.press('Enter');
      await expect(panel).toBeVisible();
      expect(await expandedState(page)).toBe(true);

      const stops = await numberStops(page, MEGA);
      for (let stop = 0; stop < stops; stop++) {
        await page.keyboard.press('Tab');
        expect(await focusedStop(page)).toBe(String(stop));
      }
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();
      expect(await expandedState(page)).toBe(false);

      await page.keyboard.press('Space');
      await expect(panel).toBeVisible();
      await settled(page);
      expect(await missedTargets(page, MEGA)).toEqual([]);
      expect(await themedFocusables(page)).toEqual([]);
    });
  }

  test('each service row reads its name and outcome as separate words (P3 plan, A fix 1)', async ({ page }) => {
    await open(page, REVIEW, 1280);
    // The first row the menu shows: items marked `mega: false` stay out of it.
    const item = navigation.columns[0]!.items.find((entry) => !('mega' in entry && entry.mega === false))!;
    const row = page.locator(`${MEGA} .dz-menu-row`).first();
    expect(await row.textContent()).toBe(`${item.name} ${item.outcome}`);
  });

  test('a click outside closes it', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    await expect(page.locator(MEGA)).toBeVisible();
    // The panel spans the container; the gutter beside it is outside.
    await page.mouse.click(20, 450);
    await expect(page.locator(MEGA)).toBeHidden();
  });

  test('Tab past its last item closes it, so focus never moves on behind it (WCAG 2.4.11)', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    const panel = page.locator(MEGA);
    await expect(panel).toBeVisible();
    const stops = await numberStops(page, MEGA);
    await panel.locator(`[data-stop="${stops - 1}"]`).focus();
    await page.keyboard.press('Tab');
    await expect(panel).toBeHidden();
    await expect(page.locator('[data-fx-nav]').getByRole('link', { name: navigation.primary[0]!.label })).toBeFocused();
  });

  test('a link followed from it closes it', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    const panel = page.locator(MEGA);
    await panel.getByRole('link').first().click();
    await expect(panel).toBeHidden();
  });

  test('hovering a service row plays only that row’s icon, and the column’s head', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    const rows = page.locator(`${MEGA} .dz-menu-row:has(.dz-icon--t2)`);
    expect(await rows.count()).toBeGreaterThan(1);
    await settled(page);
    await rows.first().hover();
    // The halo is the glow a story lights: on in the hovered row only (13 §4.3, hover-glow).
    const halos = () =>
      rows.evaluateAll((links) =>
        links.map((link) => getComputedStyle(link.querySelector('.dz-icon--t2 .dz-halo')!).opacity),
      );
    await expect
      .poll(async () => (await halos()).map((opacity) => Number(opacity) > 0))
      .toEqual((await halos()).map((_, index) => index === 0));
    // The column hosts its Tier 3 head, which replays.
    const head = page.locator(`${MEGA} .dz-t3-host`).first().locator('.dz-icon--t3 .dz-t3-part').first();
    await expect
      .poll(() => head.evaluate((part) => part.getAnimations().map((a) => (a as CSSAnimation).animationName)))
      .toContainEqual(expect.stringMatching(/-again$/));
  });
});

test.describe('Mobile sheet', () => {
  for (const path of [HOME, REVIEW]) {
    for (const width of PHONES) {
      test(`${path} at ${width} px: it traps focus over an inert page; Esc and the close button close it`, async ({
        page,
      }) => {
        await open(page, path, width);
        const menu = page.getByRole('button', { name: shellContent.menuOpen });
        const sheet = page.getByRole('dialog', { name: shellContent.menuOpen });
        const close = sheet.getByRole('button', { name: shellContent.menuClose });

        await menu.focus();
        await page.keyboard.press('Enter');
        await expect(sheet).toBeVisible();
        await expect(close).toBeFocused();

        // The page behind takes no focus and doesn't scroll.
        const behindTakesFocus = await page.evaluate(() => {
          const logo = document.querySelector<HTMLElement>('[data-fx-header] a[href]');
          logo?.focus();
          return document.activeElement === logo;
        });
        expect(behindTakesFocus).toBe(false);
        await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');

        // Tab walks the sheet in order, then wraps without ever leaving it.
        const stops = await numberStops(page, SHEET);
        await close.focus();
        for (let stop = 1; stop < stops; stop++) {
          await page.keyboard.press('Tab');
          expect(await focusedStop(page)).toBe(String(stop));
        }
        for (let extra = 0; extra < stops + 2; extra++) {
          await page.keyboard.press('Tab');
          const inside = await page.evaluate(() => {
            const active = document.activeElement;
            return !active || active === document.body || Boolean(active.closest('dialog.dz-sheet'));
          });
          expect(inside).toBe(true);
        }

        await settled(page);
        expect(await missedTargets(page, SHEET)).toEqual([]);
        expect(await themedFocusables(page)).toEqual([]);

        await page.keyboard.press('Escape');
        await expect(sheet).toBeHidden();
        await expect(menu).toBeFocused();

        await menu.click();
        await expect(sheet).toBeVisible();
        await close.click();
        await expect(sheet).toBeHidden();
        await expect(menu).toBeFocused();
        await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');

        // A link followed from it closes it (here the CTA, the one link every page has).
        await menu.click();
        await sheet.locator('[data-cta]').evaluate((cta) => {
          // An email link would open a mail app; the click only needs to reach the page.
          cta.addEventListener('click', (event) => event.preventDefault(), { once: true });
        });
        await sheet.locator('[data-cta]').click();
        await expect(sheet).toBeHidden();
      });
    }
  }

  test('closes when the window grows to desktop width, so the page is never left inert under nothing', async ({
    page,
  }) => {
    await open(page, HOME, 768);
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    const sheet = page.getByRole('dialog', { name: shellContent.menuOpen });
    await expect(sheet).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(sheet).toBeHidden();
    expect(await page.evaluate(() => document.querySelector('dialog.dz-sheet')?.hasAttribute('open'))).toBe(false);
    await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');
  });
});

test.describe('Live links only (04 §1.4; P2 plan, A)', () => {
  const unshipped = new Set<string>(
    Object.values(ROUTES)
      .filter((route) => !route.live)
      .map((route) => route.path),
  );

  for (const path of [HOME, MISSING]) {
    test(`${path} links to no unshipped page, and every internal link returns 200`, async ({ page, request }) => {
      await open(page, path, 1280);
      // No pillar column has a live item yet, so production has no Services button (plan I4).
      await expect(page.getByRole('button', { name: navigation.servicesLabel })).toHaveCount(0);
      const origin = new URL(page.url()).origin;
      const hrefs = await page
        .locator('a[href]:not([href^="#"])')
        .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
      const internal = hrefs.filter((href) => new URL(href).origin === origin);
      expect(internal.length).toBeGreaterThan(0);
      for (const href of internal) {
        expect(unshipped.has(new URL(href).pathname), href).toBe(false);
        expect((await request.get(href)).status(), href).toBe(200);
      }
      // Until the audit page ships, every CTA is an email with the subject (Q1).
      if (!ROUTES.R002.live) {
        const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(shellContent.ctaEmailSubject)}`;
        for (const cta of await page.locator('[data-cta]').all()) await expect(cta).toHaveAttribute('href', mailto);
      }
    });
  }
});

test.describe('The CTA hand-off (C42)', () => {
  for (const [path, width] of [
    [REVIEW, 1280],
    [REVIEW, 390],
    [HOME, 1280],
    [HOME, 390],
  ] as const) {
    const desktop = width >= 1024;
    test(`${path} at ${width} px: exactly one gradient CTA on screen at every scroll position${desktop ? '' : ', never the header'}`, async ({
      page,
    }) => {
      await open(page, path, width);
      const { scrollable, step } = await page.evaluate(() => ({
        scrollable: document.documentElement.scrollHeight - innerHeight,
        step: Math.round(innerHeight / 3),
      }));
      for (let top = 0; top <= scrollable + step; top += step) {
        await page.evaluate((y) => scrollTo(0, y), top);
        await expect.poll(() => litCtas(page), { message: `scrolled to ${top}` }).toHaveLength(1);
        // On mobile the header CTA stays outline: the sticky bar carries the gradient.
        if (!desktop) expect(await litCtas(page), `scrolled to ${top}`).not.toContain('header');
      }
    });
  }
});

test.describe('The desktop header', () => {
  test('condenses on scroll through a transform only: the pill keeps its box', async ({ page }) => {
    await open(page, REVIEW, 1280);
    const header = page.locator('[data-fx-header]');
    const pill = page.locator('.dz-header-pill');
    const before = await pill.boundingBox();
    await page.evaluate(() => scrollTo(0, 600));
    await expect(header).toHaveAttribute('data-condensed', '');
    await expect(page.locator('.dz-header-bg')).toHaveCSS('scale', '1 0.86');
    expect(await pill.boundingBox()).toEqual(before);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(header).not.toHaveAttribute('data-condensed');
  });

  test('marks the current page: the logo on Home, the marker under a nav item that hops to the hovered one', async ({
    page,
  }) => {
    await open(page, HOME, 1280);
    await expect(
      page.locator('[data-fx-header]').getByRole('link', { name: siteConfig.brandName, exact: true }),
    ).toHaveAttribute('aria-current', 'page');

    await open(page, REVIEW, 1280);
    const items = '[data-fx-nav] > ul > li > :is(a, button)';
    await expect.poll(() => markerOffset(page, '[data-fx-nav] [aria-current="page"]')).toBeLessThan(1.5);
    await page.locator(items).nth(3).hover();
    await expect.poll(() => markerOffset(page, `[data-fx-nav] > ul > li:nth-child(4) > *`)).toBeLessThan(1.5);
    await page.mouse.move(640, 600);
    await expect.poll(() => markerOffset(page, '[data-fx-nav] [aria-current="page"]')).toBeLessThan(1.5);
  });

  test('in Arabic (RTL) the order mirrors and the marker follows, while the logo and the cluster never mirror', async ({
    page,
  }) => {
    await open(page, REVIEW, 1280);
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      dispatchEvent(new Event('resize'));
    });
    const x = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => el.getBoundingClientRect().x);
    // Logo · nav · CTA from the inline start, which is now the right.
    expect(await x('[data-fx-header] a[href="/"]')).toBeGreaterThan(await x('[data-fx-nav]'));
    expect(await x('[data-fx-nav]')).toBeGreaterThan(await x('[data-cta="header"]'));
    const items = page.locator('[data-fx-nav] > ul > li');
    expect(await items.first().evaluate((el) => el.getBoundingClientRect().x)).toBeGreaterThan(
      await items.last().evaluate((el) => el.getBoundingClientRect().x),
    );
    await expect.poll(() => markerOffset(page, '[data-fx-nav] [aria-current="page"]')).toBeLessThan(1.5);

    await settled(page);
    // The cluster keeps the logo's shape: the upper pixel stays right of the main one, nothing flips.
    const cluster = await page.locator('[data-fx-nav] .dz-hop svg rect').evaluateAll((rects) =>
      rects.map((rect) => {
        const box = rect.getBoundingClientRect();
        const svg = (rect as SVGRectElement).ownerSVGElement as SVGSVGElement;
        return { centre: box.x + box.width / 2, transform: getComputedStyle(svg).transform };
      }),
    );
    expect(cluster[1]!.centre).toBeGreaterThan(cluster[0]!.centre);
    for (const pixel of cluster) expect(pixel.transform).toBe('none');
    const logo = page.getByRole('img', { name: siteConfig.brandName }).first();
    await expect(logo).toHaveCSS('transform', 'none');
  });
});

test('in Arabic (RTL) the compact bar mirrors: the menu button at the inline end, then the CTA, then the logo', async ({
  page,
}) => {
  await open(page, REVIEW, 390);
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  const x = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().x);
  const logo = await x(page.locator('[data-fx-header] a[href="/"]'));
  const cta = await x(page.locator('[data-cta="header"]'));
  const menu = await x(page.getByRole('button', { name: shellContent.menuOpen }));
  expect(logo).toBeGreaterThan(cta);
  expect(cta).toBeGreaterThan(menu);
});

test.describe('JavaScript off', () => {
  test.use({ javaScriptEnabled: false });

  test('the content and every nav link render, the mega menu opens (popover) and so does the sheet (invoker commands)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(REVIEW);
    await expect(page.locator('h1')).toBeVisible();
    for (const link of navigation.primary) {
      await expect(page.locator('[data-fx-nav]').getByRole('link', { name: link.label })).toBeVisible();
    }
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    await expect(page.locator(MEGA)).toBeVisible();
    // The display switches need the runtime, so they aren't offered without it.
    await expect(page.locator(MEGA).getByRole('switch')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.locator(MEGA)).toBeHidden();
    // Without the hand-off the header CTA stays outline, so the hero's is the only gradient.
    expect(await litCtas(page)).toEqual(['primary']);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    const sheet = page.getByRole('dialog', { name: shellContent.menuOpen });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('switch')).toHaveCount(0);
    await page.keyboard.press('Escape');

    // The footer renders in full, its cluster at rest (assembled), and the bar never shows.
    const footer = page.locator('footer');
    await expect(footer.getByRole('heading', { level: 2, name: shellContent.finaleHeading })).toBeAttached();
    await expect(footer.getByRole('link', { name: socialName('LinkedIn'), exact: true })).toBeAttached();
    await expect(footer.getByRole('switch')).toHaveCount(0);
    // ...but the footer's group keeps its space, so nothing below it moves once the runtime starts.
    const display = footer.locator('.dz-display');
    await expect(display).toHaveCSS('visibility', 'hidden');
    expect((await display.boundingBox())?.height ?? 0).toBeGreaterThan(0);
    await expect(page.locator('[data-fx-sticky]')).toBeHidden();
  });
});

test.describe('The footer, The Landing (footer.md; P2 plan, L)', () => {
  for (const [path, width] of [
    [HOME, 360],
    [HOME, 768],
    [HOME, 1280],
    [REVIEW, 390],
    [REVIEW, 1280],
  ] as const) {
    test(`${path} at ${width} px: the finale, the company block, the nine social links and the legal line; every tap area 44 px`, async ({
      page,
    }) => {
      await open(page, path, width);
      const footer = page.locator('footer');
      await expect(footer).toHaveAttribute('data-theme', 'dark');
      await expect(footer.getByRole('heading', { level: 2, name: shellContent.finaleHeading })).toBeVisible();
      // No heading but the finale's: column titles label their lists (plan L4).
      await expect(footer.locator('h1, h2, h3, h4, h5, h6')).toHaveCount(1);
      await expect(footer.locator('[data-cta="primary"]')).toHaveCount(1);
      await expect(footer.locator('address')).toContainText(siteConfig.address);
      // The opening hours, the fact as it stands (facts §2; P3 plan, A), on their own line
      await expect(
        footer.getByText(`${shellContent.hoursLabel}: ${siteConfig.openingHours.display}`, { exact: true }),
      ).toBeVisible();
      await expect(footer.getByRole('link', { name: siteConfig.email })).toHaveAttribute(
        'href',
        `mailto:${siteConfig.email}`,
      );
      for (const profile of siteConfig.social) {
        const link = footer.getByRole('link', { name: socialName(profile.platform), exact: true });
        await expect(link).toHaveAttribute('href', profile.url);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
      await expect(footer.getByText(`${shellContent.copyright} ${siteConfig.legalName}`)).toBeVisible();
      // The review page shows every column; production, only columns with a live link (none yet).
      const nav = footer.getByRole('navigation', { name: shellContent.footerNavLabel });
      if (path === REVIEW) {
        await expect(nav.getByRole('list')).toHaveCount(navigation.columns.length + navigation.footer.length);
      } else {
        await expect(nav).toHaveCount(0);
      }
      expect(await missedTargets(page, 'footer')).toEqual([]);
      expect(await themedFocusables(page)).toEqual([]);
    });
  }

  test('The Landing: the cluster flies in once as the finale enters, and rests assembled', async ({ page }) => {
    await open(page, REVIEW, 1280);
    const landing = page.locator('.dz-landing');
    await expect(landing).not.toHaveClass(/is-in/);
    await landing.scrollIntoViewIfNeeded();
    await expect(landing).toHaveClass(/is-in/);
    const pixels = landing.locator('svg');
    expect(await pixels.evaluateAll((svgs) => svgs.map((svg) => getComputedStyle(svg).animationName))).toEqual(
      Array(4).fill('dz-land'),
    );
    await settled(page);
    // At rest, every pixel's layer covers the cluster's box exactly, fully shown.
    expect(
      await pixels.evaluateAll((svgs) => {
        const box = svgs[0]!.parentElement!.getBoundingClientRect();
        return svgs.every((svg) => {
          const rect = svg.getBoundingClientRect();
          return (
            getComputedStyle(svg).opacity === '1' &&
            Math.abs(rect.x - box.x) < 0.5 &&
            Math.abs(rect.y - box.y) < 0.5 &&
            Math.abs(rect.width - box.width) < 0.5
          );
        });
      }),
    ).toBe(true);
  });

  test('the journey line grows with the page’s scroll, its pixel reaching the bottom as the page ends', async ({
    page,
  }) => {
    await open(page, REVIEW, 1280);
    await expect(page.locator('.dz-journey')).toBeVisible();
    const pixelBottom = () => page.locator('.dz-journey-px').evaluate((el) => el.getBoundingClientRect().bottom);
    expect(await pixelBottom()).toBeLessThan(50);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(pixelBottom).toBeGreaterThan(900 - 2);
  });

  test('a social tile lifts, glows in its own colour and pops its letter on hover; TikTok’s T splits', async ({
    page,
  }) => {
    await open(page, REVIEW, 1280);
    const tiktok = page.getByRole('link', { name: socialName('TikTok'), exact: true });
    await tiktok.scrollIntoViewIfNeeded();
    await tiktok.hover();
    const style = (part: string, property: string) =>
      tiktok
        .locator(part)
        .first()
        .evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);
    await expect.poll(() => style('.dz-social-glow', 'opacity')).toBe('0.6');
    await expect.poll(() => style('.dz-social-tile', 'translate')).toBe('0px -2px');
    await expect.poll(() => style('.dz-social-split--cyan', 'opacity')).toBe('1');
  });

  test('under Reduce effects: no journey line, the cluster rests with no flight, and a tile glows without moving', async ({
    page,
  }) => {
    await open(page, REVIEW, 1280);
    await store(page, { 'dz-effects': 'reduced' });
    await expect(page.locator('.dz-journey')).toBeHidden();
    const landing = page.locator('.dz-landing');
    await landing.scrollIntoViewIfNeeded();
    await expect(landing).toHaveClass(/is-in/);
    expect(
      await landing.locator('svg').evaluateAll((svgs) => svgs.map((svg) => getComputedStyle(svg).animationName)),
    ).toEqual(Array(4).fill('none'));
    const linkedin = page.getByRole('link', { name: socialName('LinkedIn'), exact: true });
    await linkedin.hover();
    await expect(linkedin.locator('.dz-social-glow')).toHaveCSS('opacity', '0.6');
    await expect(linkedin.locator('.dz-social-tile')).toHaveCSS('translate', 'none');
  });

  test('in forced colours each tile is a bordered system tile with its letter shown (P3 plan, A fix 6)', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await open(page, HOME, 768);
    for (const profile of siteConfig.social) {
      const link = page.getByRole('link', { name: socialName(profile.platform), exact: true });
      await link.scrollIntoViewIfNeeded();
      const tile = await link.locator('.dz-social-tile').evaluate((el) => {
        const style = getComputedStyle(el);
        return { width: parseFloat(style.borderTopWidth), style: style.borderTopStyle, colour: style.borderTopColor };
      });
      expect(tile.width, profile.platform).toBeGreaterThan(0);
      expect(tile.style, profile.platform).toBe('solid');
      expect(tile.colour, profile.platform).not.toBe('rgba(0, 0, 0, 0)');
      const letter = link.locator('.dz-social-letter:not(.dz-social-split)');
      await expect(letter, profile.platform).toBeVisible();
      await expect(link.locator('.dz-social-glow')).toBeHidden();
    }
  });

  test('in Arabic (RTL) the journey line runs down the right edge and the tiles mirror their order', async ({
    page,
  }) => {
    await open(page, REVIEW, 1280);
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    expect(
      await page
        .locator('.dz-journey')
        .evaluate((el) => document.documentElement.clientWidth - el.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(1);
    const x = (platform: string) =>
      page
        .getByRole('link', { name: socialName(platform), exact: true })
        .evaluate((el) => el.getBoundingClientRect().x);
    expect(await x('LinkedIn')).toBeGreaterThan(await x('Pinterest'));
  });
});

test.describe('The sticky CTA bar (conversion-path.md; C42)', () => {
  const bar = (page: Page) => page.locator('[data-fx-sticky]');
  const shown = (page: Page) =>
    bar(page).evaluate(
      (el) => getComputedStyle(el).visibility === 'visible' && el.getBoundingClientRect().top < innerHeight,
    );

  test('390 px, the review page: hidden while the hero’s CTA shows, up once it leaves, gone as the finale’s arrives', async ({
    page,
  }) => {
    await open(page, REVIEW, 390);
    await expect.poll(() => shown(page)).toBe(false);
    await page.evaluate(() => scrollTo(0, innerHeight * 1.5));
    await expect.poll(() => shown(page)).toBe(true);
    await page.locator('footer [data-cta="primary"]').scrollIntoViewIfNeeded();
    await expect.poll(() => shown(page)).toBe(false);
  });

  test('390 px: it hides while the sheet is open and returns when it closes; the page’s end scrolls clear of it', async ({
    page,
  }) => {
    await open(page, HOME, 390);
    // The real Home (P5) has a hero CTA, so the bar starts hidden and appears past the hero
    // (the CTA hand-off, C42) before this test opens the sheet.
    await expect.poll(() => shown(page)).toBe(false);
    await page.evaluate(() => scrollTo(0, innerHeight * 1.5));
    await expect.poll(() => shown(page)).toBe(true);
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    await expect.poll(() => shown(page)).toBe(false);
    await page.keyboard.press('Escape');
    await expect.poll(() => shown(page)).toBe(true);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => shown(page)).toBe(true);
    const legal = page.locator('footer').getByText(`${shellContent.copyright} ${siteConfig.legalName}`);
    const legalBottom = await legal.evaluate((el) => el.getBoundingClientRect().bottom);
    const barTop = await bar(page).evaluate((el) => el.getBoundingClientRect().top);
    expect(legalBottom).toBeLessThanOrEqual(barTop);
  });

  test('desktop never shows it', async ({ page }) => {
    await open(page, HOME, 1280);
    await expect(bar(page)).toBeHidden();
  });

  test('390 px, Home: hidden at load (the hero CTA holds the gradient), up once it leaves, gone at the finale (C42)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await open(page, HOME, 390);
    // The hero's primary CTA is on screen: the bar stays away, and nothing moves at load (13 §2.1)
    await expect.poll(() => shown(page)).toBe(false);
    const moving = () => bar(page).evaluate((el) => el.getAnimations().length);
    expect(await moving()).toBe(0);
    await page.evaluate(() => scrollTo(0, innerHeight * 1.5));
    await expect.poll(() => shown(page)).toBe(true);
    await page.locator('footer [data-cta="primary"]').scrollIntoViewIfNeeded();
    await expect.poll(() => shown(page)).toBe(false);
  });

  for (const [path, tabs] of [
    [HOME, 30],
    [REVIEW, 90],
  ] as const) {
    test(`390 px, ${path}: Tab never leaves a focused control under the bar (WCAG 2.4.11)`, async ({ page }) => {
      await open(page, path, 390);
      // How far the focused control's ring reaches under the bar's top edge (0 when the bar is away).
      const covered = () =>
        page.evaluate(() => {
          const el = document.activeElement;
          const bar = document.querySelector('[data-fx-sticky]');
          if (!el || el === document.body || !bar || bar.contains(el)) return 0;
          if (getComputedStyle(bar).visibility !== 'visible') return 0;
          const root = getComputedStyle(document.documentElement);
          const ring =
            parseFloat(root.getPropertyValue('--dz-focus-width')) +
            parseFloat(root.getPropertyValue('--dz-focus-offset'));
          return Math.max(0, el.getBoundingClientRect().bottom + ring - bar.getBoundingClientRect().top);
        });
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab');
        await expect.poll(covered).toBe(0);
      }
    });
  }
});

test.describe('No serious or critical axe violations (every state)', () => {
  test('the review page with the mega menu open', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    await settled(page);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('the review page with the sheet open', async ({ page }) => {
    await open(page, REVIEW, 390);
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    await settled(page);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('Home with the sheet open', async ({ page }) => {
    await open(page, HOME, 390);
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    await settled(page);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('the light theme, with the mega menu open', async ({ page }) => {
    await open(page, REVIEW, 1280);
    await store(page, { 'dz-theme': 'light' });
    await page.getByRole('button', { name: navigation.servicesLabel }).click();
    await settled(page);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('Home at 390 px scrolled to the footer, with the sticky bar up', async ({ page }) => {
    await open(page, HOME, 390);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await settled(page);
    expect(await seriousAxeViolations(page)).toEqual([]);
  });

  test('Reduce effects, with the sheet open', async ({ page }) => {
    await open(page, REVIEW, 390);
    await store(page, { 'dz-effects': 'reduced' });
    await page.getByRole('button', { name: shellContent.menuOpen }).click();
    expect(await seriousAxeViolations(page)).toEqual([]);
  });
});
