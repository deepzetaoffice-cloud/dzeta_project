import { MobileSheet } from '@/components/layout/MobileSheet';
import { agentHref, CtaButton } from '@/components/ui/CtaButton';
import { Logo } from '@/components/ui/Logo';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref, routePath } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The header (docs/design/header.md; decision 0033). Phase C: the structure and every contract; Phase
// D adds the Figma pill on the stage, the mega menu, header-condense, reading-progress and the status
// island.
// - From 1,280 px (xl, 05 §4): the logo, the nav and the audit button. Below: the logo and the Menu
//   button, which opens the mobile menu (Phase D adds the scrolled WhatsApp button, C83).
// - Every nav item renders, but only live pages are linked (04 §1.4): an unshipped item is plain text.
//   The review page links every item to a fragment of itself.
// - The header button is "Book a free AI audit" with the audit's click contract (data-cta="header",
//   cta_id book_audit) and its honest WhatsApp fallback until the audit page ships (agentHref()).
// - The logo: the locked file is dark-only (C78), so it sits on an ink plate until the owner's
//   white-background variant joins the repo.

export type SiteHeaderProps = { review?: boolean };

export function SiteHeader({ review = false }: SiteHeaderProps) {
  const links = [{ route: 'R010' as const, label: navigation.servicesLabel }, ...navigation.primary];
  return (
    <header className="sticky top-0 z-(--dz-layer-header) px-stage-inset pt-stage-inset" data-fx-header="">
      <div className="mx-auto flex h-header max-w-page items-center gap-3 rounded-full bg-glass-header ps-3 pe-2 shadow-1 sm:gap-4 xl:ps-4">
        <a href={routePath('R001')} className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-inverse px-3">
          <Logo variant="inline" label={siteConfig.brandName} className="h-6 sm:h-7" />
        </a>
        <nav aria-label={shellContent.navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.route}>
                {isShown(link.route, review) ? (
                  <a
                    href={navHref(link.route, review)}
                    className="inline-flex min-h-11 items-center rounded-full px-3 text-nav text-ink hover:text-violet"
                  >
                    {link.label}
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center px-3 text-nav text-ink-secondary">
                    {link.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <CtaButton variant="header" href={agentHref()} label={shellContent.cta} className="ms-auto max-xl:hidden" />
        <MobileSheet review={review} />
      </div>
    </header>
  );
}
