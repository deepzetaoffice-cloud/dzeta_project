import { describe, expect, it } from 'vitest';
import {
  duplicateMetaProblems,
  isNoindex,
  linkProblems,
  navLinkProblems,
  schemaProblems,
  seoProblems,
  type PageData,
} from '../gates/rules';

const origin = 'https://deepzeta.ai';
const options = { siteUrl: origin, brandName: 'Deepzeta AI' };

function pageData(overrides: Partial<PageData> = {}): PageData {
  return {
    url: `${origin}/`,
    status: 200,
    contentType: 'text/html; charset=utf-8',
    xRobotsTag: undefined,
    titles: ['AI Automation and Custom Websites in the UAE | Deepzeta AI'],
    descriptions: ['x'.repeat(150)],
    canonicals: [origin],
    robotsMeta: [],
    keywordsMetaCount: 0,
    h1Count: 1,
    links: [],
    navLists: [],
    jsonLd: [],
    ...overrides,
  };
}

describe('seoProblems (check:seo)', () => {
  it('passes a correct page', () => {
    expect(seoProblems(pageData(), options)).toEqual([]);
  });

  it.each([
    ['a missing brand suffix', { titles: ['AI Automation and Custom Websites in the UAE for You'] }, /exactly once/],
    ['a doubled brand suffix', { titles: ['Deepzeta AI | AI Automation in UAE | Deepzeta AI'] }, /exactly once/],
    [
      'a brand variant in the title',
      { titles: ['DeepZeta Services for Clinics and Retail | Deepzeta AI'] },
      /exactly once/,
    ],
    ['a short title', { titles: ['Home | Deepzeta AI'] }, /50–60/],
    ['two titles', { titles: ['a | Deepzeta AI', 'b | Deepzeta AI'] }, /one <title>/],
    ['a short description', { descriptions: ['Too short.'] }, /140–160/],
    ['two H1s', { h1Count: 2 }, /one H1/],
    ['no H1', { h1Count: 0 }, /one H1/],
    ['a keywords meta', { keywordsMetaCount: 1 }, /keywords/],
    ['no canonical', { canonicals: [] }, /one canonical/],
    ['a relative canonical', { canonicals: ['/'] }, /absolute/],
    ['a canonical with a trailing slash', { canonicals: [`${origin}/`] }, /must not end/],
    ['a canonical on another host', { canonicals: ['https://deepzeta-ai.vercel.app'] }, /must be on/],
    ['a canonical to another page', { url: `${origin}/pricing`, canonicals: [origin] }, /self-referencing/],
  ])('fails %s', (_label, overrides, message) => {
    expect(seoProblems(pageData(overrides), options).join('\n')).toMatch(message);
  });
});

describe('isNoindex', () => {
  it('reads both the header and the robots meta', () => {
    expect(isNoindex(pageData({ xRobotsTag: 'noindex' }))).toBe(true);
    expect(isNoindex(pageData({ robotsMeta: ['noindex, follow'] }))).toBe(true);
    expect(isNoindex(pageData({ robotsMeta: ['none'] }))).toBe(true);
    expect(isNoindex(pageData({ robotsMeta: ['index, follow'] }))).toBe(false);
    expect(isNoindex(pageData())).toBe(false);
  });
});

describe('duplicateMetaProblems (check:seo)', () => {
  it('fails a title or description shared by two pages', () => {
    const pages = [pageData(), pageData({ url: `${origin}/pricing` })];
    const problems = duplicateMetaProblems(pages);
    expect(problems).toHaveLength(2);
    expect(problems.join('\n')).toMatch(/the same title[\s\S]*the same description/);
  });

  it('passes unique titles and descriptions', () => {
    const pages = [
      pageData(),
      pageData({
        url: `${origin}/pricing`,
        titles: ['Pricing for AI Automation Projects in UAE | Deepzeta AI'],
        descriptions: ['y'.repeat(150)],
      }),
    ];
    expect(duplicateMetaProblems(pages)).toEqual([]);
  });
});

describe('schemaProblems (check:schema)', () => {
  it('passes a valid graph with references', () => {
    const block = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': origin, about: { '@id': `${origin}/#organization` } },
        {
          '@type': 'ItemList',
          '@id': `${origin}#itemlist`,
          itemListElement: [{ '@id': `${origin}/services#service` }],
        },
      ],
    });
    expect(schemaProblems(pageData({ jsonLd: [block] }))).toEqual([]);
  });

  it('fails a block that does not parse', () => {
    expect(schemaProblems(pageData({ jsonLd: ['{"@type": '] }))).toEqual(['JSON-LD block 1 does not parse']);
  });

  it('fails an @id defined twice across blocks', () => {
    const node = JSON.stringify({ '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Deepzeta AI' });
    expect(schemaProblems(pageData({ jsonLd: [node, node] })).join('\n')).toMatch(/defined 2 times/);
  });

  it('fails empty and placeholder values, including empty arrays', () => {
    const node = JSON.stringify({ '@type': 'Organization', telephone: '', foundingDate: '[[TODO: date]]', sameAs: [] });
    expect(schemaProblems(pageData({ jsonLd: [node] }))).toHaveLength(3);
  });
});

describe('linkProblems (check:links)', () => {
  it('fails an internal link to a page that is not 200, and ignores external links', () => {
    const pages = [
      pageData({ links: [`${origin}/services`, 'https://n8n.io/'] }),
      pageData({ url: `${origin}/services`, status: 404 }),
    ];
    expect(linkProblems(pages, origin)).toEqual([`${origin}/ links to ${origin}/services (404)`]);
  });
});

describe('navLinkProblems (check:links, header and footer)', () => {
  // Home, plus a services page served with and without a trailing slash and with a query, as a
  // crawl would find them; its canonical has neither.
  const services = (url: string) => pageData({ url, canonicals: [`${origin}/services`] });
  const site = (navLists: string[][]) => [
    pageData({ navLists }),
    services(`${origin}/services`),
    services(`${origin}/services/`),
    services(`${origin}/services?from=nav`),
  ];

  it('passes links that equal their canonical, and the same page in two lists', () => {
    expect(navLinkProblems(site([['/', '/services'], ['/services#top'], [`${origin}/services`]]), origin)).toEqual([]);
  });

  it('skips in-page anchors, mailto: and other sites', () => {
    const lists = [['#main', '#main', 'mailto:hello@deepzeta.ai', 'https://n8n.io/', 'https://n8n.io/']];
    expect(navLinkProblems(site(lists), origin)).toEqual([]);
  });

  it.each([
    ['a trailing slash', '/services/'],
    ['a query', '/services?from=nav'],
  ])('fails a link with %s', (_label, href) => {
    expect(navLinkProblems(site([[href]]), origin)).toEqual([
      `${origin}/: "${href}" isn't its target's canonical URL (${origin}/services)`,
    ]);
  });

  it('fails a list that links the same page twice, a fragment apart too', () => {
    expect(navLinkProblems(site([['/services', '/services#pricing']]), origin)).toEqual([
      `${origin}/: one header or footer list links ${origin}/services twice`,
    ]);
  });

  it('fails a link to a page without exactly one canonical', () => {
    const pages = [pageData({ navLists: [['/about']] }), pageData({ url: `${origin}/about`, canonicals: [] })];
    expect(navLinkProblems(pages, origin)).toEqual([`${origin}/: "/about" leads to a page with 0 canonicals`]);
  });
});
