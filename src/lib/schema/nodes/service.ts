// The Service generator (P4 S5): the primary entity of pillar, service, solution and audit pages
// (spec §2.3 matrix). Provider is #organization; offers carry real prices only (facts §3: prices
// are UNKNOWN until the owner provides them, so `offers` is omitted until then — never invented).
// Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type ServiceOfferInput = {
  /** The offer's @id: {page URL}#offer */
  id: string;
  /** ISO 4217 currency; AED for the audit's "price 0 AED" (spec §2.3) */
  priceCurrency: string;
  /** A number, or a string for free-text ranges the owner confirmed */
  price: number | string;
  /** The URL where the offer stands (the page's own URL, or the audit booking URL) */
  url: string;
  /** The offer's availability, a schema.org ItemAvailability value */
  availability?: string;
};

export type ServiceInput = {
  /** {page URL}#service */
  id: string;
  /** The service's page URL */
  url: string;
  name: string;
  description?: string;
  /** #organization, via provider */
  providerId: string;
  /** #website, via isPartOf (the service page lives on the site) */
  websiteId?: string;
  /** The pillar this service belongs to, via serviceType; the catalogue's pillar name */
  serviceType?: string;
  /** #service of the parent pillar, via isRelatedTo (service pages under a pillar) */
  parentId?: string;
  offers?: ServiceOfferInput;
};

export function serviceNode({
  id,
  url,
  name,
  description,
  providerId,
  websiteId,
  serviceType,
  parentId,
  offers,
}: ServiceInput): SchemaNode {
  const node: SchemaNode = {
    '@type': 'Service',
    '@id': id,
    url,
    name,
    provider: { '@id': providerId },
  };
  if (description !== undefined) node.description = description;
  if (websiteId !== undefined) node.isPartOf = { '@id': websiteId };
  if (serviceType !== undefined) node.serviceType = serviceType;
  if (parentId !== undefined) node.isRelatedTo = { '@id': parentId };
  if (offers !== undefined) {
    const offer: SchemaNode = {
      '@type': 'Offer',
      '@id': offers.id,
      priceCurrency: offers.priceCurrency,
      price: offers.price,
      url: offers.url,
    };
    if (offers.availability !== undefined) offer.availability = offers.availability;
    node.offers = offer;
  }
  return node;
}
