import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, securityHeaders } from '@/lib/security-headers';
import type { Accounts } from '@/lib/tracking/accounts';

// The security headers (docs/ai/06 §4) and the enforced CSP (conflict C53; P3 plan, K and M).

const NO_IDS: Accounts = {
  ga4MeasurementId: null,
  metaDatasetId: null,
  microsoftUetTagId: null,
  linkedinPartnerId: null,
  linkedinConversionIds: { generate_lead: null },
  googleAdsCustomerId: null,
};
const ALL_IDS: Accounts = {
  ...NO_IDS,
  ga4MeasurementId: 'G-TEST1234',
  metaDatasetId: '1234567890123',
  microsoftUetTagId: '123456789',
  linkedinPartnerId: '1234567',
};

const headers = new Map(
  securityHeaders({ gtm: false, https: true }).map(({ key, value }) => [key.toLowerCase(), value]),
);

// The policy as { directive: sources }
const parse = (csp: string) =>
  Object.fromEntries(
    csp.split('; ').map((part) => {
      const [name, ...sources] = part.split(' ');
      return [name!, sources];
    }),
  );

describe('securityHeaders (docs/ai/06 §4)', () => {
  it('sets every required header, the CSP enforced', () => {
    for (const key of [
      'content-security-policy',
      'strict-transport-security',
      'x-content-type-options',
      'referrer-policy',
      'x-frame-options',
      'permissions-policy',
    ]) {
      expect(headers.has(key), key).toBe(true);
    }
    expect(headers.has('content-security-policy-report-only')).toBe(false);
    expect(headers.get('x-content-type-options')).toBe('nosniff');
    expect(headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
  });

  it('never sends the deprecated X-XSS-Protection header', () => {
    expect(headers.has('x-xss-protection')).toBe(false);
  });

  it('allows framing by our own pages only (Designer Studio iframes)', () => {
    expect(headers.get('x-frame-options')).toBe('SAMEORIGIN');
  });
});

describe('the CSP (C53)', () => {
  it('without GTM: our own origin only, inline scripts allowed, no hash, no nonce, never eval', () => {
    const csp = parse(contentSecurityPolicy({ gtm: false, https: true, ids: ALL_IDS }));
    expect(csp['default-src']).toEqual(["'self'"]);
    expect(csp['script-src']).toEqual(["'self'", "'unsafe-inline'"]);
    expect(csp['connect-src']).toEqual(["'self'"]);
    expect(csp['img-src']).toEqual(["'self'", 'data:', 'blob:']);
    expect(csp['object-src']).toEqual(["'none'"]);
    expect(csp['frame-ancestors']).toEqual(["'self'"]);
    expect(csp['base-uri']).toEqual(["'self'"]);
    expect(csp['form-action']).toEqual(["'self'"]);
    const text = contentSecurityPolicy({ gtm: true, https: true, ids: ALL_IDS });
    expect(text).not.toMatch(/'unsafe-eval'|'sha256-|'nonce-|'strict-dynamic'/);
  });

  it('with GTM: GTM and its preview, then each vendor only once its ID is set', () => {
    const gtmOnly = parse(contentSecurityPolicy({ gtm: true, https: true, ids: NO_IDS }));
    expect(gtmOnly['script-src']).toEqual([
      "'self'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      'https://tagmanager.google.com',
    ]);
    expect(gtmOnly['connect-src']).not.toContain('https://*.google-analytics.com');
    const all = parse(contentSecurityPolicy({ gtm: true, https: true, ids: ALL_IDS }));
    expect(all['connect-src']).toEqual(
      expect.arrayContaining(['https://*.google-analytics.com', 'https://www.facebook.com', 'https://bat.bing.com']),
    );
    expect(all['script-src']).toEqual(
      expect.arrayContaining(['https://connect.facebook.net', 'https://bat.bing.com', 'https://snap.licdn.com']),
    );
    // bat.bing.com only, the host of Microsoft's official tag code: bat.bing.net appears in a Q&A
    // answer, not in Microsoft's documentation (plan finding 11)
    expect(contentSecurityPolicy({ gtm: true, https: true, ids: ALL_IDS })).not.toContain('bat.bing.net');
    for (const list of Object.values(all)) expect(new Set(list).size).toBe(list.length);
  });

  it('never names a Google Fonts host, even for GTM’s preview (05 §3, lesson 1)', () => {
    expect(contentSecurityPolicy({ gtm: true, https: true, ids: ALL_IDS })).not.toMatch(
      /fonts\.(googleapis|gstatic)\.com/,
    );
  });

  it('upgrades insecure requests only where the site is served over https', () => {
    expect(contentSecurityPolicy({ gtm: false, https: true })).toContain('upgrade-insecure-requests');
    expect(contentSecurityPolicy({ gtm: false, https: false })).not.toContain('upgrade-insecure-requests');
  });
});
