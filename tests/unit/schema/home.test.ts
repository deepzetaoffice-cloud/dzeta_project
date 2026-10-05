import { describe, expect, it } from 'vitest';
import { pillars } from '@/content/catalogue.ts';
import { homeContent } from '@/content/en/home.ts';
import { homeGraph } from '@/lib/schema/graphs/home.ts';

// The Home graph assembler (P4 S7): the spec matrix's Home row — primary entity WebPage with
// about → #organization (no mainEntity), the ItemList of the four pillars in catalogue order with
// the names the mega menu shows (visible parity), no BreadcrumbList (nothing visible to mirror)
// and no FAQPage (the FAQ is not visible on the placeholder Home).

describe('homeGraph', () => {
  const graph = homeGraph();
  const nodes = graph['@graph'];

  it('wraps with @context once', () => {
    expect(graph['@context']).toBe('https://schema.org');
    expect(nodes).toHaveLength(2);
  });

  it('the primary entity is the WebPage at the home URL, about #organization', () => {
    const page = nodes.find((node) => node['@type'] === 'WebPage');
    expect(page).toBeDefined();
    expect(page!['@id']).toBe('https://deepzeta.ai');
    expect(page!.name).toBe(homeContent.title);
    expect(page!.description).toBe(homeContent.description);
    expect(page!.about).toEqual({ '@id': 'https://deepzeta.ai/#organization' });
    expect(page!.isPartOf).toEqual({ '@id': 'https://deepzeta.ai/#website' });
    expect(page!.mainEntity).toBeUndefined();
  });

  it('the ItemList is the four pillars, in catalogue order, with the mega menu names', () => {
    const list = nodes.find((node) => node['@type'] === 'ItemList');
    expect(list).toBeDefined();
    expect(list!['@id']).toBe('https://deepzeta.ai#itemlist');
    expect(list!.itemListElement).toEqual(
      pillars.map((pillar) => ({
        '@type': 'ListItem',
        name: pillar.name,
        url: `https://deepzeta.ai/services/${pillar.slug}#service`,
      })),
    );
  });

  it('no BreadcrumbList and no FAQPage (nothing visible to mirror yet)', () => {
    expect(nodes.some((node) => node['@type'] === 'BreadcrumbList')).toBe(false);
    expect(nodes.some((node) => node['@type'] === 'FAQPage')).toBe(false);
  });
});
