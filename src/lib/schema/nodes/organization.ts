// The #organization generator (P4 S4; schema-system spec §2.1, decision 1): one ProfessionalService
// node carrying both the company and the office. Pure: it takes plain data and returns a plain
// object — no routes, no pathname, no environment, no literal hostname (spec §3 layer rules). Every
// fact comes from src/lib/site-config.ts; a PENDING fact's property is omitted, never guessed.
import { siteConfig } from '@/lib/site-config.ts';
import type { SchemaNode } from '@/lib/schema/types.ts';

export type OrganizationInput = {
  /** The @id: {SITE_URL}/#organization, built by the assembler (decision 5) */
  id: string;
  /** The #logo ImageObject's @id, {SITE_URL}/#logo */
  logoId: string;
  /** The #website's @id, {SITE_URL}/#website */
  websiteId: string;
  /** The founder Person's @id, {SITE_URL}/#person-jamsheed-khalid */
  founderId: string;
};

export function organizationNode({ id, logoId, websiteId, founderId }: OrganizationInput): SchemaNode {
  // CONFIRMED facts only (spec §2.1). telephone, geo, hasCredential, contactPoint and priceRange are
  // PENDING/omitted (facts §2; 08 §3 rule 8) — they appear when their config fields stop being null.
  return {
    '@type': 'ProfessionalService',
    '@id': id,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: websiteId,
    email: siteConfig.email,
    // Facts §2, the NAP. No postalCode (facts §2: UNKNOWN — the UAE has no postal codes).
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office #202, Al Hilal Bank Building, Al Qusais 2',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    foundingDate: '2026-08-02',
    logo: { '@id': logoId },
    founder: { '@id': founderId },
    sameAs: siteConfig.social.map((profile) => profile.url),
    // Facts §2, Monday–Saturday 08:00–17:00 GST. The dayOfWeek names are schema.org's.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: siteConfig.openingHours.days,
        opens: siteConfig.openingHours.opens,
        closes: siteConfig.openingHours.closes,
      },
    ],
    // Facts §3: UAE first. The Wikidata entity was verified on wikidata.org during S4 (Q878,
    // "United Arab Emirates", country in Western Asia; checked 2026-10-05, the live Special:EntityData
    // endpoint), per 08 §3's rule on areaServed — never from memory. GCC countries are added when
    // the owner confirms them (facts §3).
    areaServed: { '@type': 'Country', name: 'United Arab Emirates', sameAs: 'https://www.wikidata.org/wiki/Q878' },
  };
}
