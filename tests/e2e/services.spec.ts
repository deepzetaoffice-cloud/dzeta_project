import { expect, test } from '@playwright/test';
import { consentContent } from '../../src/content/en/legal/consent';
import { services as catalogue, type CatalogueService } from '../../src/content/catalogue';
import { servicesHubFaq } from '../../src/content/en/faq-bank';
import { servicePages } from '../../src/content/en/services';
import { isLivePath } from '../../src/lib/routes';
import { seriousAxeViolations } from './helpers/axe';
import { fromCountry, stubGtm } from './helpers/tracking';

// The services hub (R010) and every live service page from the template, the pilot Speed-to-Lead
// System (R027) first (P6 part A2, S11; the service batches, decision 0029: a page joins these tests
// when its registry row turns live, with no edit here; docs/design/services-hub.md, service-page.md,
// faq.md; 13 §3): the LCP H1 at first paint, one
// H1, the visible breadcrumb, the FAQ (keyboard, no-JS), the demo stub, axe, Reduce effects, the
// European banner clear of the H1 at 360 × 640, no sideways scroll on a phone, and only live services
// built or linked. view_service lives in tracking.spec.ts with the other events.

const HUB = '/services';
const PILOT = '/services/speed-to-lead-system';
const catalogueServices: readonly CatalogueService[] = catalogue;

// Each live service page: the catalogue name is its breadcrumb's current item (serviceTrail)
const SERVICE_PAGES = Object.entries(servicePages)
  .filter(([slug]) => isLivePath(`/services/${slug}`))
  .map(([slug, page]) => {
    const name = catalogueServices.find((service) => service.slug === slug)?.name ?? slug;
    return { path: `/services/${slug}`, name, current: name, trail: ['Home', 'Services'], faq: page.faq };
  });
const PAGES = [
  { path: HUB, name: 'the services hub', current: 'Services', trail: ['Home'], faq: servicesHubFaq },
  ...SERVICE_PAGES,
];

test.beforeEach(async ({ page }) => {
  await stubGtm(page);
});

for (const { path, name, current, trail, faq } of PAGES) {
  test.describe(name, () => {
    test('one H1, visible and in place at first paint (13 §3 rule 2)', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
      expect(await h1.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    });

    test('the breadcrumb: Home first, each ancestor a link, the page itself as text (engine §5.1)', async ({
      page,
    }) => {
      await page.goto(path);
      const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(nav.getByRole('link')).toHaveText([...trail]);
      await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      await expect(nav.locator('[aria-current="page"]')).toHaveText(current);
    });

    test('the FAQ: every question in the HTML, the first open, Enter opens another', async ({ page }) => {
      await page.goto(path);
      const items = page.locator('.dz-faq-item');
      await expect(items).toHaveCount(faq.length);
      await expect(items.nth(0)).toHaveAttribute('open', '');
      for (const { question } of faq) await expect(page.getByText(question, { exact: true })).toBeVisible();
      const second = items.nth(1);
      await second.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(second).toHaveAttribute('open', '');
    });

    test('axe: no serious or critical violations', async ({ page }) => {
      await page.goto(path);
      expect(await seriousAxeViolations(page)).toEqual([]);
    });

    test('at 360 px nothing scrolls sideways (WCAG 1.4.10)', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('without JavaScript the page is complete: the H1, the answer and every question', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      for (const { question } of faq) await expect(page.getByText(question, { exact: true })).toBeVisible();
      // No chips without JavaScript (faq.md)
      await expect(page.locator('[data-faq-chips]')).toBeHidden();
      await context.close();
    });

    test.describe('a European visitor (DE)', () => {
      test.use(fromCountry('DE'));
      test('the banner never covers the H1 at 360 × 640', async ({ page }) => {
        await page.route('**/_next/static/**/*.js', (route) => route.abort());
        await page.setViewportSize({ width: 360, height: 640 });
        await page.goto(path);
        const aside = page.getByRole('complementary', { name: consentContent.banner.title });
        await expect(aside).toBeVisible();
        const h1 = (await page.locator('h1').boundingBox())!;
        const box = (await aside.boundingBox())!;
        expect(h1.y + h1.height).toBeLessThanOrEqual(box.y);
      });
    });
  });
}

test.describe('the services hub', () => {
  test('a live service is a link to its page; a service not yet live is plain text (04 §1.4)', async ({ page }) => {
    await page.goto(HUB);
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: 'Speed-to-Lead System', exact: true }).first()).toHaveAttribute(
      'href',
      PILOT,
    );
    await expect(main.getByText('WhatsApp AI Agent', { exact: true }).first()).toBeVisible();
    await expect(main.locator('a[href="/services/whatsapp-ai-agent"]')).toHaveCount(0);
  });

  test('the four pillar directories in catalogue order', async ({ page }) => {
    await page.goto(HUB);
    await expect(page.locator('#hub-pillars ~ div h3')).toHaveText([
      'AI Automation',
      'Websites',
      'Software',
      'Growth & Ranking',
    ]);
  });
});

test.describe('Speed-to-Lead System', () => {
  test('the demo stub opens its honest panel', async ({ page }) => {
    await page.goto(PILOT);
    await page.locator('[data-demo="speed-to-lead"]').first().click();
    const panel = page.locator('[data-demo-panel="speed-to-lead"]');
    await expect(panel).toBeVisible({ timeout: 5_000 });
    await expect(panel).toContainText(/being built/i);
  });

  test('Reduce effects: the story-flow rests in its final state', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(PILOT);
    await expect(page.locator('html')).toHaveAttribute('data-effects', 'reduced');
    for (const line of await page.locator('.dz-flow-line').all()) {
      expect(await line.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^(none|1)$/);
    }
  });
});

test.describe('Only live service pages are built (dynamicParams = false)', () => {
  for (const path of ['/services/whatsapp-ai-agent', '/services/not-a-service']) {
    test(`${path} is a 404`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(404);
    });
  }
});
