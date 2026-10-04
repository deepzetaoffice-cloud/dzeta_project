// trackEvent(): the only way the site reports an event (docs/ai/09 §2.3; P3 plan, F). Its types come
// from the taxonomy (src/lib/tracking/taxonomy.ts), so an unknown event, a missing parameter or a
// wrong value fails the typecheck. A retired event (C59: `book_call_click`, dropped by the owner) is
// refused the same way, in the types and at run time. Components never call gtag, sendGTMEvent, fbq
// or lintrk.
// - Each value is checked against its kind before it leaves: a value that doesn't fit is dropped, and
//   so is anything that looks like an email address or a phone number (09 §2.6). Nothing here takes
//   visitor-typed text in the first place; this is the second line.
// - The push waits for the next task (setTimeout 0): GTM runs its tags synchronously inside
//   dataLayer.push, and that work must never land inside a click's input delay (INP, 07 §1).
import {
  EVENT_PARAMS,
  isEventName,
  isRetired,
  type ActiveEventName,
  type EventName,
  type EventParams,
  type ParamSpec,
} from '@/lib/tracking/taxonomy';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// GA4's value limits (docs/ai/09 §3 rule 3)
const MAX = { value: 100, url: 1000, title: 300 } as const;
const ID = /^[a-z0-9][a-z0-9_-]*$/;
const DOMAIN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const EMAIL = /[^\s@/?#&=]+@[^\s@/?#&=]+\.[a-z]{2,}/i;
// Seven or more digits, with the usual separators: a phone number (an ID never contains spaces or +)
const PHONE = /(?:^|[^a-z0-9])\+?\d(?:[\s().-]?\d){6,}(?:$|[^a-z0-9])/i;

const looksPersonal = (value: string) => EMAIL.test(value) || PHONE.test(value);

// A page address without any query value that holds an email address (a form that echoes one
// into the URL would otherwise send it to GA4).
function cleanUrl(value: string): string | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  for (const [key, entry] of [...url.searchParams]) {
    if (EMAIL.test(entry)) url.searchParams.delete(key);
  }
  return url.href.slice(0, MAX.url);
}

export function cleanValue(spec: ParamSpec, value: unknown): string | number | undefined {
  if (spec.kind === 'number') return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  switch (spec.kind) {
    case 'enum':
      return spec.values.includes(text) ? text : undefined;
    case 'id':
      return ID.test(text) && text.length <= MAX.value && !looksPersonal(text) ? text : undefined;
    case 'domain': {
      const host = text.toLowerCase();
      return DOMAIN.test(host) && host.length <= MAX.value ? host : undefined;
    }
    case 'url':
      return cleanUrl(text);
    case 'title':
      return text && !looksPersonal(text) ? text.slice(0, MAX.title) : undefined;
  }
}

// The object pushed to the data layer: the event and its checked parameters, nothing else. An event
// that isn't in the taxonomy, or one the owner retired (C59), is never sent, whatever the types say.
export function eventPayload<E extends EventName>(
  event: E,
  params: EventParams<E>,
): Record<string, unknown> | undefined {
  if (!isEventName(event) || isRetired(event)) {
    if (process.env.NODE_ENV !== 'production') console.warn(`trackEvent: ${String(event)} isn't an active event`);
    return undefined;
  }
  const specs: Readonly<Record<string, ParamSpec>> = EVENT_PARAMS[event];
  const payload: Record<string, unknown> = { event };
  for (const [key, spec] of Object.entries(specs)) {
    const value = cleanValue(spec, (params as Record<string, unknown>)[key]);
    if (value !== undefined) payload[key] = value;
    else if (process.env.NODE_ENV !== 'production') console.warn(`trackEvent: ${event}.${key} dropped`);
  }
  return payload;
}

// Whether an address carries a click ID or a campaign tag: the tracking runtime checks it before
// importing the capture code (attribution.ts; attribution.test.ts keeps it in step with its keys).
export const HAS_ATTRIBUTION = /[?&](?:gclid|gbraid|wbraid|fbclid|li_fat_id|msclkid|utm_[a-z]+)=/;

// A page's content group (GA4's content_group): its first path segment, "home" for "/". It's read from
// the address, not looked up in the route table, so no table ships to the browser (P3 B5).
export function contentGroup(pathname: string): string {
  const first = pathname.split('/')[1]?.toLowerCase() ?? '';
  if (!first) return 'home';
  return ID.test(first) ? first : 'other';
}

type ParamsArg<E extends EventName> = keyof EventParams<E> extends never ? [] : [params: EventParams<E>];

export function trackEvent<E extends ActiveEventName>(event: E, ...[params]: ParamsArg<E>): void {
  if (typeof window === 'undefined') return;
  const payload = eventPayload(event, (params ?? {}) as EventParams<E>);
  if (!payload) return;
  setTimeout(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  }, 0);
}
