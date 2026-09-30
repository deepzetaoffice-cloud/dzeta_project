import type { NextConfig } from 'next';
import { env } from './src/lib/env.ts';

// Stop at once when the environment is missing or malformed (docs/ai/02 §2.5, .env.example).
env();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Unmatched URLs need one 404 across multiple root layouts (English now, Arabic in P11).
    globalNotFound: true,
  },
};

export default nextConfig;
