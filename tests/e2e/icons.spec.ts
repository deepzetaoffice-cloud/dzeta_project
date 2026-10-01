import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { createServer } from 'vite';
import { clusterBoxes } from '../../src/components/icons/Cluster';
import { CLEARANCE as CUT } from '../../src/components/icons/IconDefs';
import { TIER_1, TIER_2, TIER_3 } from '../../src/components/icons/registry';

// The icons in a real browser (P1 plan, section E; P2 plan, K7). The test renders every icon to markup
// and injects it into the built Home, where the site's real CSS and the shared definitions (mounted by
// SiteDocument) apply. The Tier 3 stories need the shared observer, which watches server-rendered
// icons, so they're tested on the review page (/shell-review), which shows them.

const tier1 = Object.keys(TIER_1) as (keyof typeof TIER_1)[];
const tier2 = Object.keys(TIER_2) as (keyof typeof TIER_2)[];
const tier3 = Object.keys(TIER_3) as (keyof typeof TIER_3)[];
const CLEARANCE = 0.75; // §4.2 rule 4
const HALF_STROKE = 0.75; // Tier 2 lines are 1.5 wide (§6)
// The same clearance on the 48 grid, and Tier 3's stroke of 1.75 (§6)
const TIER_3_CLEARANCE = 1.5;
const TIER_3_HALF_STROKE = 0.875;

// The markup comes from icon-gallery.tsx, loaded through Vite as Vitest loads components: Playwright
// compiles JSX with its own component-testing runtime, which react-dom/server can't render.
let markup = '';
test.beforeAll(async () => {
  const vite = await createServer({
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    resolve: { tsconfigPaths: true },
    server: { middlewareMode: true, watch: null, hmr: false },
  });
  try {
    const gallery = (await vite.ssrLoadModule('/tests/e2e/icon-gallery.tsx')) as { iconGallery: () => string };
    markup = gallery.iconGallery();
  } finally {
    await vite.close();
  }
});

async function injectIcons(page: Page, dir: 'ltr' | 'rtl' = 'ltr') {
  await page.goto('/');
  await page.evaluate(
    ({ html, dir }) => {
      const box = document.createElement('div');
      box.id = 'icon-test';
      box.dir = dir;
      box.innerHTML = html;
      document.body.append(box);
    },
    { html: markup, dir },
  );
}

const icon = (page: Page, name: string) => page.locator(`[data-host="${name}"] svg`);

// The smallest gap between a pixel (the Tier 2 pixel, or one of the four cluster pixels) and any line
// or dot, in grid units. Lines are traced along their centre and widened by half the stroke; the open
// ends of a path get their square caps (§6).
function measureClearance(
  svg: SVGSVGElement,
  { halfStroke, selector = '.dz-px', index = 0 }: { halfStroke: number; selector?: string; index?: number },
) {
  const pixel = svg.querySelectorAll<SVGRectElement>(selector)[index];
  if (!pixel) throw new Error('no pixel');
  const box = pixel.getBBox();
  const gap = (x: number, y: number) =>
    Math.hypot(Math.max(box.x - x, 0, x - box.x - box.width), Math.max(box.y - y, 0, y - box.y - box.height));
  let smallest = Infinity;
  for (const line of svg.querySelectorAll<SVGGeometryElement>('.dz-ln')) {
    const length = line.getTotalLength();
    const step = 0.02;
    const points: DOMPoint[] = [];
    for (let at = 0; at <= length; at += step) points.push(line.getPointAtLength(at));
    points.push(line.getPointAtLength(length));
    for (const p of points) smallest = Math.min(smallest, gap(p.x, p.y) - halfStroke);
    // Open ends: where the trace starts or stops, or jumps to a new subpath.
    const ends: [DOMPoint, DOMPoint][] = [];
    const first = points[0];
    const last = points.at(-1);
    if (!first || !last) continue;
    const closed = line.tagName !== 'path' || Math.hypot(first.x - last.x, first.y - last.y) < 0.01;
    points.forEach((p, i) => {
      const next = points[i + 1];
      const prev = points[i - 1];
      if (next && Math.hypot(next.x - p.x, next.y - p.y) > step * 3) {
        if (prev) ends.push([p, prev]);
        const after = points[i + 2];
        if (after) ends.push([next, after]);
      }
    });
    if (!closed) {
      const second = points[1];
      const beforeLast = points.at(-2);
      if (second) ends.push([first, second]);
      if (beforeLast) ends.push([last, beforeLast]);
    }
    for (const [end, inner] of ends) {
      const length = Math.hypot(end.x - inner.x, end.y - inner.y) || 1;
      const [tx, ty] = [(end.x - inner.x) / length, (end.y - inner.y) / length];
      for (let across = -1; across <= 1; across += 0.1) {
        for (let along = 0; along <= 1; along += 0.1) {
          smallest = Math.min(
            smallest,
            gap(
              end.x + tx * halfStroke * along - ty * halfStroke * across,
              end.y + ty * halfStroke * along + tx * halfStroke * across,
            ),
          );
        }
      }
    }
  }
  for (const dot of svg.querySelectorAll<SVGCircleElement>('.dz-dot')) {
    smallest = Math.min(smallest, gap(dot.cx.baseVal.value, dot.cy.baseVal.value) - dot.r.baseVal.value);
  }
  return smallest;
}

// The colour Chromium paints at one point of the page (a screenshot, decoded in the page itself).
async function paintedColour(page: Page, x: number, y: number) {
  const png = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (base64) => {
    const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob());
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d');
    context?.drawImage(bitmap, 0, 0);
    const [r, g, b] = context?.getImageData(0, 0, 1, 1).data ?? [];
    return { r, g, b };
  }, png.toString('base64'));
}

test.describe('Icons', () => {
  test('every Tier 2 pixel keeps 0.75 from every line, or has a knockout (§4.2 rule 4)', async ({ page }) => {
    await injectIcons(page);
    const found: Record<string, string> = {};
    for (const name of tier2) {
      const clearance = await icon(page, name).evaluate(measureClearance, { halfStroke: HALF_STROKE });
      const knockout = 'knockout' in TIER_2[name];
      found[name] = knockout ? 'knockout' : clearance.toFixed(2);
      if (knockout) {
        const mask = page.locator(`#dz-ko-${name} rect[fill="black"]`);
        const { x, y, size } = TIER_2[name].pixel;
        await expect(mask).toHaveAttribute('x', String(x - CLEARANCE));
        await expect(mask).toHaveAttribute('y', String(y - CLEARANCE));
        await expect(mask).toHaveAttribute('width', String(size + 2 * CLEARANCE));
        await expect(mask).toHaveAttribute('height', String(size + 2 * CLEARANCE));
        await expect(icon(page, name).locator('g[mask]')).toHaveCount(1);
      } else {
        expect
          .soft(clearance, `${name}: the pixel is ${clearance.toFixed(2)} from a line`)
          .toBeGreaterThanOrEqual(CLEARANCE);
      }
    }
    console.log('Pixel clearance (grid units):', JSON.stringify(found));
  });

  test('lines are frost at rest and white on hover; the pixel paints its pillar gradient', async ({ page }) => {
    await injectIcons(page);
    const svg = icon(page, 'booking-automation-system');
    await expect(svg).toHaveCSS('color', 'rgb(201, 212, 255)');
    const pixel = svg.locator('.dz-px');
    await expect(pixel).toHaveCSS('fill', 'url("#dz-px-ai")');
    // The pixel's centre shows a colour from --dz-pixel-ai (cyan-blue), so the hidden definitions paint.
    const box = await pixel.boundingBox();
    if (!box) throw new Error('pixel not rendered');
    // At 24 px the pixel is 2.6 px wide, so its centre is partly blended with the navy page (1, 4, 19).
    const colour = await paintedColour(page, box.x + box.width / 2, box.y + box.height / 2);
    expect(colour.b).toBeGreaterThan(150);
    expect(colour.g).toBeGreaterThan(100);
    expect(colour.r).toBeLessThan(80);
    await page.locator('[data-host="booking-automation-system"]').hover();
    await expect(svg).toHaveCSS('color', 'rgb(244, 246, 251)');
  });

  test("a Tier 1 icon paints its line from the sprite, in its parent's colour (§2)", async ({ page }) => {
    await injectIcons(page);
    const svg = icon(page, 'menu');
    await expect(svg.locator('use')).toHaveAttribute('href', '#dz-1-menu');
    const hostColour = await page.locator('[data-host="menu"]').evaluate((el) => getComputedStyle(el).color);
    await expect(svg).toHaveCSS('color', hostColour);
    const box = await svg.boundingBox();
    if (!box) throw new Error('icon not rendered');
    // The middle bar of the menu icon runs through the centre (y = 12 of 24).
    const colour = await paintedColour(page, box.x + box.width / 2, box.y + box.height / 2);
    expect(colour.b).toBeGreaterThan(150);
  });

  test('every line has the §6 stroke: 1.5 wide, square caps, round joins', async ({ page }) => {
    await injectIcons(page);
    for (const line of [icon(page, 'arrow'), icon(page, 'booking-automation-system').locator('.dz-ln').first()]) {
      await expect(line).toHaveCSS('stroke-width', '1.5px');
      await expect(line).toHaveCSS('stroke-linecap', 'square');
      await expect(line).toHaveCSS('stroke-linejoin', 'round');
    }
  });

  test('a card that holds a link plays the story when the link has keyboard focus (13 §2)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await injectIcons(page);
    const card = page.locator('[data-host="card"]');
    await card.getByRole('link').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(card.locator('svg')).toHaveCSS('color', 'rgb(244, 246, 251)');
    await expect(card.locator('.dz-px')).toHaveCSS('animation-name', 'dz-icon-pop');
  });

  test('a disabled host keeps slate lines and plays no story (§5.1)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await injectIcons(page);
    const host = page.locator('[data-host="disabled"]');
    await host.hover({ force: true });
    await expect(host.locator('svg')).toHaveCSS('color', 'rgb(93, 115, 184)');
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'none');
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0');
  });

  test('more contrast turns the stories off, like Reduce effects, with a steady 0.45 glow (13 §2.11)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference', contrast: 'more' });
    await injectIcons(page);
    const host = page.locator('[data-host="whatsapp-ai-agent"]');
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
    await host.hover();
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'none');
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
  });

  test('the Reduce effects choice turns the stories off too, with a steady 0.45 glow (P2 plan, C3)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('dz-effects', 'reduced'));
    await injectIcons(page);
    await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
    const host = page.locator('[data-host="whatsapp-ai-agent"]');
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
    await host.hover();
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'none');
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
  });

  test('forced colours drop the gradients: a solid pixel in the text colour, no glow, no story (13 §6)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
    await injectIcons(page);
    const host = page.locator('[data-host="whatsapp-ai-agent"]');
    await host.hover();
    // The line colour eases to its hover value, so the fill is compared with it at the same moment.
    await expect
      .poll(() =>
        host
          .locator('svg')
          .evaluate((svg) => getComputedStyle(svg.querySelector('.dz-px')!).fill === getComputedStyle(svg).color),
      )
      .toBe(true);
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0');
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'none');
  });

  test('hover plays the story; with reduced motion the pixel is lit and the glow is 0.45', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await injectIcons(page);
    const host = page.locator('[data-host="whatsapp-ai-agent"]');
    await host.hover();
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'dz-icon-pop');
    await expect(host.locator('.dz-dot--blink-late')).toHaveCSS('animation-name', 'dz-icon-blink-late');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.mouse.move(0, 0);
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
    await host.hover();
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'none');
    await expect(host.locator('.dz-px')).toHaveCSS('opacity', '1');
    // Static means static: hovering doesn't fade the glow up to 0.6 either.
    await expect(host.locator('.dz-halo')).toHaveCSS('opacity', '0.45');
  });

  test('focus plays the same state as hover (13 §2)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await injectIcons(page);
    const host = page.locator('[data-host="speed-to-lead-system"]');
    await host.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(host.locator('svg')).toHaveCSS('color', 'rgb(244, 246, 251)');
    await expect(host.locator('.dz-px')).toHaveCSS('animation-name', 'dz-icon-pop');
  });

  test('the gradient stops take their colours from classes, not style attributes (a nonce CSP in P3)', async ({
    page,
  }) => {
    await injectIcons(page);
    await expect(page.locator('#dz-px-ai stop').first()).toHaveCSS('stop-color', 'rgb(3, 212, 252)');
    await expect(page.locator('#icon-test [style]')).toHaveCount(0);
  });

  test('directional icons mirror in Arabic; the rest never do, and no Tier 3 icon ever does (§9)', async ({ page }) => {
    await injectIcons(page, 'rtl');
    for (const name of [...tier1, ...tier2]) {
      const flip = name in TIER_1 ? TIER_1[name as keyof typeof TIER_1].flip : TIER_2[name as keyof typeof TIER_2].flip;
      await expect(icon(page, name)).toHaveCSS('transform', flip ? 'matrix(-1, 0, 0, 1, 0, 0)' : 'none');
    }
    // The owner, 2026-10-01: no signature icon mirrors in Arabic.
    for (const name of tier3) await expect(icon(page, name)).toHaveCSS('transform', 'none');
  });

  test('every Tier 3 cluster pixel keeps 1.5 from every line, or its knockout cuts them (§4.2 rule 4)', async ({
    page,
  }) => {
    await injectIcons(page);
    const found: Record<string, string[]> = {};
    for (const name of tier3) {
      const { cluster } = TIER_3[name];
      const knockout = 'knockout' in TIER_3[name];
      const boxes = clusterBoxes(cluster.x, cluster.y, cluster.size);
      found[name] = [];
      for (const [index, box] of boxes.entries()) {
        const clearance = await icon(page, name).evaluate(measureClearance, {
          halfStroke: TIER_3_HALF_STROKE,
          selector: '.dz-cluster-px',
          index,
        });
        found[name].push(`${box.part} ${clearance.toFixed(2)}`);
        if (!knockout) {
          expect
            .soft(clearance, `${name}: the ${box.part} pixel is ${clearance.toFixed(2)} from a line`)
            .toBeGreaterThanOrEqual(TIER_3_CLEARANCE);
        } else if (clearance < TIER_3_CLEARANCE) {
          // The knockout's cut-out for this pixel is in the page's shared definitions.
          const cutOut = page.locator(`#dz-ko-${name} rect[fill="black"]`).nth(index);
          await expect(cutOut).toHaveAttribute('x', String(box.x - CUT.tier3));
          await expect(cutOut).toHaveAttribute('width', String(box.size + 2 * CUT.tier3));
        }
      }
      // Both the lines and the parts are cut (Icon.tsx)
      if (knockout) await expect(icon(page, name).locator(`g[mask="url(#dz-ko-${name})"]`)).toHaveCount(2);
    }
    console.log('Cluster clearance before the knockout (grid units):', JSON.stringify(found));
  });

  test('forced colours drop the Tier 3 layers: a solid cluster in the text colour, no depth, glass or sweep (13 §6)', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await injectIcons(page);
    const svg = icon(page, 'ai-front-desk');
    const textColour = await svg.evaluate((el) => getComputedStyle(el).color);
    for (const pixel of await svg.locator('.dz-cluster-px').all()) await expect(pixel).toHaveCSS('fill', textColour);
    await expect(svg.locator('.dz-t3-depth')).toHaveCSS('visibility', 'hidden');
    await expect(svg.locator('.dz-t3-sweep')).toHaveCSS('visibility', 'hidden');
    await expect(svg.locator('.dz-t3-glass')).toHaveCSS('fill', 'none');
  });

  test('no serious or critical axe violations with every icon on the page', async ({ page }) => {
    await injectIcons(page);
    const results = await new AxeBuilder({ page })
      .include('#icon-test')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

// Tier 3 stories (P2 plan, K3) on the review page, where the icons are server-rendered and the shared
// observer watches them. The icon section sits below the fold of the default viewport.
test.describe('Tier 3 stories', () => {
  const host = (page: Page) => page.locator('#icon-websites a');
  const firstIcon = (page: Page) => host(page).locator('svg').first();
  // The story's CSS animations only: the hover colour change is a transition, which isn't a story.
  const animations = (page: Page) =>
    firstIcon(page).evaluate((svg) =>
      svg
        .getAnimations({ subtree: true })
        .filter((a): a is CSSAnimation => a instanceof CSSAnimation)
        .map((a) => ({ name: a.animationName, state: a.playState })),
    );

  test('play once when the icon scrolls into view, end on the rest frame, and replay on hover', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/shell-review');
    await expect(firstIcon(page)).not.toHaveClass(/is-in/);
    expect(await animations(page)).toEqual([]);

    await host(page).scrollIntoViewIfNeeded();
    await expect(firstIcon(page)).toHaveClass(/is-in/);
    const names = (await animations(page)).map((a) => a.name);
    for (const part of ['dz-t3-settle', 'dz-t3-fade', 'dz-t3-pop', 'dz-t3-assemble', 'dz-t3-glow', 'dz-t3-sweep']) {
      expect(names).toContain(part);
    }
    // No loop: every part finishes, on the rest frame
    await firstIcon(page).evaluate((svg) => Promise.all(svg.getAnimations({ subtree: true }).map((a) => a.finished)));
    expect((await animations(page)).every((a) => a.state === 'finished')).toBe(true);
    await expect(firstIcon(page).locator('.dz-t3-depth')).toHaveCSS('opacity', '0.5');
    await expect(firstIcon(page).locator('.dz-t3-sweep')).toHaveCSS('opacity', '0');
    await expect(firstIcon(page).locator('.dz-halo')).toHaveCSS('opacity', '0');

    // Hover adds the replay twins over the finished story; leaving drops them and replays nothing.
    await host(page).hover();
    expect((await animations(page)).filter((a) => a.state === 'running').map((a) => a.name)).toContain(
      'dz-t3-assemble-again',
    );
    await page.mouse.move(0, 0);
    await expect.poll(async () => (await animations(page)).filter((a) => a.state === 'running')).toEqual([]);
  });

  test('stay still under Reduce effects: no story, the glow steady at 0.45 (13 §2.11)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/shell-review');
    await page.evaluate(() => localStorage.setItem('dz-effects', 'reduced'));
    await page.reload();
    await host(page).scrollIntoViewIfNeeded();
    await expect(firstIcon(page)).toHaveClass(/is-in/);
    await host(page).hover();
    expect(await animations(page)).toEqual([]);
    await expect(firstIcon(page).locator('.dz-halo')).toHaveCSS('opacity', '0.45');
    await expect(firstIcon(page).locator('.dz-t3-depth')).toHaveCSS('opacity', '0.5');
  });

  test('the review page icon section has no serious or critical axe violations', async ({ page }) => {
    await page.goto('/shell-review');
    const results = await new AxeBuilder({ page })
      .include('section[aria-labelledby="review-icons"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
