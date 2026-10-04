// Security headers, set once for every route by next.config.ts (docs/ai/06 §4, adoption plan A4).
// Values and reasons: docs/plans/2026-09-30-p0-foundation.md, section B; the CSP: the P3 plan, K.
//
// Imported by next.config.ts through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.
import { accounts, type Accounts } from './tracking/accounts.ts';
import { vendorsInUse, type CspHosts } from './tracking/vendors.ts';

// The Content Security Policy, enforced from P3 (conflict C53; the owner, Q5):
// - Scripts, pixels, requests and frames reach only our own origin and the hosts of the tracking
//   vendors in use (vendors.ts: GTM and its preview while NEXT_PUBLIC_GTM_ID is set, the others while
//   their ID is set), so a tag added by hand in GTM, or a compromised one, can't reach any other host.
// - Scripts allow 'unsafe-inline', with no hash or nonce: every static page carries inline scripts of
//   Next.js's own that change per page and per build, a nonce would make every page dynamic, and a
//   hash or nonce in the list turns 'unsafe-inline' off. Our two init scripts stay static strings
//   (C40), so a hash-based policy stays possible later. Never 'unsafe-eval'.
// - upgrade-insecure-requests only where the site is served over https: on http://localhost it would
//   send the page's own files to an https address that isn't there.
type Directive = keyof CspHosts;
const BASE: Record<Directive, string[]> = {
  script: ["'self'", "'unsafe-inline'"],
  style: ["'self'", "'unsafe-inline'"],
  img: ["'self'", 'data:', 'blob:'],
  font: ["'self'"],
  connect: ["'self'"],
  frame: ["'self'"],
};

export type SecurityOptions = { gtm: boolean; https: boolean; ids?: Accounts };

export function contentSecurityPolicy({ gtm, https, ids = accounts }: SecurityOptions): string {
  const sources = structuredClone(BASE);
  for (const vendor of vendorsInUse({ gtm }, ids)) {
    for (const [directive, hosts] of Object.entries(vendor.hosts) as [Directive, readonly string[]][]) {
      for (const host of hosts) if (!sources[directive].includes(host)) sources[directive].push(host);
    }
  }
  return [
    "default-src 'self'",
    ...(Object.entries(sources) as [Directive, string[]][]).map(([name, list]) => `${name}-src ${list.join(' ')}`),
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(https ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}

// The asset response's own headers (the C5 amendment, the owner, 2026-10-04). Browsers ignore a CSP,
// HSTS, framing and permissions policies delivered on a subresource response: they protect documents.
// Sending them on /_next/static chunks cost ~550 B a response once GTM widened the CSP (~3.7 KB of
// every first load, measured at C5) for no effect. `nosniff` is the one that still matters on an
// asset, and it is small; caching and `Secure` are the server's own (Next.js sets Cache-Control).
export function assetSecurityHeaders(): { key: string; value: string }[] {
  return [{ key: 'X-Content-Type-Options', value: 'nosniff' }];
}

export function securityHeaders(options: SecurityOptions): { key: string; value: string }[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(options) },
    // Two years. `preload` is hard to undo, so it waits for the owner's decision at launch.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // SAMEORIGIN, not DENY: Designer Studio concepts load our own pages in a sandboxed iframe.
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
  ];
}
