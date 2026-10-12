import { expect, test } from '@playwright/test';
import { consentContent } from '../../src/content/en/legal/consent';
import { privacyFaq, privacyPolicy } from '../../src/content/en/legal/privacy';
import { seriousAxeViolations } from './helpers/axe';
import { fromCountry, stubGtm } from './helpers/tracking';

// The privacy policy (/privacy, R006; the privacy page plan; the draft's Part 1 layout): the LCP H1 at
// first paint, the breadcrumb, real contents links, captioned tables that scroll inside their own box,
// the FAQ matching its schema word for word, "Last updated" equal to dateModified, the section in view
// marked, no sideways scroll on a phone, a complete page without JavaScript, axe, and the footer's and
// the consent banner's links that appear now the page is live (04 §1.4).

const PATH = '/privacy';

test.beforeEach(async ({ page }) => {
  await stubGtm(page);
});

test('one H1, visible and in place at first paint (13 §3 rule 2)', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('h1')).toHaveCount(1);
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveText(privacyPolicy.heading);
  expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await h1.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});

test('the breadcrumb: Home, then the page as text (engine §5.1)', async ({ page }) => {
  await page.goto(PATH);
  const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(nav.getByRole('link')).toHaveText(['Home']);
  await expect(nav.locator('[aria-current="page"]')).toHaveText(privacyPolicy.breadcrumb);
});

test('every contents link points at its numbered section', async ({ page }) => {
  await page.goto(PATH);
  const nav = page.getByRole('navigation', { name: privacyPolicy.contentsLabel });
  const links = nav.locator('.dz-legal-toc-desktop a');
  await expect(links).toHaveCount(privacyPolicy.sections.length);
  for (const [index, section] of privacyPolicy.sections.entries()) {
    await expect(links.nth(index)).toHaveAttribute('href', `#${section.id}`);
    await expect(page.locator(`section#${section.id} h2`)).toHaveText(`${index + 1}. ${section.title}`);
  }
});

test('each table has a caption and scrolls inside a keyboard-reachable box', async ({ page }) => {
  await page.goto(PATH);
  const boxes = page.locator('.dz-legal-table');
  const tables = privacyPolicy.sections.flatMap((section) => section.blocks.filter((b) => b.kind === 'table'));
  await expect(boxes).toHaveCount(tables.length);
  for (const [index, table] of tables.entries()) {
    const box = boxes.nth(index);
    await expect(box).toHaveAttribute('tabindex', '0');
    await expect(box.locator('caption')).toHaveText(table.caption);
    await expect(box).toHaveAccessibleName(table.caption);
  }
});

test('the FAQ: eight questions, the same words as the FAQPage schema (08 §3 rule 7)', async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator('.dz-faq-item')).toHaveCount(privacyFaq.length);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = blocks.flatMap((text) => {
    const data = JSON.parse(text);
    return data['@graph'] ?? [data];
  });
  const faqPage = nodes.find((node) => node['@type'] === 'FAQPage');
  expect(
    faqPage.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => [q.name, q.acceptedAnswer.text]),
  ).toEqual(privacyFaq.map((q) => [q.question, q.answer]));
  for (const { question } of privacyFaq) await expect(page.getByText(question, { exact: true })).toBeVisible();
  const webPage = nodes.find((node) => node['@type'] === 'WebPage');
  expect(webPage.dateModified).toBe(privacyPolicy.lastUpdated.iso);
  await expect(page.locator('time')).toHaveAttribute('datetime', privacyPolicy.lastUpdated.iso);
});

test('the section in view is marked in the contents (toc-enhance, loaded on use)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(PATH);
  // The first pointer inside the contents loads the enhancement (fx/lazy.ts)
  await page.locator('.dz-legal-toc-desktop a').first().hover();
  await page.locator('section#cookies').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById('cookies')?.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.dz-legal-toc-desktop [data-toc-link="cookies"]')).toHaveAttribute('aria-current', 'true');
});

test('the contact block: email and WhatsApp, and no link to the contact page before it ships', async ({ page }) => {
  await page.goto(PATH);
  const block = page.locator('section[aria-labelledby="legal-contact"]');
  await expect(block.getByRole('link', { name: privacyPolicy.contact.email })).toHaveAttribute('href', /^mailto:/);
  await expect(block.getByRole('link', { name: privacyPolicy.contact.whatsapp })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/\d+$/,
  );
  await expect(page.locator('main a[href="/contact"]')).toHaveCount(0);
});

test('axe: no serious or critical violations', async ({ page }) => {
  await page.goto(PATH);
  expect(await seriousAxeViolations(page)).toEqual([]);
});

test('at 360 px nothing scrolls sideways; the tables scroll in their own box (WCAG 1.4.10)', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto(PATH);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.locator('.dz-legal-toc-mobile summary')).toBeVisible();
  await expect(page.locator('.dz-legal-toc-desktop')).toBeHidden();
});

test('without JavaScript the page is complete: the H1, every section and every question', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(PATH);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const section of privacyPolicy.sections) await expect(page.locator(`section#${section.id} h2`)).toBeVisible();
  for (const { question } of privacyFaq) await expect(page.getByText(question, { exact: true })).toBeVisible();
  await context.close();
});

test('the footer links to the policy now that it is live (04 §1.4)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href="/privacy"]')).toHaveCount(1);
});

test.describe('a European visitor (DE)', () => {
  test.use(fromCountry('DE'));

  test('the consent banner links to the policy', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('complementary', { name: consentContent.banner.title });
    await expect(banner.getByRole('link', { name: consentContent.banner.policyLink })).toHaveAttribute(
      'href',
      '/privacy',
    );
  });

  test('the banner never covers the H1 at 360 × 640', async ({ page }) => {
    await page.route('**/_next/static/**/*.js', (route) => route.abort());
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(PATH);
    const aside = page.getByRole('complementary', { name: consentContent.banner.title });
    await expect(aside).toBeVisible();
    const h1 = (await page.locator('h1').boundingBox())!;
    const box = (await aside.boundingBox())!;
    expect(h1.y + h1.height).toBeLessThanOrEqual(box.y);
  });
});
