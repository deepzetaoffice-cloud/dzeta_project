import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { isIndexable } from '@/lib/seo/indexing';

// PROTECTED once created (docs/ai/08 §5): edits need a plan that names this file.
// P9 adds the AI-bot tiers (decision 0010) and the sitemap line.
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable(env())) {
    // Vercel previews and the pre-launch production site (decision 0013): nothing is crawled.
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' } };
}
