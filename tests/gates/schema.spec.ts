import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parseEnv } from '../../src/lib/env';
import { siteConfig } from '../../src/lib/site-config';
import { crawlSite } from './crawl';
import { definedIds, isHtml, schemaProblems, SKIPPED } from './rules';

// check:schema (docs/ai/03, docs/ai/08 §3, schema-system spec §4): the built-HTML gate. The P4
// assertions: parse, @id uniqueness, no empty values, references resolve in the document union,
// #organization/#website exactly once, absolute canonical URLs with no trailing slash, NAP parity
// with the site config, and the golden fixtures for the two shipping templates.

test('check:schema', async ({ browser, baseURL }) => {
  const { siteUrl } = parseEnv(process.env);
  const options = {
    siteUrl,
    nap: {
      brandName: siteConfig.brandName,
      email: siteConfig.email,
      streetAddress: 'Office #202, Al Hilal Bank Building, Al Qusais 2',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
  };
  const pages = (await crawlSite(browser, baseURL as string)).filter((page) => page.status === 200 && isHtml(page));
  const blocks = pages.reduce((sum, page) => sum + page.jsonLd.length, 0);
  // The site-wide union (P6 part A2): every node any built page defines, and every built page's URL
  const siteDefined = new Set(pages.flatMap((page) => [...definedIds(page)]));
  const builtUrls = new Set(
    pages.map((page) => {
      const { pathname } = new URL(page.url);
      return pathname === '/' ? siteUrl : `${siteUrl}${pathname.replace(/\/$/, '')}`;
    }),
  );
  const checked = { ...options, siteDefined, builtUrls };
  const problems = pages.flatMap((page) => schemaProblems(page, checked).map((problem) => `${page.url}: ${problem}`));

  console.log(`check:schema: ${pages.length} page(s), ${blocks} JSON-LD block(s) checked.`);
  for (const skipped of [...SKIPPED.schema, ...SKIPPED.crawl]) console.log(`  not checked yet: ${skipped}`);

  expect(pages.length).toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});

// Spec §4 assertion 11: the golden fixture matches, or the diff is approved in the same change.
// One fixture per shipping template (sitewide, Home); each page's plan adds its own with its page.
// The served origin (localhost in CI) is rewritten to the fixture's canonical origin before the
// comparison, so the fixture pins the graph's shape, not the machine that served it.
test('golden fixtures match the rendered graphs', async ({ request, baseURL }) => {
  const served = new URL(baseURL as string).origin;
  const canonical = 'https://deepzeta.ai';
  const fixtures: { url: string; fixture: string }[] = [
    { url: served + '/', fixture: 'tests/fixtures/schema/home.json' },
    { url: served + '/services', fixture: 'tests/fixtures/schema/services-hub.json' },
    { url: served + '/services/speed-to-lead-system', fixture: 'tests/fixtures/schema/service.json' },
  ];
  for (const { url, fixture } of fixtures) {
    const html = await (await request.get(url)).text();
    const raw = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]!);
    const parsed = JSON.parse(
      JSON.stringify(raw.map((block) => JSON.parse(block!)))
        .split(served)
        .join(canonical),
    );
    const golden = JSON.parse(readFileSync(fixture, 'utf8'));
    expect(parsed, `the rendered blocks for ${url} differ from ${fixture}`).toEqual(golden);
  }
});
