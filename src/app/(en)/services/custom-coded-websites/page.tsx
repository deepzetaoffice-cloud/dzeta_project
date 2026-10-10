import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DemoPanelTemplate } from '@/components/demos/DemoStub';
import { CodePage } from '@/components/sections/CodePage';
import { Faq } from '@/components/sections/Faq';
import {
  ServiceDeliverables,
  ServiceFit,
  ServiceHero,
  ServiceHow,
  ServiceProblem,
  ServiceTryUaePairs,
} from '@/components/sections/service/ServiceSections';
import { StoryTerminal } from '@/components/sections/StoryTerminal';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { services as catalogueServices, type CatalogueService } from '@/content/catalogue';
import { servicePages } from '@/content/en/services';
import { buildRun } from '@/content/en/services/build-run';
import { customCodedWebsitesExtras } from '@/content/en/services/custom-coded-websites';
import { isLivePath, routeIdForPath } from '@/lib/routes';
import { serviceGraph, serviceTrail } from '@/lib/schema/graphs/service';
import { absoluteUrl } from '@/lib/url';
import '@/styles/templates/websites.css';

// The flagship service page, Custom-Coded High-Performance Websites (catalogue 2.1, R060; the plan
// docs/plans/2026-10-10-flagship-websites-page.md). The service template's sections in engine §3.1's
// order, with the spec's two extras (docs/design/service-page.md): Code ↔ Page beside the How-it-works
// steps, and the build terminal as the page's proof. Its own route, so its stylesheet and its story
// controls load here only and Home stays as it is (C73); the [slug] route skips this slug.
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
  return {
    title: data.page.content.title,
    description: data.page.content.description,
    alternates: { canonical: absoluteUrl(PATH) },
  };
}

export default function CustomCodedWebsitesPage() {
  const data = found();
  if (!data) notFound();
  const { page, service, route } = data;
  const props = { content: page.content, service };
  return (
    <>
      {/* The page block: Service, WebPage (mainEntity → #service), BreadcrumbList, FAQPage */}
      <JsonLd graph={serviceGraph(SLUG, route)} />
      <Breadcrumbs trail={serviceTrail(SLUG, route)} />
      <ServiceHero {...props} />
      <ServiceProblem {...props} />
      <ServiceHow {...props} story={<CodePage {...props} labels={customCodedWebsitesExtras.codePage} />} />
      <ServiceDeliverables {...props} />
      <ServiceFit {...props} />
      {/* §7 Proof: the build terminal (the page's demo slot; AI View can join in P7) */}
      <section aria-labelledby="service-proof" className="mx-auto max-w-page px-gutter py-section" data-fx-once="">
        <h2 id="service-proof" className="max-w-measure text-h2 text-balance">
          {customCodedWebsitesExtras.terminal.heading}
        </h2>
        <p className="mt-4 max-w-measure text-lead">{customCodedWebsitesExtras.terminal.lede}</p>
        <div className="mt-10">
          <StoryTerminal run={buildRun} labels={customCodedWebsitesExtras.terminal} />
        </div>
      </section>
      <ServiceTryUaePairs {...props} />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={page.content.faq.heading} lede={page.content.faq.lede} questions={page.faq} />
      </div>
      {/* The demo stubs' panel, once per page that has a trigger */}
      {page.content.tryIt ? <DemoPanelTemplate /> : null}
    </>
  );
}
