import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import type { Pillar, Tier3Name } from '@/components/icons/registry';
import { DisplayControls } from '@/components/layout/DisplayControls';
import { navigation } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { isLive, ROUTES, type RouteId } from '@/lib/routes';

// The mega menu, "Services" (docs/design/header.md; P2 plan, I). The button opens a popover, so Esc and
// a click outside close it and focus returns to the button, with no JavaScript; the platform exposes
// the expanded state, so no aria-expanded is written, and it's never role="menu" (06 §3). It opens on
// click only.
// - Four pillar columns, each a subgrid, so the heads (the Tier 3 icon beside the name and the promise
//   line), the service rows and the "All … services" links line up across the columns. A service row lights on hover and focus, with
//   a guide line in its pillar's colour (hover-guide-line) and its icon's story (hover-glow).
// - A strip below (the owner's rearrangement, 2026-10-01): the solutions on a line of their own; then
//   the rail (the review page's demo card, glass-liquid, production with P7's demos, and the rail links)
//   and, at the inline end, the two display switches side by side (Q2). The columns get the full width.
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

const visible = (review: boolean) => (route: RouteId) => review || isLive(route);

export function megaColumns(review: boolean) {
  const shown = visible(review);
  return navigation.columns
    .map((column) => ({
      ...column,
      items: column.items.filter((item) => shown(item.route) && !('mega' in item && item.mega === false)),
    }))
    .filter((column) => column.items.length > 0);
}

export type MegaMenuProps = { review: boolean };

export function MegaMenu({ review }: MegaMenuProps) {
  const shown = visible(review);
  const href = (route: RouteId) => (review ? `#shell-${route}` : ROUTES[route].path);
  const columns = megaColumns(review);
  if (columns.length === 0) return null;
  const solutions = navigation.solutions.items.filter((item) => shown(item.route));
  const rail = navigation.rail.filter((link) => shown(link.route));
  return (
    <>
      <button
        type="button"
        popoverTarget={PANEL}
        className="dz-mega-button inline-flex min-h-11 items-center gap-1 rounded-pill px-2.5 xl:px-3 text-small font-semibold text-fg hover:text-fg-strong"
      >
        {navigation.servicesLabel}
        <Icon name="chevron" size={16} className="dz-mega-chevron" />
      </button>
      <div id={PANEL} popover="auto" data-theme="dark" className="dz-mega dz-glass dz-glass--live dz-glass--muted">
        <div className="grid gap-x-6 gap-y-8 lg:grid-cols-4">
          {columns.map((column) => {
            const title = `${PANEL}-${column.pillar}`;
            return (
              // A host that isn't focusable itself: hovering the column, or focusing a link in it, replays
              // the head icon's story (05 §6).
              <div
                key={column.pillar}
                className={`dz-icon-host dz-pillar--${column.pillar} row-span-3 grid grid-rows-subgrid content-start gap-y-3`}
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
                        href={href(item.route)}
                        className="dz-menu-row dz-icon-host flex items-start gap-3 rounded-md px-3 py-1.5 text-small"
                      >
                        {'icon' in item && item.icon ? (
                          <Icon name={item.icon} size={24} />
                        ) : (
                          <span aria-hidden="true" className="dz-mega-pixel" />
                        )}
                        <span className="grid gap-0.5 leading-snug">
                          <span className="font-semibold text-fg-strong">{item.name}</span>
                          <span className="text-fg-muted">{item.outcome}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {shown(column.route) ? (
                  <Link
                    href={href(column.route)}
                    className="dz-underline dz-menu-all self-end justify-self-start text-small font-semibold text-balance text-link"
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
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {shown(navigation.solutions.route) ? (
                <Link href={href(navigation.solutions.route)} className="dz-underline font-bold text-fg-strong">
                  {navigation.solutions.label}
                </Link>
              ) : (
                <span className="font-bold text-fg-strong">{navigation.solutions.label}</span>
              )}
              {solutions.map((item) => (
                <Link key={item.route} href={href(item.route)} className="dz-underline text-fg">
                  {item.name}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {review ? (
                <a
                  href="#shell-demo"
                  className="dz-glass dz-glass--live dz-glass--liquid inline-flex min-h-11 items-center rounded-pill px-5 font-bold text-fg-strong"
                >
                  <span aria-hidden="true" className="dz-liquid-sheen" />
                  {shellContent.demoCard}
                </a>
              ) : null}
              {rail.map((link) => (
                <Link key={link.route} href={href(link.route)} className="dz-underline font-semibold text-fg-strong">
                  {link.label}
                </Link>
              ))}
            </div>
            <DisplayControls place="mega" layout="row" />
          </div>
        </div>
      </div>
    </>
  );
}
