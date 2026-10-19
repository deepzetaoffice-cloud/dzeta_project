import type { Viewport } from 'next';
import { readToken } from '@/lib/tokens';

// The one viewport for every document: both root layouts and the 404, which skips the layouts
// (decision 0018). Each exports it as its own `viewport`. Light only in V1 (C77; decision 0033): the
// browser bar takes the canvas colour, so a slow first load shows the canvas before the stylesheet.
// viewportFit 'cover' lets the sticky CTA bar sit clear of an iPhone's home indicator through the
// safe-area insets; the body and the sheet keep their content clear of the side insets in landscape
// (globals.css). Checked on an iPhone before launch.
export const siteViewport: Viewport = {
  themeColor: readToken('--dz-p-ink-50'),
  colorScheme: 'light',
  viewportFit: 'cover',
};
