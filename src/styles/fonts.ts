import localFont from 'next/font/local';

// The site's fonts, defined once so each is one instance for both root layouts (docs/ai/05 §3;
// decision 0015). Self-hosted latin files with their OFL licences in ./fonts; no request goes to
// Google. The `variable` classes go on <html>; tokens.css maps them to --dz-font-sans/--dz-font-mono.
// The automatic size-matched fallback (adjustFontFallback, 'Arial' by default) keeps CLS at 0.

// Variable, weights 400-900. Preloaded: the H1 is the LCP element.
export const montserrat = localFont({
  src: './fonts/montserrat-latin-wght.woff2',
  weight: '400 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-montserrat',
});

// One static weight, 500: the variable 400-600 file put the fonts over the ~60 KB target
// (docs/ai/07 §2). Not preloaded, so a page downloads it only when it shows mono text.
export const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin-500.woff2',
  weight: '500',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains-mono',
});

export const fontVariables = `${montserrat.variable} ${jetbrainsMono.variable}`;
