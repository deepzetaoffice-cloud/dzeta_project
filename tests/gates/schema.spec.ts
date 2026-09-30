import { expect, test } from '@playwright/test';
import { crawlSite } from './crawl';
import { isHtml, schemaProblems, SKIPPED } from './rules';

// check:schema (docs/ai/03, docs/ai/08 §3): the checks that apply before the P4 schema builders.
test('check:schema', async ({ browser, baseURL }) => {
  const pages = (await crawlSite(browser, baseURL as string)).filter((page) => page.status === 200 && isHtml(page));
  const blocks = pages.reduce((sum, page) => sum + page.jsonLd.length, 0);
  const problems = pages.flatMap((page) => schemaProblems(page).map((problem) => `${page.url}: ${problem}`));

  console.log(`check:schema: ${pages.length} page(s), ${blocks} JSON-LD block(s) checked.`);
  for (const skipped of [...SKIPPED.schema, ...SKIPPED.crawl]) console.log(`  not checked yet: ${skipped}`);

  expect(pages.length).toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});
