import { StatusIsland } from '@/components/layout/StatusIsland';
import { auditHref, CtaButton, telHref, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { PillarMark } from '@/components/ui/PillarMark';
import { Wordmark } from '@/components/ui/Wordmark';
import { navigation, type MenuColumn } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The mobile menu (docs/design/header.md; Figma 38:583), below 1,280 px. A native full-screen modal
// <dialog class="dz-sheet"> (C83): tracking.spec.ts opens it with the button named "Menu" and clicks
// its CTA. The page behind is inert and doesn't scroll, focus stays inside, and Esc or Close closes it,
// after which focus returns to the Menu button. The Menu button opens it with invoker commands
// (`commandfor`, `command`), so no JavaScript is needed; src/lib/fx/sheet.ts covers browsers without
// them, and closes it when a link inside is followed or the window grows to the desktop header. React
// 19.3 has no props for those two attributes yet, so they're passed as plain attributes.
// - On the stage gradient, top to bottom: the wordmark and Close, the status island (live only), the
//   four pillars as an exclusive native accordion (`accordion`), "All services", the nav items,
//   Solutions, the side links and the opening hours. Only live pages are links (04 §1.4).
// - The CTA bar stays pinned at the bottom: the audit, then WhatsApp and Call once their facts are
//   confirmed. Opening plays mobile-menu-sheet (globals.css).
// - C85: the Solutions chips are small white labels over the stage, so they keep their border and drop
//   the glass fill.

const SHEET = 'dz-sheet';

// A pillar's menu services, as in the mega menu (the rest stay on the hub and the pillar pages)
const menuItems = (column: MenuColumn) => column.items.filter((item) => item.mega !== false);

const opens = { commandfor: SHEET, command: 'show-modal' };
const closes = { commandfor: SHEET, command: 'close' };

export type MobileSheetProps = { review: boolean; agent: boolean };

export function MobileSheet({ review, agent }: MobileSheetProps) {
  const whatsapp = whatsappHref();
  const tel = telHref();
  const rest = navigation.rail.filter((link) => !navigation.primary.some((item) => item.route === link.route));
  return (
    <>
      <button
        type="button"
        {...opens}
        aria-haspopup="dialog"
        aria-label={shellContent.menuOpen}
        data-fx-sheet-open=""
        className="dz-header-menu dz-icon-button dz-icon-button-primary xl:hidden"
      >
        <Glyph name="menu" className="size-5.5" />
      </button>
      <dialog id={SHEET} aria-label={shellContent.menuOpen} className="dz-sheet">
        <div className="dz-sheet-panel">
          <div className="dz-sheet-scroll grid content-start gap-5 px-4 pt-2 pb-8">
            <div className="flex h-14 items-center gap-2 rounded-full bg-glass-header ps-4 pe-1.5">
              <Wordmark className="h-[1.8rem]" />
              <span className="flex-1" />
              <button
                type="button"
                {...closes}
                aria-label={shellContent.menuClose}
                data-fx-sheet-close=""
                className="dz-icon-button bg-action-inverse text-on-color"
              >
                <Glyph name="close" className="size-5.5" />
              </button>
            </div>
            {agent ? <StatusIsland variant="expanded" className="w-full rounded-lg" /> : null}
            <nav aria-label={shellContent.navLabel} className="grid gap-5">
              <p className="font-mono text-label text-on-color uppercase">{navigation.servicesLabel}</p>
              <div className="grid gap-3">
                {navigation.columns.map((column, index) => (
                  <details
                    key={column.pillar}
                    name="dz-sheet-pillars"
                    open={index === 0}
                    className="dz-accordion group"
                  >
                    <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 text-h4 [&::-webkit-details-marker]:hidden">
                      <PillarMark pillar={column.pillar} shape="pixels" className="h-7" />
                      <span className="flex-1">{column.name}</span>
                      <Glyph name="chevron-down" className="size-5 group-open:rotate-180" />
                    </summary>
                    <ul className="grid gap-3 pt-3">
                      {menuItems(column).map((item) => (
                        <li key={item.route} className="flex items-center gap-2.5">
                          <PillarMark pillar={column.pillar} className="size-1.5" />
                          {isShown(item.route, review) ? (
                            <a href={navHref(item.route, review)} className="flex-1 font-semibold text-ink">
                              {item.name}
                            </a>
                          ) : (
                            <span className="flex-1 font-semibold text-ink-secondary">{item.name}</span>
                          )}
                        </li>
                      ))}
                      {isShown(column.route, review) ? (
                        <li>
                          <a
                            href={navHref(column.route, review)}
                            className="inline-flex min-h-11 items-center gap-1.5 text-button-m text-violet"
                          >
                            {column.allLabel}
                            <Glyph name="arrow-up-right" className="size-4" />
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </details>
                ))}
              </div>
              <a
                href={navHref('R010', review)}
                className="inline-flex min-h-11 w-fit items-center gap-1.5 text-button-l text-on-color"
              >
                {navigation.hubLabel}
                <Glyph name="arrow-up-right" className="size-4.5" />
              </a>
              <ul className="grid">
                {navigation.primary.map((link) => (
                  <li key={link.route} className="border-b border-line-on-color">
                    {isShown(link.route, review) ? (
                      <a
                        href={navHref(link.route, review)}
                        className="flex min-h-14 items-center justify-between gap-3 py-3.5 dz-sheet-link text-on-color"
                      >
                        {link.label}
                        <Glyph name="arrow-up-right" className="size-5" />
                      </a>
                    ) : (
                      <span className="flex min-h-14 items-center py-3.5 dz-sheet-link text-on-color">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-label text-on-color uppercase">{navigation.solutions.label}</p>
              <ul className="flex flex-wrap gap-2">
                {navigation.solutions.items.map((item) => (
                  <li key={item.route}>
                    {isShown(item.route, review) ? (
                      <a
                        href={navHref(item.route, review)}
                        className="inline-flex min-h-11 items-center rounded-full border border-line-on-color px-3 text-caption text-on-color"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-9 items-center rounded-full border border-line-on-color px-3 text-caption text-on-color">
                        {item.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-x-4">
                {rest.map((link) => (
                  <li key={link.route}>
                    {isShown(link.route, review) ? (
                      <a
                        href={navHref(link.route, review)}
                        className="inline-flex min-h-11 items-center text-nav text-on-color"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center text-nav text-on-color">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-caption text-on-color">{siteConfig.openingHours.display}</p>
          </div>
          {/* The pinned CTA bar (Figma 38:740): the audit, then WhatsApp and Call once their facts are confirmed */}
          <div className="dz-sheet-bar grid gap-2.5 border-t border-line bg-surface px-4 pt-4">
            <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} wide />
            {whatsapp || tel ? (
              <div className="flex gap-2.5">
                {whatsapp ? (
                  <a href={whatsapp} className="dz-press dz-button-secondary flex-1">
                    {shellContent.whatsappLabel}
                    <Glyph name="whatsapp" className="size-4.5" />
                  </a>
                ) : null}
                {tel ? (
                  <a href={tel} className="dz-press dz-button-secondary flex-1">
                    {shellContent.callLabel}
                    <Glyph name="phone" className="size-4.5" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
