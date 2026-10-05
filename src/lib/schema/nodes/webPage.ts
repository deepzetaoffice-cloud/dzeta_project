// The WebPage generator (P4 S5): the page-level node every page block uses as its primary entity
// (Home per the spec matrix; legal pages too). Subtypes (CollectionPage, AboutPage, ContactPage,
// Article) are passed by their assembler — one generator, one file per type family (spec §3).
// Pure: plain data in, plain object out; no hostname or NAP value inside.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type WebPageInput = {
  /** A schema.org page subtype, e.g. 'WebPage', 'CollectionPage', 'AboutPage', 'ContactPage' */
  type: string;
  /** The page's absolute canonical URL (decision 5: the page URL is the @id) */
  id: string;
  name: string;
  description?: string;
  /** #website, via isPartOf */
  websiteId: string;
  /** #organization, via isPartOf/about */
  organizationId: string;
  /** ISO date, from the content field (spec decision 4: a content field, not a git date) */
  dateModified?: string;
  inLanguage?: string;
};

export function webPageNode({
  type,
  id,
  name,
  description,
  websiteId,
  organizationId,
  dateModified,
  inLanguage = 'en',
}: WebPageInput): SchemaNode {
  const node: SchemaNode = {
    '@type': type,
    '@id': id,
    url: id,
    name,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    inLanguage,
  };
  if (description !== undefined) node.description = description;
  if (dateModified !== undefined) node.dateModified = dateModified;
  return node;
}
