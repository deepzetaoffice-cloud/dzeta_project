import type { Browser } from '@playwright/test';
import { isHtml, type PageData } from './rules';

const MAX_PAGES = 500;

// Crawls the built site from "/" by following same-origin links, with JavaScript off, so the gates
// read the raw server HTML that search and AI crawlers read (plan section E).
// `baseUrl` may be any URL on the site; only its origin is used.
export async function crawlSite(browser: Browser, baseUrl: string): Promise<PageData[]> {
  const origin = new URL(baseUrl).origin;
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const queue = [new URL('/', origin).href];
  const seen = new Set(queue);
  const pages: PageData[] = [];

  try {
    while (queue.length > 0 && pages.length < MAX_PAGES) {
      const url = queue.shift() as string;
      const response = await context.request.get(url, { maxRedirects: 0 });
      const base: PageData = {
        url,
        status: response.status(),
        contentType: response.headers()['content-type'] ?? '',
        xRobotsTag: response.headers()['x-robots-tag'],
        titles: [],
        descriptions: [],
        canonicals: [],
        robotsMeta: [],
        keywordsMetaCount: 0,
        h1Count: 0,
        links: [],
        jsonLd: [],
      };
      if (base.status !== 200 || !isHtml(base)) {
        pages.push(base);
        continue;
      }

      await page.goto(url);
      const extracted = await page.evaluate(() => {
        const all = (selector: string) => Array.from(document.querySelectorAll(selector));
        const attr = (selector: string, name: string) => all(selector).map((el) => el.getAttribute(name) ?? '');
        return {
          titles: all('head > title').map((el) => el.textContent ?? ''),
          descriptions: attr('meta[name="description"]', 'content'),
          canonicals: attr('link[rel="canonical"]', 'href'),
          robotsMeta: attr('meta[name="robots"], meta[name="googlebot"]', 'content'),
          keywordsMetaCount: all('meta[name="keywords"]').length,
          h1Count: all('h1').length,
          links: attr('a[href]', 'href'),
          jsonLd: all('script[type="application/ld+json"]').map((el) => el.textContent ?? ''),
        };
      });

      const links = extracted.links
        .filter((href) => !/^(mailto|tel|sms|javascript):/i.test(href))
        .map((href) => {
          const target = new URL(href, url);
          target.hash = '';
          return target.href;
        });
      pages.push({ ...base, ...extracted, links });

      for (const link of links) {
        if (new URL(link).origin === origin && !seen.has(link)) {
          seen.add(link);
          queue.push(link);
        }
      }
    }
  } finally {
    await context.close();
  }
  return pages;
}
