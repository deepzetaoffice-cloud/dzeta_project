// Where a visitor is, for consent (docs/ai/09 §2.7, conflict C52; P3 plan, B). Vercel's CDN sets
// x-vercel-ip-country on every request, and two next.config header rules turn it into a
// Server-Timing value on the page itself: `dz-region;desc="eea"` for the EEA, the UK and Switzerland,
// `dz-region;desc="row"` for any other country. The consent init script reads it before the first
// paint. The rules run at the CDN before its cache, so pages stay static, no function runs, and
// nothing is stored on the visitor's device. No hint (no header, an odd value, a browser without
// serverTiming) counts as Europe: a failure asks for consent rather than skipping it.
//
// Imported by next.config through Node's own TypeScript loader: keep relative imports with explicit
// `.ts` extensions and type-only syntax in this file.

export type Region = 'eea' | 'row';

export const COUNTRY_HEADER = 'x-vercel-ip-country';
export const REGION_TIMING = 'dz-region';

// The EU's 27 members (Greece is GR in ISO 3166-1, not EL), the three other EEA members (Iceland,
// Liechtenstein, Norway), the UK and Switzerland. Google gives no list of its own; this one is ours,
// with its official sources in docs/facts/external-sources.md.
export const CONSENT_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
] as const;

const LIST = CONSENT_COUNTRIES.join('|');
// next.config anchors a `has` value (^…$), so these match the whole header. The second is the first's
// exact complement among two-letter codes: the two rules never both match, so nothing depends on which
// of two rules for one header wins.
export const EEA_VALUE = `(?:${LIST})`;
export const ROW_VALUE = `(?!(?:${LIST})$)[A-Z]{2}`;

// Pages only: not the build's files under /_next/, and not files with an extension (the logo, icons,
// robots.txt, the manifest), which never read the hint.
export const PAGE_SOURCE = '/:path((?!_next/)[^.]*)';

export const regionTiming = (region: Region) => `${REGION_TIMING};desc="${region}"`;

type HeaderRule = {
  source: string;
  has: { type: 'header'; key: string; value: string }[];
  headers: { key: string; value: string }[];
};

export function regionHeaderRules(): HeaderRule[] {
  return (
    [
      ['eea', EEA_VALUE],
      ['row', ROW_VALUE],
    ] as const
  ).map(([region, value]) => ({
    source: PAGE_SOURCE,
    has: [{ type: 'header', key: COUNTRY_HEADER, value }],
    headers: [{ key: 'Server-Timing', value: regionTiming(region) }],
  }));
}
