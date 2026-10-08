import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DemoPanelTemplate } from '@/components/demos/DemoStub';
import { Faq } from '@/components/sections/Faq';
import {
  ServiceDeliverables,
  ServiceFit,
  ServiceHero,
  ServiceHow,
  ServiceProblem,
  ServiceTryUaePairs,
} from '@/components/sections/service/ServiceSections';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { services as catalogueServices, type CatalogueService } from '@/content/catalogue';
import { servicePages } from '@/content/en/services';
import { isLivePath, routeIdForPath } from '@/lib/routes';
import { serviceGraph, serviceTrail } from '@/lib/schema/graphs/service';
import { absoluteUrl } from '@/lib/url';

// The service template (/services/<slug>; engine §3.1; docs/design/service-page.md; the P6 part A
// plan, S11). T2. Only live service pages are built (dynamicParams = false): any other slug is a 404,
// and a service's page ships when its registry row turns live in src/lib/routes.ts (04 §1.4).
export const dynamicParams = false;

const services: readonly CatalogueService[] = catalogueServices;

export function generateStaticParams() {
  return Object.keys(servicePages)
    .filter((slug) => isLivePath(`/services/${slug}`))
    .map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

// The page's data, or undefined for a slug that has no live page
function pageFor(slug: string) {
  const page = servicePages[slug];
  const service = services.find((entry) => entry.slug === slug);
  const path = `/services/${slug}`;
  const route = routeIdForPath(path);
  if (!page || !service || !route || !isLivePath(path)) return undefined;
  return { page, service, route, path };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = pageFor((await params).slug);
  if (!found) return {};
  return {
    title: found.page.content.title,
    description: found.page.content.description,
    alternates: { canonical: absoluteUrl(found.path) },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const found = pageFor(slug);
  if (!found) notFound();
  const { page, service, route } = found;
  const props = { content: page.content, service };
  return (
    <>
      {/* The page block: Service, WebPage (mainEntity → #service), BreadcrumbList, FAQPage */}
      <JsonLd graph={serviceGraph(slug, route)} />
      <Breadcrumbs trail={serviceTrail(slug, route)} />
      <ServiceHero {...props} />
      <ServiceProblem {...props} />
      <ServiceHow {...props} />
      <ServiceDeliverables {...props} />
      <ServiceFit {...props} />
      <ServiceTryUaePairs {...props} />
      {/* The FAQ module (faq.md): zero JS for the base; its enhancement loads on use */}
      <div data-fx-lazy="faq" className="mx-auto max-w-page px-gutter py-section">
        <Faq heading={page.content.faq.heading} lede={page.content.faq.lede} questions={page.faq} />
      </div>
      {/* The demo stubs' panel, once per page: hidden until a trigger clones it (demo-enhance.ts) */}
      <DemoPanelTemplate />
    </>
  );
}
