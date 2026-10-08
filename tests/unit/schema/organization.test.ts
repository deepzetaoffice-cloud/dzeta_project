import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { logoNode } from '@/lib/schema/nodes/logo.ts';
import { organizationNode } from '@/lib/schema/nodes/organization.ts';
import { websiteNode } from '@/lib/schema/nodes/website.ts';
import { siteConfig } from '@/lib/site-config.ts';

// The sitewide generators (P4 S4): #organization equals the CONFIRMED facts byte for byte (NAP is
// identical everywhere, facts §2), every PENDING property is absent (02 §1: omitted, never guessed),
// and the types are schema.org's real names (spec §6, "a made-up type"). Wikidata's UAE entity is
// verified on wikidata.org at build time (08 §3), never from memory.

const FACTS = readFileSync('docs/facts/company-facts.md', 'utf8');

const fact = (name: string): { value: string; status: string } => {
  const row = FACTS.split('\n')
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .find((cells) => cells[1] === name);
  if (!row) throw new Error(`no row "${name}" in the facts file`);
  return { value: row[2]!, status: row[row.length - 2]! };
};

const ORIGIN = 'https://deepzeta.ai';
const ids = {
  id: `${ORIGIN}/#organization`,
  logoId: `${ORIGIN}/#logo`,
  websiteId: `${ORIGIN}/#website`,
  founderId: `${ORIGIN}/#person-jamsheed-khalid`,
};
const org = organizationNode(ids);

describe('organizationNode', () => {
  it('is the ProfessionalService, the one primary entity (spec decision 1)', () => {
    expect(org['@type']).toBe('ProfessionalService');
    expect(org['@id']).toBe(ids.id);
  });

  it('names, email, founding date and address equal the CONFIRMED facts byte for byte', () => {
    expect(org.name).toBe(fact('Brand name').value);
    expect(org.legalName).toBe(fact('Legal company name').value);
    expect(org.email).toBe(fact('Public contact email').value);
    expect(String(org.foundingDate)).toBe(fact('Founding date').value);
    expect(org.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: fact('Street address').value,
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    });
  });

  it('sameAs is exactly the nine profiles of facts §2.1, in order', () => {
    expect(org.sameAs).toEqual(siteConfig.social.map((profile) => profile.url));
    expect((org.sameAs as string[]).length).toBe(9);
  });

  it('opening hours equal the fact, Monday–Saturday 08:00–17:00', () => {
    expect(org.openingHoursSpecification).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: siteConfig.openingHours.days,
        opens: '08:00',
        closes: '17:00',
      },
    ]);
  });

  it('areaServed is the UAE with its Wikidata entity, verified at build time (08 §3)', () => {
    expect(org.areaServed).toEqual({
      '@type': 'Country',
      name: 'United Arab Emirates',
      sameAs: 'https://www.wikidata.org/wiki/Q878',
    });
  });

  it('every PENDING or omitted fact is absent, never filled (02 §1; spec §2.1)', () => {
    // geo, hasCredential, priceRange, aggregateRating, review, award, numberOfEmployees, postalCode —
    // all PENDING or deliberately omitted.
    for (const key of [
      'geo',
      'hasCredential',
      'priceRange',
      'aggregateRating',
      'review',
      'award',
      'numberOfEmployees',
    ]) {
      expect(org[key], key).toBeUndefined();
    }
    expect((org.address as Record<string, unknown>).postalCode).toBeUndefined();
  });

  it('telephone and contactPoint follow the phone fact (facts §2; spec §2.1)', () => {
    const phone = fact('Phone (international format)');
    if (phone.status.startsWith('CONFIRMED')) {
      expect(org.telephone).toBe(phone.value);
      expect(org.contactPoint).toEqual({
        '@type': 'ContactPoint',
        telephone: phone.value,
        contactType: 'customer service',
        availableLanguage: 'en',
        areaServed: 'AE',
      });
    } else {
      expect(org.telephone).toBeUndefined();
      expect(org.contactPoint).toBeUndefined();
    }
  });

  it('references the logo, website and founder by @id, never by a bare string', () => {
    expect(org.logo).toEqual({ '@id': ids.logoId });
    expect(org.url).toBe(ids.websiteId);
    expect(org.founder).toEqual({ '@id': ids.founderId });
  });
});

describe('websiteNode', () => {
  it('is the WebSite with the bare origin, named after the brand, publishing #organization', () => {
    const node = websiteNode({ id: ids.websiteId, url: ORIGIN, publisherId: ids.id });
    expect(node).toEqual({
      '@type': 'WebSite',
      '@id': ids.websiteId,
      url: ORIGIN,
      name: siteConfig.brandName,
      publisher: { '@id': ids.id },
      inLanguage: 'en',
    });
  });
});

describe('logoNode', () => {
  it('is the 512×512 ImageObject at the exported PNG path', () => {
    const node = logoNode({ id: ids.logoId, url: `${ORIGIN}/brand/deepzeta-logo-512.png` });
    expect(node).toEqual({
      '@type': 'ImageObject',
      '@id': ids.logoId,
      url: `${ORIGIN}/brand/deepzeta-logo-512.png`,
      width: 512,
      height: 512,
    });
  });
});
