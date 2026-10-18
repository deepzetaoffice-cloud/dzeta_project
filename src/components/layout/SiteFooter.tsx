import type { CSSProperties } from 'react';
import type { Pillar } from '@/components/icons/registry';
import { auditHref, CtaButton, telHref, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { PillarMark } from '@/components/ui/PillarMark';
import { Switch } from '@/components/ui/Switch';
import { Wordmark } from '@/components/ui/Wordmark';
import { navigation, type NavLink } from '@/content/en/navigation';
import { consentContent } from '@/content/en/legal/consent';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The footer (docs/design/footer.md; Figma Footer set 39:1070, Footer column 36:287).
// 1. The audit panel (the finale) on the stage gradient, with `beams` falling toward its edge (they
//    point to the CTA; static under Reduce effects, paused out of view: src/lib/fx/footer.ts). The
//    mono label, the <h2>, its line and the audit CTA (`footer [data-cta="primary"]`, cta_location
//    finale), then WhatsApp and Call once their facts are confirmed. From 1,024 px, the "In one session
//    we map" card. C85: their labels are small white text over the stage, so the secondary buttons and
//    the card keep their border and drop the glass fill.
// 2. The footer panel: the wordmark and the brand line; the sections in a <nav> named "Footer" —
//    Services (the pillar pages and the hub), Solutions, Company and Resources — then the contact block
//    from siteConfig (facts §1–§2) in an <address>, with the opening hours after it. Only live links
//    render (04 §1.4), and a section with none isn't shown; the review page shows every link as a
//    placeholder fragment, as the header does. No newsletter yet: it ships with its service and its
//    promise line (C84).
// 3. The social links, named "Deepzeta AI on LinkedIn" and so on, in a new tab (facts §2.1).
// 4. The legal line: the copyright and the legal name, Privacy and Terms once live, the Reduce effects
//    switch, Cookie settings for every visitor (09 §2.7: TrackingRuntime opens the panel; hidden in
//    place until it can) and "Back to top" (#top: the page's top, where the skip link is the next stop;
//    #main stays the skip link's alone, foundation.spec.ts).
// 5. The giant outlined "Deepzeta", lit by the logo gradient under the pointer (wordmark-spotlight).
//    aria-hidden: the name is already in the logo and the legal line.

type Column = { id: string; title: string; links: (NavLink & { pillar?: Pillar })[] };

function footerColumns(review: boolean): Column[] {
  const services: Column = {
    id: 'services',
    title: navigation.servicesLabel,
    links: [
      ...navigation.columns.map((column) => ({ route: column.route, label: column.name, pillar: column.pillar })),
      { route: 'R010' as const, label: navigation.hubLabel },
    ],
  };
  const solutions: Column = {
    id: 'solutions',
    title: navigation.solutions.label,
    links: navigation.solutions.items.map((item) => ({ route: item.route, label: item.name })),
  };
  const groups = navigation.footer
    .filter((group) => group.title !== 'Legal')
    .map((group) => ({ id: group.title.toLowerCase(), title: group.title, links: [...group.links] }));
  return [services, solutions, ...groups]
    .map((column) => ({ ...column, links: column.links.filter((link) => isShown(link.route, review)) }))
    .filter((column) => column.links.length > 0);
}

// The beams (Figma 39:674–39:683): where each falls across the panel (below 1,024 px and from it),
// where it rests when still, its length, its fall time and its offset in the loop, as shares of the
// panel, so they hold at every width. The last four show from 1,024 px; three rest with a burst.
type Beam = {
  at: string;
  atLg: string;
  top: string;
  length: number;
  duration: string;
  delay: string;
  burst?: true;
  wide?: true;
};

const BEAMS: Beam[] = [
  { at: '8%', atLg: '5.7%', top: '4.5%', length: 0.27, duration: '3.4s', delay: '0s' },
  { at: '24%', atLg: '13.5%', top: '15%', length: 0.41, duration: '4.2s', delay: '-1.4s' },
  { at: '42.8%', atLg: '23.4%', top: '26%', length: 0.55, duration: '5s', delay: '-2.6s', burst: true },
  { at: '61.5%', atLg: '33.4%', top: '36.6%', length: 0.27, duration: '3.8s', delay: '-0.7s' },
  { at: '80.2%', atLg: '44%', top: '47%', length: 0.41, duration: '4.6s', delay: '-3.3s' },
  { at: '93.6%', atLg: '55.4%', top: '12.5%', length: 0.55, duration: '3.2s', delay: '-1.9s' },
  { at: '66%', atLg: '66%', top: '23%', length: 0.27, duration: '4.4s', delay: '-2.2s', burst: true, wide: true },
  { at: '76.7%', atLg: '76.7%', top: '34%', length: 0.41, duration: '3.6s', delay: '-0.3s', wide: true },
  { at: '86.6%', atLg: '86.6%', top: '44.5%', length: 0.55, duration: '4.8s', delay: '-3.8s', burst: true, wide: true },
  { at: '95.2%', atLg: '95.2%', top: '10%', length: 0.27, duration: '4s', delay: '-1.1s', wide: true },
];

const beamStyle = (beam: Beam) =>
  ({
    '--dz-beam-at': beam.at,
    '--dz-beam-at-lg': beam.atLg,
    '--dz-beam-top': beam.top,
    '--dz-beam-length': beam.length,
    '--dz-beam-duration': beam.duration,
    '--dz-beam-delay': beam.delay,
  }) as CSSProperties;

export type SiteFooterProps = { review?: boolean };

export function SiteFooter({ review = false }: SiteFooterProps) {
  const columns = footerColumns(review);
  const legal = (navigation.footer.find((group) => group.title === 'Legal')?.links ?? []).filter((link) =>
    isShown(link.route, review),
  );
  const whatsapp = whatsappHref();
  const tel = telHref();
  // The giant wordmark's word, the brand's first word (siteConfig), drawn by CSS from data-word so it
  // isn't text: a crawler or a text reader meets the name once, in the legal line
  const word = siteConfig.brandName.split(' ')[0];
  return (
    <footer className="grid gap-2 px-stage-inset py-stage-inset md:gap-4">
      <section
        aria-labelledby="dz-finale-heading"
        data-fx-beams=""
        className="dz-finale relative mx-auto w-full max-w-page overflow-hidden rounded-xl bg-(image:--dz-grad-stage) text-on-color md:rounded-stage"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="dz-finale-glow" />
          {BEAMS.map((beam) => (
            <span
              key={beam.atLg}
              style={beamStyle(beam)}
              data-burst={beam.burst ? '' : undefined}
              className={beam.wide ? 'dz-beam max-lg:hidden' : 'dz-beam'}
            >
              <span className="dz-beam-ray" />
              <span className="dz-beam-burst" />
            </span>
          ))}
        </div>
        <div className="relative grid gap-10 px-5 py-10 md:px-18 md:py-20 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="grid content-start gap-5.5">
            <p className="font-mono text-label uppercase">{shellContent.finaleLabel}</p>
            <h2 id="dz-finale-heading" className="dz-finale-heading text-on-color">
              {shellContent.finaleHeading}
            </h2>
            <p className="max-w-[38.75rem] text-lead">{shellContent.finaleLine}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} className="dz-finale-cta" />
              {whatsapp ? (
                <a href={whatsapp} className="dz-press dz-button-on-color">
                  {shellContent.whatsappLabel}
                  <Glyph name="whatsapp" className="size-5" />
                </a>
              ) : null}
              {tel ? (
                <a href={tel} className="dz-press dz-button-on-color">
                  {shellContent.callLabel} {siteConfig.phone}
                  <Glyph name="phone" className="size-5" />
                </a>
              ) : null}
            </div>
          </div>
          <div className="hidden content-start gap-3.5 self-start rounded-xl border border-line-on-color p-6 lg:grid">
            <p className="font-mono text-label uppercase">{shellContent.finaleMapLabel}</p>
            <ol className="grid gap-3.5">
              {shellContent.finaleMap.map((step, index) => (
                <li key={step} className="flex items-center gap-3.5">
                  <span className="font-mono text-step">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-display text-h3">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-small">{shellContent.finaleMapLine}</p>
          </div>
        </div>
      </section>

      <div className="dz-footer-panel mx-auto grid w-full max-w-page gap-8 overflow-hidden rounded-xl bg-surface px-5 py-8 md:gap-12 md:rounded-stage md:p-12">
        <div className="grid gap-3.5">
          <Wordmark label={siteConfig.brandName} className="h-[2.35rem] md:h-[3.075rem]" />
          <p className="max-w-[28.75rem] text-lead text-ink-secondary">{siteConfig.positioningLine}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16.25rem] lg:gap-12">
          {columns.length > 0 ? (
            <nav
              aria-label={shellContent.footerNavLabel}
              className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8"
            >
              {columns.map((column) => (
                <div key={column.id} className="grid content-start gap-3">
                  <p id={`dz-footer-${column.id}`} className="dz-mono-label">
                    {column.title}
                  </p>
                  <ul aria-labelledby={`dz-footer-${column.id}`} className="grid">
                    {column.links.map((link) => (
                      <li key={link.route}>
                        <a
                          href={navHref(link.route, review)}
                          className={
                            link.pillar
                              ? 'flex min-h-11 items-center gap-2.5 font-semibold text-ink hover:text-violet'
                              : link.route === 'R010'
                                ? 'inline-flex min-h-11 items-center gap-1.5 text-button-m text-violet hover:underline'
                                : 'flex min-h-11 items-center text-small text-ink hover:text-violet'
                          }
                        >
                          {link.pillar ? <PillarMark pillar={link.pillar} className="size-2" /> : null}
                          {link.label}
                          {link.route === 'R010' ? <Glyph name="arrow-up-right" className="size-4" /> : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          ) : null}
          <div className="grid content-start gap-3 text-small text-ink">
            <p id="dz-footer-contact" className="dz-mono-label">
              {shellContent.contactLabel}
            </p>
            {/* One block per line: inline spans would reach crawlers and text readers that ignore CSS as
                one run, which garbles the NAP. The opening hours follow as their own line, outside
                <address>, which is for contact details (facts §2). */}
            <address aria-labelledby="dz-footer-contact" className="grid gap-3 not-italic">
              <p className="flex gap-2.5">
                <Glyph name="globe" className="mt-0.5 size-4.5 shrink-0 text-ink-secondary" />
                {siteConfig.address}
              </p>
              <p className="flex gap-2.5">
                <Glyph name="mail" className="mt-0.5 size-4.5 shrink-0 text-ink-secondary" />
                <a href={`mailto:${siteConfig.email}`} className="text-ink underline-offset-4 hover:underline">
                  {siteConfig.email}
                </a>
              </p>
              {tel ? (
                <p className="flex gap-2.5">
                  <Glyph name="phone" className="mt-0.5 size-4.5 shrink-0 text-ink-secondary" />
                  <a href={tel} className="text-ink underline-offset-4 hover:underline">
                    {siteConfig.phone}
                  </a>
                </p>
              ) : null}
              {whatsapp && siteConfig.whatsapp ? (
                <p className="flex gap-2.5">
                  <Glyph name="whatsapp" className="mt-0.5 size-4.5 shrink-0 text-ink-secondary" />
                  <a href={whatsapp} className="text-ink underline-offset-4 hover:underline">
                    {shellContent.whatsappLinePrefix} {siteConfig.whatsapp}
                  </a>
                </p>
              ) : null}
            </address>
            <p className="flex gap-2.5">
              <Glyph name="calendar" className="mt-0.5 size-4.5 shrink-0 text-ink-secondary" />
              {siteConfig.openingHours.display}
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2">
          {siteConfig.social.map((profile) => (
            <li key={profile.key}>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={shellContent.socialLinkName(siteConfig.brandName, profile.platform)}
                className="dz-press inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-surface px-3 text-caption text-ink hover:border-line-strong"
              >
                {profile.platform}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption">
            <p className="text-ink-secondary">
              {shellContent.copyright} {siteConfig.legalName}
            </p>
            {legal.map((link) => (
              <a
                key={link.route}
                href={navHref(link.route, review)}
                className="inline-flex min-h-11 items-center text-ink hover:text-violet"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption">
            <div role="group" aria-label={shellContent.displayLabel} className="dz-display grid">
              <Switch kind="effects" label={shellContent.reduceEffects} note="dz-footer-effects-note" />
              <p id="dz-footer-effects-note" className="sr-only">
                {shellContent.deviceSettingNote}
              </p>
            </div>
            <button
              type="button"
              data-consent-settings=""
              className="dz-cookie-settings inline-flex min-h-11 items-center font-medium text-ink underline underline-offset-4"
            >
              {consentContent.footer.cookieSettings}
            </button>
            <a href="#top" className="inline-flex min-h-11 items-center gap-1 text-violet hover:underline">
              {shellContent.backToTop}
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>

        <p aria-hidden="true" data-fx-spotlight="" className="dz-wordmark">
          <span className="dz-wordmark-outline" data-word={word} />
          <span className="dz-wordmark-knock" data-word={word} />
          <span className="dz-wordmark-fill" data-word={word} />
        </p>
      </div>
    </footer>
  );
}
