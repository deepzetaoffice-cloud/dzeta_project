import { auditHref, CtaButton, telHref, whatsappHref } from '@/components/ui/CtaButton';
import { Logo } from '@/components/ui/Logo';
import { Switch } from '@/components/ui/Switch';
import { navigation, type NavLink } from '@/content/en/navigation';
import { consentContent } from '@/content/en/legal/consent';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The footer (docs/design/footer.md; Figma 39:1070). Phase C: the structure and every contract; Phase
// D adds the Figma look, beams, the giant wordmark and wordmark-spotlight.
// - The audit panel (the finale): the <h2>, its line and the audit CTA (`footer [data-cta="primary"]`,
//   cta_location finale), then WhatsApp and Call once their facts are confirmed.
// - The sections, in a <nav> named "Footer": Services (the hub and the pillar pages), then Company,
//   Resources and Legal. Only live links render (04 §1.4), and a section with none isn't shown. The
//   review page shows every link as a placeholder fragment, as the header does.
// - The contact block from siteConfig (facts §1–§2) in an <address>, with the opening hours after it.
// - The social links, named "Deepzeta AI on LinkedIn" and so on, in a new tab (facts §2.1).
// - The legal line: the copyright and the legal name, the Reduce effects switch, and Cookie settings
//   for every visitor (09 §2.7): TrackingRuntime opens the panel; hidden in place until it can.
// - No newsletter yet: it ships with its service and its promise line (C84).

type Column = { id: string; title: string; links: NavLink[] };

function footerColumns(review: boolean): Column[] {
  const services = {
    id: 'services',
    title: navigation.servicesLabel,
    links: [
      ...navigation.columns.map((column) => ({ route: column.route, label: column.name })),
      { route: 'R010' as const, label: navigation.hubLabel },
    ],
  };
  const solutions = {
    id: 'solutions',
    title: navigation.solutions.label,
    links: navigation.solutions.items.map((item) => ({ route: item.route, label: item.name })),
  };
  const groups = navigation.footer.map((group) => ({
    id: group.title.toLowerCase(),
    title: group.title,
    links: [...group.links],
  }));
  return [services, solutions, ...groups]
    .map((column) => ({ ...column, links: column.links.filter((link) => isShown(link.route, review)) }))
    .filter((column) => column.links.length > 0);
}

export type SiteFooterProps = { review?: boolean };

export function SiteFooter({ review = false }: SiteFooterProps) {
  const columns = footerColumns(review);
  const whatsapp = whatsappHref();
  const tel = telHref();
  return (
    <footer className="px-stage-inset pb-stage-inset">
      <div className="mx-auto max-w-page rounded-stage bg-(image:--dz-grad-stage) px-gutter py-section text-on-color">
        <h2 className="max-w-measure text-h2 text-on-color">{shellContent.finaleHeading}</h2>
        <p className="mt-4 max-w-measure text-lead">{shellContent.finaleLine}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} />
          {whatsapp ? (
            <a
              href={whatsapp}
              className="dz-press inline-flex min-h-14 items-center rounded-full border border-line-on-color px-6 text-button-l"
            >
              {shellContent.whatsappLabel}
            </a>
          ) : null}
          {tel ? (
            <a
              href={tel}
              className="dz-press inline-flex min-h-14 items-center rounded-full border border-line-on-color px-6 text-button-l"
            >
              {shellContent.callLabel} {siteConfig.phone}
            </a>
          ) : null}
        </div>
      </div>
      <div className="mx-auto grid max-w-page gap-12 px-gutter pt-16 pb-10">
        <div className="grid gap-4">
          <span className="inline-flex w-fit rounded-full bg-inverse px-4 py-2">
            <Logo variant="inline" label={siteConfig.brandName} className="h-7" />
          </span>
          <p className="max-w-measure text-ink-secondary">{siteConfig.positioningLine}</p>
        </div>
        {columns.length > 0 ? (
          <nav
            aria-label={shellContent.footerNavLabel}
            className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-5"
          >
            {columns.map((column) => (
              <div key={column.id}>
                <p id={`dz-footer-${column.id}`} className="font-semibold text-ink">
                  {column.title}
                </p>
                <ul aria-labelledby={`dz-footer-${column.id}`} className="mt-2">
                  {column.links.map((link) => (
                    <li key={link.route} className="flex min-h-11 items-center">
                      <a href={navHref(link.route, review)} className="text-small text-ink-secondary hover:text-ink">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}
        <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          {/* One block per line: inline spans would reach crawlers and text readers that ignore CSS as
              one run, which garbles the NAP. The opening hours follow as their own line, outside
              <address>, which is for contact details (facts §2). */}
          <div className="grid gap-1 text-small">
            <address className="grid gap-1 not-italic">
              <p className="font-semibold text-ink">{siteConfig.brandName}</p>
              <p>{siteConfig.address}</p>
              <p>
                <a href={`mailto:${siteConfig.email}`} className="text-link underline underline-offset-4">
                  {siteConfig.email}
                </a>
              </p>
              {tel ? (
                <p>
                  <a href={tel} className="inline-flex min-h-11 items-center text-link underline underline-offset-4">
                    {siteConfig.phone}
                  </a>
                </p>
              ) : null}
            </address>
            <p>
              {shellContent.hoursLabel}: {siteConfig.openingHours.display}
            </p>
          </div>
          <ul className="flex flex-wrap content-start gap-x-5 gap-y-1">
            {siteConfig.social.map((profile) => (
              <li key={profile.key}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={shellContent.socialLinkName(siteConfig.brandName, profile.platform)}
                  className="inline-flex min-h-11 items-center text-small text-ink-secondary hover:text-ink"
                >
                  {profile.platform} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-6">
          <p className="text-small text-ink-secondary">
            {shellContent.copyright} {siteConfig.legalName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <div role="group" aria-label={shellContent.displayLabel} className="dz-display grid">
              <Switch kind="effects" label={shellContent.reduceEffects} note="dz-footer-effects-note" />
              <p id="dz-footer-effects-note" className="sr-only">
                {shellContent.deviceSettingNote}
              </p>
            </div>
            <button
              type="button"
              data-consent-settings=""
              className="dz-cookie-settings inline-flex min-h-11 items-center text-small font-medium text-link underline underline-offset-4"
            >
              {consentContent.footer.cookieSettings}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
