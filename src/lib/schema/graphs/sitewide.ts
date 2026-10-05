// The sitewide graph assembler (P4 S4; spec decision 3): the one block the (en) root layout mounts
// on every page — #organization, #website and #logo. Assemblers compose nodes and resolve @ids;
// they never contain a literal value (spec §3 layer rules). The block stays small because the
// catalogue lives on /services (spec §6). The global @ids anchor to the bare origin (decision 2:
// one entity, no locale prefix), so they are built from siteUrl() — absoluteUrl() is for page
// paths and rejects the # fragment by design (C27).
import { absoluteUrl, siteUrl } from '@/lib/url.ts';
import { checkedGraph } from '@/lib/schema/graph.ts';
import { logoNode } from '@/lib/schema/nodes/logo.ts';
import { organizationNode } from '@/lib/schema/nodes/organization.ts';
import { websiteNode } from '@/lib/schema/nodes/website.ts';

export function sitewideGraph() {
  // The global @ids (decision 5: the @id convention — the page's absolute canonical URL, and for
  // global nodes the bare origin with the #fragment).
  const origin = siteUrl();
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const logoId = `${origin}/#logo`;
  // #organization's founder reference resolves to a registry node (spec §4 assertion 3): its home
  // page /about/jamsheed-khalid defines it in the same build (spec §7's registry row).
  const founderId = `${origin}/#person-jamsheed-khalid`;
  return checkedGraph(
    [
      organizationNode({ id: organizationId, logoId, websiteId, founderId }),
      websiteNode({ id: websiteId, url: origin, publisherId: organizationId }),
      logoNode({ id: logoId, url: absoluteUrl('/brand/deepzeta-logo-512.png') }),
    ],
    [founderId],
  );
}
