// Consent (docs/ai/09 §2.7, conflict C52; P3 plan, C and E): the groups, the visitor's stored choice,
// and applying a new one. The init script (consent-init.ts) sets the defaults before the first paint
// from the constants and the rule below; consent-init.test.ts runs both over every case, so they
// can't drift apart.
// - Essential is always on. Analytics is analytics_storage; Marketing is ad_storage, ad_user_data and
//   ad_personalization (consent-copy.md §5). personalization_storage is denied: the site uses none.
//   Every type gets a value, because Google counts a type that's never set as granted.
// - The stored choice holds no personal data: a version, the two groups and when it was made. It's
//   asked again when the version changes (the groups or the banner's wording did) and after 12 months
//   (the privacy policy's promise).
import { trackEvent } from '@/lib/analytics';
import { REGION_TIMING, type Region } from '@/lib/tracking/region';
import type { GRANTED_NOW } from '@/lib/tracking/taxonomy';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = 'dz-consent';
export const CONSENT_VERSION = 1;
const DAY_MS = 24 * 60 * 60 * 1000;
export const CONSENT_MAX_AGE_MS = 365 * DAY_MS;
// A clock a little ahead of ours is fine; a choice dated far in the future is not a real one.
export const CONSENT_CLOCK_SKEW_MS = DAY_MS;
export const ASK_ATTRIBUTE = 'data-consent';
// The attribution touches (attribution.ts), kept here because withdrawing Marketing removes them, and
// this module is always loaded while the capture code loads only when needed.
export const FIRST_TOUCH_KEY = 'dz-attribution-first';
export const LAST_TOUCH_KEY = 'dz-attribution-last';
export const ATTRIBUTION_DAYS = 90;
// Whether an address carries a click ID or a campaign tag: the runtime checks it before importing the
// capture code (attribution.test.ts keeps it in step with ATTRIBUTION_KEYS).
export const HAS_ATTRIBUTION = /[?&](?:gclid|gbraid|wbraid|fbclid|li_fat_id|msclkid|utm_[a-z]+)=/;
export const ASK = 'ask';

export type Choice = { analytics: boolean; marketing: boolean };
type Stored = { v: number; a: 0 | 1; m: 0 | 1; t: number };

// The stored choice, or null when there's none that still counts.
export function parseStored(raw: string | null, now: number): Choice | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const { v, a, m, t } = value as Partial<Stored>;
  const flag = (x: unknown) => x === 0 || x === 1;
  if (v !== CONSENT_VERSION || !flag(a) || !flag(m) || typeof t !== 'number') return null;
  if (now - t > CONSENT_MAX_AGE_MS || t > now + CONSENT_CLOCK_SKEW_MS) return null;
  return { analytics: a === 1, marketing: m === 1 };
}

export const serializeChoice = ({ analytics, marketing }: Choice, now: number) =>
  JSON.stringify({ v: CONSENT_VERSION, a: analytics ? 1 : 0, m: marketing ? 1 : 0, t: now } satisfies Stored);

// The one rule, shared with the init script: a stored choice wins; otherwise visitors outside Europe
// are granted by default, and everyone else (Europe, or no hint) is asked, with nothing granted.
export function resolveConsent(region: Region | null, stored: Choice | null): { choice: Choice; ask: boolean } {
  if (stored) return { choice: stored, ask: false };
  if (region === 'row') return { choice: { analytics: true, marketing: true }, ask: false };
  return { choice: { analytics: false, marketing: false }, ask: true };
}

type State = 'granted' | 'denied';
const state = (on: boolean): State => (on ? 'granted' : 'denied');

// Consent Mode's types for a choice
export const consentModeState = ({ analytics, marketing }: Choice) => ({
  analytics_storage: state(analytics),
  ad_storage: state(marketing),
  ad_user_data: state(marketing),
  ad_personalization: state(marketing),
  functionality_storage: 'granted' as const,
  security_storage: 'granted' as const,
  personalization_storage: 'denied' as const,
});

// Which groups a choice newly granted: GTM's after-Accept triggers fire the page's blocked tags once.
export function grantedNow(before: Choice, after: Choice): (typeof GRANTED_NOW)[number] {
  const analytics = !before.analytics && after.analytics;
  const marketing = !before.marketing && after.marketing;
  if (analytics && marketing) return 'analytics marketing';
  if (analytics) return 'analytics';
  if (marketing) return 'marketing';
  return 'none';
}

// The region hint the CDN put on this page (region.ts), or null without one.
export function readRegion(): Region | null {
  try {
    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const hint = navigation?.serverTiming?.find((entry) => entry.name === REGION_TIMING)?.description;
    return hint === 'eea' || hint === 'row' ? hint : null;
  } catch {
    return null;
  }
}

function readStoredChoice(now: number): Choice | null {
  try {
    return parseStored(localStorage.getItem(CONSENT_KEY), now);
  } catch {
    return null;
  }
}

// What applies on this page now: the same answer the init script reached before the first paint.
export function currentConsent(now = Date.now()) {
  return resolveConsent(readRegion(), readStoredChoice(now));
}

// Deletes first-party cookies by name or name pattern, on this host and each parent domain (a tag
// may set them on the registrable domain, as GA4 does).
export function deleteCookies(names: readonly (string | RegExp)[]): void {
  const present = document.cookie
    .split(';')
    .map((pair) => pair.split('=')[0]!.trim())
    .filter((name) => names.some((pattern) => (typeof pattern === 'string' ? pattern === name : pattern.test(name))));
  const labels = location.hostname.split('.');
  const domains = labels.map((_, index) => labels.slice(index).join('.')).filter((domain) => domain.includes('.'));
  for (const name of present) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}`;
  }
}

export type WithdrawnCookies = Partial<Record<'analytics' | 'marketing', readonly (string | RegExp)[]>>;

// Applies a visitor's choice: stores it, tells Consent Mode, then reports it (consent_update) so GTM
// can fire the page's tags a new grant allows; a withdrawn group's cookies are deleted, and withdrawing
// Marketing removes the attribution touches. The page hears of it as a dz:consent event (the
// attribution capture waits for it).
export function applyChoice(choice: Choice, withdrawnCookies: WithdrawnCookies = {}): void {
  const before = currentConsent().choice;
  try {
    localStorage.setItem(CONSENT_KEY, serializeChoice(choice, Date.now()));
  } catch {
    // Storage blocked: the choice holds for this page only, and Europe is asked again next time.
  }
  window.gtag?.('consent', 'update', consentModeState(choice));
  trackEvent('consent_update', {
    consent_analytics: state(choice.analytics),
    consent_marketing: state(choice.marketing),
    consent_granted_now: grantedNow(before, choice),
  });
  for (const group of ['analytics', 'marketing'] as const) {
    if (before[group] && !choice[group]) deleteCookies(withdrawnCookies[group] ?? []);
  }
  if (before.marketing && !choice.marketing) {
    try {
      localStorage.removeItem(FIRST_TOUCH_KEY);
      localStorage.removeItem(LAST_TOUCH_KEY);
    } catch {
      // Storage blocked: nothing was stored.
    }
  }
  document.documentElement.removeAttribute(ASK_ATTRIBUTE);
  window.dispatchEvent(new CustomEvent('dz:consent', { detail: choice }));
}
