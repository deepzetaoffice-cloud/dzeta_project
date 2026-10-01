import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyChoice,
  CONSENT_KEY,
  CONSENT_MAX_AGE_MS,
  consentModeState,
  deleteCookies,
  grantedNow,
  parseStored,
  resolveConsent,
  serializeChoice,
} from '@/lib/tracking/consent';

// Consent (docs/ai/09 §2.7, C52; P3 plan, C, E and M): the stored choice, the rule, Consent Mode's
// values, what a choice newly grants, and applying a choice in a page.

const NOW = Date.UTC(2026, 9, 2);
const ALL = { analytics: true, marketing: true };
const NONE = { analytics: false, marketing: false };

describe('the stored choice', () => {
  it('round-trips, holding no personal data: a version, two flags and a time', () => {
    const raw = serializeChoice({ analytics: true, marketing: false }, NOW);
    expect(JSON.parse(raw)).toEqual({ v: 1, a: 1, m: 0, t: NOW });
    expect(parseStored(raw, NOW)).toEqual({ analytics: true, marketing: false });
  });

  it('stops counting after 12 months, or with another version, or when it is not ours', () => {
    expect(parseStored(serializeChoice(ALL, NOW - CONSENT_MAX_AGE_MS), NOW)).toEqual(ALL);
    expect(parseStored(serializeChoice(ALL, NOW - CONSENT_MAX_AGE_MS - 1), NOW)).toBeNull();
    expect(parseStored(JSON.stringify({ v: 2, a: 1, m: 1, t: NOW }), NOW)).toBeNull();
    for (const raw of [null, '', '{', '[]', '"x"', JSON.stringify({ v: 1, a: 2, m: 1, t: NOW })]) {
      expect(parseStored(raw, NOW), String(raw)).toBeNull();
    }
  });
});

describe('the rule', () => {
  it('lets a stored choice win, grants outside Europe by default, and asks everyone else', () => {
    expect(resolveConsent('eea', NONE)).toEqual({ choice: NONE, ask: false });
    expect(resolveConsent('row', NONE)).toEqual({ choice: NONE, ask: false });
    expect(resolveConsent('row', null)).toEqual({ choice: ALL, ask: false });
    expect(resolveConsent('eea', null)).toEqual({ choice: NONE, ask: true });
    expect(resolveConsent(null, null)).toEqual({ choice: NONE, ask: true });
  });

  it('sets every Consent Mode type, Marketing as the three ad types', () => {
    expect(consentModeState({ analytics: true, marketing: false })).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      personalization_storage: 'denied',
    });
  });

  it('names what a choice newly grants, for GTM’s after-Accept triggers', () => {
    expect(grantedNow(NONE, ALL)).toBe('analytics marketing');
    expect(grantedNow(NONE, { analytics: true, marketing: false })).toBe('analytics');
    expect(grantedNow({ analytics: true, marketing: false }, ALL)).toBe('marketing');
    expect(grantedNow(ALL, ALL)).toBe('none');
    expect(grantedNow(ALL, NONE)).toBe('none');
  });
});

describe('in a page', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // A page with a cookie jar that records what each write asked for.
  function page({ region, stored = null }: { region: 'eea' | 'row' | null; stored?: string | null }) {
    const jar = new Map<string, string>([
      ['_ga', 'GA1.1.1'],
      ['_ga_ABC123', 'GS1'],
      ['_fbp', 'fb.1'],
      ['dz-other', 'x'],
    ]);
    const writes: string[] = [];
    const storage = new Map<string, string>(stored ? [[CONSENT_KEY, stored]] : []);
    const attributes = new Map<string, string>([['data-consent', 'ask']]);
    const win = { dataLayer: [] as unknown[], gtag: vi.fn(), dispatchEvent: vi.fn() };
    vi.stubGlobal('window', win);
    vi.stubGlobal('performance', {
      getEntriesByType: () => [{ serverTiming: region ? [{ name: 'dz-region', description: region }] : [] }],
    });
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
    vi.stubGlobal('location', { hostname: 'www.deepzeta.ai' });
    vi.stubGlobal('document', {
      get cookie() {
        return [...jar].map(([name, value]) => `${name}=${value}`).join('; ');
      },
      set cookie(value: string) {
        writes.push(value);
        if (/Max-Age=0/.test(value)) jar.delete(value.split('=')[0]!);
      },
      documentElement: { removeAttribute: (name: string) => attributes.delete(name) },
    });
    return { win, storage, jar, writes, attributes };
  }

  it('Accept all: stores it, updates Consent Mode, then reports what it newly granted, and the banner goes', () => {
    vi.useFakeTimers();
    const { win, storage, attributes } = page({ region: 'eea' });
    applyChoice(ALL);
    expect(parseStored(storage.get(CONSENT_KEY) ?? null, Date.now())).toEqual(ALL);
    expect(win.gtag).toHaveBeenCalledWith('consent', 'update', consentModeState(ALL));
    expect(win.dataLayer).toEqual([]);
    vi.runAllTimers();
    expect(win.dataLayer).toEqual([
      {
        event: 'consent_update',
        consent_analytics: 'granted',
        consent_marketing: 'granted',
        consent_granted_now: 'analytics marketing',
      },
    ]);
    expect(attributes.has('data-consent')).toBe(false);
  });

  it('switching Analytics off outside Europe deletes its cookies on the host and the parent domain', () => {
    vi.useFakeTimers();
    const { jar, writes } = page({ region: 'row' });
    applyChoice({ analytics: false, marketing: true }, { analytics: ['_ga', /^_ga_/], marketing: ['_fbp'] });
    expect([...jar.keys()]).toEqual(['_fbp', 'dz-other']);
    expect(writes).toContain('_ga=; Max-Age=0; Path=/; Domain=deepzeta.ai');
    expect(writes).toContain('_ga_ABC123=; Max-Age=0; Path=/; Domain=www.deepzeta.ai');
    vi.runAllTimers();
  });

  it('withdrawing Marketing removes the attribution touches, and every choice is announced as dz:consent', () => {
    vi.useFakeTimers();
    const { win, storage } = page({ region: 'row' });
    storage.set('dz-attribution-first', '{}');
    storage.set('dz-attribution-last', '{}');
    applyChoice({ analytics: true, marketing: false });
    expect(storage.has('dz-attribution-first')).toBe(false);
    expect(storage.has('dz-attribution-last')).toBe(false);
    const [event] = win.dispatchEvent.mock.calls[0]! as [CustomEvent];
    expect([event.type, event.detail]).toEqual(['dz:consent', { analytics: true, marketing: false }]);
    vi.runAllTimers();
  });

  it('deletes only the cookies it is given, never a group that stays granted', () => {
    const { jar } = page({ region: 'row' });
    deleteCookies([/^_ga/]);
    expect([...jar.keys()]).toEqual(['_fbp', 'dz-other']);
  });
});
