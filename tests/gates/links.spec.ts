import { expect, test } from '@playwright/test';
import { crawlSite } from './crawl';
import { linkProblems, SKIPPED } from './rules';

// check:links (docs/ai/03): every internal link on every crawled page resolves to a 200.
test('check:links', async ({ browser, baseURL }) => {
  const origin = new URL(baseURL as string).origin;
  const pages = await crawlSite(browser, origin);
  const links = pages.reduce((sum, page) => sum + page.links.length, 0);
  const problems = linkProblems(pages, origin);

  console.log(`check:links: ${pages.length} URL(s) crawled, ${links} link(s) checked.`);
  for (const skipped of [...SKIPPED.links, ...SKIPPED.crawl]) console.log(`  not checked yet: ${skipped}`);

  expect(pages.length).toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});
