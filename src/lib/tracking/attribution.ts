// Click IDs and campaign tags (docs/ai/09 §2.8; P3 plan, I): where a visitor came from, kept as the
// first touch and the last touch so P6's forms can send them to the CRM with the lead (n8n guide §8.1).
// - Written to the visitor's browser only with Marketing consent (granted by default outside Europe,
//   C52). The consent is read from dataLayer: the default the consent init script set from the stored
//   choice and the region, or a choice's update since, so a campaign landing doesn't load the consent
//   code as well. Until it's granted they're held in memory, and written if Accept comes on the same
//   page (consent.ts announces a choice with the dz:consent event). Withdrawing Marketing removes them
//   (consent.ts).
// - Each value is checked against a character allowlist and cut to 200 characters, and kept for 90
//   days, the longest Google Ads click window. Nothing here is personal: IDs and campaign names.
// The tracking runtime imports this module only when the landing's address carries one of the keys, on
// the visitor's first action (a scroll, a tap, a click or a key), and passes it the landing's address,
// so it's never in a campaign landing's first load (07 §2, 0021). Its storage keys and lifetime live
// in keys.ts, shared with the consent code and the cookie list.
import { ATTRIBUTION_DAYS, FIRST_TOUCH_KEY, LAST_TOUCH_KEY } from './keys';

export const ATTRIBUTION_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'li_fat_id',
  'msclkid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

const MAX_AGE_MS = ATTRIBUTION_DAYS * 24 * 60 * 60 * 1000;
const MAX_LENGTH = 200;
// Letters, digits, spaces and the punctuation campaign tags and click IDs use
const ALLOWED = /^[\p{L}\p{N} ._~:+%/|-]+$/u;

export type Touch = { params: Partial<Record<AttributionKey, string>>; landing: string; t: number };

// The touch an address carries, or null when it carries none.
export function touchFrom(search: string, landing: string, now: number): Touch | null {
  const query = new URLSearchParams(search);
  const params: Touch['params'] = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = query.get(key)?.trim().slice(0, MAX_LENGTH);
    if (value && ALLOWED.test(value)) params[key] = value;
  }
  return Object.keys(params).length > 0 ? { params, landing, t: now } : null;
}

function parseTouch(raw: string | null, now: number): Touch | null {
  if (!raw) return null;
  try {
    const touch = JSON.parse(raw) as Touch;
    return typeof touch?.t === 'number' && now - touch.t <= MAX_AGE_MS && typeof touch.params === 'object'
      ? touch
      : null;
  } catch {
    return null;
  }
}

// Stores a touch: the last touch always, the first touch only when there's none still in date.
export function storeTouch(touch: Touch, storage: Pick<Storage, 'getItem' | 'setItem'>): void {
  try {
    if (!parseTouch(storage.getItem(FIRST_TOUCH_KEY), touch.t)) storage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
    storage.setItem(LAST_TOUCH_KEY, JSON.stringify(touch));
  } catch {
    // Storage blocked: nothing is kept, which loses only the attribution.
  }
}

// What P6's forms send with a lead: the first and the last touch still in date.
export function readAttribution(now = Date.now()): { first: Touch | null; last: Touch | null } {
  try {
    return {
      first: parseTouch(localStorage.getItem(FIRST_TOUCH_KEY), now),
      last: parseTouch(localStorage.getItem(LAST_TOUCH_KEY), now),
    };
  } catch {
    return { first: null, last: null };
  }
}

// Whether Marketing is granted now: the latest gtag('consent', …) entry in dataLayer that sets
// ad_storage, an arguments object. That's the init script's default (dataLayer[0]) or a choice's update
// since (consent.ts), so a choice made before this module arrived counts too. Nothing counts as not
// granted.
export function marketingGranted(): boolean {
  const layer = window.dataLayer ?? [];
  for (let i = layer.length - 1; i >= 0; i--) {
    const entry = layer[i] as ArrayLike<unknown> | null | undefined;
    const state = entry?.[2] as { ad_storage?: unknown } | undefined;
    if (entry?.[0] === 'consent' && (entry[1] === 'default' || entry[1] === 'update') && state?.ad_storage) {
      return state.ad_storage === 'granted';
    }
  }
  return false;
}

// Captures the landing's touch (its query string and path): stored now with Marketing consent,
// otherwise held until a choice grants it.
export function captureAttribution(search: string, landing: string): void {
  const touch = touchFrom(search, landing, Date.now());
  if (!touch) return;
  if (marketingGranted()) {
    storeTouch(touch, localStorage);
    return;
  }
  const onChoice = (event: Event) => {
    if (!(event as CustomEvent<{ marketing: boolean }>).detail.marketing) return;
    window.removeEventListener('dz:consent', onChoice);
    storeTouch(touch, localStorage);
  };
  window.addEventListener('dz:consent', onChoice);
}
