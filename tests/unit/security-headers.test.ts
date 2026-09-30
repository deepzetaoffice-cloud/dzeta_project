import { describe, expect, it } from 'vitest';
import { securityHeaders } from '@/lib/security-headers';

const headers = new Map(securityHeaders().map(({ key, value }) => [key.toLowerCase(), value]));

describe('securityHeaders (docs/ai/06 §4)', () => {
  it('sets every required header', () => {
    for (const key of [
      'content-security-policy-report-only',
      'strict-transport-security',
      'x-content-type-options',
      'referrer-policy',
      'x-frame-options',
      'permissions-policy',
    ]) {
      expect(headers.has(key), key).toBe(true);
    }
    expect(headers.get('x-content-type-options')).toBe('nosniff');
    expect(headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
  });

  it('keeps the CSP report-only in P0, without directives browsers reject there', () => {
    expect(headers.has('content-security-policy')).toBe(false);
    const csp = headers.get('content-security-policy-report-only') ?? '';
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('upgrade-insecure-requests');
  });

  it('never sends the deprecated X-XSS-Protection header', () => {
    expect(headers.has('x-xss-protection')).toBe(false);
  });

  it('allows framing by our own pages only (Designer Studio iframes)', () => {
    expect(headers.get('x-frame-options')).toBe('SAMEORIGIN');
  });
});
