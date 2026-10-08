import type { Metadata } from 'next';
import { Faq } from '@/components/sections/Faq';
import {
  HubCareAndSolutions,
  HubChooser,
  HubDirectories,
  HubHero,
  HubStartHere,
} from '@/components/sections/hub/HubSections';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { servicesHubFaq } from '@/content/en/faq-bank';
import { servicesHub } from '@/content/en/services-hub';
import { routePath } from '@/lib/routes';
import { servicesHubGraph, servicesHubTrail } from '@/lib/schema/graphs/servicesHub';
import { absoluteUrl } from '@/lib/url';

// The services hub (/services, R010; docs/design/services-hub.md; the P6 part A plan, S11). T2. The
// layout's title template adds the brand (08 §1).
export const metadata: Metadata = {
  title: servicesHub.title,
  description: servicesHub.description,
  alternates: { canonical: absoluteUrl(routePath('R010')) },
};

export default function ServicesHubPage() {
  return (
    <>
      {/* The page block: CollectionPage, the live services' ItemList and #catalog, the BreadcrumbList,
          the FAQPage (the sitewide block is the layout's) */}
      <JsonLd graph={servicesHubGraph()} />
      <Breadcrumbs trail={servicesHubTrail} />
      <HubHero />
      <HubChooser />
      <HubStartHere />
      <HubDirectories />
      <HubCareAndSolutions />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={servicesHub.faq.heading} lede={servicesHub.faq.lede} questions={servicesHubFaq} />
      </div>
    </>
  );
}
