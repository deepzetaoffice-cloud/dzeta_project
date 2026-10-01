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
// click only. The panel holds the four pillar columns (Tier 3 heads, catalogue names, outcomes), the
// solutions row, and the rail with the display controls (Q2).
// Only live pages are linked: a column with no live item is left out, and with no column the button
// isn't rendered (plan I4). The review page shows everything, each link a fragment of itself, and the
// rail's demo card (glass-liquid), which comes to production with P7's demos.

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
    .map((column) => ({ ...column, items: column.items.filter((item) => shown(item.route)) }))
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
        className="dz-mega-button inline-flex min-h-11 items-center gap-1 rounded-pill px-3 text-small font-semibold text-fg hover:text-fg-strong"
      >
        {navigation.servicesLabel}
        <Icon name="chevron" size={16} className="dz-mega-chevron" />
      </button>
      <div id={PANEL} popover="auto" data-theme="dark" className="dz-mega dz-glass dz-glass--live dz-glass--muted">
        <div className="grid gap-8 lg:grid-cols-5">
          {columns.map((column) => {
            const title = `${PANEL}-${column.pillar}`;
            return (
              // A host that isn't focusable itself: hovering the column, or focusing a link in it, replays
              // the head icon's story (05 §6).
              <div key={column.pillar} className="dz-icon-host grid content-start gap-3">
                <Icon name={HEAD[column.pillar]} size={64} />
                <p id={title} className="font-bold text-fg-strong">
                  {column.name}
                </p>
                <p className="text-small text-fg-muted">{column.promise}</p>
                <ul aria-labelledby={title} className="grid gap-1">
                  {column.items.map((item) => (
                    <li key={item.route}>
                      <Link
                        href={href(item.route)}
                        className="dz-icon-host flex gap-3 rounded-md py-1.5 text-small hover:text-fg-strong"
                      >
                        {'icon' in item && item.icon ? (
                          <Icon name={item.icon} size={24} />
                        ) : (
                          <span aria-hidden="true" className={`dz-mega-pixel dz-mega-pixel--${column.pillar}`} />
                        )}
                        <span>
                          <span className="block font-semibold text-fg-strong">{item.name}</span>
                          <span className="block text-fg-muted">{item.outcome}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {shown(column.route) ? (
                  <Link href={href(column.route)} className="dz-underline text-small font-semibold text-link">
                    {column.allLabel}
                  </Link>
                ) : null}
              </div>
            );
          })}
          <div className="grid content-start gap-4">
            {review ? (
              <a
                href="#shell-demo"
                className="dz-glass dz-glass--live dz-glass--liquid rounded-lg p-4 font-bold text-fg-strong"
              >
                <span aria-hidden="true" className="dz-liquid-sheen" />
                {shellContent.demoCard}
              </a>
            ) : null}
            {rail.length > 0 ? (
              <ul className="grid gap-2">
                {rail.map((link) => (
                  <li key={link.route}>
                    <Link href={href(link.route)} className="dz-underline text-small font-semibold text-fg-strong">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <DisplayControls place="mega" />
          </div>
        </div>
        {solutions.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-4 text-small">
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
      </div>
    </>
  );
}
