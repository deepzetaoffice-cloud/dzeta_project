import type { ReactNode } from 'react';
import { JourneyLine } from '@/components/layout/JourneyLine';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StickyCta } from '@/components/layout/StickyCta';
import { shellContent } from '@/content/en/shell';

// The shell around every page (P2 plan, B1, B2, L and M): the skip link, the header, the page's one
// <main>, so the skip link always has a target, the footer, and the sticky CTA bar.
// - The skip link is the first tab stop and stays hidden until focused.
// - The sentinel marks the top of the page: when it scrolls away, the header condenses (header.ts).
// - The journey line is sitewide chrome on the inline-start edge (scroll-journey-line).
// - <main> takes focus from the skip link (tabIndex -1); it's no control, so it shows no ring. It fills at
//   least the first screen below the header, so the footer always starts below the fold: on a short
//   page (the placeholder Home, the 404) a font swap above it would otherwise push the whole footer down
//   in view (CLS), and the finale's display headline would compete with the H1 for LCP (P2 step 14).
// - The sticky bar comes last, so it's the last tab stop while it shows (mobile only).

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
      <JourneyLine />
      <SiteHeader review={review} />
      <main
        id="main"
        tabIndex={-1}
        className="min-h-[calc(100svh-var(--dz-header-height)-var(--dz-header-inset))] focus:outline-none"
      >
        {children}
      </main>
      <SiteFooter review={review} />
      <StickyCta />
    </>
  );
}
