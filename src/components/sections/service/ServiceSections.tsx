// The service template's sections (/services/<slug>; docs/design/service-page.md; Figma 59:34 desktop,
// 59:873 mobile). Copy from the page's file (src/content/en/services/<slug>.ts) and the template's
// shared labels; the service's name, pillar and every service named by number come from the catalogue
// (10 §2). Links only to live pages (04 §1.4). No signature moment: the flow diagram is the page's one
// explanatory moment, and src/lib/fx/service.ts lights its steps in order on view (section-reveal).
import type { Pillar } from '@/components/icons/registry';
import { DemoStub } from '@/components/demos/DemoStub';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { Photo } from '@/components/ui/Photo';
import { PILLAR_WASH, PillarMark } from '@/components/ui/PillarMark';
import { pillars, services as catalogueServices, subgroups, type CatalogueService } from '@/content/catalogue';
import { shellContent } from '@/content/en/shell';
import type { FlowStep, ServicePageContent } from '@/content/en/services/types';
import { serviceTemplate } from '@/content/en/services/template';
import { photo, SERVICE_PHOTO } from '@/lib/media/photos';
import { livePath } from '@/lib/routes';

const services: readonly CatalogueService[] = catalogueServices;
const byNumber = (number: string) => services.find((service) => service.number === number);
const pillarName = (pillar: Pillar) => pillars.find((entry) => entry.pixel === pillar)?.name ?? '';
const pad = (n: number) => String(n).padStart(2, '0');

export type ServiceSectionProps = { content: ServicePageContent; service: CatalogueService };

const section = 'mx-auto max-w-page px-gutter py-section';

// The catalogue chip's text: "1B.1 · Sales & Lead Automation" (the sub-group, when the pillar has them)
function catalogueLabel(service: CatalogueService) {
  const group = subgroups.find((entry) => service.number.startsWith(`${entry.code}.`));
  return group ? `${service.number} · ${group.name}` : service.number;
}

// §01 The hero, on a stage in the page's pillar: the breadcrumb, the pillar and catalogue chips, the
// H1 and the direct answer (both static from first paint), the audit CTA and the demo's trigger, and
// the service's photo with its design-target chip when the facts allow one.
export function ServiceHero({
  content,
  service,
  trail,
  preview = false,
}: ServiceSectionProps & { trail?: readonly Crumb[]; preview?: boolean }) {
  const Heading = preview ? 'p' : 'h1';
  const photoId = SERVICE_PHOTO[service.slug ?? ''];
  return (
    <section
      aria-labelledby={preview ? undefined : 'service-heading'}
      data-stage-hero={preview ? undefined : ''}
      className={preview ? 'p-3' : 'px-stage-inset pt-stage-inset'}
      data-view-service={preview ? undefined : service.slug}
      data-view-pillar={preview ? undefined : service.pillar}
    >
      <div
        className="dz-svc-hero relative mx-auto max-w-page overflow-hidden rounded-stage bg-(image:--dz-grad-stage) text-on-color"
        data-pillar={service.pillar}
      >
        <span aria-hidden="true" className="dz-svc-glow" />
        <div className="relative grid gap-8 px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-6))] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,32.5rem)] lg:items-center lg:gap-14 lg:px-16 lg:pb-12">
          <div className="grid content-start justify-items-start gap-5">
            {trail ? <Breadcrumbs trail={trail} tone="onColor" className="" /> : null}
            <p className="flex flex-wrap gap-2.5 text-caption">
              {service.pillar ? (
                <span
                  className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-ink ${PILLAR_WASH[service.pillar]}`}
                >
                  <PillarMark pillar={service.pillar} className="size-2" />
                  {pillarName(service.pillar)}
                </span>
              ) : null}
              <span className="inline-flex min-h-8 items-center rounded-full border border-line-on-color px-3">
                {catalogueLabel(service)}
              </span>
            </p>
            <Heading id={preview ? undefined : 'service-heading'} className="text-hero-line text-balance text-on-color">
              {content.heading}
            </Heading>
            <p className="max-w-[40rem] text-lead">{content.answer}</p>
            <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" className="dz-cta-rim" />
              {content.tryIt ? (
                <DemoStub
                  demoId={content.tryIt.demoId}
                  label={content.tryIt.trigger}
                  icon={content.tryIt.icon}
                  tone="onColor"
                  className="justify-center"
                />
              ) : null}
            </div>
          </div>
          {photoId ? (
            <div className="relative">
              <Photo
                asset={photo(photoId, { alt: content.heroPhotoAlt })}
                sizes="(min-width: 64rem) 32.5rem, 100vw"
                className="aspect-[8/7] w-full rounded-2xl object-cover lg:aspect-[13/14]"
                priority={!preview}
              />
              {content.heroStat ? (
                <p className="absolute start-4 bottom-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-surface ps-3.5 pe-4 text-caption text-ink shadow-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-accent-signal" />
                  <span className="font-semibold">{content.heroStat.value}</span>
                  <span className="text-ink-secondary">{content.heroStat.qualifier}</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// `index`: the section's place in the page's numbered sequence (the flagship page puts Code ↔ Page first)
export function ServiceProblem({ content, index = 1 }: ServiceSectionProps & { index?: number }) {
  return (
    <section aria-labelledby="service-problem" className={section}>
      <SectionHeading
        id="service-problem"
        index={index}
        eyebrow={serviceTemplate.eyebrows.problem}
        heading={content.problem.heading}
        lede={content.problem.lede}
      />
      <BeforeAfter
        beforeLabel={serviceTemplate.beforeLabel}
        afterLabel={serviceTemplate.afterLabel}
        caption={content.problem.heading}
        rows={content.problem.rows}
      />
    </section>
  );
}

// The diagram's rows (Figma 59:34: two boxes over three), each box with its step's number; a step
// without its own box shows its title
function diagramRows(steps: readonly FlowStep[]): { step: FlowStep; number: number }[][] {
  const sizes: Record<number, number[]> = { 3: [3], 4: [2, 2], 5: [2, 3], 6: [3, 3], 7: [2, 3, 2] };
  const numbered = steps.map((step, index) => ({ step, number: index + 1 }));
  const rows: { step: FlowStep; number: number }[][] = [];
  let at = 0;
  for (const size of sizes[steps.length] ?? [steps.length]) {
    rows.push(numbered.slice(at, at + size));
    at += size;
  }
  return rows;
}

// §03 How it works (the C diagram language): the steps as a visible ordered list beside the system
// diagram, an example labelled as one (10 §3.6). The diagram repeats the list, so it's hidden from
// screen readers.
export function ServiceHow({ content }: ServiceSectionProps) {
  const { how } = content;
  const caption = how.figure
    ? `${serviceTemplate.figureLabel} — ${how.figure} · ${serviceTemplate.figureExample}`
    : `${serviceTemplate.figureLabel} — ${how.exampleLabel}`;
  return (
    <section aria-labelledby="service-how" className={section}>
      <SectionHeading
        id="service-how"
        index={2}
        eyebrow={serviceTemplate.eyebrows.how}
        heading={how.heading}
        lede={how.lede}
      />
      <div className="dz-flow mt-12" data-fx-scene="service-flow" data-fx-svc-flow="" data-step={how.steps.length}>
        <figure className="dz-flow-panel dz-svc-panel">
          <figcaption className="dz-svc-caption font-mono text-label text-ink uppercase">{caption}</figcaption>
          <ol aria-label={serviceTemplate.stepsLabel} className="dz-steps dz-svc-steps">
            {how.steps.map((step, index) => (
              <li key={step.title} className="dz-step" data-flow-step={index + 1}>
                <span aria-hidden="true" className="dz-step-rail" />
                <span className="grid gap-1.5">
                  <span className="dz-step-label font-mono text-label uppercase">
                    <span className="dz-num" data-num={pad(index + 1)} /> · {step.title}
                  </span>
                  <span className="dz-step-text">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="dz-svc-diagram-area dz-svc-diagram">
            <div className="dz-svc-rows">
              {diagramRows(how.steps).map((row) => (
                <div key={row[0]?.number} className="dz-svc-row">
                  {row.map(({ step, number }) => (
                    <div key={number} className="dz-svc-node" data-flow-node={number}>
                      <p className="text-h4 text-ink">{step.node?.label ?? step.title}</p>
                      {step.node?.line ? <p className="text-caption text-ink-secondary">{step.node.line}</p> : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="inline-flex min-h-8 w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 font-mono text-label text-ink-secondary uppercase">
              <span className="size-1.5 rounded-full bg-accent-signal" />
              {how.exampleLabel}
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}

// A check glyph in its violet-soft disc, the template's list marker
function CheckDisc() {
  return (
    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
      <Glyph name="check" className="size-4" />
    </span>
  );
}

// §04 What you get, and the Works with card on the stage
export function ServiceDeliverables({ content }: ServiceSectionProps) {
  return (
    <section aria-labelledby="service-get" className={section}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16">
        <div>
          <SectionHeading
            id="service-get"
            index={3}
            eyebrow={serviceTemplate.eyebrows.deliverables}
            heading={content.deliverables.heading}
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {content.deliverables.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-small text-ink"
              >
                <CheckDisc />
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <section
          aria-labelledby="service-works"
          className="grid gap-4 rounded-2xl bg-(image:--dz-grad-stage) p-6 text-on-color lg:p-8"
        >
          <h2 id="service-works" className="text-h3 text-balance text-on-color">
            {content.worksWith.heading}
          </h2>
          <p className="text-small">{content.worksWith.lede}</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {content.worksWith.platforms.map((platform) => (
              <li
                key={platform}
                className="inline-flex min-h-9 items-center rounded-full border border-line-on-color px-3 text-caption"
              >
                {platform}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

// §05 Is it right for you?: the catalogue's fits on the pillar's wash, then the decision aid.
// `aidOnly`: the decision aid alone, in two columns (the flagship page, Figma 60:34)
export function ServiceFit({
  content,
  service,
  index = 4,
  aidOnly = false,
}: ServiceSectionProps & { index?: number; aidOnly?: boolean }) {
  const { fit } = content;
  const aid = (
    <dl className="grid gap-card-gap sm:grid-cols-2">
      {fit.decisionAid.map((entry) => (
        <div key={entry.question} className="rounded-2xl border border-line bg-surface p-5 lg:p-6">
          <dt className="font-semibold text-ink">{entry.question}</dt>
          <dd className="mt-2 text-small text-ink-secondary">{entry.answer}</dd>
        </div>
      ))}
    </dl>
  );
  return (
    <section aria-labelledby="service-fit" className={section}>
      <SectionHeading
        id="service-fit"
        index={index}
        eyebrow={serviceTemplate.eyebrows.fit}
        heading={fit.heading}
        lede={fit.lede}
      />
      {aidOnly ? (
        <div className="mt-12">{aid}</div>
      ) : (
        <div className="mt-12 grid gap-card-gap lg:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] lg:items-start">
          <div
            className={`grid gap-4 rounded-2xl p-6 ${service.pillar ? PILLAR_WASH[service.pillar] : 'bg-violet-soft'}`}
          >
            <h3 className="font-mono text-label text-ink uppercase">{serviceTemplate.goodFitLabel}</h3>
            <ul className="grid gap-3.5 text-small text-ink">
              {fit.goodFit.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {service.pillar ? <PillarMark pillar={service.pillar} className="mt-1.5 size-2" /> : null}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {aid}
        </div>
      )}
    </section>
  );
}

// §06 Try it (the matching demo's stub, labelled honestly until P7 ships it), Built for UAE leads and
// Pairs well with (each card a link only when its page is live; the link is the service's name)
export function ServiceTryUaePairs({ content }: ServiceSectionProps) {
  const { tryIt } = content;
  return (
    <div className={section}>
      {tryIt ? (
        <section
          aria-labelledby="service-try"
          className="mb-card-gap flex flex-col gap-6 rounded-2xl bg-(image:--dz-grad-stage) p-6 text-on-color lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7"
        >
          <div className="grid gap-2">
            <p className="font-mono text-label uppercase">{serviceTemplate.demoLabel}</p>
            <h2 id="service-try" className="text-h3 text-balance text-on-color">
              {tryIt.heading}
            </h2>
            <p className="max-w-[45rem] text-small">{tryIt.line}</p>
          </div>
          <DemoStub
            demoId={tryIt.demoId}
            label={tryIt.trigger}
            icon={tryIt.icon}
            tone="onColor"
            className="shrink-0 justify-center"
          />
        </section>
      ) : null}
      <div className="grid gap-card-gap lg:grid-cols-2 lg:items-start">
        <section
          aria-labelledby="service-uae"
          className="grid gap-5 rounded-2xl border border-line bg-surface p-6 lg:mt-12 lg:p-8"
        >
          <h2 id="service-uae" className="text-h3 text-ink">
            {content.uae.heading}
          </h2>
          <ul className="grid gap-4 text-small text-ink">
            {content.uae.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Glyph name="check" className="mt-0.5 size-4.5 shrink-0 text-violet" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="service-pairs" className="grid gap-4">
          <h2 id="service-pairs" className="text-h3 text-ink">
            {content.pairs.heading}
          </h2>
          <ul className="grid gap-card-gap">
            {content.pairs.items.map((item) => {
              const pair = byNumber(item.catalogueNumber);
              if (!pair) return null;
              const href = pair.slug ? livePath(`/services/${pair.slug}`) : undefined;
              return (
                <li
                  key={item.catalogueNumber}
                  className={[
                    'relative overflow-hidden rounded-2xl border border-line bg-surface',
                    href ? 'dz-hover-lift' : '',
                  ].join(' ')}
                >
                  {pair.pillar ? (
                    <div className={`flex items-center justify-between px-5 py-4 ${PILLAR_WASH[pair.pillar]}`}>
                      <PillarMark pillar={pair.pillar} shape="pixels" className="h-9" />
                      <span className="inline-flex items-center gap-2 text-caption text-ink">
                        <PillarMark pillar={pair.pillar} className="size-2" />
                        {pillarName(pair.pillar)}
                      </span>
                    </div>
                  ) : null}
                  <div className="grid gap-2 p-5">
                    <h3 className="text-h4 text-ink">
                      {href ? (
                        <a href={href} className="after:absolute after:inset-0">
                          {pair.name}
                        </a>
                      ) : (
                        pair.name
                      )}
                    </h3>
                    <p className="max-w-[24rem] text-small text-ink-secondary">{item.line}</p>
                    {href ? (
                      <p
                        aria-hidden="true"
                        className="mt-1 inline-flex items-center gap-2 text-small font-semibold text-ink"
                      >
                        {serviceTemplate.pairCue}
                        <Glyph name="arrow-up-right" className="size-4" />
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
