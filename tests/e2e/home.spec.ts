import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The real Home's e2e (P5 S7; docs/design/home.md, faq.md; 13 §3): the LCP H1 visible at first
// paint, one H1, the section order, the FAQ's keyboard/details/chips behaviour and its no-JS
// state, the demo stub, axe, and Reduce effects' static final states. The tracking regressions
// (page_view, cta_click, demo_open) live in tracking.spec.ts; this spec is the page itself.

const QUESTIONS = [
  'What does the free AI automation audit include?',
  'How long does an automation or website take to build?',
  'Is my business and customer data safe with AI systems?',
  'Do the AI agents work in Arabic as well as English?',
  'Which tools and platforms can you connect?',
  'Who owns the automation or website once it is built?',
  'Do you guarantee rankings, leads or results?',
  'What happens after launch — am I on my own?',
];

test('the LCP heading is visible and in place at first paint (13 §3 rule 2)', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  // No entrance animation: it never starts hidden (the CSS keeps hidden starts inside the fx
  // variant, and the statement itself has none)
  const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
  const transform = await h1.evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toBe('none');
});

test('one H1; the sections in blueprint order (home.md §01–§11)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  const headings = (await page.locator('main h2').allInnerTexts()).map((heading) =>
    // The proof strip's eyebrow renders uppercased by CSS; compare case-insensitively
    heading.trim().toLowerCase(),
  );
  // §02–§11 in order (the proof card's H3 and the finale's H2 in the shell are not main H2s here)
  expect(headings).toEqual(
    [
      'A customer writes. The system answers.',
      'The platforms we build on',
      'Sound familiar?',
      'Four ways we build your growth',
      'See an automation run',
      'Watch this page build itself',
      'How we work',
      'What is manual work really costing you?',
      'Built for your industry',
      'Questions, answered',
      'Start with a free AI automation audit',
    ].map((heading) => heading.toLowerCase()),
  );
});

test('the four doors show the catalogue pillar names and promises (C6; 10 §2)', async ({ page }) => {
  await page.goto('/');
  const doors = page.locator('.dz-door');
  await expect(doors).toHaveCount(4);
  await expect(doors.nth(0)).toContainText('AI Automation');
  await expect(doors.nth(1)).toContainText('Websites');
  await expect(doors.nth(2)).toContainText('Software');
  await expect(doors.nth(3)).toContainText('Growth & Ranking');
  // Cards, not links, until the pillar pages ship (04 §1.4)
  await expect(doors.getByRole('link')).toHaveCount(0);
});

test('the FAQ: native details, first open, all questions in the HTML', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('.dz-faq-item');
  await expect(items).toHaveCount(8);
  // The first question is open on load; the rest closed
  await expect(items.nth(0)).toHaveAttribute('open', '');
  await expect(items.nth(1)).not.toHaveAttribute('open');
  for (const question of QUESTIONS) await expect(page.getByText(question)).toBeVisible();
});

test('the FAQ is keyboard-operable and opens with Enter on the summary', async ({ page }) => {
  await page.goto('/');
  const second = page.locator('.dz-faq-item').nth(1);
  await second.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('open', '');
});

test('the FAQ enhancement: the chips filter, the live count, copy-link (lazy, after first interaction)', async ({
  page,
}) => {
  await page.goto('/');
  // The chips stay hidden until the enhancement loads (faq.md: no JS, no chips)
  await expect(page.locator('[data-faq-chips]')).toBeHidden();
  // The first pointer inside the region loads it
  await page.locator('.dz-faq-item').nth(1).hover();
  const chips = page.locator('[data-faq-topic]');
  await expect(chips.first()).toBeVisible({ timeout: 5_000 });
  // Press the Cost chip (the questions carry data-faq-topic too; the chip is the button)
  await page.locator('button[data-faq-topic="cost"]').click();
  await expect(page.locator('[data-faq-count]')).toHaveText(/Showing 1 of 8 questions/i);
  await expect(page.locator('.dz-faq-item:not([hidden])')).toHaveCount(1);
  // Copy-link exists on the open question
  await expect(page.locator('.dz-faq-copy').first()).toBeVisible();
});

test('a deep link opens and focuses its question (#faq-<id>)', async ({ page }) => {
  await page.goto('/#faq-who-owns-the-system');
  // The enhancement loads on the region's first pointer; the hash is handled once it runs
  await page.locator('.dz-faq-intro h2').hover();
  const target = page.locator('#faq-who-owns-the-system');
  await expect(target).toHaveAttribute('open', '', { timeout: 5_000 });
});

test('the demo stub fires demo_open and opens its honest panel', async ({ page }) => {
  await page.goto('/');
  const events: { event: string; demo_id: string }[] = [];
  await page.exposeFunction('__pushEvent', (event: { event: string; demo_id: string }) => events.push(event));
  await page.addInitScript(() => {
    window.dataLayer = window.dataLayer ?? [];
    const push = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = (...args: unknown[]) => {
      for (const arg of args) {
        const obj = arg as { event?: string; demo_id?: string };
        if (obj && typeof obj === 'object' && obj.event === 'demo_open') {
          void (window as unknown as { __pushEvent: (e: unknown) => void }).__pushEvent(obj);
        }
      }
      return push(...args);
    };
  });
  await page.goto('/');
  await page.locator('[data-demo="speed-to-lead"]').click();
  await expect(page.locator('[data-demo-panel="speed-to-lead"]')).toBeVisible({ timeout: 5_000 });
  await expect(page.locator('[data-demo-panel="speed-to-lead"]')).toContainText(/being built/i);
  await expect.poll(() => events).toEqual([{ event: 'demo_open', demo_id: 'speed-to-lead' }]);
});

test('the LCP stamp fills with a real measurement once its region is interacted with', async ({ page }) => {
  await page.goto('/');
  const stamp = page.locator('[data-lcp-value]');
  // The honest fallback first (footer.md's rule: never a substitute number)
  await expect(stamp).toHaveText(/not measured in this browser/i);
  // The §06 region's first pointer loads the enhancement and reads the buffered entry
  await page.locator('#build-heading').hover();
  await expect.poll(async () => stamp.textContent(), { timeout: 5_000 }).toMatch(/^\d+\.\d\d s$/);
});

test('axe: no serious or critical violations on Home', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test('Reduce effects: the stories rest in their final states', async ({ page }) => {
  // A genuine trigger (13 §2.11): the init script reads the media query before the first
  // paint, so no race with the preferences runtime's own write of data-effects
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
  // The chat's final state: the complete conversation, no hidden bubbles
  const bubbles = page.locator('.dz-chat-bubble');
  await expect(bubbles).toHaveCount(2);
  for (const bubble of await bubbles.all()) {
    const opacity = await bubble.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  }
});

test('without JavaScript the page is complete: every question and the hero answer', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const question of QUESTIONS) await expect(page.getByText(question).first()).toBeVisible();
  // No chips without JavaScript (faq.md)
  await expect(page.locator('[data-faq-chips]')).toBeHidden();
  await context.close();
});
