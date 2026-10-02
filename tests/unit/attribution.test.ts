import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ATTRIBUTION_KEYS,
  captureAttribution,
  readAttribution,
  storeTouch,
  touchFrom,
} from '@/lib/tracking/attribution';
import { HAS_ATTRIBUTION } from '@/lib/analytics';
import { ATTRIBUTION_DAYS, FIRST_TOUCH_KEY, LAST_TOUCH_KEY } from '@/lib/tracking/consent';

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
  function page(search: string) {
    const storage = memoryStorage();
    const listeners = new Map<string, (event: Event) => void>();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('location', { search, pathname: '/' });
    vi.stubGlobal('window', {
      addEventListener: (type: string, listener: (event: Event) => void) => listeners.set(type, listener),
      removeEventListener: (type: string) => listeners.delete(type),
    });
    const choose = (marketing: boolean) =>
      listeners.get('dz:consent')?.(new CustomEvent('dz:consent', { detail: { analytics: true, marketing } }));
    return { storage, choose, listeners };
  }

  it('stores at once with Marketing consent', () => {
    const { storage } = page('?utm_source=linkedin');
    captureAttribution(true);
    expect(storage.map.has(LAST_TOUCH_KEY)).toBe(true);
  });

  it('holds the touch without it, and stores it only when a choice grants Marketing', () => {
    const { storage, choose, listeners } = page('?gclid=abc');
    captureAttribution(false);
    expect(storage.map.size).toBe(0);
    choose(false);
    expect(storage.map.size).toBe(0);
    choose(true);
    expect(JSON.parse(storage.map.get(FIRST_TOUCH_KEY)!).params).toEqual({ gclid: 'abc' });
    expect(listeners.has('dz:consent')).toBe(false);
  });
});
