// The service template's sections (/services/<slug>; engine §3.1's order; docs/design/service-page.md;
// the P6 part A plan, S8 and S11). Server components; the demo stub and the FAQ enhancement load on
// use. Copy comes from the page's file (src/content/en/services/<slug>.ts) and the template's shared
// labels; the service's name, pillar and every service named by number come from the catalogue
// (10 §2). Links only to live pages, built from the route helpers (06 §2.4, 04 §1.4).
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { TIER_2, type Tier2Name } from '@/components/icons/registry';
import { DemoStub } from '@/components/demos/DemoStub';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { StoryFlow } from '@/components/sections/StoryFlow';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { services as catalogueServices, type CatalogueService } from '@/content/catalogue';
import { shellContent } from '@/content/en/shell';
import type { ServicePageContent } from '@/content/en/services/types';
import { serviceTemplate } from '@/content/en/services/template';
import { livePath } from '@/lib/routes';

const services: readonly CatalogueService[] = catalogueServices;
const byNumber = (number: string) => services.find((service) => service.number === number);

export type ServiceSectionProps = { content: ServicePageContent; service: CatalogueService };

const section = 'mx-auto max-w-page px-gutter py-section';

// §1 The hero: the Tier 2 icon, the one statement H1 (h1 size below 640 px, as Home), the direct
// answer (both the LCP, visible at first paint, 13 §3 rule 2), the primary CTA and the demo stub.
// Below 640 px the icon takes the 48 px Tier 2 size and the top tightens, so the European consent
// banner at 360 × 640 stays clear of the H1. data-view-service tells the tracking runtime which
// service this page is (view_service, 09). `preview` renders the same hero as a picture inside the
// Websites page's Code ↔ Page slider (the flagship plan): no H1, no ids, no tracking attributes; the
// slider wraps it inert and hidden from assistive technology.
export function ServiceHero({ content, service, preview = false }: ServiceSectionProps & { preview?: boolean }) {
  const icon = service.slug && Object.hasOwn(TIER_2, service.slug) ? (service.slug as Tier2Name) : undefined;
  const Heading = preview ? 'p' : 'h1';
  return (
    <section
      aria-labelledby={preview ? undefined : 'service-heading'}
      className="mx-auto max-w-page px-gutter pt-3 pb-section sm:pt-8"
      data-view-service={preview ? undefined : service.slug}
      data-view-pillar={preview ? undefined : service.pillar}
    >
      {icon ? <Icon name={icon} size={64} className="size-12 sm:size-16" /> : null}
      <Heading
        id={preview ? undefined : 'service-heading'}
        className="mt-3 text-h1 text-balance sm:mt-4 sm:text-statement"
      >
        {content.heading}
      </Heading>
      <p className="mt-6 max-w-measure text-lead">{content.answer}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" />
        {content.tryIt ? (
          <DemoStub demoId={content.tryIt.demoId} label={content.tryIt.trigger} icon={content.tryIt.icon} />
        ) : null}
      </div>
    </section>
  );
}

// §2 The problem it solves: story-before-after rows
export function ServiceProblem({ content }: ServiceSectionProps) {
  return (
    <section aria-labelledby="service-problem" className={section} data-fx-once="">
      <h2 id="service-problem" className="max-w-measure text-h2 text-balance">
        {content.problem.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{content.problem.lede}</p>
      <BeforeAfter
        beforeLabel={serviceTemplate.beforeLabel}
        afterLabel={serviceTemplate.afterLabel}
        rows={content.problem.rows}
      />
    </section>
  );
}

// §3 How it works: the visible step list beside the labelled example story-flow (13 §4.8, 10 §3.6),
// or above the page's own story, full width, when it brings one (the Websites page's Code ↔ Page)
export function ServiceHow({ content, story }: ServiceSectionProps & { story?: ReactNode }) {
  const { how } = content;
  return (
    <section aria-labelledby="service-how" className={section} data-fx-once="">
      <h2 id="service-how" className="max-w-measure text-h2 text-balance">
        {how.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{how.lede}</p>
      <div className={story ? 'mt-10' : 'mt-10 grid gap-10 lg:grid-cols-2 lg:items-center'}>
        <ol aria-label={serviceTemplate.stepsLabel} className={story ? 'grid gap-4 lg:grid-cols-2' : 'grid gap-4'}>
          {how.steps.map((step, index) => (
            <li key={step.title} className="flex items-baseline gap-3">
              <span className="font-mono text-caption text-fg-muted">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="font-bold text-fg-strong">{step.title}</span>{' '}
                <span className="text-fg-muted">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        {story ? (
          <div className="mt-10">{story}</div>
        ) : (
          <StoryFlow
            label={how.exampleLabel}
            nodes={how.steps.map((step) => step.title)}
            description={`${how.exampleLabel}: ${how.steps.map((step) => step.title).join(', ')}.`}
          />
        )}
      </div>
    </section>
  );
}

// §4 What you get, §5 Works with
export function ServiceDeliverables({ content }: ServiceSectionProps) {
  return (
    <section aria-labelledby="service-get" className={section} data-fx-once="">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="service-get" className="text-h2 text-balance">
            {content.deliverables.heading}
          </h2>
          <ul className="mt-6 grid gap-3">
            {content.deliverables.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Icon name="check" size={20} className="mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 id="service-works" className="text-h2 text-balance">
            {content.worksWith.heading}
          </h2>
          <p className="mt-4 max-w-measure">{content.worksWith.lede}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {content.worksWith.platforms.map((platform) => (
              <li key={platform} className="dz-chip inline-flex items-center">
                {platform}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// §6 Is it right for you?: the catalogue's fits and the decision aid
export function ServiceFit({ content }: ServiceSectionProps) {
  const { fit } = content;
  return (
    <section aria-labelledby="service-fit" className={section} data-fx-once="">
      <h2 id="service-fit" className="max-w-measure text-h2 text-balance">
        {fit.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{fit.lede}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ul className="dz-glass grid content-start gap-3 rounded-2xl p-6">
          {fit.goodFit.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Icon name="check" size={20} className="mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <dl className="dz-glass grid content-start gap-4 rounded-2xl p-6">
          {fit.decisionAid.map((entry) => (
            <div key={entry.question}>
              <dt className="font-bold text-fg-strong">{entry.question}</dt>
              <dd className="mt-1 text-fg-muted">{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// §7 Try it (the matching demo's stub, when the service has one; P7 builds the demos), §8 UAE
// specifics, §9 Pairs well with
export function ServiceTryUaePairs({ content }: ServiceSectionProps) {
  const { tryIt } = content;
  return (
    <section aria-labelledby={tryIt ? 'service-try' : 'service-uae'} className={section} data-fx-once="">
      {tryIt ? (
        <div className="dz-glass mb-section rounded-2xl p-6">
          <h2 id="service-try" className="text-h3 text-balance">
            {tryIt.heading}
          </h2>
          <p className="mt-2 max-w-measure text-fg-muted">{tryIt.line}</p>
          <div className="mt-4">
            <DemoStub demoId={tryIt.demoId} label={tryIt.trigger} icon={tryIt.icon} />
          </div>
        </div>
      ) : null}
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="service-uae" className="text-h2 text-balance">
            {content.uae.heading}
          </h2>
          <ul className="mt-6 grid gap-3">
            {content.uae.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Icon name="check" size={20} className="mt-1 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 id="service-pairs" className="text-h2 text-balance">
            {content.pairs.heading}
          </h2>
          <ul className="mt-6 grid gap-4">
            {content.pairs.items.map((item) => {
              const pair = byNumber(item.catalogueNumber);
              if (!pair) return null;
              const href = pair.slug ? livePath(`/services/${pair.slug}`) : undefined;
              return (
                <li key={item.catalogueNumber}>
                  <p className="font-bold text-fg-strong">
                    {href ? (
                      <a href={href} className="dz-underline dz-target">
                        {pair.name}
                      </a>
                    ) : (
                      pair.name
                    )}
                  </p>
                  <p className="mt-1 text-small text-fg-muted">{item.line}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
