import { describe, expect, it } from 'vitest';
import { buildAbsoluteUrl } from '@/lib/url';

const origin = 'https://deepzeta.ai';

describe('buildAbsoluteUrl', () => {
  it('returns the bare origin for the home page (no trailing slash)', () => {
    expect(buildAbsoluteUrl(origin, '/', 'en')).toBe('https://deepzeta.ai');
  });

  it('keeps English paths unprefixed', () => {
    expect(buildAbsoluteUrl(origin, '/services/ai-automation', 'en')).toBe(
      'https://deepzeta.ai/services/ai-automation',
    );
  });

  it.each(['services', '/services/', '/services?ref=x', '/services#faq'])('rejects the path %s', (path) => {
    expect(() => buildAbsoluteUrl(origin, path, 'en')).toThrow(/absoluteUrl/);
  });
});
