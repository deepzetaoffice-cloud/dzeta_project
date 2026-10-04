import type { NextConfig } from 'next';
import { LOGO_URL, LOGO_VERSION } from './src/lib/brand.ts';
import { env } from './src/lib/env.ts';
import { assetSecurityHeaders, securityHeaders } from './src/lib/security-headers.ts';
import { isIndexable, noindexHeaders } from './src/lib/seo/indexing.ts';
import { regionHeaderRules } from './src/lib/tracking/region.ts';

// Stops at once when the environment is missing or malformed (docs/ai/02 §2.5, .env.example).
const currentEnv = env();
const indexable = isIndexable(currentEnv);
if (currentEnv.vercelEnv === 'production' && !indexable) {
  // Visible in every production build log until launch, so the lock can't be forgotten.
  console.warn('Pre-launch lock ON: production sends noindex until SITE_INDEXING=on (decision 0013).');
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Unmatched URLs need one 404 across multiple root layouts (English now, Arabic in P11).
    globalNotFound: true,
  },
  // Security and noindex headers on page paths only (docs/ai/06 §4; the C5 amendment, 2026-10-04):
  // a CSP, HSTS, framing and permissions policies delivered on a subresource response is ignored by
  // browsers, so /_next/static chunks carry just nosniff — with the full set on chunks, GTM's hosts
  // cost ~3.7 KB of headers on every first load for no effect (C5's measurement).
  async headers() {
    const security = securityHeaders({
      gtm: currentEnv.gtm !== null,
      https: currentEnv.siteUrl.startsWith('https:'),
    });
    return [
      {
        // Everything except /_next/ files: pages, robots.txt, the icons and the logo. The region rule
        // uses a narrower page-only shape (no dots) because a Server-Timing value only matters on a
        // document; these headers are cheap on the few non-chunk assets and must not vanish from
        // robots.txt (its noindex is checked, foundation.spec.ts).
        source: '/:path((?!_next/).*)',
        headers: [...security, ...noindexHeaders(indexable)],
      },
      {
        // Build output chunks and other /_next/ responses: the one header an asset response needs.
        source: '/_next/:path*',
        headers: assetSecurityHeaders(),
      },
      // The logo at its current versioned URL (src/lib/brand.ts): a new logo gets a new URL, so
      // browsers keep this one for a year without asking again (P2 plan, E2; decision 0018). Other
      // requests for the path keep the default.
      {
        source: LOGO_URL,
        has: [{ type: 'query', key: 'v', value: LOGO_VERSION }],
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // The visitor's region for consent, from Vercel's country header, as a Server-Timing value the
      // page reads before its first paint (docs/ai/09 §2.7, C52; src/lib/tracking/region.ts).
      ...regionHeaderRules(),
    ];
  },
};

export default nextConfig;
