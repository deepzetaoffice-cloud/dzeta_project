// The OfferCatalog generator (P4 S5): /services's catalogue of services (the spec's #catalog, its
// registry row) and /pricing's real-price catalogue. Items reference Service nodes by @id (the
// registry's "{page URL}#service"); names are the catalogue's, byte for byte. Pure functions only.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type CatalogOfferInput = {
  /** The referenced Service node's @id: {page URL}#service */
  id: string;
  /** The service's name, byte for byte the catalogue's */
  name: string;
};

export type OfferCatalogInput = {
  /** {catalog page URL}#catalog — e.g. {SITE_URL}/services#catalog */
  id: string;
  name: string;
  offers: readonly CatalogOfferInput[];
};

export function offerCatalogNode({ id, name, offers }: OfferCatalogInput): SchemaNode {
  return {
    '@type': 'OfferCatalog',
    '@id': id,
    name,
    itemListElement: offers.map((offer) => ({
      '@type': 'Offer',
      itemOffered: { '@id': offer.id, name: offer.name },
    })),
  };
}
