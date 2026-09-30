// The locked logo, as code sees it (docs/ai/00 §5; P1 plan, section A). The file is only ever read:
// the site serves it unchanged (src/app/brand/deepzeta-logo.svg/route.ts), every variant is a viewBox
// crop of it, and scripts/build-brand-icons.mjs draws the app icons from it.
//
// Imported by scripts/build-brand-icons.mjs through Node's own TypeScript loader: keep this file free
// of imports and TypeScript-only runtime syntax.

export const LOCKED_LOGO_PATH = 'Planning Folder/For Ai/deepZeta Ai Logo/Coded Logo SVG Do not touch the code.svg';

// Where the site serves it (URL registry R178).
export const LOGO_URL = '/brand/deepzeta-logo.svg';

// The logo's own viewBox is 0 0 LOGO_CANVAS LOGO_CANVAS.
export const LOGO_CANVAS = 1254;

// Crops in the logo's own units (x, y, width, height), from the Design Lab. Checked against the path
// data: the ribbon spans x 380–853, the pixels end at x 916.5, the wordmark covers 222–1038 × 747–896.
export const LOGO_CROPS = {
  // The Z ribbon, which reads as a D, and the four pixels
  mark: [372, 262, 552, 432],
  // "Deepzeta"
  wordmark: [214, 740, 832, 164],
  // The whole canvas, as designed, with its own margins
  full: [0, 0, LOGO_CANVAS, LOGO_CANVAS],
} as const;
