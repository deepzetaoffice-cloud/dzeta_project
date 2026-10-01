import { describe, expect, it } from 'vitest';
import {
  CONSENT_KEY,
  CONSENT_MAX_AGE_MS,
  consentModeState,
  parseStored,
  resolveConsent,
  serializeChoice,
  type Choice,
} from '@/lib/tracking/consent';
import { consentInitScript } from '@/lib/tracking/consent-init';
import type { Region } from '@/lib/tracking/region';

// The consent init script (docs/ai/09 §2.2, §2.7; P3 plan, C and M) runs here against fake browser
// objects: the same string every page inlines. For every region hint and stored choice, dataLayer[0]
// must be Consent Mode's default with the values resolveConsent() gives, and the banner must be asked
// for exactly when resolveConsent() says so.

const NOW = Date.UTC(2026, 9, 2);

type Setup = {
  // What the page's Server-Timing says: a region, an odd value, nothing, or no serverTiming at all
  hint?: string | null | 'unsupported';
  stored?: string | null;
  storageThrows?: boolean;
};

function run({ hint = null, stored = null, storageThrows = false }: Setup = {}) {
  const attributes = new Map<string, string>();
  const window: { dataLayer?: unknown[]; gtag?: unknown } = {};
  const entry =
    hint === 'unsupported' ? {} : { serverTiming: hint === null ? [] : [{ name: 'dz-region', description: hint }] };
  const performance = { getEntriesByType: (type: string) => (type === 'navigation' ? [entry] : []) };
  const localStorage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('SecurityError');
      return key === CONSENT_KEY ? stored : null;
    },
  };
  const document = { documentElement: { setAttribute: (name: string, value: string) => attributes.set(name, value) } };
  const FakeDate = { now: () => NOW };
  new Function('window', 'performance', 'localStorage', 'document', 'Date', consentInitScript)(
    window,
    performance,
    localStorage,
    document,
    FakeDate,
  );
  return { window, attributes };
}

const isArguments = (value: unknown) => Object.prototype.toString.call(value) === '[object Arguments]';

describe('the consent init script', () => {
  it('makes the consent default dataLayer[0], pushed by gtag() as Google expects (an arguments object)', () => {
    const { window } = run({ hint: 'row' });
    expect(window.dataLayer).toHaveLength(1);
    expect(isArguments(window.dataLayer![0])).toBe(true);
    expect(Array.from(window.dataLayer![0] as ArrayLike<unknown>)).toEqual([
      'consent',
      'default',
      consentModeState({ analytics: true, marketing: true }),
    ]);
    expect(typeof window.gtag).toBe('function');
  });

  it('asks a European visitor, and grants nothing until they choose', () => {
    const { window, attributes } = run({ hint: 'eea' });
    expect(Array.from(window.dataLayer![0] as ArrayLike<unknown>)[2]).toEqual(
      consentModeState({ analytics: false, marketing: false }),
    );
    expect(attributes.get('data-consent')).toBe('ask');
  });

  it('grants a visitor outside Europe by default, with no banner', () => {
    const { attributes } = run({ hint: 'row' });
    expect(attributes.has('data-consent')).toBe(false);
  });

  it('treats no hint, an odd hint and a browser without serverTiming as Europe', () => {
    for (const hint of [null, 'ROW', 'unsupported', '']) {
      expect(run({ hint }).attributes.get('data-consent'), String(hint)).toBe('ask');
    }
  });

  it('survives blocked storage', () => {
    expect(run({ hint: 'row', storageThrows: true }).attributes.has('data-consent')).toBe(false);
    expect(run({ hint: 'eea', storageThrows: true }).attributes.get('data-consent')).toBe('ask');
  });

  it('agrees with resolveConsent() for every hint and stored choice', () => {
    const choices: Choice[] = [
      { analytics: true, marketing: true },
      { analytics: true, marketing: false },
      { analytics: false, marketing: true },
      { analytics: false, marketing: false },
    ];
    const storedValues: (string | null)[] = [
      null,
      ...choices.map((choice) => serializeChoice(choice, NOW - 1000)),
      serializeChoice(choices[0]!, NOW - CONSENT_MAX_AGE_MS - 1), // older than 12 months
      serializeChoice(choices[0]!, NOW + 3 * 24 * 60 * 60 * 1000), // dated in the future
      JSON.stringify({ v: 2, a: 1, m: 1, t: NOW }), // another version
      JSON.stringify({ v: 1, a: true, m: 1, t: NOW }), // a flag that isn't 0 or 1
      '{not json',
      'null',
    ];
    let cases = 0;
    for (const hint of ['eea', 'row', null, 'unsupported', 'XX'] as const) {
      for (const stored of storedValues) {
        const region: Region | null = hint === 'eea' || hint === 'row' ? hint : null;
        const expected = resolveConsent(region, parseStored(stored, NOW));
        const { window, attributes } = run({ hint, stored });
        const label = JSON.stringify({ hint, stored });
        expect(Array.from(window.dataLayer![0] as ArrayLike<unknown>)[2], label).toEqual(
          consentModeState(expected.choice),
        );
        expect(attributes.get('data-consent'), label).toBe(expected.ask ? 'ask' : undefined);
        cases++;
      }
    }
    expect(cases).toBe(5 * 11);
  });
});
