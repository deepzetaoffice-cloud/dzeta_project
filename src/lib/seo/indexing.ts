// Whether search engines may index this deployment (docs/ai/08 §1 for previews; the pre-launch lock
// is decision 0013, PROPOSED). Used by next.config.ts (the X-Robots-Tag header) and
// src/app/robots.ts, so both always agree.
//
// Imported by next.config.ts through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.
import type { Env } from '../env.ts';

export function isIndexable({ siteIndexing, vercelEnv }: Pick<Env, 'siteIndexing' | 'vercelEnv'>): boolean {
  // Vercel previews are never indexable, whatever SITE_INDEXING says.
  if (vercelEnv !== undefined && vercelEnv !== 'production') return false;
  // Production stays noindex until the owner sets SITE_INDEXING=on at launch (the pre-launch lock).
  return siteIndexing === 'on';
}

export function noindexHeaders(indexable: boolean): { key: string; value: string }[] {
  return indexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex' }];
}

// The robots.txt rules (src/app/robots.ts). P9 adds the AI-bot tiers (decision 0010) here.
export function robotsRules(indexable: boolean): { userAgent: string; allow?: string; disallow: string } {
  // Not indexable (previews, and production before launch): nothing is crawled.
  if (!indexable) return { userAgent: '*', disallow: '/' };
  return { userAgent: '*', allow: '/', disallow: '/api/' };
}
