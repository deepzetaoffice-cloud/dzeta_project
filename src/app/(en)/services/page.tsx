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
import { servicesHubFaq } from '@/content/en/faq-bank';
import { servicesHub } from '@/content/en/services-hub';
import { routePath } from '@/lib/routes';
import { servicesHubGraph, servicesHubTrail } from '@/lib/schema/graphs/servicesHub';
import { pageMetadata } from '@/lib/seo/page-seo';

// The services hub (/services, R010; docs/design/services-hub.md; Figma 58:34). T2. The layout's
// title template adds the brand (08 §1). The breadcrumb is inside the hero's stage (Figma).
export const metadata: Metadata = pageMetadata({
  title: servicesHub.title,
  description: servicesHub.description,
  path: routePath('R010'),
});

export default function ServicesHubPage() {
  return (
    <>
      {/* The page block: CollectionPage, the live services' ItemList and #catalog, the BreadcrumbList,
          the FAQPage (the sitewide block is the layout's) */}
      <JsonLd graph={servicesHubGraph()} />
      <HubHero trail={servicesHubTrail} />
      <HubChooser />
      <HubStartHere />
      <HubDirectories />
      <HubCareAndSolutions />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq
          heading={servicesHub.faq.heading}
          lede={servicesHub.faq.lede}
          questions={servicesHubFaq}
          index={6}
          eyebrow={servicesHub.faq.eyebrow}
          layout="stacked"
        />
      </div>
    </>
  );
}
