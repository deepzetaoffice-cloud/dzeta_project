import { describe, expect, it } from 'vitest';
import { pillars } from '@/content/catalogue.ts';
import { homeFaq } from '@/content/en/faq-bank.ts';
import { homeContent } from '@/content/en/home.ts';
import { homeGraph } from '@/lib/schema/graphs/home.ts';
import { parseEnv } from '@/lib/env.ts';
import { siteConfig } from '@/lib/site-config.ts';

// The Home graph assembler (P4 S7): the spec matrix's Home row — primary entity WebPage with
// about → #organization (no mainEntity), the ItemList of the four pillars in catalogue order with
// the names the mega menu shows (visible parity), no BreadcrumbList (nothing visible to mirror)
// and no FAQPage (the FAQ is not visible on the placeholder Home). The origin comes from the
// environment (CI builds with http://localhost:3000; the dev machine with the canonical origin).

const origin = parseEnv(process.env).siteUrl;

describe('homeGraph', () => {
  const graph = homeGraph();
  const nodes = graph['@graph'];

  it('wraps with @context once', () => {
    expect(graph['@context']).toBe('https://schema.org');
    expect(nodes).toHaveLength(3);
  });

  it('the primary entity is the WebPage at the home URL, about #organization', () => {
    const page = nodes.find((node) => node['@type'] === 'WebPage');
    expect(page).toBeDefined();
    expect(page!['@id']).toBe(origin);
    expect(page!.name).toBe(homeContent.title);
    expect(page!.description).toBe(homeContent.description);
    expect(page!.about).toEqual({ '@id': `${origin}/#organization` });
    expect(page!.isPartOf).toEqual({ '@id': `${origin}/#website` });
    expect(page!.mainEntity).toBeUndefined();
  });

  it('the ItemList is the four pillars, in catalogue order, with the mega menu names', () => {
    const list = nodes.find((node) => node['@type'] === 'ItemList');
    expect(list).toBeDefined();
    expect(list!['@id']).toBe(`${origin}#itemlist`);
    expect(list!.itemListElement).toEqual(
      pillars.map((pillar) => ({
        '@type': 'ListItem',
        name: pillar.name,
        url: `${origin}/services/${pillar.slug}#service`,
      })),
    );
  });

  it('no BreadcrumbList (nothing visible to mirror)', () => {
    expect(nodes.some((node) => node['@type'] === 'BreadcrumbList')).toBe(false);
  });

  // P5 S3: the FAQ is visible on the real Home, so the FAQPage block ships (the P4 plan's S7 note).
  // Q&A parity is byte for byte with the question bank the Faq component renders (08 §3 rule 7).
  it('the FAQPage mirrors the visible FAQ byte for byte', () => {
    const faq = nodes.find((node) => node['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    expect(faq!['@id']).toBe(`${origin}#faq`);
    expect(faq!.mainEntity).toHaveLength(homeFaq.length);
    expect(faq!.mainEntity).toEqual(
      homeFaq.map((question) => ({
        '@type': 'Question',
        name: question.question,
        acceptedAnswer: { '@type': 'Answer', text: question.answer },
      })),
    );
  });

  it('the names match the mega menu column names byte for byte (visible parity)', () => {
    const menuNames = ['AI Automation', 'Websites', 'Software', 'Growth & Ranking'];
    expect(pillars.map((pillar) => pillar.name)).toEqual(menuNames);
    expect(siteConfig.brandName).toBe('Deepzeta AI');
  });
});
