import type { ReactNode } from 'react';
import { ConsentBanner } from '@/components/layout/ConsentBanner';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StickyCta } from '@/components/layout/StickyCta';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { shellContent } from '@/content/en/shell';

// The shell around every page (docs/design/header.md, footer.md, conversion-path.md): the skip link,
// the header, the page's one <main>, so the skip link always has a target, the footer, the sticky CTA
// bar and the floating WhatsApp button.
// - The skip link is the first tab stop and stays hidden until focused.
// - The consent banner follows it, shown only while a European visitor hasn't chosen (C52): first in
//   the reading order after the skip link, which still jumps past it to <main>.
// - <main> takes focus from the skip link (tabIndex -1); it's no control, so it shows no ring. It fills
//   at least the first screen, so the footer always starts below the fold. The header floats over the
//   page: <main> keeps its space clear (dz-main), unless the page opens on a hero stage, which holds
//   the header inside its top (data-stage-hero).
// - The sticky bar and the float come last, so they're the last tab stops while they show.

export type SiteShellProps = { review?: boolean; children: ReactNode };

export function SiteShell({ review = false, children }: SiteShellProps) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-(--dz-layer-toast) focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-ink"
      >
        {shellContent.skipLink}
      </a>
      <ConsentBanner />
      <SiteHeader review={review} />
      <main id="main" tabIndex={-1} className="dz-main min-h-svh focus:outline-none">
        {children}
      </main>
      <SiteFooter review={review} />
      <StickyCta />
      <WhatsAppFloat />
    </>
  );
}
