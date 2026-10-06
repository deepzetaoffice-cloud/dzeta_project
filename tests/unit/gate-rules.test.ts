import { describe, expect, it } from 'vitest';
import {
  duplicateMetaProblems,
  isNoindex,
  linkProblems,
  navLinkProblems,
  schemaProblems,
  seoProblems,
  type PageData,
  type SchemaOptions,
} from '../gates/rules';

const origin = 'https://deepzeta.ai';
const options = { siteUrl: origin, brandName: 'Deepzeta AI' };
const schemaOptions: SchemaOptions = {
  siteUrl: origin,
  nap: {
    brandName: 'Deepzeta AI',
    email: 'hello@deepzeta.ai',
    streetAddress: 'Office #202, Al Hilal Bank Building, Al Qusais 2',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE',
  },
};

// A minimal sitewide + page graph that satisfies every P4 assertion.
const goodBlocks = () => [
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${origin}/#organization`,
        name: 'Deepzeta AI',
        email: 'hello@deepzeta.ai',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Office #202, Al Hilal Bank Building, Al Qusais 2',
          addressLocality: 'Dubai',
          addressRegion: 'Dubai',
          addressCountry: 'AE',
        },
      },
      { '@type': 'WebSite', '@id': `${origin}/#website`, url: origin, publisher: { '@id': `${origin}/#organization` } },
    ],
  }),
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': origin,
        url: origin,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
      },
    ],
  }),
];

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
  it('passes a valid two-block document (sitewide + page)', () => {
    expect(schemaProblems(pageData({ jsonLd: goodBlocks() }), schemaOptions)).toEqual([]);
  });

  // P5: the FAQ visible-parity check (08 §3 rule 7). The questions and answers of a FAQPage block
  // must appear in the page's visible text; both sides are whitespace-normalised before comparing.
  const faqBlock = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${origin}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does the audit include?',
            acceptedAnswer: { '@type': 'Answer', text: 'Everything you need to decide, in one session.' },
          },
        ],
      },
    ],
  });

  it('passes a FAQPage whose question and answer are visible on the page', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    expect(
      schemaProblems(
        pageData({
          jsonLd: [sitewideBlock!, pageBlock!, faqBlock],
          bodyText: 'What does the audit include? Everything you need to decide, in one session.',
        }),
        schemaOptions,
      ),
    ).toEqual([]);
  });

  it('fails a FAQPage question or answer that is not visible on the page', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    const problems = schemaProblems(
      pageData({ jsonLd: [sitewideBlock!, pageBlock!, faqBlock], bodyText: 'Completely unrelated text.' }),
      schemaOptions,
    );
    expect(problems).toHaveLength(2);
    expect(problems.join('\n')).toMatch(/question is not visible/);
    expect(problems.join('\n')).toMatch(/answer is not visible/);
  });

  it('ignores markup differences: only the normalised words are compared', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    expect(
      schemaProblems(
        pageData({
          jsonLd: [sitewideBlock!, pageBlock!, faqBlock],
          bodyText: '<p>What does the audit include?</p>  <span>Everything you need to decide, in one session.</span>',
        }),
        schemaOptions,
      ),
    ).toEqual([]);
  });

  it('fails a block that does not parse', () => {
    // The unparseable block also misses #organization/#website, so all three problems surface.
    expect(schemaProblems(pageData({ jsonLd: ['{"@type": '] }), schemaOptions)).toEqual([
      'JSON-LD block 1 does not parse',
      `${origin}/#organization defined 0 times (expected 1)`,
      `${origin}/#website defined 0 times (expected 1)`,
    ]);
  });

  it('fails an @id defined twice across blocks', () => {
    const node = JSON.stringify({ '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Deepzeta AI' });
    expect(schemaProblems(pageData({ jsonLd: [node, node] }), schemaOptions).join('\n')).toMatch(/defined 2 times/);
  });

  it('fails empty and placeholder values, including empty arrays', () => {
    const node = JSON.stringify({ '@type': 'Organization', telephone: '', foundingDate: '[[TODO: date]]', sameAs: [] });
    // The three value problems, plus the two missing global nodes (this graph defines neither).
    expect(schemaProblems(pageData({ jsonLd: [node] }), schemaOptions)).toHaveLength(5);
  });

  it('fails #organization or #website missing or duplicated (spec §4 assertion 10)', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    expect(schemaProblems(pageData({ jsonLd: [pageBlock!] }), schemaOptions).join('\n')).toMatch(
      /#organization.*0 times/,
    );
    expect(
      schemaProblems(pageData({ jsonLd: [sitewideBlock!, sitewideBlock!, pageBlock!] }), schemaOptions).join('\n'),
    ).toMatch(/#website.*2 times/);
  });

  it('fails a reference that resolves nowhere in the document (assertion 3)', () => {
    const block = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          publisher: { '@id': `${origin}/#organization` },
        },
        { '@type': 'WebPage', '@id': origin, isPartOf: { '@id': `${origin}/#website` } },
      ],
    });
    // #organization referenced (the WebSite's publisher) but never defined.
    expect(schemaProblems(pageData({ jsonLd: [block] }), schemaOptions).join('\n')).toMatch(/resolves to no @id/);
  });

  it('fails a URL that leaves the canonical origin or carries a trailing slash (assertion 6)', () => {
    const [sitewideBlock] = goodBlocks();
    const block = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          publisher: { '@id': `${origin}/#organization` },
        },
        {
          '@type': 'WebPage',
          '@id': origin,
          url: origin,
          isPartOf: { '@id': `${origin}/#website` },
          about: { '@id': `${origin}/#organization` },
          relatedLink: 'https://example.com/x',
        },
      ],
    });
    expect(
      schemaProblems(
        pageData({ jsonLd: [sitewideBlock!.replace(`"url":"${origin}"`, `"url":"${origin}/"`), block] }),
        schemaOptions,
      ).join('\n'),
    ).toMatch(/leaves the canonical origin|trailing slash/);
  });

  it('fails NAP that differs from the site config (assertion 5)', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    const edited = sitewideBlock!.replace('Office #202', 'Office 202');
    expect(schemaProblems(pageData({ jsonLd: [edited, pageBlock!] }), schemaOptions).join('\n')).toMatch(
      /streetAddress differs/,
    );
  });

  it('sameAs is exempt from the origin rule: external profile URLs pass', () => {
    const [sitewideBlock, pageBlock] = goodBlocks();
    const withProfiles = sitewideBlock!.replace(
      '"addressCountry":"AE"}',
      '"addressCountry":"AE"},"sameAs":["https://www.linkedin.com/company/deepzeta-ai-digital-solutions-dubai/"]',
    );
    expect(schemaProblems(pageData({ jsonLd: [withProfiles, pageBlock!] }), schemaOptions).join('\n')).not.toMatch(
      /leaves the canonical origin/,
    );
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
