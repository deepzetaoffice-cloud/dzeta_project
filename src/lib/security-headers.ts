// Security headers, set once for every route by next.config.ts (docs/ai/06 §4, adoption plan A4).
// Values and reasons: docs/plans/2026-09-30-p0-foundation.md, section B.
//
// Imported by next.config.ts through Node's own TypeScript loader: keep this file free of imports
// and TypeScript-only runtime syntax.

// Report-only until P3, when enforcement is decided after GTM is in (a nonce-based CSP forces
// dynamic rendering). `upgrade-insecure-requests` is left out: browsers log an error for it in
// report-only mode. There is no report endpoint until P3.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

export function securityHeaders(): { key: string; value: string }[] {
  return [
    { key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY },
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
