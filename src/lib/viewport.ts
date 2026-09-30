import type { Viewport } from 'next';
import { readToken } from '@/lib/tokens';

// The one viewport for every document: both root layouts and the 404, which skips the layouts
// (decision 0018; P2 plan, B3). Each exports it as its own `viewport`.
// Every first visit is dark (05 §1), so a slow first load shows a dark canvas before the stylesheet
// arrives (0015). The browser bar is navy in both themes, because the header stays navy (05 §2).
export const siteViewport: Viewport = {
  themeColor: readToken('--dz-navy'),
  colorScheme: 'dark',
};
