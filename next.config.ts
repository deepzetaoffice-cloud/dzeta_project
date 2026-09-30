import type { NextConfig } from 'next';
import { env } from './src/lib/env.ts';
import { securityHeaders } from './src/lib/security-headers.ts';
import { isIndexable, noindexHeaders } from './src/lib/seo/indexing.ts';

// Stops at once when the environment is missing or malformed (docs/ai/02 §2.5, .env.example).
const indexable = isIndexable(env());

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Unmatched URLs need one 404 across multiple root layouts (English now, Arabic in P11).
    globalNotFound: true,
  },
  // Set once, for every route (docs/ai/06 §4). Non-indexable deployments also send noindex (08 §1).
  async headers() {
    return [{ source: '/:path*', headers: [...securityHeaders(), ...noindexHeaders(indexable)] }];
  },
};

export default nextConfig;
