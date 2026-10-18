import { auditHref, CtaButton, telHref, whatsappHref } from '@/components/ui/CtaButton';
import { Glyph } from '@/components/ui/Glyph';
import { PillarMark } from '@/components/ui/PillarMark';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';
import { siteConfig } from '@/lib/site-config';

// The mobile menu (docs/design/header.md; Figma 38:583), below 1,280 px. A native full-screen modal
// <dialog class="dz-sheet"> (C83): tracking.spec.ts opens it with the button named "Menu" and clicks
// its CTA. The page behind is inert, focus stays inside, and Esc or Close closes it, after which focus
// returns to the Menu button. The Menu button opens it with invoker commands (`commandfor`,
// `command`), so no JavaScript is needed; src/lib/fx/sheet.ts covers browsers without them, and closes
// it when a link inside is followed or the window grows to the desktop header. React 19.3 has no
// props for those two attributes yet, so they're passed as plain attributes.
// Phase C: the structure; Phase D adds the Figma look, the pillar accordion and mobile-menu-sheet.

const SHEET = 'dz-sheet';

const opens = { commandfor: SHEET, command: 'show-modal' };
const closes = { commandfor: SHEET, command: 'close' };

export type MobileSheetProps = { review: boolean };

export function MobileSheet({ review }: MobileSheetProps) {
  const links = [{ route: 'R010' as const, label: navigation.servicesLabel }, ...navigation.primary];
  const whatsapp = whatsappHref();
  const tel = telHref();
  return (
    <>
      <button
        type="button"
        {...opens}
        aria-haspopup="dialog"
        aria-label={shellContent.menuOpen}
        data-fx-sheet-open=""
        className="dz-press inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink max-xl:ms-auto xl:hidden"
      >
        <Glyph name="menu" />
      </button>
      <dialog id={SHEET} aria-label={shellContent.menuOpen} className="dz-sheet">
        <div className="dz-sheet-panel flex flex-col gap-8 px-gutter pt-stage-inset">
          <div className="flex h-header items-center justify-end">
            <button
              type="button"
              {...closes}
              aria-label={shellContent.menuClose}
              data-fx-sheet-close=""
              className="dz-press inline-flex size-11 items-center justify-center rounded-full text-ink"
            >
              <Glyph name="close" />
            </button>
          </div>
          <nav aria-label={shellContent.navLabel} className="grid gap-8">
            <ul className="grid gap-1">
              {links.map((link) => (
                <li key={link.route}>
                  {isShown(link.route, review) ? (
                    <a
                      href={navHref(link.route, review)}
                      className="inline-flex min-h-11 items-center text-h3 text-ink"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-h3 text-ink-secondary">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <ul className="grid gap-1">
              {navigation.columns.map((column) => (
                <li key={column.pillar} className="flex min-h-11 items-center gap-3">
                  <PillarMark pillar={column.pillar} />
                  {isShown(column.route, review) ? (
                    <a href={navHref(column.route, review)} className="font-semibold text-ink">
                      {column.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink-secondary">{column.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-small text-ink-secondary">
            {shellContent.hoursLabel}: {siteConfig.openingHours.display}
          </p>
          {/* The pinned CTA bar (Figma): the audit, then WhatsApp and Call once their facts are confirmed */}
          <div className="mt-auto grid gap-3">
            <CtaButton variant="primary" href={auditHref()} label={shellContent.cta} wide />
            <div className="flex gap-3">
              {whatsapp ? (
                <a
                  href={whatsapp}
                  className="dz-press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong text-button-m text-ink"
                >
                  <Glyph name="whatsapp" className="size-5" />
                  {shellContent.whatsappLabel}
                </a>
              ) : null}
              {tel ? (
                <a
                  href={tel}
                  className="dz-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-button-m text-ink"
                >
                  <Glyph name="phone" className="size-5" />
                  {shellContent.callLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
