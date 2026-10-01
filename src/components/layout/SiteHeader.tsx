import Link from 'next/link';
import { ClusterLayers } from '@/components/icons/Cluster';
import { CtaButton } from '@/components/ui/CtaButton';
import { Logo } from '@/components/ui/Logo';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isLive, routePath, ROUTES, type RouteId } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The header "Proof Bar" (docs/design/header.md; P2 plan, H). On desktop a floating glass pill: the
// logo, the nav and the CTA (the speed chip and AI View take their places in P7). On mobile a compact
// bar: the logo and the CTA; the menu button and its sheet arrive with the mobile sheet (step 10).
// - Only live pages are linked (04 §1.4; plan A). The review page shows every item, each linking to
//   a fragment of itself, and marks the first as current so the marker can be seen.
// - The pill carries data-theme="dark": it stays navy in both themes (05 §2), and the header element
//   around it stays transparent, so only the pill covers the page.
// - header.ts condenses it on scroll, marks the current page and moves the marker; cta.ts hands the
//   gradient to the CTA (C42).

export type SiteHeaderProps = { review?: boolean };

// The CTA's target: the audit page once it ships, an email with a subject until then (Q1).
export function auditHref(): string {
  return isLive('R002')
    ? routePath('R002')
    : `mailto:${siteConfig.email}?subject=${encodeURIComponent(shellContent.ctaEmailSubject)}`;
}

export function SiteHeader({ review = false }: SiteHeaderProps) {
  const links = navigation.primary.filter((link) => review || isLive(link.route));
  const href = (route: RouteId) => (review ? `#shell-${route}` : ROUTES[route].path);
  return (
    <header
      className="pointer-events-none sticky top-0 z-(--dz-layer-header) mx-auto w-full max-w-page px-gutter pt-(--dz-header-inset)"
      data-fx-header=""
    >
      <div
        data-theme="dark"
        className="dz-header-pill pointer-events-auto relative isolate flex h-(--dz-header-height) items-center gap-4 rounded-pill bg-transparent ps-4 pe-2"
      >
        <span aria-hidden="true" className="dz-header-bg dz-glass dz-glass--live absolute inset-0 -z-10 rounded-pill" />
        {/* At 360 px the bar holds the logo, the CTA and the menu button, so small screens show the mark. */}
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center rounded-md">
          <span className="flex sm:hidden">
            <Logo variant="mark" label={siteConfig.brandName} className="h-9" />
          </span>
          <span className="hidden sm:flex">
            <Logo variant="lockup" label={siteConfig.brandName} className="h-9" />
          </span>
        </Link>
        {links.length > 0 ? (
          <nav aria-label={shellContent.navLabel} className="relative hidden lg:block" data-fx-nav="">
            <ul className="flex gap-1">
              {links.map((link, index) => (
                <li key={link.route}>
                  <Link
                    href={href(link.route)}
                    aria-current={review && index === 0 ? 'page' : undefined}
                    className="inline-flex min-h-11 items-center rounded-pill px-3 text-small font-semibold text-fg hover:text-fg-strong aria-[current=page]:text-fg-strong"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="dz-hop" aria-hidden="true">
              <ClusterLayers />
            </span>
          </nav>
        ) : null}
        <CtaButton
          variant="header"
          href={auditHref()}
          label={shellContent.cta}
          className="ms-auto text-small lg:text-body"
        />
      </div>
    </header>
  );
}
