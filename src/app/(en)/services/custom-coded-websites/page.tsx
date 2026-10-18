import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CodePage } from '@/components/sections/CodePage';
import { Faq } from '@/components/sections/Faq';
import { FlagshipDeliverables, FlagshipHero, FlagshipHow } from '@/components/sections/service/FlagshipSections';
import { ServiceFit, ServiceProblem, ServiceTryUaePairs } from '@/components/sections/service/ServiceSections';
import { StoryTerminal } from '@/components/sections/StoryTerminal';
import { JsonLd } from '@/components/seo/JsonLd';
import { services as catalogueServices, type CatalogueService } from '@/content/catalogue';
import { servicePages } from '@/content/en/services';
import { serviceTemplate } from '@/content/en/services/template';
import { buildRun } from '@/content/en/services/build-run';
import { customCodedWebsitesExtras } from '@/content/en/services/custom-coded-websites';
import { isLivePath, routeIdForPath } from '@/lib/routes';
import { serviceGraph, serviceTrail } from '@/lib/schema/graphs/service';
import { pageMetadata } from '@/lib/seo/page-seo';

// The flagship service page, Custom-Coded High-Performance Websites (catalogue 2.1, R060;
// docs/design/custom-coded-websites.md; Figma 60:34). Engine §3.1's order around the page's three
// signature moments, one per viewport: the laptop, Code ↔ Page and the build terminal. Its scene
// (src/lib/fx/flagship.ts) loads on this page only; the [slug] route skips this slug.
const SLUG = 'custom-coded-websites';
const PATH = `/services/${SLUG}`;

const services: readonly CatalogueService[] = catalogueServices;

function found() {
  const page = servicePages[SLUG];
  const service = services.find((entry) => entry.slug === SLUG);
  const route = routeIdForPath(PATH);
  if (!page || !service || !route || !isLivePath(PATH)) return undefined;
  return { page, service, route };
}

export function generateMetadata(): Metadata {
  const data = found();
  if (!data) return {};
  return pageMetadata({
    title: data.page.content.title,
    description: data.page.content.description,
    path: PATH,
  });
}

export default function CustomCodedWebsitesPage() {
  const data = found();
  if (!data) notFound();
  const { page, service, route } = data;
  const props = { content: page.content, service, extras: customCodedWebsitesExtras };
  return (
    <>
      {/* The page block: Service, WebPage (mainEntity → #service), BreadcrumbList, FAQPage */}
      <JsonLd graph={serviceGraph(SLUG, route)} />
      <FlagshipHero {...props} trail={serviceTrail(SLUG, route)} />
      <CodePage {...props} />
      <ServiceProblem {...props} index={2} />
      <FlagshipHow {...props} />
      <FlagshipDeliverables {...props} />
      <StoryTerminal
        run={buildRun}
        labels={customCodedWebsitesExtras.terminal}
        eyebrow={customCodedWebsitesExtras.proofEyebrow}
      />
      <ServiceFit {...props} index={6} aidOnly />
      <ServiceTryUaePairs {...props} />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq
          heading={page.content.faq.heading}
          lede={page.content.faq.lede}
          questions={page.faq}
          index={7}
          eyebrow={serviceTemplate.eyebrows.faq}
          layout="stacked"
        />
      </div>
    </>
  );
}
