import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import type { Pillar, Tier3Name } from '@/components/icons/registry';
import { DisplayControls } from '@/components/layout/DisplayControls';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isShown, navHref } from '@/lib/routes';

// The mega menu, "Services" (docs/design/header.md; P2 plan, I). The button opens a popover, so Esc and
// a click outside close it and focus returns to the button, with no JavaScript; the platform exposes
// the expanded state, so no aria-expanded is written, and it's never role="menu" (06 §3). It opens on
// click only.
// - Four pillar columns, each a subgrid, so the heads (the Tier 3 icon beside the name and the promise
//   line), the service rows and the "All … services" links line up across the columns. A service row
//   lights on hover and focus, with a guide line in its pillar's colour (hover-guide-line) and its own
//   icon's story (hover-glow). The column hosts only its Tier 3 head (dz-t3-host), so one row never
//   plays the other rows' icons.
// - A strip below (the owner's rearrangement, 2026-10-01): the solutions on a line of their own; then
//   the rail (the review page's demo card, glass-liquid, production with P7's demos, and the rail links)
//   and, at the inline end, the two display switches side by side (Q2). The columns get the full width.
// The strip's links and "All … services" are one line of small text, so each gets a 44 px hit area
// (dz-target, 05 §7); wrapped lines keep a gap wide enough that two hit areas never overlap.
// Only live pages are linked: a column with no live item is left out, and with no column the button
// isn't rendered (plan I4). Items marked `mega: false` stay out of the menu (the owner, 2026-10-01).
// The review page shows everything, each link a fragment of itself.

const PANEL = 'dz-mega';

const HEAD: Record<Pillar, Tier3Name> = {
  ai: 'ai-automation',
  web: 'websites',
  software: 'software',
  ranking: 'growth-ranking',
};

export function megaColumns(review: boolean) {
  return navigation.columns
    .map((column) => ({
      ...column,
      items: column.items.filter((item) => isShown(item.route, review) && !('mega' in item && item.mega === false)),
    }))
    .filter((column) => column.items.length > 0);
}

export type MegaMenuProps = { review: boolean };

export function MegaMenu({ review }: MegaMenuProps) {
  const columns = megaColumns(review);
  if (columns.length === 0) return null;
  const solutions = navigation.solutions.items.filter((item) => isShown(item.route, review));
  const rail = navigation.rail.filter((link) => isShown(link.route, review));
  return (
    <>
      <button
        type="button"
        popoverTarget={PANEL}
        className="dz-mega-button inline-flex min-h-11 items-center gap-1 rounded-pill px-2.5 xl:px-3 text-small font-medium text-fg hover:text-fg-strong"
      >
        {navigation.servicesLabel}
        <Icon name="chevron" size={16} className="dz-mega-chevron" />
      </button>
      <div id={PANEL} popover="auto" data-theme="dark" className="dz-mega dz-glass dz-glass--live dz-glass--muted">
        <div className="grid gap-x-6 gap-y-8 lg:grid-cols-4">
          {columns.map((column) => {
            const title = `${PANEL}-${column.pillar}`;
            return (
              // A host for the Tier 3 head only, not focusable itself: hovering the column, or focusing a
              // link in it, replays the head icon's story (05 §6).
              <div
                key={column.pillar}
                className={`dz-t3-host dz-pillar--${column.pillar} row-span-3 grid grid-rows-subgrid content-start gap-y-3`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={HEAD[column.pillar]} size={64} />
                  <div className="grid gap-1 pt-1">
                    <p id={title} className="font-bold text-fg-strong">
                      {column.name}
                    </p>
                    <p className="text-small text-fg-muted">{column.promise}</p>
                  </div>
                </div>
                <ul aria-labelledby={title} className="-mx-3 grid content-start gap-0.5">
                  {column.items.map((item) => (
                    <li key={item.route}>
                      <Link
                        href={navHref(item.route, review)}
                        className="dz-menu-row dz-icon-host flex items-start gap-3 rounded-md px-3 py-1.5 text-small"
                      >
                        {'icon' in item && item.icon ? (
                          <Icon name={item.icon} size={24} />
                        ) : (
                          <span aria-hidden="true" className="dz-mega-pixel" />
                        )}
                        <span className="grid gap-0.5 leading-snug">
                          <span className="font-medium text-fg-strong">{item.name}</span>
                          <span className="text-fg-muted">{item.outcome}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {isShown(column.route, review) ? (
                  <Link
                    href={navHref(column.route, review)}
                    className="dz-underline dz-target dz-menu-all self-end justify-self-start text-small font-medium text-balance text-link"
                  >
                    {column.allLabel}
                    <Icon name="arrow" size={16} className="dz-menu-arrow ms-1.5 align-middle" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid gap-3 border-t border-hairline pt-5 text-small">
          {solutions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-6">
              {isShown(navigation.solutions.route, review) ? (
                <Link
                  href={navHref(navigation.solutions.route, review)}
                  className="dz-underline dz-target font-bold text-fg-strong"
                >
                  {navigation.solutions.label}
                </Link>
              ) : (
                <span className="font-bold text-fg-strong">{navigation.solutions.label}</span>
              )}
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-6">
                {solutions.map((item) => (
                  <li key={item.route}>
                    <Link href={navHref(item.route, review)} className="dz-underline dz-target text-fg">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
              {review ? (
                <a
                  href="#shell-demo"
                  className="dz-glass dz-glass--live dz-glass--liquid inline-flex min-h-11 items-center rounded-pill px-5 font-bold text-fg-strong"
                >
                  <span aria-hidden="true" className="dz-liquid-sheen" />
                  {shellContent.demoCard}
                </a>
              ) : null}
              {rail.length > 0 ? (
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-6">
                  {rail.map((link) => (
                    <li key={link.route}>
                      <Link
                        href={navHref(link.route, review)}
                        className="dz-underline dz-target font-medium text-fg-strong"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <DisplayControls place="mega" layout="row" />
          </div>
        </div>
      </div>
    </>
  );
}
