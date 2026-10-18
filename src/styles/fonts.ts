import { Figtree, Geist_Mono, Unbounded } from 'next/font/google';

// The site's fonts (docs/ai/05 §3; decision 0033): Unbounded for display and headings, Figtree for
// body and UI, Geist Mono for labels and steps. next/font downloads them at build time and serves
// them from the site itself, so no request goes to Google at runtime. Each is defined once, for both
// root layouts and the error page. The `variable` classes go on <html>; tokens.css maps them to the
// --dz-font-family-* tokens.

// The H1's family, so it's preloaded: the H1 is the LCP element (13 §3).
const unbounded = Unbounded({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-unbounded',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-figtree',
});

// Labels and steps only, so it isn't preloaded.
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--font-geist-mono',
});

export const fontVariables = `${unbounded.variable} ${figtree.variable} ${geistMono.variable}`;
