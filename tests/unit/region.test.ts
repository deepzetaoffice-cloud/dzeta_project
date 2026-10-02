import { describe, expect, it } from 'vitest';
import {
  CONSENT_COUNTRIES,
  COUNTRY_HEADER,
  EEA_VALUE,
  PAGE_SOURCE,
  regionHeaderRules,
  regionTiming,
  ROW_VALUE,
} from '@/lib/tracking/region';

// The region hint (docs/ai/09 §2.7, C52; P3 plan, B). next.config anchors a `has` value, as this test
// does. Which paths get the hint is checked on `next start` by the e2e tests (tracking.spec.ts).

const matches = (value: string) => (country: string) => new RegExp(`^${value}$`).test(country);
const isEea = matches(EEA_VALUE);
const isRow = matches(ROW_VALUE);

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALL_CODES = [...LETTERS].flatMap((a) => [...LETTERS].map((b) => a + b));

describe('the consent countries', () => {
  it('are the EU 27, Iceland, Liechtenstein, Norway, the UK and Switzerland, once each', () => {
    expect(CONSENT_COUNTRIES).toHaveLength(32);
    expect(new Set(CONSENT_COUNTRIES).size).toBe(32);
    for (const code of CONSENT_COUNTRIES) expect(code).toMatch(/^[A-Z]{2}$/);
    expect(CONSENT_COUNTRIES).toEqual(expect.arrayContaining(['GR', 'IS', 'LI', 'NO', 'GB', 'CH']));
    expect(CONSENT_COUNTRIES).not.toContain('EL');
  });
});

describe('the two header rules', () => {
  it('send "eea" for each consent country and "row" for every other two-letter code, never both', () => {
    for (const code of ALL_CODES) {
      const eea = (CONSENT_COUNTRIES as readonly string[]).includes(code);
      expect([isEea(code), isRow(code)], code).toEqual([eea, !eea]);
    }
  });

  it('send nothing for anything that isn’t a two-letter code, so the page treats it as Europe', () => {
    for (const odd of ['', 'de', 'De', 'DEU', 'D', 'AE ', ' AE', 'A1']) {
      expect([isEea(odd), isRow(odd)], JSON.stringify(odd)).toEqual([false, false]);
    }
  });

  it('read Vercel’s country header on page paths, and send Server-Timing', () => {
    const rules = regionHeaderRules();
    expect(rules).toHaveLength(2);
    for (const rule of rules) {
      expect(rule.source).toBe(PAGE_SOURCE);
      expect(rule.has).toEqual([{ type: 'header', key: COUNTRY_HEADER, value: expect.any(String) }]);
    }
    expect(rules.map((rule) => rule.headers)).toEqual([
      [{ key: 'Server-Timing', value: 'dz-region;desc="eea"' }],
      [{ key: 'Server-Timing', value: 'dz-region;desc="row"' }],
    ]);
    expect(regionTiming('row')).toBe('dz-region;desc="row"');
  });
});
