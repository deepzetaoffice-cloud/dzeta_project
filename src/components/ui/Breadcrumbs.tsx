import { shellContent } from '@/content/en/shell';
import { routePath, type RouteId } from '@/lib/routes';

// The visible breadcrumb trail (engine §5.1: every inner page has one). Plain links from the route
// helpers (06 §2.4, C67), Home first, the current page last as text with aria-current="page". The
// BreadcrumbList schema reads the same trail through fullTrail(), so the two can't drift (08 §3.7).
// Logical CSS only, so it reads right to left in Arabic. `onColor` is the C diagram mono label inside a
// hero stage (Figma 58:34, 59:34: "HOME / SERVICES"), white on the stage gradient; `mono` is the same
// label on a light hero (Figma 61:34).

export type Crumb = { route: RouteId; label: string };

export type BreadcrumbsProps = {
  /** The trail after Home: each ancestor, then the current page (rendered as text) */
  trail: readonly Crumb[];
  tone?: 'default' | 'onColor' | 'mono';
  className?: string;
};

/** The full trail, Home included: what the page shows and what its BreadcrumbList states */
export const fullTrail = (trail: readonly Crumb[]): readonly Crumb[] => [
  { route: 'R001', label: shellContent.breadcrumbHome },
  ...trail,
];

export function Breadcrumbs({
  trail,
  tone = 'default',
  className = 'mx-auto max-w-page px-gutter pt-6',
}: BreadcrumbsProps) {
  const crumbs = fullTrail(trail);
  const onColor = tone === 'onColor';
  // The mono label sits in a hero, above the H1: it stays on one line whatever font has loaded (a
  // late font that rewrapped it would shift the whole hero, CLS), and the current page's name
  // shortens with an ellipsis on screen if it must. Screen readers still hear the full name.
  const mono = onColor || tone === 'mono';
  return (
    <nav aria-label={shellContent.breadcrumbLabel} className={mono ? `min-w-0 max-w-full ${className}` : className}>
      <ol
        className={
          mono
            ? `flex min-w-0 flex-nowrap items-center gap-x-3 font-mono text-label uppercase ${onColor ? 'text-on-color' : 'text-ink-secondary'}`
            : 'flex flex-wrap items-center gap-x-2 gap-y-1 text-small'
        }
      >
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li
              key={crumb.route}
              className={
                mono
                  ? last
                    ? 'inline-flex min-h-8 min-w-0 items-center'
                    : 'inline-flex shrink-0 items-center gap-x-3'
                  : 'inline-flex items-center gap-x-2'
              }
            >
              {last ? (
                <span aria-current="page" className={mono ? 'block truncate' : undefined}>
                  {crumb.label}
                </span>
              ) : (
                <>
                  <a
                    href={routePath(crumb.route)}
                    className={[
                      'inline-flex items-center underline-offset-4 hover:underline',
                      mono ? 'min-h-8' : 'min-h-11',
                    ].join(' ')}
                  >
                    {crumb.label}
                  </a>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
