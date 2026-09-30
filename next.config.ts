import type { NextConfig } from 'next';
import { LOGO_URL, LOGO_VERSION } from './src/lib/brand.ts';
import { env } from './src/lib/env.ts';
import { securityHeaders } from './src/lib/security-headers.ts';
import { isIndexable, noindexHeaders } from './src/lib/seo/indexing.ts';

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
  // Set once, for every route (docs/ai/06 §4). Non-indexable deployments also send noindex (08 §1).
  async headers() {
    return [
      { source: '/:path*', headers: [...securityHeaders(), ...noindexHeaders(indexable)] },
      // The logo at its current versioned URL (src/lib/brand.ts): a new logo gets a new URL, so
      // browsers keep this one for a year without asking again (P2 plan, E2; decision 0018). Other
      // requests for the path keep the default.
      {
        source: LOGO_URL,
        has: [{ type: 'query', key: 'v', value: LOGO_VERSION }],
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
