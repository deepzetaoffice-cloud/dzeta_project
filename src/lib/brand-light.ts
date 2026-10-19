// The owner's white-background logos (C78; the owner, 2026-10-18: "add my white-background logo files
// … to the repo as new locked files (never edited)"). They live byte for byte, under their own names,
// in src/brand/white-bg/ (.gitattributes keeps their line endings), and are never edited, recoloured,
// optimised or redrawn: the site serves them as they are and only scales them (docs/ai/05 §6).
// tests/unit/brand-assets.test.ts holds each file's SHA-256, so any change fails the build's tests.
//
// Kept apart from brand.ts, which the v3 rebuild keeps verbatim.

export const LIGHT_LOGO_DIR = 'src/brand/white-bg';

// The header's logo (Figma component 2:337): the wordmark with the mark as its D, and the pixels.
export const LIGHT_WORDMARK_FILE = 'DeepZeta_Wordmark_D_As_Symbol_Plus_Pixels_WhiteBG.svg';

// Where the site serves it: a descriptive kebab-case URL (08 §7), versioned by the file's own hash.
export const LIGHT_WORDMARK_URL = '/brand/deepzeta-wordmark-light.svg';
export const LIGHT_WORDMARK_VERSION = '83923af3';
export const LIGHT_WORDMARK_VERSIONED_URL = `${LIGHT_WORDMARK_URL}?v=${LIGHT_WORDMARK_VERSION}`;

// The file's canvas is 1254 × 1254 with its viewBox cropped to the wordmark, so an <img> shows it at
// the crop's ratio with object-fit: cover; the file itself is untouched.
export const LIGHT_WORDMARK_CROP = { width: 910, height: 210 } as const;
