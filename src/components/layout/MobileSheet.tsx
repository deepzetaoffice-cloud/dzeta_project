import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { DisplayControls } from '@/components/layout/DisplayControls';
import { megaColumns } from '@/components/layout/MegaMenu';
import { auditHref, CtaButton } from '@/components/ui/CtaButton';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isLive, ROUTES, type RouteId } from '@/lib/routes';

// The mobile sheet (docs/design/header.md; P2 plan, J), below 1024 px. A full-screen modal <dialog>:
// the page behind is inert, focus stays inside, and Esc or the close button closes it, after which
// focus returns to the menu button (lesson 4). The menu button opens it with invoker commands
// (`commandfor`, `command`), so no JavaScript is needed; header.ts covers browsers without them and
// closes it on a client navigation. React 19.3 has no props for those two attributes yet, so they're
// passed as plain attributes, which React writes as they are.
// Inside: the live nav items at heading size (type-word-stagger, whole items; the owner asked for them
// smaller than the spec's statement size, 2026-10-01), the pillar bars,
// the display controls (Q2) and the thumb zone with the CTA. The sticky CTA bar (part C) hides while
// it's open. The close button sits where the menu button was, so the menu icon seems to turn into it.

const SHEET = 'dz-sheet';

const opens = { commandfor: SHEET, command: 'show-modal' };
const closes = { commandfor: SHEET, command: 'close' };

export type MobileSheetProps = { review: boolean };

export function MobileSheet({ review }: MobileSheetProps) {
  const href = (route: RouteId) => (review ? `#shell-${route}` : ROUTES[route].path);
  const links = navigation.primary.filter((link) => review || isLive(link.route));
  const pillars = megaColumns(review).filter((column) => review || isLive(column.route));
  return (
    <>
      <button
        type="button"
        {...opens}
        aria-haspopup="dialog"
        aria-label={shellContent.menuOpen}
        data-fx-sheet-open=""
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-fg-strong lg:hidden"
      >
        <Icon name="menu" size={24} />
      </button>
      <dialog id={SHEET} aria-label={shellContent.menuOpen} className="dz-sheet lg:hidden">
        <div
          data-theme="dark"
          className="dz-sheet-panel dz-glass dz-glass--live dz-glass--muted flex min-h-full flex-col gap-8 px-gutter pt-(--dz-header-inset) pb-6"
        >
          <div className="flex h-(--dz-header-height) items-center justify-end pe-2">
            <button
              type="button"
              {...closes}
              aria-label={shellContent.menuClose}
              data-fx-sheet-close=""
              className="inline-flex size-11 items-center justify-center rounded-pill text-fg-strong"
            >
              <Icon name="close" size={24} className="dz-sheet-close" />
            </button>
          </div>
          {links.length > 0 ? (
            <nav aria-label={shellContent.navLabel}>
              <ul className="dz-sheet-items grid gap-2">
                {links.map((link) => (
                  <li key={link.route}>
                    <Link
                      href={href(link.route)}
                      className="dz-stagger inline-flex min-h-11 items-center text-h2 text-fg-strong"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {pillars.length > 0 ? (
            <ul className="grid gap-2">
              {pillars.map((column) => (
                <li key={column.pillar}>
                  <Link
                    href={href(column.route)}
                    className={`dz-pillar-bar dz-pillar--${column.pillar} flex min-h-11 items-center ps-4 font-semibold text-fg-strong`}
                  >
                    {column.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <DisplayControls place="sheet" />
          {/* The thumb zone: the CTA where a thumb reaches (WhatsApp joins it once the number is confirmed) */}
          <div className="mt-auto">
            <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} wide />
          </div>
        </div>
      </dialog>
    </>
  );
}
