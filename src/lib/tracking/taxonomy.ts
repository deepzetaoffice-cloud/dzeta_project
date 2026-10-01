// The event taxonomy: the one source of every tracking name (docs/ai/09 §3, conflict C55; the owner's
// tracking-parity rule). trackEvent()'s types come from here, and so do the GTM container and the GA4
// tables (P3 plan, F and L), so a name typed anywhere else can't drift from it.
// APPEND-ONLY: an entry is added before anything fires it (docs/ai/04 §1.5), and names, parameters and
// enum values never change or disappear once added.
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

export type EventSpec = {
  category: 'navigation' | 'engagement' | 'lead' | 'contact' | 'content' | 'consent';
  // Who fires it, and from which phase: for people reading the generated table
  firedBy: string;
  // Sent to GA4 as an event of the same name; false means GTM only (a trigger for other tags)
  ga4: boolean;
  keyEvent?: KeyEvent;
  params: Readonly<Record<string, ParamSpec>>;
  // Meta's standard event for it (Meta's own GTM method, P3 plan L), when Meta is used
  meta?: 'PageView' | 'Lead' | 'Contact';
  // A LinkedIn event-specific conversion, once the owner sends its conversion ID (accounts.ts)
  linkedin?: boolean;
};

// Shared value sets. Values are APPEND-ONLY too.
export const CTA_IDS = ['book_audit'] as const;
export const CTA_LOCATIONS = ['header', 'sheet', 'sticky', 'finale', 'hero', 'page'] as const;
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;
export const PILLARS = ['ai', 'web', 'software', 'ranking'] as const;
export const CONSENT_STATES = ['granted', 'denied'] as const;
// Which groups a consent choice newly granted: the after-Accept triggers in GTM fire the page's tags
// that were blocked before it (Google: blocked tags never fire later by themselves).
export const GRANTED_NOW = ['analytics', 'marketing', 'analytics marketing', 'none'] as const;

// Google tag fields GA4 already knows (its config reference), so they need no custom dimension.
export const GA4_FIELDS = ['page_location', 'page_title', 'content_group'] as const;

export const TAXONOMY = {
  page_view: {
    category: 'navigation',
    firedBy: 'The tracker: each page load and client navigation (P3)',
    ga4: true,
    params: { page_location: { kind: 'url' }, page_title: { kind: 'title' }, content_group: { kind: 'id' } },
    meta: 'PageView',
  },
  cta_click: {
    category: 'engagement',
    firedBy: 'Any CTA, by its data-cta attribute (P3)',
    ga4: true,
    params: { cta_id: { kind: 'enum', values: CTA_IDS }, cta_location: { kind: 'enum', values: CTA_LOCATIONS } },
  },
  audit_start: {
    category: 'lead',
    firedBy: 'The audit form, its first field (P6)',
    ga4: true,
    params: { form_id: { kind: 'id' } },
  },
  generate_lead: {
    category: 'lead',
    firedBy: 'The audit form, sent successfully (P6)',
    ga4: true,
    keyEvent: 'primary',
    params: { form_id: { kind: 'id' }, service_interest: { kind: 'id' } },
    meta: 'Lead',
    linkedin: true,
  },
  book_call_click: {
    category: 'lead',
    firedBy: 'The booking sheet opened (P7)',
    ga4: true,
    keyEvent: 'secondary',
    params: { cta_location: { kind: 'enum', values: CTA_LOCATIONS } },
  },
  contact_click: {
    category: 'contact',
    firedBy: 'Any mailto:, tel: or wa.me link (P3)',
    ga4: true,
    keyEvent: 'secondary',
    params: { method: { kind: 'enum', values: CONTACT_METHODS } },
    meta: 'Contact',
  },
  demo_open: {
    category: 'engagement',
    firedBy: 'A live demo opened (P7)',
    ga4: true,
    params: { demo_id: { kind: 'id' } },
  },
  agent_message_sent: {
    category: 'engagement',
    firedBy: 'A visitor sends a message to the AI agent demo (P7)',
    ga4: true,
    params: { turn: { kind: 'number' } },
  },
  calculator_complete: {
    category: 'engagement',
    firedBy: 'The ROI calculator shows its result (P7)',
    ga4: true,
    params: { industry: { kind: 'id' } },
  },
  speed_test_request: {
    category: 'lead',
    firedBy: 'The 60-second speed-to-lead test, submitted (P7)',
    ga4: true,
    params: { form_id: { kind: 'id' } },
  },
  view_service: {
    category: 'content',
    firedBy: 'A service or solution page viewed (P6)',
    ga4: true,
    params: { service_slug: { kind: 'id' }, pillar: { kind: 'enum', values: PILLARS } },
  },
  pricing_view: {
    category: 'content',
    firedBy: 'The pricing page viewed (P6)',
    ga4: true,
    params: {},
  },
  case_study_view: {
    category: 'content',
    firedBy: 'A case study scrolled to 75% (P8)',
    ga4: true,
    params: { case_slug: { kind: 'id' } },
  },
  faq_expand: {
    category: 'engagement',
    firedBy: 'An FAQ item opened (P5/P6)',
    ga4: true,
    params: { faq_id: { kind: 'id' } },
  },
  outbound_click: {
    category: 'navigation',
    firedBy: 'A link to another site that is not a contact link (P3)',
    ga4: true,
    params: { destination_domain: { kind: 'domain' } },
  },
  newsletter_signup: {
    category: 'lead',
    firedBy: 'The newsletter form, sent successfully (later)',
    ga4: true,
    params: { form_id: { kind: 'id' } },
  },
  consent_update: {
    category: 'consent',
    firedBy: 'A consent choice: the banner or Cookie settings (P3)',
    ga4: false,
    params: {
      consent_analytics: { kind: 'enum', values: CONSENT_STATES },
      consent_marketing: { kind: 'enum', values: CONSENT_STATES },
      consent_granted_now: { kind: 'enum', values: GRANTED_NOW },
    },
  },
} as const satisfies Record<string, EventSpec>;

export type EventName = keyof typeof TAXONOMY;

type ValueOf<S> = S extends { kind: 'enum'; values: readonly (infer V)[] }
  ? V
  : S extends { kind: 'number' }
    ? number
    : string;

// The parameters an event takes, every one required.
export type EventParams<E extends EventName> = {
  -readonly [K in keyof (typeof TAXONOMY)[E]['params']]: ValueOf<(typeof TAXONOMY)[E]['params'][K]>;
};

export const EVENT_NAMES = Object.keys(TAXONOMY) as EventName[];

export const isEventName = (name: string): name is EventName => Object.hasOwn(TAXONOMY, name);
