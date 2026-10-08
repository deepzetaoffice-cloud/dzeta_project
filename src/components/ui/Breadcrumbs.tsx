import { shellContent } from '@/content/en/shell';
import { routePath, type RouteId } from '@/lib/routes';

// The visible breadcrumb trail (engine §5.1: every inner page has one; P6 part A2, S8). Plain links
// from the route helpers (06 §2.4, C67), Home first, the current page last as text with
// aria-current="page". The BreadcrumbList schema (S9) reads the same trail, so the two can't drift.
// hover-underline on the links (13 §4.3); logical CSS only, so it reads right to left in Arabic.

export type Crumb = { route: RouteId; label: string };

export type BreadcrumbsProps = {
  /** The trail after Home: each ancestor, then the current page (rendered as text) */
  trail: readonly Crumb[];
};

/** The full trail, Home included: what the page shows and what its BreadcrumbList states */
export const fullTrail = (trail: readonly Crumb[]): readonly Crumb[] => [
  { route: 'R001', label: shellContent.breadcrumbHome },
  ...trail,
];

export function Breadcrumbs({ trail }: BreadcrumbsProps) {
  const crumbs = fullTrail(trail);
  return (
    <nav aria-label={shellContent.breadcrumbLabel} className="mx-auto max-w-page px-gutter pt-4 sm:pt-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-fg-muted">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.route} className="inline-flex items-center gap-x-2">
              {last ? (
                <span aria-current="page" className="text-fg">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <a href={routePath(crumb.route)} className="dz-underline dz-target text-fg-muted hover:text-fg">
                    {crumb.label}
                  </a>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
