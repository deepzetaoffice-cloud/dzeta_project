// The Home page graph assembler (P4 S7; spec §2.3 matrix, the Home row): primary entity WebPage
// with about → #organization (no mainEntity — the matrix leaves it out), plus the ItemList of the
// four pillars, in catalogue order, the names the mega menu shows (visible parity, 08 §3 rule 7).
// No BreadcrumbList (the plan: nothing visible to mirror). P5 adds the FAQPage block: the FAQ is
// now visible on the real Home, and the Q&A mirrors the question bank byte for byte — the same
// strings the Faq component renders, never retyped here (the P4 plan's S7 note, fulfilled).
// Assemblers compose nodes and resolve @ids; no literal values.
import { pillars } from '@/content/catalogue.ts';
import { homeFaq } from '@/content/en/faq-bank.ts';
import { homeContent } from '@/content/en/home.ts';
import { checkedGraph } from '@/lib/schema/graph.ts';
import { faqPageNode } from '@/lib/schema/nodes/faqPage.ts';
import { itemListNode } from '@/lib/schema/nodes/itemList.ts';
import { webPageNode } from '@/lib/schema/nodes/webPage.ts';
import { absoluteUrl, siteUrl } from '@/lib/url.ts';

export function homeGraph() {
  const origin = siteUrl();
  const pageUrl = absoluteUrl('/');
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  // The sitewide block in the layout defines #organization and #website (spec decision 3); the
  // page block references them, so they pass as externals (assertion 3, the document union).
  return checkedGraph(
    [
      webPageNode({
        type: 'WebPage',
        id: pageUrl,
        name: homeContent.title,
        description: homeContent.description,
        websiteId,
        organizationId,
      }),
      itemListNode({
        id: `${pageUrl}#itemlist`,
        name: 'The four pillars',
        items: pillars.map((pillar) => ({
          // The pillar's future service node: the pillar page's URL (registry R011–R014) with the
          // #service anchor — absoluteUrl() is for page paths and rejects the fragment (C27), so the
          // anchor is appended here, like the global @ids in sitewide.ts.
          id: `${absoluteUrl(`/services/${pillar.slug}`)}#service`,
          name: pillar.name,
        })),
      }),
      faqPageNode({
        id: `${pageUrl}#faq`,
        questions: homeFaq.map((question) => ({
          name: question.question,
          answerText: question.answer,
        })),
      }),
    ],
    [organizationId, websiteId],
  );
}
