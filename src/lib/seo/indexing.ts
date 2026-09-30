// Whether search engines may index this deployment (docs/ai/08 §1 for previews; the pre-launch lock
// is decision 0013). Used by next.config.ts (the X-Robots-Tag header) and src/app/robots.ts, so
// both follow one deployment rule: the header carries the lock, and robots.txt blocks only Vercel
// previews and development builds (0013, option 2).
//
// Imported by next.config.ts through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.
import type { Env } from '../env.ts';

// Vercel previews and development builds (08 §1).
function isNonProductionVercel(vercelEnv: Env['vercelEnv']): boolean {
  return vercelEnv !== undefined && vercelEnv !== 'production';
}

export function isIndexable({ siteIndexing, vercelEnv }: Pick<Env, 'siteIndexing' | 'vercelEnv'>): boolean {
  // Vercel previews are never indexable, whatever SITE_INDEXING says.
  if (isNonProductionVercel(vercelEnv)) return false;
  // Production stays noindex until the owner sets SITE_INDEXING=on at launch (the pre-launch lock).
  return siteIndexing === 'on';
}

export function noindexHeaders(indexable: boolean): { key: string; value: string }[] {
  return indexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex' }];
}

// The robots.txt rules (src/app/robots.ts). P9 adds the AI-bot tiers (decision 0010) here.
export function robotsRules({ vercelEnv }: Pick<Env, 'vercelEnv'>): {
  userAgent: string;
  allow?: string;
  disallow: string;
} {
  // Previews and development builds: nothing is crawled.
  if (isNonProductionVercel(vercelEnv)) return { userAgent: '*', disallow: '/' };
  // Everywhere else the launch file, also while the pre-launch lock is on: crawlers must fetch a page
  // to see its noindex header, since Google ignores a noindex behind a robots.txt block (0013, option 2).
  return { userAgent: '*', allow: '/', disallow: '/api/' };
}
