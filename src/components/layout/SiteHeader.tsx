import { MEGA_ID, MegaMenu } from '@/components/layout/MegaMenu';
import { MobileSheet } from '@/components/layout/MobileSheet';
import { StatusIsland } from '@/components/layout/StatusIsland';
import { agentHref, CtaButton, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { Wordmark } from '@/components/ui/Wordmark';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { AGENT_LIVE } from '@/lib/agent';
import { isShown, navHref, routePath } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The header (docs/design/header.md; Figma Header set 36:285; decision 0033): a floating pill, fixed
// over the page. On a hero stage it sits inside the stage's top (the stage reserves the space,
// data-stage-hero); on a light page <main> reserves it (globals.css).
// - From 1,280 px (xl, 05 §4): the light wordmark, the nav, the status island (live only) and the
//   audit button. Below: the wordmark, the status island and the Menu button, which opens the mobile
//   menu; scrolled, a WhatsApp button joins them (C83).
// - header-condense (src/lib/fx/header.ts): past 80 px the pill narrows and shortens, by a clip on
//   its fill and transforms on its contents only, so nothing reflows; reading-progress runs along its
//   lower edge. The space it takes never changes.
// - Every nav item renders, but only live pages are linked (04 §1.4): an unshipped item is plain text.
//   The review page links every item to a fragment of itself. The current section is marked by
//   header.ts (aria-current): violet, with its Zeta pixel.
// - Services opens the mega menu (MegaMenu.tsx), a native popover.
// - The header button is "Book a free AI audit" with the audit's click contract (data-cta="header",
//   cta_id book_audit) and its honest WhatsApp fallback until the audit page ships (agentHref()).

export type SiteHeaderProps = { review?: boolean };

export function SiteHeader({ review = false }: SiteHeaderProps) {
  const agent = AGENT_LIVE || review;
  const whatsapp = whatsappHref();
  return (
    <header className="dz-header" data-fx-header="">
      <div className="dz-header-pill">
        <span aria-hidden="true" className="dz-header-bg">
          <span className="dz-header-fill">
            <span className="dz-progress" />
          </span>
        </span>
        <a href={routePath('R001')} className="dz-header-logo inline-flex min-h-11 shrink-0 items-center rounded-sm">
          <Wordmark label={siteConfig.brandName} className="h-[2.2rem] max-xl:h-[1.8rem]" />
        </a>
        <nav aria-label={shellContent.navLabel} className="dz-header-nav hidden min-w-0 flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-1">
            <li>
              <button
                type="button"
                popoverTarget={MEGA_ID}
                data-nav-path={review ? undefined : routePath('R010')}
                className="dz-nav-link"
              >
                {navigation.servicesLabel}
                <Glyph name="chevron-down" className="dz-mega-chevron size-4" />
              </button>
            </li>
            {navigation.primary.map((link) => (
              <li key={link.route}>
                {isShown(link.route, review) ? (
                  <a
                    href={navHref(link.route, review)}
                    data-nav-path={review ? undefined : routePath(link.route)}
                    className="dz-nav-link"
                  >
                    {link.label}
                  </a>
                ) : (
                  <span className="dz-nav-link text-ink-secondary">{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <span className="flex-1 xl:hidden" />
        {agent ? <StatusIsland variant="compact" className="dz-header-island" /> : null}
        <CtaButton
          variant="header"
          href={agentHref()}
          label={shellContent.cta}
          className="dz-header-cta max-xl:hidden"
        />
        {whatsapp ? (
          <a href={whatsapp} aria-label={shellContent.whatsappLabel} className="dz-header-wa dz-icon-button xl:hidden">
            <Glyph name="whatsapp" className="size-5.5" />
          </a>
        ) : null}
        <MobileSheet review={review} agent={agent} />
      </div>
      <MegaMenu review={review} />
    </header>
  );
}
