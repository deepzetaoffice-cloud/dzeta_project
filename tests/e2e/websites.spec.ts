import { expect, test } from '@playwright/test';
import { buildRun } from '../../src/content/en/services/build-run';
import { customCodedWebsitesExtras as extras } from '../../src/content/en/services/custom-coded-websites';
import { seriousAxeViolations } from './helpers/axe';
import { stubGtm } from './helpers/tracking';

// The flagship Custom-Coded Websites page's two extras (the plan
// docs/plans/2026-10-10-flagship-websites-page.md; 13 §4.8): Code ↔ Page and the build terminal with
// its story controls. The template's own checks (H1, breadcrumb, FAQ, axe at load, 360 px, no-JS,
// the European banner) run for this page in services.spec.ts, as for every live service page.

const PATH = '/services/custom-coded-websites';

test.beforeEach(async ({ page }) => {
  await stubGtm(page);
});

test.describe('Code ↔ Page', () => {
  test('the code side is the hero’s real source; the page side is a hidden, inert picture', async ({ page }) => {
    await page.goto(PATH);
    const figure = page.locator('[data-codepage]');
    await expect(figure.locator('.dz-codepage-code code')).toContainText('export function ServiceHero');
    await expect(figure.locator('.dz-codepage-page')).toHaveAttribute('aria-hidden', 'true');
    await expect(figure.locator('.dz-codepage-page')).toHaveAttribute('inert', '');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-view-service]')).toHaveCount(1);
  });

  test('the arrow keys move the reveal', async ({ page }) => {
    await page.goto(PATH);
    const slider = page.getByRole('slider', { name: extras.codePage.sliderLabel });
    await expect(slider).toBeVisible();
    await expect(page.locator('[data-codepage]')).toHaveAttribute('data-enhanced', '');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const reveal = await page
      .locator('[data-codepage]')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--dz-reveal').trim());
    expect(reveal).toBe('52%');
  });

  test('without JavaScript both sides show, one above the other, and no slider', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(PATH);
    await expect(page.locator('.dz-codepage-code code')).toBeVisible();
    await expect(page.locator('.dz-codepage-page')).toBeVisible();
    await expect(page.locator('.dz-codepage-range')).toBeHidden();
    await context.close();
  });
});

test.describe('the build terminal', () => {
  test('every recorded line is in the HTML, with its date and commit', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(PATH);
    await expect(page.locator('[data-term-line]')).toHaveCount(buildRun.lines.length);
    await expect(page.locator('.dz-term-recorded')).toContainText(buildRun.date);
    await expect(page.locator('.dz-term-recorded')).toContainText(buildRun.commit);
    await expect(page.locator('.dz-term-controls')).toBeHidden();
    await context.close();
  });

  test('it plays in view; Pause stops it, Step shows one more line, Replay starts over', async ({ page }) => {
    await page.goto(PATH);
    const terminal = page.locator('[data-terminal]');
    await terminal.scrollIntoViewIfNeeded();
    const controls = page.getByRole('group', { name: extras.terminal.controls.group });
    await expect(controls).toBeVisible();
    const shown = () => terminal.locator('[data-term-line][data-on]').count();
    await expect.poll(shown).toBeGreaterThan(1);
    await controls.getByRole('button', { name: extras.terminal.controls.pause }).click();
    const paused = await shown();
    await page.waitForTimeout(800);
    expect(await shown()).toBe(paused);
    await controls.getByRole('button', { name: extras.terminal.controls.step }).click();
    expect(await shown()).toBe(paused + 1);
    await controls.getByRole('button', { name: extras.terminal.controls.replay }).click();
    await expect.poll(shown).toBeLessThan(paused + 1);
  });

  test('it pauses when scrolled away mid-play', async ({ page }) => {
    await page.goto(PATH);
    const terminal = page.locator('[data-terminal]');
    await terminal.scrollIntoViewIfNeeded();
    const shown = () => terminal.locator('[data-term-line][data-on]').count();
    await expect.poll(shown).toBeGreaterThan(1);
    await page.evaluate(() => window.scrollTo(0, 0));
    const away = await shown();
    await page.waitForTimeout(800);
    expect(await shown()).toBe(away);
    expect(away).toBeLessThan(buildRun.lines.length);
  });

  test('under reduced motion the full run shows, still, with no controls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(PATH);
    const terminal = page.locator('[data-terminal]');
    await terminal.scrollIntoViewIfNeeded();
    await expect(terminal).not.toHaveAttribute('data-playable', '');
    await expect(terminal.locator('[data-term-line]').last()).toBeVisible();
    await expect(page.locator('.dz-term-controls')).toBeHidden();
  });

  test('axe: no serious or critical violations once the controls are up', async ({ page }) => {
    await page.goto(PATH);
    await page.locator('[data-terminal]').scrollIntoViewIfNeeded();
    await expect(page.getByRole('group', { name: extras.terminal.controls.group })).toBeVisible();
    expect(await seriousAxeViolations(page)).toEqual([]);
  });
});
