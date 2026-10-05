// The #website generator (P4 S4; spec §2.1, registry seed): one WebSite node, the same bytes in
// every locale (decision 2 — one global entity). Pure: plain data in, plain object out.
import { siteConfig } from '@/lib/site-config.ts';
import type { SchemaNode } from '@/lib/schema/types.ts';

export type WebsiteInput = {
  /** {SITE_URL}/#website */
  id: string;
  /** The site's home URL (the bare origin; the node's url and the publisher reference) */
  url: string;
  /** The #organization's @id, for `publisher` */
  publisherId: string;
};

export function websiteNode({ id, url, publisherId }: WebsiteInput): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': id,
    url,
    name: siteConfig.brandName,
    publisher: { '@id': publisherId },
    inLanguage: 'en',
  };
}
