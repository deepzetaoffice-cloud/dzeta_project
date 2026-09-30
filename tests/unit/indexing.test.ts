import { describe, expect, it } from 'vitest';
import { isIndexable, noindexHeaders } from '@/lib/seo/indexing';

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
