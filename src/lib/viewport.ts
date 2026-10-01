import type { Viewport } from 'next';
import { readToken } from '@/lib/tokens';

// The one viewport for every document: both root layouts and the 404, which skips the layouts
// (decision 0018; P2 plan, B3). Each exports it as its own `viewport`.
// Every first visit is dark (05 §1), so a slow first load shows a dark canvas before the stylesheet
// arrives (0015). The browser bar is navy in both themes, because the header stays navy (05 §2).
// viewportFit 'cover' lets the sticky CTA bar sit clear of an iPhone's home indicator through the
// safe-area insets; the body and the sheet keep their content clear of the side insets in landscape
// (effects.css). The owner kept it at P2's exit (decision 0019): it's checked on an iPhone before
// launch, with the sheet's bottom inset and the light theme's side strips.
export const siteViewport: Viewport = {
  themeColor: readToken('--dz-navy'),
  colorScheme: 'dark',
  viewportFit: 'cover',
};
