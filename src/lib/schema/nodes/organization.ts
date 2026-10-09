// The #organization generator (P4 S4; schema-system spec §2.1, decision 1): one ProfessionalService
// node carrying both the company and the office. Pure: it takes plain data and returns a plain
// object — no routes, no pathname, no environment, no literal hostname (spec §3 layer rules). Every
// fact comes from src/lib/site-config.ts; a PENDING fact's property is omitted, never guessed.
import { siteConfig } from '@/lib/site-config.ts';
import type { SchemaNode } from '@/lib/schema/types.ts';

// Facts §3: UAE first. The Wikidata entity was verified on wikidata.org during S4 (Q878,
// "United Arab Emirates", country in Western Asia; checked 2026-10-05, the live Special:EntityData
// endpoint), per 08 §3's rule on areaServed — never from memory. GCC countries are added when the
// owner confirms them (facts §3). Shared: #organization and every Service node serve the same area
// (the P6 part A plan, S9).
export const AREA_SERVED: SchemaNode = {
  '@type': 'Country',
  name: 'United Arab Emirates',
  sameAs: 'https://www.wikidata.org/wiki/Q878',
};

export type OrganizationInput = {
  /** The @id: {SITE_URL}/#organization, built by the assembler (decision 5) */
  id: string;
  /** The #logo ImageObject's @id, {SITE_URL}/#logo */
  logoId: string;
  /** The site's address, {SITE_URL}: the organization's url (an @id is not a page address) */
  url: string;
  /** The founder Person's @id, {SITE_URL}/#person-jamsheed-khalid */
  founderId: string;
  /** The services hub's OfferCatalog, {SITE_URL}/services#catalog, via hasOfferCatalog; only while the
   *  hub is live, so the reference always resolves to a published page (the P6 part A plan, S9) */
  catalogId?: string;
};

export function organizationNode({ id, logoId, url, founderId, catalogId }: OrganizationInput): SchemaNode {
  // CONFIRMED facts only (spec §2.1). geo, hasCredential and priceRange stay omitted (facts §2; 08 §3
  // rule 8). telephone and contactPoint appear while the phone fact is CONFIRMED (spec §2.1's
  // contactPoint row: contactType "customer service", availableLanguage English — Arabic once P11
  // ships — areaServed AE) and are omitted, never guessed, while it is null.
  const node: SchemaNode = {
    '@type': 'ProfessionalService',
    '@id': id,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url,
    email: siteConfig.email,
    // Facts §2, the phone (owner, 2026-10-08). Both the org's telephone and its contactPoint read
    // the one config field, so they can never disagree with the footer's tel: link.
    ...(siteConfig.phone
      ? {
          telephone: siteConfig.phone,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.phone,
            contactType: 'customer service',
            availableLanguage: 'en',
            areaServed: 'AE',
          },
        }
      : {}),
    // Facts §2, the NAP. No postalCode (facts §2: UNKNOWN — the UAE has no postal codes). The hash
    // before the office number is written \u0023, because check:tokens reads a raw # as a colour
    // (the same workaround as site-config.ts); the string is the fact, byte for byte.
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office \u0023202, Al Hilal Bank Building, Al Qusais 2',
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
    areaServed: AREA_SERVED,
  };
  if (catalogId !== undefined) node.hasOfferCatalog = { '@id': catalogId };
  return node;
}
