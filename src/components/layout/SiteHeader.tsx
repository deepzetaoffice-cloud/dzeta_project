import { ClusterLayers } from '@/components/icons/Cluster';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { MobileSheet } from '@/components/layout/MobileSheet';
import { agentHref, CtaButton } from '@/components/ui/CtaButton';
import { Logo } from '@/components/ui/Logo';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref, routePath } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The header "Proof Bar" (docs/design/header.md; P2 plan, H). On desktop a floating glass pill: the
// logo, the nav (Services opens the mega menu) and the CTA; the speed chip and AI View take their
// places in P7. Below 1024 px a compact bar: the logo, the CTA and the menu button, which opens the
// mobile sheet.
// - Every nav item renders, but only live pages are linked (04 §1.4; plan 2026-10-08-header-full-menu):
//   an unshipped item is muted text. The review page links every item to a fragment of itself, and
//   marks the first as current so the marker can be seen.
// - The pill carries data-theme="dark": it stays navy in both themes (05 §2), and the header element
//   around it stays transparent, so only the pill covers the page.
// - header.ts condenses it on scroll, marks the current page and moves the marker; cta.ts hands the
//   gradient to the CTA (C42).

export type SiteHeaderProps = { review?: boolean };

export function SiteHeader({ review = false }: SiteHeaderProps) {
  const links = navigation.primary;
  return (
    <header
      className="pointer-events-none sticky top-0 z-(--dz-layer-header) mx-auto w-full max-w-page px-gutter pt-(--dz-header-inset)"
      data-fx-header=""
    >
      <div
        data-theme="dark"
        className="dz-header-pill pointer-events-auto relative isolate flex h-(--dz-header-height) items-center gap-2 rounded-pill bg-transparent ps-4 pe-2 max-xs:gap-1 max-xs:ps-3 max-xs:pe-1 sm:gap-4"
      >
        <span aria-hidden="true" className="dz-header-bg dz-glass dz-glass--live absolute inset-0 -z-10 rounded-pill" />
        {/* The mark stands in for the wordmark's D (the owner, 2026-10-01). At 360 px the bar holds the
            logo, the CTA and the menu button, so small screens show the mark alone; below 360 px the
            pill's padding and gaps tighten, so it still fits at 320 px. */}
        <a href={routePath('R001')} className="inline-flex min-h-11 shrink-0 items-center rounded-md">
          <span className="flex sm:hidden">
            <Logo variant="mark" label={siteConfig.brandName} className="h-9" />
          </span>
          <span className="hidden sm:flex">
            <Logo variant="inline" label={siteConfig.brandName} className="h-8" />
          </span>
        </a>
        <nav aria-label={shellContent.navLabel} className="relative hidden lg:block" data-fx-nav="">
          <ul className="flex gap-1">
            <li>
              <MegaMenu review={review} />
            </li>
            {links.map((link, index) => {
              const live = isShown(link.route, review);
              return (
                <li key={link.route}>
                  {live ? (
                    <a
                      href={navHref(link.route, review)}
                      aria-current={review && index === 0 ? 'page' : undefined}
                      className="inline-flex min-h-11 items-center rounded-pill px-2.5 text-small font-medium text-fg hover:text-fg-strong aria-[current=page]:text-fg-strong xl:px-3"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center rounded-pill px-2.5 text-small font-medium text-fg-muted xl:px-3">
                      {link.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <span className="dz-hop" aria-hidden="true">
            <ClusterLayers />
          </span>
        </nav>
        {/* The header CTA (decision 0024): the brand name on the button, which will launch the
            Deepzeta Agent bot in P7; until then agentHref() falls back to WhatsApp honestly. cta.ts
            still hands it the gradient (C42), so its data-cta attributes are unchanged. */}
        <CtaButton
          variant="header"
          href={agentHref()}
          label={siteConfig.brandName}
          className="ms-auto text-small lg:text-body"
        />
        <MobileSheet review={review} />
      </div>
    </header>
  );
}
