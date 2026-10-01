import { describe, expect, it } from 'vitest';
import { parseEnv } from '@/lib/env';

describe('parseEnv', () => {
  it('accepts a local origin and defaults indexing to off', () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' })).toEqual({
      siteUrl: 'http://localhost:3000',
      siteIndexing: 'off',
      vercelEnv: undefined,
      gtm: null,
    });
  });

  it('accepts the production origin with indexing on', () => {
    const env = parseEnv({
      NEXT_PUBLIC_SITE_URL: 'https://deepzeta.ai',
      VERCEL_ENV: 'production',
      SITE_INDEXING: 'on',
    });
    expect(env).toEqual({ siteUrl: 'https://deepzeta.ai', siteIndexing: 'on', vercelEnv: 'production', gtm: null });
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

  it('has no GTM until its container ID is set, then takes an optional GTM environment (P3 plan, J)', () => {
    const local = { NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' };
    expect(parseEnv(local).gtm).toBeNull();
    expect(parseEnv({ ...local, NEXT_PUBLIC_GTM_ID: '' }).gtm).toBeNull();
    expect(parseEnv({ ...local, NEXT_PUBLIC_GTM_ID: 'GTM-AB12CD3' }).gtm).toEqual({ id: 'GTM-AB12CD3' });
    expect(
      parseEnv({
        ...local,
        NEXT_PUBLIC_GTM_ID: 'GTM-AB12CD3',
        NEXT_PUBLIC_GTM_AUTH: 'aBcD_123',
        NEXT_PUBLIC_GTM_PREVIEW: 'env-5',
      }).gtm,
    ).toEqual({ id: 'GTM-AB12CD3', auth: 'aBcD_123', preview: 'env-5' });
  });

  it.each([
    [{ NEXT_PUBLIC_GTM_ID: 'G-AB12CD3' }, /GTM-XXXXXXX/],
    [{ NEXT_PUBLIC_GTM_ID: 'gtm-ab12cd3' }, /GTM-XXXXXXX/],
    [{ NEXT_PUBLIC_GTM_ID: 'GTM-AB12CD3', NEXT_PUBLIC_GTM_AUTH: 'x' }, /set together/],
    [{ NEXT_PUBLIC_GTM_ID: 'GTM-AB12CD3', NEXT_PUBLIC_GTM_AUTH: 'x', NEXT_PUBLIC_GTM_PREVIEW: '5' }, /env-2/],
    [{ NEXT_PUBLIC_GTM_AUTH: 'x', NEXT_PUBLIC_GTM_PREVIEW: 'env-5' }, /need NEXT_PUBLIC_GTM_ID/],
  ])('rejects the GTM variables %j', (gtm, message) => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', ...gtm })).toThrow(message);
  });

  it('reports every problem at once', () => {
    expect(() => parseEnv({ SITE_INDEXING: 'yes', VERCEL_ENV: 'staging' })).toThrow(
      /VERCEL_ENV[\s\S]*NEXT_PUBLIC_SITE_URL[\s\S]*SITE_INDEXING/,
    );
  });
});
