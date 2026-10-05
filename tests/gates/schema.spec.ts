import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { siteConfig } from '../../src/lib/site-config';
import { crawlSite } from './crawl';
import { isHtml, schemaProblems, SKIPPED } from './rules';

// check:schema (docs/ai/03, docs/ai/08 §3, schema-system spec §4): the built-HTML gate. The P4
// assertions: parse, @id uniqueness, no empty values, references resolve in the document union,
// #organization/#website exactly once, absolute canonical URLs with no trailing slash, NAP parity
// with the site config, and the golden fixtures for the two shipping templates.

const OPTIONS = {
  siteUrl: (await import('../../src/lib/env')).parseEnv(process.env).siteUrl,
  nap: {
    brandName: siteConfig.brandName,
    email: siteConfig.email,
    streetAddress: 'Office #202, Al Hilal Bank Building, Al Qusais 2',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE',
  },
};

test('check:schema', async ({ browser, baseURL }) => {
  const pages = (await crawlSite(browser, baseURL as string)).filter((page) => page.status === 200 && isHtml(page));
  const blocks = pages.reduce((sum, page) => sum + page.jsonLd.length, 0);
  const problems = pages.flatMap((page) => schemaProblems(page, OPTIONS).map((problem) => `${page.url}: ${problem}`));

  console.log(`check:schema: ${pages.length} page(s), ${blocks} JSON-LD block(s) checked.`);
  for (const skipped of [...SKIPPED.schema, ...SKIPPED.crawl]) console.log(`  not checked yet: ${skipped}`);

  expect(pages.length).toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});

// Spec §4 assertion 11: the golden fixture matches, or the diff is approved in the same change.
// One fixture per shipping template (sitewide, Home); each page's plan adds its own with its page.
test('golden fixtures match the rendered graphs', async ({ request, baseURL }) => {
  const origin = new URL(baseURL as string).origin;
  const fixtures: { url: string; fixture: string }[] = [
    { url: origin + '/', fixture: 'tests/fixtures/schema/home.json' },
  ];
  for (const { url, fixture } of fixtures) {
    const html = await (await request.get(url)).text();
    const raw = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]!);
    const parsed = raw.map((block) => JSON.parse(block!));
    const golden = JSON.parse(readFileSync(fixture, 'utf8'));
    expect(parsed, `the rendered blocks for ${url} differ from ${fixture}`).toEqual(golden);
  }
});
