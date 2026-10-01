import Link from 'next/link';
import { ClusterLayers } from '@/components/icons/Cluster';
import type { Pillar } from '@/components/icons/registry';
import { DisplayControls } from '@/components/layout/DisplayControls';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { navigation, type NavLink } from '@/content/en/navigation';
import { consentContent } from '@/content/en/legal/consent';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';
import { siteConfig, type SocialKey } from '@/lib/site-config';

// The footer "The Landing" (docs/design/footer.md; P2 plan, L), on every page, navy in both themes.
// - The finale: The Landing (the logo's four pixels assemble once the finale enters, scroll-assemble;
//   its rest state is the assembled cluster), the headline at the display size (C41) and the primary
//   CTA. cta.ts counts that CTA in the hand-off (C42). WhatsApp joins it once the number is confirmed.
// - The body: the link columns, one per pillar in its pixel colour (C6), then Company, Resources and
//   Legal; only live links render (04 §1.4), and a column with none isn't shown. The review page shows
//   every link as a placeholder fragment, as the header does (plan A3).
// - The company block from siteConfig (facts §1–§2); the phone shows once it's confirmed, never before.
// - The social links: Deepzeta's letter tiles in each platform's colour (C49), named "Deepzeta AI on
//   LinkedIn" and so on, in a new tab (facts §2.1 rules). The letters are decorative.
// - The display controls (Q2) and the legal line, whose year is written by hand (02 §1.5), with Cookie
//   settings for every visitor (P3 plan, E): TrackingRuntime opens the panel; hidden in place until it can.
// No heading but the finale's <h2>: column titles label their lists, so the footer adds nothing to a
// page's outline (plan L4). The language switch is mounted here in P11, with its behaviour.

// The tiles' letters (C49): each platform's best-known short form; Threads takes its own @, as TikTok has T.
const LETTERS = {
  linkedin: 'in',
  instagram: 'Ig',
  facebook: 'f',
  youtube: 'YT',
  tiktok: 'T',
  x: 'X',
  threads: '@',
  snapchat: 'S',
  pinterest: 'P',
} as const satisfies Record<SocialKey, string>;

type Column = { id: string; title: string; pillar?: Pillar; links: NavLink[] };

function footerColumns(review: boolean): Column[] {
  const pillars = navigation.columns.map((column) => ({
    id: column.pillar,
    title: column.name,
    pillar: column.pillar,
    links: [
      ...column.items.map((item) => ({ route: item.route, label: item.name })),
      { route: column.route, label: column.allLabel },
    ],
  }));
  const groups = navigation.footer.map((group) => ({
    id: group.title.toLowerCase(),
    title: group.title,
    links: [...group.links],
  }));
  return [...pillars, ...groups]
    .map((column) => ({ ...column, links: column.links.filter((link) => isShown(link.route, review)) }))
    .filter((column) => column.links.length > 0);
}

export type SiteFooterProps = { review?: boolean };

export function SiteFooter({ review = false }: SiteFooterProps) {
  const columns = footerColumns(review);
  return (
    <footer data-theme="dark" className="dz-footer">
      <div className="mx-auto max-w-page px-gutter pt-chapter pb-section">
        <span className="dz-landing block" data-fx-once="">
          <ClusterLayers />
        </span>
        <h2 className="mt-8 max-w-measure text-display">{shellContent.finaleHeading}</h2>
        <p className="mt-6 max-w-measure text-lead">{shellContent.finaleLine}</p>
        <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} className="mt-8" />
      </div>
      <div className="mx-auto grid max-w-page gap-12 px-gutter pb-12">
        {columns.length > 0 ? (
          <nav
            aria-label={shellContent.footerNavLabel}
            className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-hairline pt-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.id}>
                <p id={`dz-footer-${column.id}`} className="flex items-center gap-1 font-medium text-fg-strong">
                  {column.pillar ? (
                    <span className={`dz-mega-pixel dz-pillar--${column.pillar}`} aria-hidden="true" />
                  ) : null}
                  {column.title}
                </p>
                <ul aria-labelledby={`dz-footer-${column.id}`} className="mt-2">
                  {column.links.map((link) => (
                    <li key={link.route} className="flex min-h-11 items-center py-1">
                      {/* No prefetch: once the columns are live, some thirty links entering the view
                          together would each fetch their page data on a slow phone (P2 step 16). */}
                      <Link
                        href={navHref(link.route, review)}
                        prefetch={false}
                        className="dz-underline dz-target text-small text-fg hover:text-fg-strong"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}
        <div className="grid gap-10 border-t border-hairline pt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="grid gap-6">
            {/* One block per line: inline spans would reach crawlers and text readers that ignore CSS
                as one run (the brand name glued to the address), which garbles the NAP (P2 step 16).
                The opening hours follow as their own line, outside <address>, which is for contact
                details (P3 plan, A; facts §2). */}
            <div className="grid gap-1 text-small">
              <address className="grid gap-1 not-italic">
                <p className="font-bold text-fg-strong">{siteConfig.brandName}</p>
                <p>{siteConfig.address}</p>
                <p>
                  <a href={`mailto:${siteConfig.email}`} className="dz-underline dz-target text-link">
                    {siteConfig.email}
                  </a>
                </p>
                {siteConfig.phone ? (
                  <p>
                    <a href={`tel:${siteConfig.phone}`} className="dz-underline dz-target text-link">
                      {siteConfig.phone}
                    </a>
                  </p>
                ) : null}
              </address>
              <p>
                {shellContent.hoursLabel}: {siteConfig.openingHours.display}
              </p>
            </div>
            <ul className="flex flex-wrap gap-1">
              {siteConfig.social.map((profile) => (
                <li key={profile.key}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`dz-social dz-social--${profile.key} dz-press`}
                  >
                    {/* The name is real text, so text readers and crawlers get it too, not only an
                        aria-label; the tile's letters are a logotype and stay hidden (P2 step 16). */}
                    <span className="sr-only">
                      {shellContent.socialLinkName(siteConfig.brandName, profile.platform)}
                    </span>
                    <span className="dz-social-glow" aria-hidden="true" />
                    <span className="dz-social-tile" aria-hidden="true">
                      <span className="dz-social-sheen" />
                    </span>
                    {profile.key === 'tiktok' ? (
                      <>
                        <span className="dz-social-letter dz-social-split dz-social-split--cyan" aria-hidden="true">
                          {LETTERS.tiktok}
                        </span>
                        <span className="dz-social-letter dz-social-split dz-social-split--red" aria-hidden="true">
                          {LETTERS.tiktok}
                        </span>
                      </>
                    ) : null}
                    <span className="dz-social-letter" aria-hidden="true">
                      {LETTERS[profile.key]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-72">
            <DisplayControls place="footer" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <p className="text-small text-fg-muted">
            {shellContent.copyright} {siteConfig.legalName}
          </p>
          <button
            type="button"
            data-consent-settings=""
            className="dz-cookie-settings dz-underline dz-target text-small font-medium text-link"
          >
            {consentContent.footer.cookieSettings}
          </button>
        </div>
      </div>
    </footer>
  );
}
