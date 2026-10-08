// A service page's graph (/services/<slug>; the P6 part A plan, S9; spec §2.3 matrix, the service
// row): the Service as the primary entity (provider #organization, the catalogue's pillar as
// serviceType, the same areaServed as #organization), the WebPage whose mainEntity is that Service,
// the BreadcrumbList mirroring the visible trail, and the FAQPage of the questions the page shows.
// No isPartOf on the Service (not a schema.org property of Service), no offers (no confirmed prices,
// facts §3), and no HowTo: the steps describe how the system runs, not steps the reader follows
// (C11 read strictly). The parent pillar is referenced only while its page is live.
import { fullTrail } from '@/components/ui/Breadcrumbs.tsx';
import { pillars, services as catalogueServices, type CatalogueService } from '@/content/catalogue.ts';
import { navigation } from '@/content/en/navigation.ts';
import { servicePages } from '@/content/en/services/index.ts';
import { isLivePath, routePath, type RouteId } from '@/lib/routes.ts';
import { checkedGraph } from '@/lib/schema/graph.ts';
import { breadcrumbListNode } from '@/lib/schema/nodes/breadcrumbList.ts';
import { faqPageNode } from '@/lib/schema/nodes/faqPage.ts';
import { AREA_SERVED } from '@/lib/schema/nodes/organization.ts';
import { serviceNode } from '@/lib/schema/nodes/service.ts';
import { webPageNode } from '@/lib/schema/nodes/webPage.ts';
import { absoluteUrl, siteUrl } from '@/lib/url.ts';

// Widened from the `as const` data to the declared shape, so the optional slug can be read uniformly
const services: readonly CatalogueService[] = catalogueServices;

/** A service page's visible trail after Home: the hub, then the service (its catalogue name) */
export function serviceTrail(slug: string, route: RouteId) {
  const service = services.find((entry) => entry.slug === slug);
  if (!service) throw new Error(`no catalogue service with the slug ${slug}`);
  return [
    { route: 'R010' as const, label: navigation.servicesLabel },
    { route, label: service.name },
  ];
}

export function serviceGraph(slug: string, route: RouteId) {
  const page = servicePages[slug];
  const service = services.find((entry) => entry.slug === slug);
  if (!page || !service) throw new Error(`no service page for the slug ${slug}`);
  const pillar = pillars.find((entry) => entry.pixel === service.pillar);
  const origin = siteUrl();
  const pageUrl = absoluteUrl(routePath(route));
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const pillarPath = pillar ? `/services/${pillar.slug}` : undefined;
  const parentId = pillarPath && isLivePath(pillarPath) ? `${absoluteUrl(pillarPath)}#service` : undefined;
  return checkedGraph(
    [
      serviceNode({
        id: `${pageUrl}#service`,
        url: pageUrl,
        name: service.name,
        description: page.content.answer,
        providerId: organizationId,
        serviceType: pillar?.name,
        areaServed: AREA_SERVED,
        parentId,
      }),
      webPageNode({
        type: 'WebPage',
        id: pageUrl,
        name: page.content.title,
        description: page.content.answer,
        websiteId,
        organizationId,
        mainEntityId: `${pageUrl}#service`,
        breadcrumbId: `${pageUrl}#breadcrumb`,
      }),
      breadcrumbListNode({
        id: `${pageUrl}#breadcrumb`,
        steps: fullTrail(serviceTrail(slug, route)).map((crumb) => ({
          name: crumb.label,
          url: absoluteUrl(routePath(crumb.route)),
        })),
      }),
      faqPageNode({
        id: `${pageUrl}#faq`,
        questions: page.faq.map((question) => ({ name: question.question, answerText: question.answer })),
      }),
    ],
    [organizationId, websiteId, ...(parentId ? [parentId] : [])],
  );
}
