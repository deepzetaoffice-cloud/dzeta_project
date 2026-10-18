// The service template's sections (/services/<slug>; docs/design/service-page.md; Figma 59:34). Copy
// from the page's file (src/content/en/services/<slug>.ts) and the template's shared labels; the
// service's name, pillar and every service named by number come from the catalogue (10 §2). Links only
// to live pages (04 §1.4). Phase C: the semantic sections, base tokens only; Phase D adds the Figma look.
// CodePage reads ServiceHero's source from this file at build time, so it shows the real code.
import type { ReactNode } from 'react';
import { Glyph } from '@/components/ui/Glyph';
import { PillarMark } from '@/components/ui/PillarMark';
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

export function ServiceHero({ content, service, preview = false }: ServiceSectionProps & { preview?: boolean }) {
  const Heading = preview ? 'p' : 'h1';
  return (
    <section
      aria-labelledby={preview ? undefined : 'service-heading'}
      className="mx-auto max-w-page px-gutter pt-3 pb-section sm:pt-8"
      data-view-service={preview ? undefined : service.slug}
      data-view-pillar={preview ? undefined : service.pillar}
    >
      {service.pillar ? <PillarMark pillar={service.pillar} className="size-6" /> : null}
      <Heading
        id={preview ? undefined : 'service-heading'}
        className="mt-3 text-hero-line text-balance sm:mt-4 sm:text-hero-line"
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

export function ServiceProblem({ content }: ServiceSectionProps) {
  return (
    <section aria-labelledby="service-problem" className={section}>
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

export function ServiceHow({ content, story }: ServiceSectionProps & { story?: ReactNode }) {
  const { how } = content;
  return (
    <section aria-labelledby="service-how" className={section}>
      <h2 id="service-how" className="max-w-measure text-h2 text-balance">
        {how.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{how.lede}</p>
      <div className={story ? 'mt-10' : 'mt-10 grid gap-10 lg:grid-cols-2 lg:items-center'}>
        <ol aria-label={serviceTemplate.stepsLabel} className={story ? 'grid gap-4 lg:grid-cols-2' : 'grid gap-4'}>
          {how.steps.map((step, index) => (
            <li key={step.title} className="flex items-baseline gap-3">
              <span className="font-mono text-caption text-ink-secondary">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="font-bold text-ink">{step.title}</span>{' '}
                <span className="text-ink-secondary">{step.text}</span>
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
    <section aria-labelledby="service-get" className={section}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="service-get" className="text-h2 text-balance">
            {content.deliverables.heading}
          </h2>
          <ul className="mt-6 grid gap-3">
            {content.deliverables.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Glyph name="check" className="mt-0.5 size-5 text-violet" />
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
              <li key={platform} className="inline-flex items-center">
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
    <section aria-labelledby="service-fit" className={section}>
      <h2 id="service-fit" className="max-w-measure text-h2 text-balance">
        {fit.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{fit.lede}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ul className="grid content-start gap-3 rounded-lg p-6">
          {fit.goodFit.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Glyph name="check" className="mt-0.5 size-5 text-violet" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <dl className="grid content-start gap-4 rounded-lg p-6">
          {fit.decisionAid.map((entry) => (
            <div key={entry.question}>
              <dt className="font-bold text-ink">{entry.question}</dt>
              <dd className="mt-1 text-ink-secondary">{entry.answer}</dd>
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
    <section aria-labelledby={tryIt ? 'service-try' : 'service-uae'} className={section}>
      {tryIt ? (
        <div className="mb-section rounded-lg p-6">
          <h2 id="service-try" className="text-h3 text-balance">
            {tryIt.heading}
          </h2>
          <p className="mt-2 max-w-measure text-ink-secondary">{tryIt.line}</p>
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
                <Glyph name="check" className="mt-0.5 size-5 text-violet" />
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
                  <p className="font-bold text-ink">
                    {href ? (
                      <a href={href} className="text-link underline-offset-4 hover:underline">
                        {pair.name}
                      </a>
                    ) : (
                      pair.name
                    )}
                  </p>
                  <p className="mt-1 text-small text-ink-secondary">{item.line}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
