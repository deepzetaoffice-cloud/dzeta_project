import { describe, expect, it } from 'vitest';
import { articleNode } from '@/lib/schema/nodes/article.ts';
import { breadcrumbListNode } from '@/lib/schema/nodes/breadcrumbList.ts';
import { definedTermSetNode } from '@/lib/schema/nodes/definedTermSet.ts';
import { faqPageNode } from '@/lib/schema/nodes/faqPage.ts';
import { howToNode } from '@/lib/schema/nodes/howTo.ts';
import { itemListNode } from '@/lib/schema/nodes/itemList.ts';
import { offerCatalogNode } from '@/lib/schema/nodes/offerCatalog.ts';
import { personNode } from '@/lib/schema/nodes/person.ts';
import { serviceNode } from '@/lib/schema/nodes/service.ts';
import { webPageNode } from '@/lib/schema/nodes/webPage.ts';
import { siteConfig } from '@/lib/site-config.ts';

// The page generators (P4 S5): each returns a plain node with schema.org's real property names,
// every reference is an @id, and nothing reads routes, the pathname or the environment.

const PAGE = 'https://deepzeta.ai/services/whatsapp-ai-agent';
const GLOBAL = {
  websiteId: 'https://deepzeta.ai/#website',
  organizationId: 'https://deepzeta.ai/#organization',
};

describe('webPageNode', () => {
  it('carries the page URL as @id, isPartOf #website, about #organization', () => {
    expect(webPageNode({ type: 'WebPage', id: PAGE, name: 'WhatsApp AI Agent', ...GLOBAL })).toEqual({
      '@type': 'WebPage',
      '@id': PAGE,
      url: PAGE,
      name: 'WhatsApp AI Agent',
      isPartOf: { '@id': GLOBAL.websiteId },
      about: { '@id': GLOBAL.organizationId },
      inLanguage: 'en',
    });
  });

  it('takes a subtype (CollectionPage, AboutPage, ContactPage) and optional fields', () => {
    const node = webPageNode({
      type: 'CollectionPage',
      id: 'https://deepzeta.ai/services',
      name: 'Services',
      description: 'What we build',
      ...GLOBAL,
      dateModified: '2026-10-04',
    });
    expect(node['@type']).toBe('CollectionPage');
    expect(node.description).toBe('What we build');
    expect(node.dateModified).toBe('2026-10-04');
  });
});

describe('breadcrumbListNode', () => {
  it('positions run from 1 without gaps, labels byte for byte', () => {
    const node = breadcrumbListNode({
      id: `${PAGE}#breadcrumb`,
      steps: [
        { name: 'Home', url: 'https://deepzeta.ai' },
        { name: 'Services', url: 'https://deepzeta.ai/services' },
      ],
    });
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://deepzeta.ai' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://deepzeta.ai/services' },
    ]);
  });
});

describe('serviceNode', () => {
  it('is the Service with provider #organization, and no offers unless given real prices', () => {
    const node = serviceNode({
      id: `${PAGE}#service`,
      url: PAGE,
      name: 'WhatsApp AI Agent',
      providerId: GLOBAL.organizationId,
    });
    expect(node['@type']).toBe('Service');
    expect(node.provider).toEqual({ '@id': GLOBAL.organizationId });
    expect(node.offers).toBeUndefined();
  });

  it('carries an Offer when one is given (the audit: price 0 AED)', () => {
    const node = serviceNode({
      id: 'https://deepzeta.ai/audit#service',
      url: 'https://deepzeta.ai/audit',
      name: 'AI automation audit',
      providerId: GLOBAL.organizationId,
      offers: {
        id: 'https://deepzeta.ai/audit#offer',
        priceCurrency: 'AED',
        price: 0,
        url: 'https://deepzeta.ai/audit',
      },
    });
    expect(node.offers).toEqual({
      '@type': 'Offer',
      '@id': 'https://deepzeta.ai/audit#offer',
      priceCurrency: 'AED',
      price: 0,
      url: 'https://deepzeta.ai/audit',
    });
  });
});

describe('faqPageNode', () => {
  it('mirrors the Q&A byte for byte', () => {
    const node = faqPageNode({
      id: `${PAGE}#faq`,
      questions: [{ name: 'Is it 24/7?', answerText: 'Yes, the agent replies around the clock.' }],
    });
    expect(node.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Is it 24/7?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, the agent replies around the clock.' },
      },
    ]);
  });
});

describe('howToNode', () => {
  it('mirrors the visible step titles', () => {
    const node = howToNode({
      id: `${PAGE}#howto`,
      name: 'How it works',
      steps: [{ name: 'Book the audit' }, { name: 'Get the map' }],
    });
    expect(node.step).toEqual([
      { '@type': 'HowToStep', name: 'Book the audit' },
      { '@type': 'HowToStep', name: 'Get the map' },
    ]);
  });
});

describe('itemListNode', () => {
  it('lists items in the visible order, referencing nodes by @id', () => {
    const node = itemListNode({
      id: 'https://deepzeta.ai#itemlist',
      name: 'The four pillars',
      items: [{ id: 'https://deepzeta.ai/services/ai-automation#service', name: 'AI Automation' }],
    });
    expect(node.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        name: 'AI Automation',
        url: 'https://deepzeta.ai/services/ai-automation#service',
      },
    ]);
  });
});

describe('offerCatalogNode', () => {
  it('offers reference Service nodes by @id', () => {
    const node = offerCatalogNode({
      id: 'https://deepzeta.ai/services#catalog',
      name: 'Services',
      offers: [{ id: `${PAGE}#service`, name: 'WhatsApp AI Agent' }],
    });
    expect(node.itemListElement).toEqual([
      { '@type': 'Offer', itemOffered: { '@id': `${PAGE}#service`, name: 'WhatsApp AI Agent' } },
    ]);
  });
});

describe('articleNode', () => {
  it('is authored and published by reference, with content-field dates', () => {
    const node = articleNode({
      type: 'Article',
      id: 'https://deepzeta.ai/work/example#article',
      url: 'https://deepzeta.ai/work/example',
      headline: 'A case study',
      websiteId: GLOBAL.websiteId,
      authorId: GLOBAL.organizationId,
      publisherId: GLOBAL.organizationId,
      datePublished: '2026-10-01',
    });
    expect(node.author).toEqual({ '@id': GLOBAL.organizationId });
    expect(node.publisher).toEqual({ '@id': GLOBAL.organizationId });
    expect(node.datePublished).toBe('2026-10-01');
    expect(node.dateModified).toBeUndefined();
  });
});

describe('definedTermSetNode', () => {
  it('mirrors the visible terms and definitions', () => {
    const node = definedTermSetNode({
      id: 'https://deepzeta.ai/resources/glossary#termset',
      name: 'Glossary',
      terms: [{ name: 'AI agent', description: 'Software that acts.' }],
    });
    expect(node.hasDefinedTerm).toEqual([
      { '@type': 'DefinedTerm', name: 'AI agent', description: 'Software that acts.' },
    ]);
  });
});

describe('personNode', () => {
  it('is the founder from facts §4, working for #organization, photo and bio omitted', () => {
    const node = personNode({
      id: 'https://deepzeta.ai/#person-jamsheed-khalid',
      organizationId: GLOBAL.organizationId,
    });
    expect(node).toEqual({
      '@type': 'Person',
      '@id': 'https://deepzeta.ai/#person-jamsheed-khalid',
      name: siteConfig.founder.name,
      jobTitle: siteConfig.founder.jobTitle,
      worksFor: { '@id': GLOBAL.organizationId },
      sameAs: siteConfig.founder.sameAs,
    });
    expect(node.image).toBeUndefined();
    expect(node.description).toBeUndefined();
  });
});

describe('every @type is a real schema.org type (spec §6)', () => {
  // The types the generators emit. Checked against schema.org's type hierarchy (verified on
  // schema.org during S4/S5, 2026-10-05): all of these exist there today.
  const REAL_TYPES = new Set([
    'ProfessionalService',
    'WebSite',
    'ImageObject',
    'WebPage',
    'CollectionPage',
    'AboutPage',
    'ContactPage',
    'Service',
    'Offer',
    'OfferCatalog',
    'FAQPage',
    'Question',
    'Answer',
    'HowTo',
    'HowToStep',
    'ItemList',
    'ListItem',
    'BreadcrumbList',
    'Article',
    'BlogPosting',
    'Person',
    'PostalAddress',
    'OpeningHoursSpecification',
    'Country',
    'DefinedTermSet',
    'DefinedTerm',
    'Organization',
  ]);

  it('the emitted types are exactly the set pinned here', () => {
    // Every generator's literal @type strings appear in REAL_TYPES; a made-up type fails this pin.
    const emitted = [
      webPageNode({ type: 'WebPage', id: PAGE, name: 'x', ...GLOBAL }),
      breadcrumbListNode({ id: 'x', steps: [{ name: 'x', url: PAGE }] }),
      serviceNode({
        id: 'x',
        url: PAGE,
        name: 'x',
        providerId: GLOBAL.organizationId,
        offers: { id: 'y', priceCurrency: 'AED', price: 0, url: PAGE },
      }),
      faqPageNode({ id: 'x', questions: [{ name: 'q', answerText: 'a' }] }),
      howToNode({ id: 'x', name: 'x', steps: [{ name: 's' }] }),
      itemListNode({ id: 'x', items: [{ id: 'x', name: 'x' }] }),
      offerCatalogNode({ id: 'x', name: 'x', offers: [{ id: 'x', name: 'x' }] }),
      articleNode({
        type: 'Article',
        id: 'x',
        url: PAGE,
        headline: 'x',
        websiteId: 'w',
        authorId: 'a',
        publisherId: 'p',
        datePublished: '2026-01-01',
      }),
      definedTermSetNode({ id: 'x', name: 'x', terms: [{ name: 't', description: 'd' }] }),
      personNode({ id: 'x', organizationId: 'o' }),
    ];
    const typeStrings = new Set<string>();
    const walk = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        if (typeof record['@type'] === 'string') typeStrings.add(record['@type']);
        Object.values(record).forEach(walk);
      }
    };
    emitted.forEach(walk);
    for (const type of typeStrings) expect(REAL_TYPES, `unknown @type "${type}"`).toContain(type);
  });
});
