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
        navLists: [],
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
        // The site's header and footer (the banner and contentinfo landmarks, so never one inside an
        // article or a section). Each link belongs to its nearest list, or else to the menu it sits in
        // (a popover or a dialog), or else to the region: so the mega menu's links aren't counted as
        // part of the nav list around its button, nor the sheet's CTA beside the header's.
        const navGroups = new Map<Element, string[]>();
        const landmark = ':not(:is(article, aside, main, nav, section) *)';
        for (const region of all(`header${landmark}, footer${landmark}`)) {
          for (const link of region.querySelectorAll('a[href]')) {
            const list = link.closest('ul, ol, [popover], dialog');
            const group = list && region.contains(list) ? list : region;
            navGroups.set(group, [...(navGroups.get(group) ?? []), link.getAttribute('href') ?? '']);
          }
        }
        return {
          titles: all('head > title').map((el) => el.textContent ?? ''),
          descriptions: attr('meta[name="description"]', 'content'),
          canonicals: attr('link[rel="canonical"]', 'href'),
          robotsMeta: attr('meta[name="robots"], meta[name="googlebot"]', 'content'),
          keywordsMetaCount: all('meta[name="keywords"]').length,
          h1Count: all('h1').length,
          links: attr('a[href]', 'href'),
          navLists: [...navGroups.values()],
          jsonLd: all('script[type="application/ld+json"]').map((el) => el.textContent ?? ''),
          // The visible text of the page body, whitespace-normalised: the visible-parity check
          // (P5) reads it — schema values that must mirror the page (the FAQ Q&A) are searched in it.
          bodyText: (document.querySelector('main')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
          // The SEO contract (08 §7): the social tags, and every image and video as served
          meta: all('meta[property^="og:"], meta[name^="twitter:"]').reduce<Record<string, string[]>>((map, el) => {
            const key = el.getAttribute('property') ?? el.getAttribute('name') ?? '';
            map[key] = [...(map[key] ?? []), el.getAttribute('content') ?? ''];
            return map;
          }, {}),
          images: all('img').map((el) => ({
            src: el.getAttribute('src') ?? '',
            alt: el.getAttribute('alt'),
            width: el.getAttribute('width'),
            height: el.getAttribute('height'),
          })),
          videos: all('video').map((el) => ({
            src: el.getAttribute('src') ?? el.querySelector('source')?.getAttribute('src') ?? '',
            poster: el.getAttribute('poster'),
            captions: el.querySelectorAll('track[kind="captions"], track[kind="subtitles"]').length,
            loop: el.hasAttribute('loop'),
            muted: el.hasAttribute('muted'),
          })),
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
