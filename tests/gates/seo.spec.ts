import { expect, test } from '@playwright/test';
import { parseEnv } from '../../src/lib/env';
import { siteConfig } from '../../src/lib/site-config';
import { crawlSite } from './crawl';
import { duplicateMetaProblems, isHtml, isNoindex, seoProblems, SKIPPED } from './rules';

// check:seo (docs/ai/03, docs/ai/08 §1): every indexable built page.
test('check:seo', async ({ browser, baseURL }) => {
  const { siteUrl } = parseEnv(process.env);
  const pages = (await crawlSite(browser, baseURL as string)).filter((page) => page.status === 200 && isHtml(page));
  const indexable = pages.filter((page) => !isNoindex(page));
  const skipped = pages.filter((page) => isNoindex(page));
  const problems = [
    ...indexable.flatMap((page) =>
      seoProblems(page, { siteUrl, brandName: siteConfig.brandName }).map((problem) => `${page.url}: ${problem}`),
    ),
    ...duplicateMetaProblems(indexable),
  ];

  console.log(`check:seo: ${indexable.length} indexable page(s) checked, ${skipped.length} noindex skipped.`);
  for (const page of skipped) console.log(`  noindex, not checked: ${page.url}`);
  for (const item of [...SKIPPED.seo, ...SKIPPED.crawl]) console.log(`  not checked yet: ${item}`);

  expect(indexable.length, 'no indexable page was found: is SITE_INDEXING=on for this build?').toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});
