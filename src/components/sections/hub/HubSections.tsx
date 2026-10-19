// The services hub's sections (/services, R010; docs/design/services-hub.md; Figma 58:34 desktop,
// 58:2466 mobile). Copy from services-hub.ts; every service name, pillar and offer from the catalogue
// (10 §2). A service links only while its page is live (04 §1.4), and every link names its service.
// A utility page: no signature moment. Its effects are dot-field in the hero (src/lib/fx/hub.ts) and
// hover-lift on live links; the sections carry no JavaScript of their own.
import type { Pillar } from '@/components/icons/registry';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { PILLAR_FILL, PILLAR_WASH, PillarMark } from '@/components/ui/PillarMark';
import {
  bundles,
  pillars,
  services as catalogueServices,
  starterOffers,
  type CatalogueService,
} from '@/content/catalogue';
import { navigation } from '@/content/en/navigation';
import { servicesHub } from '@/content/en/services-hub';
import { shellContent } from '@/content/en/shell';
import { isLive, livePath, routePath } from '@/lib/routes';

// Widened from the `as const` data to the declared shape, so the optional fields read uniformly
const services: readonly CatalogueService[] = catalogueServices;
const byNumber = (number: string) => services.find((service) => service.number === number);
const serviceHref = (service: CatalogueService) => (service.slug ? livePath(`/services/${service.slug}`) : undefined);

// The chooser's id: the hero's "Find your service by problem" scrolls to it
const CHOOSER_ID = 'hub-chooser';

// A service's name with its pillar square: a link with the arrow while its page is live, plain text
// before (the arrow only ever marks a link)
function ServiceItem({ service, className }: { service: CatalogueService; className?: string }) {
  const href = serviceHref(service);
  const mark = service.pillar ? <PillarMark pillar={service.pillar} className="size-2" /> : null;
  return href ? (
    <a
      href={href}
      className={['dz-hub-link group flex items-center gap-2.5 text-link', className].filter(Boolean).join(' ')}
    >
      {mark}
      <span className="flex-1 underline-offset-4 group-hover:underline">{service.name}</span>
      <Glyph name="arrow-up-right" className="size-4 shrink-0" />
    </a>
  ) : (
    <span className={['flex items-center gap-2.5', className].filter(Boolean).join(' ')}>
      {mark}
      <span>{service.name}</span>
    </span>
  );
}

// §01 The hero: a compact stage with the dot field. The H1 and the answer are the LCP (13 §3 rule 2):
// visible at first paint, never animated. The breadcrumb sits inside the stage (Figma), and the stage
// holds the floating header in its top (data-stage-hero).
export function HubHero({ trail }: { trail: readonly Crumb[] }) {
  return (
    <section aria-labelledby="hub-heading" data-stage-hero="" className="px-stage-inset pt-stage-inset">
      <div
        data-fx-scene="hub-dots"
        className="dz-hub-hero relative mx-auto max-w-page overflow-hidden rounded-stage bg-(image:--dz-grad-stage) text-on-color"
      >
        <span aria-hidden="true" className="dz-dots" />
        <span aria-hidden="true" className="dz-dots dz-dots-spot" />
        {pillars.map((pillar) => (
          <span key={pillar.pixel} aria-hidden="true" className={`dz-dots dz-dots-pillar dz-dots-${pillar.pixel}`} />
        ))}
        <div className="relative mx-auto grid max-w-[60rem] justify-items-start gap-6 px-gutter pt-[calc(var(--dz-layout-header-height)+var(--dz-space-8))] pb-12 lg:justify-items-center lg:pt-[calc(var(--dz-layout-header-height)+var(--dz-space-12))] lg:pb-16 lg:text-center">
          <Breadcrumbs trail={trail} tone="onColor" className="lg:-mb-2" />
          <h1 id="hub-heading" className="text-hero-line text-balance text-on-color">
            {servicesHub.heading}
          </h1>
          <p className="max-w-[47.5rem] text-lead">{servicesHub.answer}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" className="dz-cta-rim" />
            <a href={`#${CHOOSER_ID}`} className="dz-press dz-button-on-color">
              {servicesHub.findByProblem}
            </a>
          </div>
          <ul className="flex flex-wrap gap-2.5 lg:justify-center">
            {pillars.map((pillar) => (
              <li key={pillar.pixel}>
                <a
                  href={`#hub-pillar-${pillar.pixel}`}
                  data-hub-pillar={pillar.pixel}
                  className="dz-press inline-flex min-h-9 items-center gap-2 rounded-full border border-line-on-color px-3 text-caption hover:border-on-color"
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-on-color" />
                  {pillar.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// §02 "Which service do you need?": a real table (caption, scope) whose rows stack below 640 px,
// never a sideways scroll. The section's eyebrow is the table's caption, said once.
export function HubChooser() {
  const { chooser } = servicesHub;
  return (
    <section aria-labelledby={CHOOSER_ID} className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id={CHOOSER_ID}
        index={1}
        eyebrow={chooser.caption}
        heading={chooser.heading}
        lede={chooser.lede}
      />
      <div className="dz-table-panel mt-12">
        <table className="text-start">
          <caption className="sr-only">{chooser.caption}</caption>
          <thead className="sr-only sm:not-sr-only">
            <tr className="bg-surface-muted">
              <th
                scope="col"
                className="w-[55%] px-6 py-3.5 text-start font-mono text-label font-normal text-ink-secondary uppercase"
              >
                {chooser.problemHeader}
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-start font-mono text-label font-normal text-ink-secondary uppercase"
              >
                {chooser.serviceHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {chooser.rows.map((row) => {
              const service = byNumber(row.catalogueNumber);
              if (!service) return null;
              return (
                <tr key={row.problem} className="dz-chooser-row grid gap-2 p-5 sm:table-row sm:p-0">
                  <th scope="row" className="text-start font-medium text-ink sm:px-6 sm:py-4">
                    {row.problem}
                  </th>
                  <td className="text-small font-medium sm:px-6 sm:py-4">
                    <ServiceItem service={service} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// §03 Start here: the catalogue's three starter offers. 0.1 sits on the stage with the audit CTA; a
// card's offer name is its link once that offer's page is live (no "Learn more": 08 §2.9).
export function HubStartHere() {
  const { startHere } = servicesHub;
  return (
    <section aria-labelledby="hub-start" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading
        id="hub-start"
        index={2}
        eyebrow={startHere.eyebrow}
        heading={startHere.heading}
        lede={startHere.lede}
      />
      <ul className="mt-12 grid gap-card-gap md:grid-cols-3">
        {startHere.items.map((item, index) => {
          const offer = starterOffers.find((entry) => entry.number === item.offerNumber);
          if (!offer) return null;
          const href = livePath(offer.path);
          const free = index === 0;
          const name = href ? (
            <a href={href} className="underline-offset-4 hover:underline">
              {offer.name}
            </a>
          ) : (
            offer.name
          );
          return (
            <li
              key={offer.number}
              className={[
                'grid content-start gap-3 rounded-2xl p-6 lg:p-8',
                free ? 'bg-(image:--dz-grad-stage) text-on-color' : 'border border-line bg-surface text-ink',
                href ? 'dz-hover-lift' : '',
              ].join(' ')}
            >
              {/* The number in signal orange is a marker (C80), so it's drawn, not read; the h3 names the offer */}
              <p className="font-mono text-label uppercase">
                {free ? (
                  `${offer.number} · ${startHere.freeLabel}`
                ) : (
                  <span className="dz-num dz-num-signal" data-num={offer.number} />
                )}
              </p>
              <h3 className={free ? 'text-h3 text-balance text-on-color' : 'text-h3 text-balance'}>{name}</h3>
              <p className={free ? 'text-small' : 'text-small text-ink-secondary'}>{item.line}</p>
              {free ? (
                <CtaButton
                  href={auditHref()}
                  label={shellContent.cta}
                  variant="primary"
                  size="m"
                  className="dz-cta-rim mt-2 w-fit"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const MENU_COLUMN = Object.fromEntries(navigation.columns.map((column) => [column.pillar, column])) as Record<
  Pillar,
  (typeof navigation.columns)[number]
>;

// §04 Every service, by pillar: the bento of four directories in catalogue order, each with every lead
// and core service by its exact name. The h3 ids are the anchors the hero's chips and Home's doors use.
export function HubDirectories() {
  const { pillars: copy } = servicesHub;
  return (
    <section aria-labelledby="hub-pillars" className="mx-auto max-w-page px-gutter py-section">
      <SectionHeading id="hub-pillars" index={3} eyebrow={copy.eyebrow} heading={copy.heading} />
      <div className="mt-12 grid gap-card-gap">
        {pillars.map((pillar) => {
          const listed = services.filter(
            (service) =>
              service.pillar === pillar.pixel && (service.priority === 'lead' || service.priority === 'core'),
          );
          const titleId = `hub-pillar-${pillar.pixel}`;
          const column = MENU_COLUMN[pillar.pixel];
          const allHref = column && isLive(column.route) ? routePath(column.route) : undefined;
          return (
            <section
              key={pillar.pixel}
              aria-labelledby={titleId}
              className="overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div
                className={`grid gap-5 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,47.5rem)] lg:items-center lg:gap-10 lg:px-8 lg:py-8 ${PILLAR_WASH[pillar.pixel]}`}
              >
                <h3 id={titleId} className="flex items-center gap-3.5 text-h3 text-ink">
                  <PillarMark pillar={pillar.pixel} shape="pixels" className="h-9" />
                  {pillar.name}
                </h3>
                <p className="text-ink-secondary lg:text-small">{copy.ledes[pillar.pixel]}</p>
              </div>
              <span aria-hidden="true" className={`block h-1.5 ${PILLAR_FILL[pillar.pixel]}`} />
              <ul className="grid gap-x-6 px-5 pt-4 pb-2 text-small sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
                {listed.map((service) => (
                  <li key={service.number} className="border-b border-line">
                    <ServiceItem service={service} className="min-h-11 py-2" />
                  </li>
                ))}
              </ul>
              {allHref && column ? (
                <p className="px-5 pt-4 pb-6 lg:px-8">
                  <a href={allHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-link">
                    {column.allLabel}
                    <Glyph name="arrow-up-right" className="size-4" />
                  </a>
                </p>
              ) : (
                <span aria-hidden="true" className="block h-4" />
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

// The two cards' eyebrow: the C diagram's "[ 04 ] Label" at card size
function CardEyebrow({ index, label }: { index: number; label: string }) {
  return (
    <p className="flex gap-2.5 font-mono text-label uppercase">
      <span className="dz-num-bracket" data-num={String(index).padStart(2, '0')} />
      <span className="text-ink-secondary">{label}</span>
    </p>
  );
}

// §05 Ongoing care and Solutions: section 6's services, and the six bundle names (catalogue §5), which
// link once the solutions pages ship (R090–R096). "E-Invoicing Ready" carries no clock: the deadline
// needs an APPROVED citation first (services-hub.md's flags).
export function HubCareAndSolutions() {
  const { care, solutions } = servicesHub;
  return (
    <div className="mx-auto max-w-page px-gutter py-section">
      <div className="grid gap-card-gap lg:grid-cols-2">
        <section aria-labelledby="hub-care" className="grid content-start gap-4 rounded-2xl bg-violet-soft p-6 lg:p-8">
          <CardEyebrow index={4} label={care.eyebrow} />
          <h2 id="hub-care" className="text-h3 text-ink">
            {care.heading}
          </h2>
          <p className="text-ink-secondary">{care.lede}</p>
          <ul className="mt-1 grid gap-3">
            {care.catalogueNumbers.map((number) => {
              const service = byNumber(number);
              if (!service) return null;
              const href = serviceHref(service);
              return (
                <li key={number} className="flex items-center gap-3 font-semibold text-ink">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-xs bg-accent-violet" />
                  {href ? (
                    <a href={href} className="text-link underline-offset-4 hover:underline">
                      {service.name}
                    </a>
                  ) : (
                    service.name
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        <section
          aria-labelledby="hub-solutions"
          className="grid content-start gap-4 rounded-2xl border border-line bg-surface p-6 lg:p-8"
        >
          <CardEyebrow index={5} label={solutions.eyebrow} />
          <h2 id="hub-solutions" className="text-h3 text-ink">
            {solutions.heading}
          </h2>
          <p className="text-ink-secondary">{solutions.lede}</p>
          <ul className="mt-1 flex flex-wrap gap-2.5">
            {bundles.map((bundle) => {
              const href = livePath(`/solutions/${bundle.slug}`);
              const chip =
                'inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3 text-caption text-ink';
              const dot = <span aria-hidden="true" className="size-2 rounded-full bg-accent-violet" />;
              return (
                <li key={bundle.number}>
                  {href ? (
                    <a href={href} className={`dz-press ${chip} hover:border-line-strong`}>
                      {dot}
                      {bundle.name}
                    </a>
                  ) : (
                    <span className={chip}>
                      {dot}
                      {bundle.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
