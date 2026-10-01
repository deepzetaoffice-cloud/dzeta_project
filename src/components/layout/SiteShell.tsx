import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { shellContent } from '@/content/en/shell';

// The shell around every page (P2 plan, B1 and B2): the skip link, the header, and the page's one
// <main>, so the skip link always has a target. Part C adds the footer and the sticky CTA bar.
// - The skip link is the first tab stop and stays hidden until focused.
// - The sentinel marks the top of the page: when it scrolls away, the header condenses (header.ts).
// - <main> takes focus from the skip link (tabIndex -1); it's no control, so it shows no ring.

export type SiteShellProps = { review?: boolean; children: ReactNode };

export function SiteShell({ review = false, children }: SiteShellProps) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-(--dz-layer-toast) focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-fg-strong"
      >
        {shellContent.skipLink}
      </a>
      <div aria-hidden="true" className="absolute top-0 h-px w-px" data-fx-sentinel="" />
      <SiteHeader review={review} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </>
  );
}
