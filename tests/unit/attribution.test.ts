import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ATTRIBUTION_KEYS,
  captureAttribution,
  marketingGranted,
  readAttribution,
  storeTouch,
  touchFrom,
} from '@/lib/tracking/attribution';
import { HAS_ATTRIBUTION } from '@/lib/analytics';
import { consentInitScript } from '@/lib/tracking/consent-init';
import { ATTRIBUTION_DAYS, FIRST_TOUCH_KEY, LAST_TOUCH_KEY } from '@/lib/tracking/keys';

// Click IDs and campaign tags (docs/ai/09 §2.8; P3 plan, I and M): what's read from an address, the
// first and last touch, the 90 days, and the consent gate.

const NOW = Date.UTC(2026, 9, 2);
const DAY = 24 * 60 * 60 * 1000;

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('touchFrom', () => {
  it('takes the six click IDs and five campaign tags, nothing else', () => {
    const search = `?${ATTRIBUTION_KEYS.map((key) => `${key}=v-${key}`).join('&')}&email=a%40b.com&ref=x`;
    const touch = touchFrom(search, '/', NOW)!;
    expect(Object.keys(touch.params)).toEqual([...ATTRIBUTION_KEYS]);
    expect(touch).toMatchObject({ landing: '/', t: NOW });
  });

  it('keeps campaign names with spaces and accents, cuts at 200 characters, and drops anything else', () => {
    const touch = touchFrom(
      `?utm_campaign=Spring+Sale%C3%A9&utm_term=${'a'.repeat(300)}&gclid=Cj0K%3Cscript%3E`,
      '/x',
      NOW,
    )!;
    expect(touch.params.utm_campaign).toBe('Spring Saleé');
    expect(touch.params.utm_term).toHaveLength(200);
    expect(touch.params.gclid).toBeUndefined();
    expect(touchFrom('?utm_source=', '/', NOW)).toBeNull();
    expect(touchFrom('', '/', NOW)).toBeNull();
  });

  it('is what the runtime checks before importing the capture code', () => {
    for (const key of ATTRIBUTION_KEYS) expect(HAS_ATTRIBUTION.test(`?a=1&${key}=x`), key).toBe(true);
    expect(HAS_ATTRIBUTION.test('?ref=x&utmsource=y')).toBe(false);
  });
});

describe('storeTouch and readAttribution', () => {
  it('keeps the first touch and replaces the last', () => {
    const storage = memoryStorage();
    storeTouch(touchFrom('?utm_source=linkedin', '/', NOW)!, storage);
    storeTouch(touchFrom('?gclid=abc', '/services', NOW + DAY)!, storage);
    expect(JSON.parse(storage.map.get(FIRST_TOUCH_KEY)!).params).toEqual({ utm_source: 'linkedin' });
    expect(JSON.parse(storage.map.get(LAST_TOUCH_KEY)!).params).toEqual({ gclid: 'abc' });
  });

  it('replaces a first touch older than 90 days, and reads neither once they are', () => {
    const old = { params: { utm_source: 'old' }, landing: '/', t: NOW - (ATTRIBUTION_DAYS + 1) * DAY };
    const storage = memoryStorage({ [FIRST_TOUCH_KEY]: JSON.stringify(old), [LAST_TOUCH_KEY]: JSON.stringify(old) });
    vi.stubGlobal('localStorage', storage);
    expect(readAttribution(NOW)).toEqual({ first: null, last: null });
    storeTouch(touchFrom('?utm_source=new', '/', NOW)!, storage);
    expect(readAttribution(NOW).first?.params).toEqual({ utm_source: 'new' });
  });
});

describe('captureAttribution', () => {
  // dataLayer as the real consent init script leaves it: outside Europe Marketing is granted, in
  // Europe (with no stored choice) denied.
  function initDataLayer(region: 'row' | 'eea') {
    const win: { dataLayer?: unknown[] } = {};
    new Function('window', 'performance', 'localStorage', 'document', 'Date', consentInitScript)(
      win,
      { getEntriesByType: () => [{ serverTiming: [{ name: 'dz-region', description: region }] }] },
      { getItem: () => null },
      { documentElement: { setAttribute: () => {} } },
      Date,
    );
    return win.dataLayer ?? [];
  }

  function page(search: string, region: 'row' | 'eea' | null) {
    const storage = memoryStorage();
    const listeners = new Map<string, (event: Event) => void>();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('location', { search, pathname: '/' });
    vi.stubGlobal('window', {
      dataLayer: region ? initDataLayer(region) : [],
      addEventListener: (type: string, listener: (event: Event) => void) => listeners.set(type, listener),
      removeEventListener: (type: string) => listeners.delete(type),
    });
    const choose = (marketing: boolean) =>
      listeners.get('dz:consent')?.(new CustomEvent('dz:consent', { detail: { analytics: true, marketing } }));
    return { storage, choose, listeners };
  }

  // gtag('consent', 'update', {…}) as consent.ts pushes it (an arguments object; an array reads the same)
  const update = (state: Record<string, string>) => ['consent', 'update', state];

  it('reads Marketing consent from the latest consent entry in dataLayer, and anything else as not granted', () => {
    page('', 'row');
    expect(marketingGranted()).toBe(true);
    page('', 'eea');
    expect(marketingGranted()).toBe(false);
    page('', null);
    expect(marketingGranted()).toBe(false);
  });

  it('counts a choice made before the capture code arrived (the update after the default)', () => {
    const { storage } = page('?utm_source=linkedin', 'eea');
    const layer = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    layer.push(update({ ad_storage: 'granted', analytics_storage: 'granted' }), { event: 'consent_update' });
    expect(marketingGranted()).toBe(true);
    captureAttribution('?utm_source=linkedin', '/');
    expect(storage.map.has(LAST_TOUCH_KEY)).toBe(true);
    layer.push(update({ ad_storage: 'denied' }));
    expect(marketingGranted()).toBe(false);
  });

  it('stores at once with Marketing consent, from the landing’s address it’s given', () => {
    const { storage } = page('', 'row');
    captureAttribution('?utm_source=linkedin', '/services');
    expect(JSON.parse(storage.map.get(LAST_TOUCH_KEY)!)).toMatchObject({
      params: { utm_source: 'linkedin' },
      landing: '/services',
    });
  });

  it('holds the touch without it, and stores it only when a choice grants Marketing', () => {
    const { storage, choose, listeners } = page('', 'eea');
    captureAttribution('?gclid=abc', '/');
    expect(storage.map.size).toBe(0);
    choose(false);
    expect(storage.map.size).toBe(0);
    choose(true);
    expect(JSON.parse(storage.map.get(FIRST_TOUCH_KEY)!).params).toEqual({ gclid: 'abc' });
    expect(listeners.has('dz:consent')).toBe(false);
  });
});
