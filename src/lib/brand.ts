// The locked logo, as code sees it (docs/ai/00 §5; P1 plan, section A). The file is only ever read:
// the site serves it unchanged (src/app/brand/deepzeta-logo.svg/route.ts), every variant is a viewBox
// crop of it, and scripts/build-brand-icons.mjs draws the app icons from it.
//
// Imported by scripts/build-brand-icons.mjs through Node's own TypeScript loader: keep this file free
// of imports and TypeScript-only runtime syntax.

export const LOCKED_LOGO_PATH = 'Planning Folder/For Ai/deepZeta Ai Logo/Coded Logo SVG Do not touch the code.svg';

// Where the site serves it (URL registry R178).
export const LOGO_URL = '/brand/deepzeta-logo.svg';

// The first 8 hex digits of the locked file's SHA-256 (its LF bytes; tests/unit/brand-assets.test.ts
// checks it). Pages request the logo with it as ?v=, so the URL changes if the file ever does, and
// next.config.ts can let browsers keep that URL for a year (P2 plan, E1; decision 0018).
export const LOGO_VERSION = '6431c297';
export const LOGO_VERSIONED_URL = `${LOGO_URL}?v=${LOGO_VERSION}`;

// The logo's own viewBox is 0 0 LOGO_CANVAS LOGO_CANVAS.
export const LOGO_CANVAS = 1254;

// Crops in the logo's own units (x, y, width, height), from the Design Lab. Checked against the path
// data: the ribbon spans x 380–853, the pixels end at x 916.5, the wordmark covers 222–1038 × 747–896.
export const LOGO_CROPS = {
  // The Z ribbon, which reads as a D, and the four pixels
  mark: [372, 262, 552, 432],
  // "Deepzeta"
  wordmark: [214, 740, 832, 164],
  // "eepzeta": the wordmark after its D, for the header's inline lockup (owner, 2026-10-01). It starts
  // halfway between the D (which ends at x 336) and the first e (which starts at 344).
  tail: [340, 740, 706, 164],
  // The whole canvas, as designed, with its own margins
  full: [0, 0, LOGO_CANVAS, LOGO_CANVAS],
} as const;

// Shapes the inline lockup is fitted to (x1, y1, x2, y2 in the logo's units), measured with getBBox in
// Chromium on 2026-10-01: the wordmark's D (its cap height and its baseline, 863), the gap after it
// (8, to the first e at 344), and the ribbon, the mark's D shape.
export const LOGO_SHAPES = {
  wordmarkD: [222, 747, 336, 863],
  letterGap: 8,
  ribbon: [380.2, 322.6, 852.5, 685.7],
} as const;
