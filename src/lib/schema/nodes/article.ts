// The Article generator (P4 S5): case studies (/work) and guides (/resources). Author defaults to
// #organization until a real author exists (spec decision 6: no invented people). datePublished and
// dateModified are content fields, never git dates (spec decision 4). Pure: plain data in, out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type ArticleInput = {
  /** 'Article' or 'BlogPosting' */
  type: string;
  /** {page URL}#article */
  id: string;
  /** The article's page URL */
  url: string;
  headline: string;
  description?: string;
  /** #website, via isPartOf */
  websiteId: string;
  /** #organization (or #person-… once an author exists), via author */
  authorId: string;
  /** #organization, via publisher */
  publisherId: string;
  /** ISO dates, content fields (spec decision 4) */
  datePublished: string;
  dateModified?: string;
  inLanguage?: string;
};

export function articleNode({
  type,
  id,
  url,
  headline,
  description,
  websiteId,
  authorId,
  publisherId,
  datePublished,
  dateModified,
  inLanguage = 'en',
}: ArticleInput): SchemaNode {
  const node: SchemaNode = {
    '@type': type,
    '@id': id,
    url,
    headline,
    isPartOf: { '@id': websiteId },
    author: { '@id': authorId },
    publisher: { '@id': publisherId },
    datePublished,
    inLanguage,
  };
  if (description !== undefined) node.description = description;
  if (dateModified !== undefined) node.dateModified = dateModified;
  return node;
}
