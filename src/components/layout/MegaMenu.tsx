import type { ReactNode } from 'react';
import type { Pillar } from '@/components/icons/registry';
import { Glyph } from '@/components/ui/Glyph';
import { Photo } from '@/components/ui/Photo';
import { PillarMark } from '@/components/ui/PillarMark';
import { navigation, type MenuColumn } from '@/content/en/navigation';
import { shellContent } from '@/content/en/shell';
import { photo, PILLAR_DOOR } from '@/lib/media/photos';
import { isShown, navHref, type RouteId } from '@/lib/routes';

// The mega menu (header.md; Figma 37:862, open over Home 37:863), from 1,280 px. A native popover
// (`popover="auto"`) that the Services button opens on click or Enter, never on hover-intent alone:
// Esc, a click outside or a followed link close it, and focus returns to Services, all without
// JavaScript. It's a disclosure of links, never role="menu" (06 §3). Its links are in the page's HTML,
// so crawlers and no-JS visitors reach every service (0026).
// - Four pillar columns in the catalogue order: the Pillar pixels mark, the name, the promise, the
//   menu services with their outcomes (navigation.ts, byte for byte) and "All {pillar} services".
// - The preview rail: the hovered or focused pillar's door photo (P01–P04) and service
//   (mega-preview-swap, src/lib/fx/mega.ts sets data-pillar and the two lines), then the Solutions,
//   the side links and, on the review page, "Try a live demo".
// - Every item renders; it's a link only while its page is live (04 §1.4), as in the header.

export const MEGA_ID = 'dz-mega';

const WASH: Record<Pillar, string> = {
  ai: 'dz-mega-col-ai',
  web: 'dz-mega-col-web',
  software: 'dz-mega-col-software',
  ranking: 'dz-mega-col-ranking',
};

const BAR: Record<Pillar, string> = {
  ai: 'bg-(image:--dz-grad-pillar-ai)',
  web: 'bg-(image:--dz-grad-pillar-websites)',
  software: 'bg-(image:--dz-grad-pillar-software)',
  ranking: 'bg-(image:--dz-grad-pillar-growth)',
};

// A link while its page is live (or on the review page), else the same text, muted
function MaybeLink({
  route,
  review,
  className,
  muted,
  children,
}: {
  route: RouteId;
  review: boolean;
  className: string;
  muted: string;
  children: ReactNode;
}) {
  return isShown(route, review) ? (
    <a href={navHref(route, review)} className={className}>
      {children}
    </a>
  ) : (
    <span className={`${className} ${muted}`}>{children}</span>
  );
}

function Column({ column, review }: { column: MenuColumn; review: boolean }) {
  const items = column.items.filter((item) => item.mega !== false);
  return (
    <div
      data-mega-col={column.pillar}
      className={`dz-mega-col grid min-w-0 flex-1 content-start gap-3.5 rounded-lg p-4 ${WASH[column.pillar]}`}
    >
      <div className="grid gap-2">
        <p className="dz-mega-title flex items-center gap-2.5">
          <PillarMark pillar={column.pillar} shape="pixels" className="h-7" />
          <MaybeLink route={column.route} review={review} className="text-ink" muted="">
            {column.name}
          </MaybeLink>
        </p>
        <p className="max-w-[12.5rem] text-small text-ink-secondary">{column.promise}</p>
        <span aria-hidden="true" className={`h-0.75 w-full rounded-xs ${BAR[column.pillar]}`} />
      </div>
      <ul className="grid gap-3.5">
        {items.map((item) => (
          <li key={item.route} data-mega-item="" data-name={item.name} data-outcome={item.outcome}>
            <MaybeLink
              route={item.route}
              review={review}
              className="dz-mega-item grid gap-0.5 rounded-sm"
              muted="dz-mega-item-muted"
            >
              <span className="text-[length:var(--dz-font-size-nav)] leading-(--dz-leading-body) font-semibold">
                {item.name}
              </span>
              <span className="text-caption text-ink-tertiary">{item.outcome}</span>
            </MaybeLink>
          </li>
        ))}
      </ul>
      <MaybeLink
        route={column.route}
        review={review}
        className="dz-mega-all inline-flex w-fit items-center gap-1.5 text-caption"
        muted="text-ink-secondary"
      >
        {column.allLabel}
        <Glyph name="arrow-up-right" className="size-3.5" />
      </MaybeLink>
    </div>
  );
}

export function MegaMenu({ review }: { review: boolean }) {
  const first = navigation.columns[0];
  const firstItem = first.items[0];
  return (
    <div id={MEGA_ID} popover="auto" className="dz-mega" data-pillar={first.pillar}>
      <div className="flex items-center justify-between gap-6">
        <p className="dz-mono-label">{shellContent.megaLabel}</p>
        <a
          href={navHref('R010', review)}
          className="inline-flex min-h-11 items-center gap-1.5 text-button-m text-violet hover:underline"
        >
          {navigation.hubLabel}
          <Glyph name="arrow-up-right" className="size-4.5" />
        </a>
      </div>
      <div className="mt-5 flex items-start gap-4">
        <div className="flex min-w-0 flex-1 gap-2">
          {navigation.columns.map((column) => (
            <Column key={column.pillar} column={column} review={review} />
          ))}
        </div>
        <div className="grid w-[20.625rem] shrink-0 content-start gap-4 rounded-xl bg-canvas p-4">
          <div className="relative h-[11.875rem] overflow-hidden rounded-lg bg-surface-muted">
            {navigation.columns.map((column) => (
              <div key={column.pillar} data-preview={column.pillar} className="dz-mega-preview absolute inset-0">
                <Photo
                  asset={photo(PILLAR_DOOR[column.pillar], { decorative: true })}
                  sizes="20rem"
                  className="size-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 opacity-45 mix-blend-multiply ${BAR[column.pillar]}`}
                />
                <span className="absolute start-3 top-3 rounded-full bg-surface px-3 py-1 font-mono text-label text-ink uppercase">
                  {shellContent.previewLabel} · {column.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-1">
            <p data-mega-name="" className="dz-mega-title text-ink">
              {firstItem.name}
            </p>
            <p data-mega-outcome="" className="text-small text-ink-secondary">
              {firstItem.outcome}
            </p>
          </div>
          <hr className="border-line" />
          <p className="dz-mono-label">{navigation.solutions.label}</p>
          <ul className="flex flex-wrap gap-1.5">
            {navigation.solutions.items.map((item) => (
              <li key={item.route}>
                <MaybeLink
                  route={item.route}
                  review={review}
                  className="inline-flex min-h-9 items-center rounded-full border border-line bg-surface px-3 text-caption text-ink"
                  muted="text-ink-secondary"
                >
                  {item.name}
                </MaybeLink>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-3.5 gap-y-2 text-caption">
            {navigation.rail.map((link) => (
              <li key={link.route}>
                <MaybeLink
                  route={link.route}
                  review={review}
                  className="text-ink hover:text-violet"
                  muted="text-ink-secondary"
                >
                  {link.label}
                </MaybeLink>
              </li>
            ))}
          </ul>
          {review ? (
            <a
              href="#shell-demo"
              className="dz-press flex min-h-11 items-center justify-between rounded-lg bg-action px-4 py-3 text-button-m text-on-color"
            >
              {shellContent.demoCard}
              <Glyph name="arrow-up-right" className="size-4.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
