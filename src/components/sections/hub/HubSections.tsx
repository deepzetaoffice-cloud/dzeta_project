// The services hub's sections (/services, R010; docs/design/services-hub.md; Figma 58:34). Copy from
// services-hub.ts; every service name, pillar and offer from the catalogue (10 §2). A service links
// only while its page is live (04 §1.4). Phase C: the semantic sections, base tokens only; Phase D adds
// the Figma look, dot-field and hover-lift.
import { PillarMark } from '@/components/ui/PillarMark';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import {
  bundles,
  pillars,
  services as catalogueServices,
  starterOffers,
  subgroups,
  type CatalogueService,
} from '@/content/catalogue';
import { servicesHub } from '@/content/en/services-hub';
import { shellContent } from '@/content/en/shell';
import { livePath } from '@/lib/routes';

// Widened from the `as const` data to the declared shape, so the optional fields read uniformly
const services: readonly CatalogueService[] = catalogueServices;
const byNumber = (number: string) => services.find((service) => service.number === number);
const serviceHref = (service: CatalogueService) => (service.slug ? livePath(`/services/${service.slug}`) : undefined);

// A service's name: a link while its page is live, plain text before
function ServiceName({ service, className }: { service: CatalogueService; className?: string }) {
  const href = serviceHref(service);
  return href ? (
    <a href={href} className={['text-link underline-offset-4 hover:underline', className].filter(Boolean).join(' ')}>
      {service.name}
    </a>
  ) : (
    <span className={className}>{service.name}</span>
  );
}

// §2 The hero: the H1 and the answer are the LCP (13 §3 rule 2); the H1 takes the h1 size below 640 px
export function HubHero() {
  return (
    <section aria-labelledby="hub-heading" className="mx-auto max-w-page px-gutter pt-8 pb-section">
      <h1 id="hub-heading" className="text-hero-line text-balance sm:text-hero-line">
        {servicesHub.heading}
      </h1>
      <p className="mt-6 max-w-measure text-lead">{servicesHub.answer}</p>
      <div className="mt-8">
        <CtaButton href={auditHref()} label={shellContent.cta} variant="primary" />
      </div>
    </section>
  );
}

// §3 "Which service do you need?": a real table (caption, scope) that stacks below 640 px
export function HubChooser() {
  const { chooser } = servicesHub;
  return (
    <section aria-labelledby="hub-chooser" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="hub-chooser" className="max-w-measure text-h2 text-balance">
        {chooser.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{chooser.lede}</p>
      <table className="mt-8 w-full max-w-measure text-start">
        <caption className="sr-only">{chooser.caption}</caption>
        <thead className="sr-only sm:not-sr-only">
          <tr>
            <th scope="col" className="pb-3 text-start text-small font-medium text-ink-secondary">
              {chooser.problemHeader}
            </th>
            <th scope="col" className="pb-3 text-start text-small font-medium text-ink-secondary">
              {chooser.serviceHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {chooser.rows.map((row) => {
            const service = byNumber(row.catalogueNumber);
            if (!service) return null;
            return (
              <tr key={row.problem} className="grid gap-1 border-t border-line py-3 sm:table-row">
                <th scope="row" className="text-start font-normal sm:py-3 sm:pe-6">
                  {row.problem}
                </th>
                <td className="font-medium text-ink sm:py-3">
                  <ServiceName service={service} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export function HubStartHere() {
  const { startHere } = servicesHub;
  return (
    <section aria-labelledby="hub-start" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="hub-start" className="max-w-measure text-h2 text-balance">
        {startHere.heading}
      </h2>
      <p className="mt-4 max-w-measure text-lead">{startHere.lede}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {startHere.items.map((item) => {
          const offer = starterOffers.find((entry) => entry.number === item.offerNumber);
          if (!offer) return null;
          const href = livePath(offer.path);
          return (
            <li key={offer.number} className="rounded-lg p-6">
              <h3 className="text-h4">
                {href ? (
                  <a href={href} className="text-link underline-offset-4 hover:underline">
                    {offer.name}
                  </a>
                ) : (
                  offer.name
                )}
              </h3>
              <p className="mt-2 text-small text-ink-secondary">{item.line}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function HubDirectories() {
  const { pillars: copy } = servicesHub;
  return (
    <section aria-labelledby="hub-pillars" className="mx-auto max-w-page px-gutter py-section">
      <h2 id="hub-pillars" className="max-w-measure text-h2 text-balance">
        {copy.heading}
      </h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {pillars.map((pillar) => {
          const listed = services.filter(
            (service) =>
              service.pillar === pillar.pixel && (service.priority === 'lead' || service.priority === 'core'),
          );
          const groups = subgroups.filter((group) => group.pillar === pillar.pixel);
          const sections = groups.length
            ? groups.map((group) => ({
                key: group.code,
                title: group.name,
                items: listed.filter((service) => service.number.startsWith(`${group.code}.`)),
              }))
            : [{ key: String(pillar.number), title: undefined, items: listed }];
          const titleId = `hub-pillar-${pillar.pixel}`;
          return (
            <section
              key={pillar.pixel}
              aria-labelledby={titleId}
              className="rounded-lg border border-line bg-surface p-6"
            >
              <div className="flex items-start gap-4">
                <PillarMark pillar={pillar.pixel} className="mt-2 size-6" />
                <div className="grid gap-1 pt-1">
                  <h3 id={titleId} className="text-h3">
                    {pillar.name}
                  </h3>
                  <p className="text-small text-ink-secondary">{pillar.promise}</p>
                </div>
              </div>
              <p className="mt-4 max-w-measure">{copy.ledes[pillar.pixel]}</p>
              {sections
                .filter((group) => group.items.length > 0)
                .map((group) => (
                  <div key={group.key} className="mt-6">
                    {group.title ? <h4 className="text-small font-bold text-ink">{group.title}</h4> : null}
                    <ul className="mt-2 grid gap-1.5 text-small">
                      {group.items.map((service) => (
                        <li key={service.number} className="flex items-center gap-2">
                          <PillarMark pillar={pillar.pixel} className="size-2" />
                          <ServiceName service={service} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </section>
          );
        })}
      </div>
    </section>
  );
}

// §6 Ongoing care and Solutions: section 6's services and the six bundle names (catalogue §5); the
// solutions hub and each bundle page link once they ship (R090–R096)
export function HubCareAndSolutions() {
  const { care, solutions } = servicesHub;
  return (
    <section aria-labelledby="hub-care" className="mx-auto max-w-page px-gutter py-section">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="hub-care" className="text-h2 text-balance">
            {care.heading}
          </h2>
          <p className="mt-4 max-w-measure">{care.lede}</p>
          <ul className="mt-6 grid gap-2">
            {care.catalogueNumbers.map((number) => {
              const service = byNumber(number);
              return service ? (
                <li key={number} className="font-medium text-ink">
                  <ServiceName service={service} />
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <div>
          <h2 id="hub-solutions" className="text-h2 text-balance">
            {solutions.heading}
          </h2>
          <p className="mt-4 max-w-measure">{solutions.lede}</p>
          <ul className="mt-6 grid gap-2">
            {bundles.map((bundle) => {
              const href = livePath(`/solutions/${bundle.slug}`);
              return (
                <li key={bundle.number} className="font-medium text-ink">
                  {href ? (
                    <a href={href} className="text-link underline-offset-4 hover:underline">
                      {bundle.name}
                    </a>
                  ) : (
                    bundle.name
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
