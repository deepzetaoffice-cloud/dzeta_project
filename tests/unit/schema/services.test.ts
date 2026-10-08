import { describe, expect, it } from 'vitest';
import { servicesHubFaq, speedToLeadSystemFaq } from '@/content/en/faq-bank.ts';
import { servicesHub } from '@/content/en/services-hub.ts';
import { speedToLeadSystem } from '@/content/en/services/speed-to-lead-system.ts';
import { parseEnv } from '@/lib/env.ts';
import { liveServiceEntries, servicesHubGraph } from '@/lib/schema/graphs/servicesHub.ts';
import { serviceGraph } from '@/lib/schema/graphs/service.ts';
import { AREA_SERVED } from '@/lib/schema/nodes/organization.ts';

// The two P6 part A2 assemblers (S9; spec §2.3, the hub and service rows): the primary entity, the
// references between pages (live pages only), the breadcrumb that mirrors the visible trail, and the
// FAQ byte for byte. The golden fixtures (tests/fixtures/schema/) pin the whole output; these pin the
// rules behind it.

const origin = parseEnv(process.env).siteUrl;
const PILOT = `${origin}/services/speed-to-lead-system`;

const byType = (nodes: readonly Record<string, unknown>[], type: string) =>
  nodes.find((node) => node['@type'] === type);
const faqOf = (questions: readonly { question: string; answer: string }[]) =>
  questions.map((question) => ({
    '@type': 'Question',
    name: question.question,
    acceptedAnswer: { '@type': 'Answer', text: question.answer },
  }));

describe('servicesHubGraph', () => {
  const nodes = servicesHubGraph()['@graph'];

  it('a CollectionPage whose mainEntity is the ItemList, with its breadcrumb', () => {
    const page = byType(nodes, 'CollectionPage');
    expect(page?.['@id']).toBe(`${origin}/services`);
    expect(page?.name).toBe(servicesHub.title);
    expect(page?.mainEntity).toEqual({ '@id': `${origin}/services#itemlist` });
    expect(page?.breadcrumb).toEqual({ '@id': `${origin}/services#breadcrumb` });
  });

  it('the ItemList and #catalog list the live services only, the pilot among them', () => {
    const live = liveServiceEntries();
    expect(live).toContainEqual({ id: `${PILOT}#service`, name: 'Speed-to-Lead System' });
    expect(live.some((entry) => entry.id.includes('/whatsapp-ai-agent'))).toBe(false);
    const catalog = byType(nodes, 'OfferCatalog');
    expect(catalog?.['@id']).toBe(`${origin}/services#catalog`);
    expect(catalog?.itemListElement).toHaveLength(live.length);
  });

  it('the breadcrumb is Home, then Services', () => {
    expect(byType(nodes, 'BreadcrumbList')?.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${origin}/services` },
    ]);
  });

  it('the FAQPage mirrors the visible FAQ byte for byte', () => {
    expect(byType(nodes, 'FAQPage')?.mainEntity).toEqual(faqOf(servicesHubFaq));
  });
});

describe('serviceGraph (the pilot)', () => {
  const nodes = serviceGraph('speed-to-lead-system', 'R027')['@graph'];

  it('the Service: provider #organization, the pillar as serviceType, the organization’s area', () => {
    const service = byType(nodes, 'Service');
    expect(service?.['@id']).toBe(`${PILOT}#service`);
    expect(service?.name).toBe('Speed-to-Lead System');
    expect(service?.provider).toEqual({ '@id': `${origin}/#organization` });
    expect(service?.serviceType).toBe('AI Automation');
    expect(service?.areaServed).toEqual(AREA_SERVED);
  });

  it('no offers, no isPartOf, and no parent pillar while its page is not live', () => {
    const service = byType(nodes, 'Service');
    expect(service?.offers).toBeUndefined();
    expect(service?.isPartOf).toBeUndefined();
    expect(JSON.stringify(nodes)).not.toContain('/services/ai-automation');
  });

  it('the WebPage’s mainEntity is the Service; no HowTo (C11 read strictly)', () => {
    const page = byType(nodes, 'WebPage');
    expect(page?.name).toBe(speedToLeadSystem.title);
    expect(page?.mainEntity).toEqual({ '@id': `${PILOT}#service` });
    expect(byType(nodes, 'HowTo')).toBeUndefined();
  });

  it('the breadcrumb is Home, Services, then the service', () => {
    expect(byType(nodes, 'BreadcrumbList')?.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${origin}/services` },
      { '@type': 'ListItem', position: 3, name: 'Speed-to-Lead System', item: PILOT },
    ]);
  });

  it('the FAQPage mirrors the visible FAQ byte for byte', () => {
    expect(byType(nodes, 'FAQPage')?.mainEntity).toEqual(faqOf(speedToLeadSystemFaq));
  });

  it('a slug with no page throws', () => {
    expect(() => serviceGraph('not-a-service', 'R027')).toThrow();
  });
});
