// The Person generator (P4 S5): the founder's node, {SITE_URL}/#person-jamsheed-khalid (spec §2.1,
// "founder"). Every fact comes from siteConfig.founder (facts §4); his other companies (facts §4.1)
// appear only on /about, as Organization nodes without an @id whose founder points back to him.
// Pure: plain data in, plain object out.
import { siteConfig } from '@/lib/site-config.ts';
import type { SchemaNode } from '@/lib/schema/types.ts';

export type PersonInput = {
  /** {SITE_URL}/#person-jamsheed-khalid */
  id: string;
  /** #organization, via worksFor */
  organizationId: string;
  /** His home page: /about/jamsheed-khalid (spec §2.1) */
  url?: string;
};

export function personNode({ id, organizationId, url }: PersonInput): SchemaNode {
  const founder = siteConfig.founder;
  const node: SchemaNode = {
    '@type': 'Person',
    '@id': id,
    name: founder.name,
    jobTitle: founder.jobTitle,
    worksFor: { '@id': organizationId },
    sameAs: [...founder.sameAs],
  };
  if (url !== undefined) node.url = url;
  // Photo and bio are UNKNOWN (facts §4): omitted until the owner confirms them, never guessed.
  return node;
}
