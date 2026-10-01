// Pure assertion logic for the HTML gates (docs/ai/03 · check:seo, check:schema, check:links).
// The crawler (crawl.ts) collects PageData from the built site; these functions judge it. They are
// unit-tested with failing fixtures (tests/unit/gate-rules.test.ts), so each gate can really fail.

export type PageData = {
  url: string; // absolute URL as served
  status: number;
  contentType: string;
  xRobotsTag: string | undefined;
  titles: string[];
  descriptions: string[];
  canonicals: string[]; // raw href attributes
  robotsMeta: string[];
  keywordsMetaCount: number;
  h1Count: number;
  links: string[]; // absolute, hash removed
  navLists: string[][]; // raw hrefs in the header and the footer, one array per list (crawl.ts)
  jsonLd: string[]; // raw script contents
};

// Printed with every run so the output never claims more than it checked (plan section E).
export const SKIPPED = {
  seo: [
    'Open Graph and Twitter tags: og:title, og:description, og:url, og:locale, og:type, twitter:card (enabled in P4, with the metadata builder)',
    'og:image returns 200 (enabled in P4, with OG images)',
    'sitemap parity (enabled in P9, with the sitemap)',
    'noindex routes absent from the llms files (enabled in P9, with the llms files)',
  ],
  schema: [
    '#organization and #website exactly once, reference resolution, the page-type matrix, NAP, breadcrumbs, visible parity (enabled in P4)',
    'every URL absolute on the canonical host with no trailing slash (enabled in P4)',
  ],
  links: [
    'URL-registry rules, link budgets, anchors, duplicate targets in the prose, orphans, click depth (enabled in P4)',
  ],
  crawl: ['pages are found by following links from /; sitemap and registry seeds are added in P4/P9'],
} as const;

export function isHtml(page: PageData): boolean {
  return page.contentType.includes('text/html');
}

// `none` means noindex + nofollow. robotsMeta also holds `googlebot` meta values (crawl.ts).
export function isNoindex(page: PageData): boolean {
  return [page.xRobotsTag ?? '', ...page.robotsMeta].some((value) => /\bnoindex\b|\bnone\b/i.test(value));
}

// docs/ai/08 §1: titles and descriptions are unique across the site.
export function duplicateMetaProblems(pages: PageData[]): string[] {
  const problems: string[] = [];
  for (const [label, pick] of [
    ['title', (page: PageData) => page.titles[0]],
    ['description', (page: PageData) => page.descriptions[0]],
  ] as const) {
    const urlsByValue = new Map<string, string[]>();
    for (const page of pages) {
      const value = pick(page);
      if (value) urlsByValue.set(value, [...(urlsByValue.get(value) ?? []), page.url]);
    }
    for (const [value, urls] of urlsByValue) {
      if (urls.length > 1) problems.push(`the same ${label} on ${urls.join(', ')}: "${value}"`);
    }
  }
  return problems;
}

type SeoOptions = { siteUrl: string; brandName: string };

// docs/ai/08 §1 and §2.1, for one indexable page.
export function seoProblems(page: PageData, { siteUrl, brandName }: SeoOptions): string[] {
  const problems: string[] = [];
  const suffix = ` | ${brandName}`;

  if (page.titles.length !== 1) problems.push(`expected one <title>, found ${page.titles.length}`);
  const title = page.titles[0] ?? '';
  // The one title format adds the suffix; page titles never name the brand themselves (08 §1).
  // The brand's first word is also counted case-insensitively, to catch variants like "Deepzeta".
  const brandWord = (brandName.split(' ')[0] ?? brandName).toLowerCase();
  if (!title.endsWith(suffix) || title.toLowerCase().split(brandWord).length !== 2) {
    problems.push(`title must end with "${suffix}" and name the brand exactly once: "${title}"`);
  }
  if (title.length < 50 || title.length > 60) problems.push(`title is ${title.length} characters (50–60): "${title}"`);

  if (page.descriptions.length !== 1) problems.push(`expected one meta description, found ${page.descriptions.length}`);
  const description = page.descriptions[0] ?? '';
  if (description.length < 140 || description.length > 160) {
    problems.push(`description is ${description.length} characters (140–160)`);
  }

  if (page.h1Count !== 1) problems.push(`expected one H1, found ${page.h1Count}`);
  if (page.keywordsMetaCount > 0) problems.push('the keywords meta tag is banned');
  problems.push(...canonicalProblems(page, siteUrl));
  return problems;
}

function canonicalProblems(page: PageData, siteUrl: string): string[] {
  if (page.canonicals.length !== 1) return [`expected one canonical, found ${page.canonicals.length}`];
  const href = page.canonicals[0] ?? '';
  let canonical: URL;
  try {
    canonical = new URL(href);
  } catch {
    return [`canonical must be an absolute URL: "${href}"`];
  }
  const problems: string[] = [];
  if (canonical.origin !== siteUrl) problems.push(`canonical must be on ${siteUrl}: "${href}"`);
  if (href.endsWith('/')) problems.push(`canonical must not end with "/": "${href}"`);
  if (canonical.pathname !== new URL(page.url).pathname) problems.push(`canonical is not self-referencing: "${href}"`);
  if (canonical.search || canonical.hash) problems.push(`canonical must have no query or hash: "${href}"`);
  return problems;
}

// docs/ai/08 §3, the parts that apply before the schema builders exist (P4).
export function schemaProblems(page: PageData): string[] {
  const problems: string[] = [];
  const defined = new Map<string, number>();

  page.jsonLd.forEach((raw, index) => {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      problems.push(`JSON-LD block ${index + 1} does not parse`);
      return;
    }
    walk(data, (node) => {
      const id = node['@id'];
      // A node with only "@id" is a reference; anything more is a definition.
      if (typeof id === 'string' && Object.keys(node).length > 1) defined.set(id, (defined.get(id) ?? 0) + 1);
      for (const [key, value] of Object.entries(node)) {
        // A missing value means the property is omitted (02 §1.4), never sent empty.
        const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
        if (empty || (typeof value === 'string' && /\[\[TODO|lorem ipsum/i.test(value))) {
          problems.push(`empty or placeholder value for "${key}"${typeof id === 'string' ? ` in ${id}` : ''}`);
        }
      }
    });
  });

  for (const [id, count] of defined) if (count > 1) problems.push(`@id defined ${count} times: ${id}`);
  return problems;
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void): void {
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
  } else if (value !== null && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    visit(node);
    Object.values(node).forEach((child) => walk(child, visit));
  }
}

// docs/ai/03 · check:links: every internal link on every crawled page resolves to 200.
export function linkProblems(pages: PageData[], origin: string): string[] {
  const statusByUrl = new Map(pages.map((page) => [page.url, page.status]));
  const problems: string[] = [];
  for (const page of pages) {
    for (const link of page.links) {
      if (new URL(link).origin !== origin) continue;
      const status = statusByUrl.get(link);
      if (status !== 200) problems.push(`${page.url} links to ${link} (${status ?? 'not crawled'})`);
    }
  }
  return problems;
}

// docs/ai/03 · check:links; 08 §2 rule 9; engine §5.1: a header or footer link points at its target's
// canonical URL (no trailing slash, no query), and no list in them links the same page twice. The
// same page in two lists is fine: the desktop nav and the mobile sheet each list it. In-page anchors,
// mailto: and other sites are skipped; linkProblems reports a target that isn't a 200.
export function navLinkProblems(pages: PageData[], origin: string): string[] {
  const pageByUrl = new Map(pages.map((page) => [page.url, page]));
  const problems: string[] = [];
  for (const page of pages) {
    for (const list of page.navLists) {
      const seen = new Set<string>();
      for (const href of list) {
        if (href.startsWith('#')) continue;
        const target = new URL(href, page.url);
        if (target.origin !== origin) continue;
        target.hash = '';
        if (seen.has(target.href)) problems.push(`${page.url}: one header or footer list links ${target.href} twice`);
        seen.add(target.href);

        const linked = pageByUrl.get(target.href);
        if (!linked || linked.status !== 200 || !isHtml(linked)) continue;
        if (linked.canonicals.length !== 1) {
          problems.push(`${page.url}: "${href}" leads to a page with ${linked.canonicals.length} canonicals`);
          continue;
        }
        const canonical = new URL(linked.canonicals[0] ?? '', origin);
        if (target.pathname + target.search !== canonical.pathname + canonical.search) {
          problems.push(`${page.url}: "${href}" isn't its target's canonical URL (${linked.canonicals[0]})`);
        }
      }
    }
  }
  return problems;
}
