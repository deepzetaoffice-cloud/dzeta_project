import { describe, expect, it } from 'vitest';
import { parseEnv } from '@/lib/env';

describe('parseEnv', () => {
  it('accepts a local origin and defaults indexing to off', () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' })).toEqual({
      siteUrl: 'http://localhost:3000',
      siteIndexing: 'off',
      vercelEnv: undefined,
    });
  });

  it('accepts the production origin with indexing on', () => {
    const env = parseEnv({
      NEXT_PUBLIC_SITE_URL: 'https://deepzeta.ai',
      VERCEL_ENV: 'production',
      SITE_INDEXING: 'on',
    });
    expect(env).toEqual({ siteUrl: 'https://deepzeta.ai', siteIndexing: 'on', vercelEnv: 'production' });
  });

  it.each([
    [{}, /is missing/],
    [{ NEXT_PUBLIC_SITE_URL: 'deepzeta.ai' }, /not a valid URL/],
    [{ NEXT_PUBLIC_SITE_URL: 'https://deepzeta.ai/' }, /must not end with "\/"/],
    [{ NEXT_PUBLIC_SITE_URL: 'https://deepzeta.ai/en' }, /origin only/],
    [{ NEXT_PUBLIC_SITE_URL: 'https://Deepzeta.ai' }, /lowercase origin only/],
    [{ NEXT_PUBLIC_SITE_URL: 'ftp://deepzeta.ai' }, /http or https/],
    [{ NEXT_PUBLIC_SITE_URL: 'http://deepzeta.ai', VERCEL_ENV: 'production' }, /https in production/],
    [{ NEXT_PUBLIC_SITE_URL: 'https://dzeta.vercel.app', VERCEL_ENV: 'production' }, /vercel\.app/],
    [{ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', SITE_INDEXING: 'yes' }, /SITE_INDEXING/],
    [{ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', VERCEL_ENV: 'staging' }, /VERCEL_ENV/],
  ])('rejects %j', (source, message) => {
    expect(() => parseEnv(source)).toThrow(message);
  });

  it('allows a *.vercel.app origin outside production', () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: 'https://dzeta.vercel.app', VERCEL_ENV: 'preview' }).siteUrl).toBe(
      'https://dzeta.vercel.app',
    );
  });

  it('reports every problem at once', () => {
    expect(() => parseEnv({ SITE_INDEXING: 'yes', VERCEL_ENV: 'staging' })).toThrow(
      /VERCEL_ENV[\s\S]*NEXT_PUBLIC_SITE_URL[\s\S]*SITE_INDEXING/,
    );
  });
});
