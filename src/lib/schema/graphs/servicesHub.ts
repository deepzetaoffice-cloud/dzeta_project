// The services hub's page graph (/services, R010; the P6 part A plan, S9; spec §2.3 matrix, the hub
// row): a CollectionPage whose mainEntity is the ItemList of the live services, the OfferCatalog
// #catalog that #organization's hasOfferCatalog points at, the BreadcrumbList that mirrors the
// visible trail, and the FAQPage of the questions the page shows. Every list and reference names
// live pages only: the ItemList and the catalogue's offers grow as service pages ship (04 §1.4
// applied to schema). Names are the catalogue's, byte for byte (10 §2); assemblers resolve @ids and
// hold no literal values.
import { fullTrail } from '@/components/ui/Breadcrumbs.tsx';
import { services as catalogueServices, type CatalogueService } from '@/content/catalogue.ts';
import { servicesHubFaq } from '@/content/en/faq-bank.ts';
import { navigation } from '@/content/en/navigation.ts';
import { servicesHub } from '@/content/en/services-hub.ts';
import { isLivePath, routePath } from '@/lib/routes.ts';
import { checkedGraph } from '@/lib/schema/graph.ts';
import { breadcrumbListNode } from '@/lib/schema/nodes/breadcrumbList.ts';
import { faqPageNode } from '@/lib/schema/nodes/faqPage.ts';
import { itemListNode } from '@/lib/schema/nodes/itemList.ts';
import { offerCatalogNode } from '@/lib/schema/nodes/offerCatalog.ts';
import { webPageNode } from '@/lib/schema/nodes/webPage.ts';
import { absoluteUrl, siteUrl } from '@/lib/url.ts';

// Widened from the `as const` data to the declared shape, so the optional slug can be read uniformly
const services: readonly CatalogueService[] = catalogueServices;

/** The hub's visible trail after Home (the Breadcrumbs component renders the same) */
export const servicesHubTrail = [{ route: 'R010', label: navigation.servicesLabel }] as const;

/** The services whose pages are live, in catalogue order: their #service @ids and exact names */
export function liveServiceEntries() {
  return services
    .filter((service) => service.slug !== undefined && isLivePath(`/services/${service.slug}`))
    .map((service) => ({ id: `${absoluteUrl(`/services/${service.slug}`)}#service`, name: service.name }));
}

export function servicesHubGraph() {
  const origin = siteUrl();
  const pageUrl = absoluteUrl(routePath('R010'));
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const live = liveServiceEntries();
  return checkedGraph(
    [
      webPageNode({
        type: 'CollectionPage',
        id: pageUrl,
        name: servicesHub.title,
        description: servicesHub.answer,
        websiteId,
        organizationId,
        mainEntityId: `${pageUrl}#itemlist`,
        breadcrumbId: `${pageUrl}#breadcrumb`,
      }),
      itemListNode({ id: `${pageUrl}#itemlist`, name: servicesHub.heading, items: live }),
      offerCatalogNode({ id: `${pageUrl}#catalog`, name: servicesHub.heading, offers: live }),
      breadcrumbListNode({
        id: `${pageUrl}#breadcrumb`,
        steps: fullTrail(servicesHubTrail).map((crumb) => ({
          name: crumb.label,
          url: absoluteUrl(routePath(crumb.route)),
        })),
      }),
      faqPageNode({
        id: `${pageUrl}#faq`,
        questions: servicesHubFaq.map((question) => ({ name: question.question, answerText: question.answer })),
      }),
    ],
    // #organization and #website come from the sitewide block; each live service's #service from its page
    [organizationId, websiteId, ...live.map((entry) => entry.id)],
  );
}
