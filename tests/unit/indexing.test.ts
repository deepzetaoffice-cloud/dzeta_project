import { describe, expect, it } from 'vitest';
import { isIndexable, noindexHeaders, robotsRules } from '@/lib/seo/indexing';

describe('isIndexable (plan section A, decision 0013)', () => {
  it.each([
    ['a Vercel preview, even with SITE_INDEXING=on', 'preview', 'on', false],
    ['a Vercel development build', 'development', 'on', false],
    ['production before launch (the pre-launch lock)', 'production', 'off', false],
    ['production at launch', 'production', 'on', true],
    ['the owner machine or CI with indexing on', undefined, 'on', true],
    ['the owner machine with indexing off', undefined, 'off', false],
  ] as const)('%s → %s', (_label, vercelEnv, siteIndexing, expected) => {
    expect(isIndexable({ vercelEnv, siteIndexing })).toBe(expected);
  });
});

describe('noindexHeaders', () => {
  it('sends X-Robots-Tag: noindex only when the deployment is not indexable', () => {
    expect(noindexHeaders(false)).toEqual([{ key: 'X-Robots-Tag', value: 'noindex' }]);
    expect(noindexHeaders(true)).toEqual([]);
  });
});

describe('robotsRules (docs/ai/08 §1 and §5, decision 0013 option 2)', () => {
  it.each([
    ['a Vercel preview', 'preview'],
    ['a Vercel development build', 'development'],
  ] as const)('blocks everything on %s', (_label, vercelEnv) => {
    expect(robotsRules({ vercelEnv })).toEqual({ userAgent: '*', disallow: '/' });
  });

  it.each([
    ['production', 'production'],
    ['the owner machine or CI', undefined],
  ] as const)('serves the launch file on %s and blocks only /api/, never /_next/', (_label, vercelEnv) => {
    const rules = robotsRules({ vercelEnv });
    expect(rules).toEqual({ userAgent: '*', allow: '/', disallow: '/api/' });
    expect(JSON.stringify(rules)).not.toContain('_next');
  });

  it('lets crawlers fetch pages while the pre-launch lock is on, so they see the noindex', () => {
    const locked = { vercelEnv: 'production', siteIndexing: 'off' } as const;
    expect(noindexHeaders(isIndexable(locked))).toEqual([{ key: 'X-Robots-Tag', value: 'noindex' }]);
    expect(robotsRules(locked)).toEqual({ userAgent: '*', allow: '/', disallow: '/api/' });
  });
});
