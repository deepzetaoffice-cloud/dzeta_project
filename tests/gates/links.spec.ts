import { expect, test } from '@playwright/test';
import { crawlSite } from './crawl';
import { linkProblems, navLinkProblems, SKIPPED } from './rules';

// check:links (docs/ai/03): every internal link on every crawled page resolves to a 200, and the
// header's and the footer's links equal their targets' canonical URLs, with no list linking a page
// twice (P2).
test('check:links', async ({ browser, baseURL }) => {
  const origin = new URL(baseURL as string).origin;
  const pages = await crawlSite(browser, baseURL as string);
  const links = pages.reduce((sum, page) => sum + page.links.length, 0);
  // Only links to another page of the site are compared; in-page anchors and mailto: aren't pages.
  const navLinks = pages.reduce(
    (sum, page) =>
      sum +
      page.navLists.flat().filter((href) => !href.startsWith('#') && new URL(href, page.url).origin === origin).length,
    0,
  );
  const problems = [...linkProblems(pages, origin), ...navLinkProblems(pages, origin)];

  console.log(
    `check:links: ${pages.length} URL(s) crawled, ${links} link(s) checked; ${navLinks} header and footer link(s) checked against canonicals.`,
  );
  for (const item of [...SKIPPED.links, ...SKIPPED.crawl]) console.log(`  not checked yet: ${item}`);

  expect(pages.length).toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});
