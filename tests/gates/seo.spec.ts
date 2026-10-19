import { expect, test } from '@playwright/test';
import { parseEnv } from '../../src/lib/env';
import { siteConfig } from '../../src/lib/site-config';
import { crawlSite } from './crawl';
import { duplicateMetaProblems, isHtml, isNoindex, seoProblems, sitemapProblems, SKIPPED } from './rules';

// check:seo (docs/ai/03; docs/ai/08 §1, §6, §7): every indexable built page, the SEO contract's media
// rules, the og:image each page names, and the sitemap against the indexable pages.
test('check:seo', async ({ browser, baseURL, request }) => {
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

  // Every og:image a page names returns 200 (08 §1)
  const ogImages = new Set(indexable.flatMap((page) => page.meta?.['og:image'] ?? []));
  for (const image of ogImages) {
    const status = (await request.get(new URL(new URL(image).pathname, baseURL).href)).status();
    if (status !== 200) problems.push(`og:image returns ${status}: ${image}`);
  }

  // The sitemap lists exactly the indexable built pages (08 §6)
  const sitemap = await (await request.get(new URL('/sitemap.xml', baseURL).href)).text();
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');
  const onSite = (url: string) => new URL(new URL(url).pathname, siteUrl).href.replace(/\/$/, '');
  problems.push(
    ...sitemapProblems(
      listed.map(onSite),
      indexable.map((page) => onSite(page.url)),
    ),
  );

  console.log(`check:seo: ${indexable.length} indexable page(s) checked, ${skipped.length} noindex skipped.`);
  for (const page of skipped) console.log(`  noindex, not checked: ${page.url}`);
  for (const item of [...SKIPPED.seo, ...SKIPPED.crawl]) console.log(`  not checked yet: ${item}`);

  expect(indexable.length, 'no indexable page was found: is SITE_INDEXING=on for this build?').toBeGreaterThan(0);
  expect(problems, problems.join('\n')).toEqual([]);
});
