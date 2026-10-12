// A legal page's graph (/privacy, R006; /terms reuses it; the privacy page plan): the WebPage (its
// dateModified is the page's "Last updated" date, a content field, never the build time — spec
// decision 4), the BreadcrumbList that mirrors the visible trail, and the FAQPage of the questions the
// page shows. No "PrivacyPolicy" type: schema.org has none (C30). Assemblers resolve @ids and hold no
// literal values.
import { fullTrail, type Crumb } from '@/components/ui/Breadcrumbs.tsx';
import type { FaqQuestion } from '@/content/en/faq-bank.ts';
import { routePath, type RouteId } from '@/lib/routes.ts';
import { checkedGraph } from '@/lib/schema/graph.ts';
import { breadcrumbListNode } from '@/lib/schema/nodes/breadcrumbList.ts';
import { faqPageNode } from '@/lib/schema/nodes/faqPage.ts';
import { webPageNode } from '@/lib/schema/nodes/webPage.ts';
import { absoluteUrl, siteUrl } from '@/lib/url.ts';

export type LegalGraphInput = {
  route: RouteId;
  name: string;
  description: string;
  /** ISO date: the page's "Last updated" */
  dateModified: string;
  /** The visible trail after Home (the Breadcrumbs component renders the same) */
  trail: readonly Crumb[];
  faq: readonly FaqQuestion[];
};

export function legalPageGraph({ route, name, description, dateModified, trail, faq }: LegalGraphInput) {
  const origin = siteUrl();
  const pageUrl = absoluteUrl(routePath(route));
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  return checkedGraph(
    [
      webPageNode({
        type: 'WebPage',
        id: pageUrl,
        name,
        description,
        websiteId,
        organizationId,
        breadcrumbId: `${pageUrl}#breadcrumb`,
        dateModified,
      }),
      breadcrumbListNode({
        id: `${pageUrl}#breadcrumb`,
        steps: fullTrail(trail).map((crumb) => ({ name: crumb.label, url: absoluteUrl(routePath(crumb.route)) })),
      }),
      faqPageNode({
        id: `${pageUrl}#faq`,
        questions: faq.map((question) => ({ name: question.question, answerText: question.answer })),
      }),
    ],
    // #organization and #website come from the sitewide block
    [organizationId, websiteId],
  );
}
