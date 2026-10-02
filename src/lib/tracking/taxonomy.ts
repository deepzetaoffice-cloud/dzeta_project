// The event taxonomy: the one source of every tracking name (docs/ai/09 §3, conflict C55; the owner's
// tracking-parity rule). trackEvent()'s types come from here, and so do the GTM container and the GA4
// tables (P3 plan, F and L), so a name typed anywhere else can't drift from it.
// APPEND-ONLY: an entry is added before anything fires it (docs/ai/04 §1.5), and names, parameters and
// enum values never change or disappear once added.
// Two objects with the same events: EVENT_PARAMS is all the browser needs (trackEvent() checks each
// value by it), and EVENT_DETAILS is for the generator, the tests and people (who fires it, GA4, key
// events, vendor mappings), so none of that ships to visitors. taxonomy.test.ts keeps their keys equal.
//
// Imported by scripts and next.config through Node's own TypeScript loader: keep relative imports with
// explicit `.ts` extensions and type-only syntax in this file.

// How a parameter's value is checked before it's sent (analytics.ts). No kind takes visitor-typed text.
// - enum: one of a closed set
// - id: a slug or identifier (lowercase letters, digits, `-`, `_`)
// - domain: a host name, lowercased
// - url: the page's own address, GA4's page_location (up to 1,000 characters)
// - title: the page's own title, from our metadata (up to 300 characters)
// - number: a finite number
export type ParamSpec =
  | { kind: 'enum'; values: readonly string[] }
  | { kind: 'id' }
  | { kind: 'domain' }
  | { kind: 'url' }
  | { kind: 'title' }
  | { kind: 'number' };

export type KeyEvent = 'primary' | 'secondary';

export type EventDetails = {
  category: 'navigation' | 'engagement' | 'lead' | 'contact' | 'content' | 'consent';
  // Who fires it, and from which phase: for people reading the generated table
  firedBy: string;
  // Sent to GA4 as an event of the same name; false means GTM only (a trigger for other tags)
  ga4: boolean;
  keyEvent?: KeyEvent;
  // Dropped by the owner (2026-10-02): the name stays reserved (append-only) but is never fired, is not
  // a key event, and is in no container or table. trackEvent() refuses it in its types and at run time
  // (ActiveEventName, analytics.ts; C59).
  retired?: string;
  // Meta's standard event for it (Meta's own GTM method, P3 plan L), when Meta is used
  meta?: 'PageView' | 'Lead' | 'Contact';
  // A Microsoft UET custom event: its Action is the taxonomy name exactly (tracking parity)
  microsoft?: true;
  // A LinkedIn event-specific conversion, once the owner sends its conversion ID (accounts.ts)
  linkedin?: boolean;
};

// Shared value sets. Values are APPEND-ONLY too.
export const CTA_IDS = ['book_audit'] as const;
export const CTA_LOCATIONS = ['header', 'sheet', 'sticky', 'finale', 'page'] as const;
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;
export const PILLARS = ['ai', 'web', 'software', 'ranking'] as const;
export const CONSENT_STATES = ['granted', 'denied'] as const;
// Which groups a consent choice newly granted: the after-Accept triggers in GTM fire the page's tags
// that were blocked before it (Google: blocked tags never fire later by themselves).
export const GRANTED_NOW = ['analytics', 'marketing', 'analytics marketing', 'none'] as const;

// Google tag fields GA4 already knows (its config reference), so they need no custom dimension.
export const GA4_FIELDS = ['page_location', 'page_title', 'content_group'] as const;

const id = { kind: 'id' } as const;
const ctaLocation = { kind: 'enum', values: CTA_LOCATIONS } as const;

export const EVENT_PARAMS = {
  page_view: { page_location: { kind: 'url' }, page_title: { kind: 'title' }, content_group: id },
  cta_click: { cta_id: { kind: 'enum', values: CTA_IDS }, cta_location: ctaLocation },
  audit_start: { form_id: id },
  generate_lead: { form_id: id, service_interest: id },
  book_call_click: { cta_location: ctaLocation },
  contact_click: { method: { kind: 'enum', values: CONTACT_METHODS } },
  demo_open: { demo_id: id },
  agent_message_sent: { turn: { kind: 'number' } },
  calculator_complete: { industry: id },
  speed_test_request: { form_id: id },
  view_service: { service_slug: id, pillar: { kind: 'enum', values: PILLARS } },
  pricing_view: {},
  case_study_view: { case_slug: id },
  faq_expand: { faq_id: id },
  outbound_click: { destination_domain: { kind: 'domain' } },
  newsletter_signup: { form_id: id },
  consent_update: {
    consent_analytics: { kind: 'enum', values: CONSENT_STATES },
    consent_marketing: { kind: 'enum', values: CONSENT_STATES },
    consent_granted_now: { kind: 'enum', values: GRANTED_NOW },
  },
} as const satisfies Record<string, Readonly<Record<string, ParamSpec>>>;

export type EventName = keyof typeof EVENT_PARAMS;

export const EVENT_DETAILS = {
  page_view: {
    category: 'navigation',
    firedBy: 'The tracker: each page load and client navigation (P3)',
    ga4: true,
    meta: 'PageView',
  },
  cta_click: { category: 'engagement', firedBy: 'Any CTA, by its data-cta attribute (P3)', ga4: true },
  audit_start: { category: 'lead', firedBy: 'The audit form, its first field (P6)', ga4: true },
  generate_lead: {
    category: 'lead',
    firedBy: 'The audit form, sent successfully (P6)',
    ga4: true,
    keyEvent: 'primary',
    meta: 'Lead',
    microsoft: true,
    linkedin: true,
  },
  book_call_click: {
    category: 'lead',
    firedBy: 'The booking sheet opened (P7)',
    ga4: true,
    retired: '2026-10-02, the owner: never sent',
  },
  contact_click: {
    category: 'contact',
    firedBy: 'Any mailto:, tel: or wa.me link (P3)',
    ga4: true,
    keyEvent: 'primary',
    meta: 'Contact',
    microsoft: true,
  },
  demo_open: { category: 'engagement', firedBy: 'A live demo opened (P7)', ga4: true },
  agent_message_sent: {
    category: 'engagement',
    firedBy: 'A visitor sends a message to the AI agent demo (P7)',
    ga4: true,
  },
  calculator_complete: { category: 'engagement', firedBy: 'The ROI calculator shows its result (P7)', ga4: true },
  speed_test_request: {
    category: 'lead',
    firedBy: 'The 60-second speed-to-lead test, submitted (P7)',
    ga4: true,
  },
  view_service: { category: 'content', firedBy: 'A service or solution page viewed (P6)', ga4: true },
  pricing_view: { category: 'content', firedBy: 'The pricing page viewed (P6)', ga4: true },
  case_study_view: { category: 'content', firedBy: 'A case study scrolled to 75% (P8)', ga4: true },
  faq_expand: { category: 'engagement', firedBy: 'An FAQ item opened (P5/P6)', ga4: true },
  outbound_click: {
    category: 'navigation',
    firedBy: 'A link to another site that is not a contact link (P3)',
    ga4: true,
  },
  newsletter_signup: { category: 'lead', firedBy: 'The newsletter form, sent successfully (later)', ga4: true },
  consent_update: {
    category: 'consent',
    firedBy: 'A consent choice: the banner or Cookie settings (P3)',
    ga4: false,
  },
} as const satisfies Record<EventName, EventDetails>;

type ValueOf<S> = S extends { kind: 'enum'; values: readonly (infer V)[] }
  ? V
  : S extends { kind: 'number' }
    ? number
    : string;

// The parameters an event takes, every one required.
export type EventParams<E extends EventName> = {
  -readonly [K in keyof (typeof EVENT_PARAMS)[E]]: ValueOf<(typeof EVENT_PARAMS)[E][K]>;
};

export const EVENT_NAMES = Object.keys(EVENT_PARAMS) as EventName[];

// The events trackEvent() accepts and the generator writes: every name except the retired ones (C59).
// Derived, so a future retirement drops out of both by itself.
export type ActiveEventName = {
  [K in EventName]: (typeof EVENT_DETAILS)[K] extends { retired: string } ? never : K;
}[EventName];

export const isEventName = (name: string): name is EventName => Object.hasOwn(EVENT_PARAMS, name);

// Whether a name is retired: trackEvent() refuses it at run time, and the generator skips it.
export const isRetired = (name: EventName): boolean => Object.hasOwn(EVENT_DETAILS[name], 'retired');
