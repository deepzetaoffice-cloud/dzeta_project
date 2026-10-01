import { describe, expect, it } from 'vitest';
import { ACCOUNT_FORMATS, accounts } from '@/lib/tracking/accounts';
import { EVENT_NAMES, GA4_FIELDS, TAXONOMY, type EventSpec } from '@/lib/tracking/taxonomy';

// The taxonomy (docs/ai/09 §3; P3 plan, F): GA4's naming rules and limits, the owner's conversions,
// and the append-only rule. GA4's reserved names and limits are from its help pages
// (support.google.com/analytics/answer/13316687, /9267744, /12229528), read 2026-10-02.

const specs = TAXONOMY as Record<string, EventSpec>;

// Reserved for the web (13316687). page_view is used as GA4 means it, through Google's manual method.
const RESERVED_EVENTS = [
  'ad_impression',
  'app_remove',
  'app_store_refund',
  'app_store_subscription_cancel',
  'app_store_subscription_renew',
  'click',
  'error',
  'file_download',
  'first_open',
  'first_visit',
  'form_start',
  'form_submit',
  'in_app_purchase',
  'scroll',
  'session_start',
  'user_engagement',
  'view_complete',
  'video_complete',
  'video_progress',
  'video_start',
  'view_search_results',
];
const RESERVED_PARAMS = [
  'cid',
  'currency',
  'customer_id',
  'customerid',
  'dclid',
  'gclid',
  'session_id',
  'sessionid',
  'sfmc_id',
  'sid',
  'srsltid',
  'uid',
  'user_id',
  'userid',
];
const RESERVED_PREFIXES = ['_', 'firebase_', 'ga_', 'google_', 'gtag.'];

// The taxonomy as approved on 2026-10-02 (C55). Entries may be added; these never change or go.
const FROZEN: Record<string, string[]> = {
  page_view: ['page_location', 'page_title', 'content_group'],
  cta_click: ['cta_id', 'cta_location'],
  audit_start: ['form_id'],
  generate_lead: ['form_id', 'service_interest'],
  book_call_click: ['cta_location'],
  contact_click: ['method'],
  demo_open: ['demo_id'],
  agent_message_sent: ['turn'],
  calculator_complete: ['industry'],
  speed_test_request: ['form_id'],
  view_service: ['service_slug', 'pillar'],
  pricing_view: [],
  case_study_view: ['case_slug'],
  faq_expand: ['faq_id'],
  outbound_click: ['destination_domain'],
  newsletter_signup: ['form_id'],
  consent_update: ['consent_analytics', 'consent_marketing', 'consent_granted_now'],
};

const ga4Events = EVENT_NAMES.filter((name) => specs[name]!.ga4);
const customDimensions = [...new Set(ga4Events.flatMap((name) => Object.keys(specs[name]!.params)))].filter(
  (param) => !(GA4_FIELDS as readonly string[]).includes(param),
);

describe('the taxonomy (09 §3)', () => {
  it('is append-only: every approved event keeps its name and its parameters', () => {
    for (const [name, params] of Object.entries(FROZEN)) {
      expect(specs[name], name).toBeDefined();
      expect(Object.keys(specs[name]!.params), name).toEqual(expect.arrayContaining(params));
    }
  });

  it('names events as GA4 allows: <object>_<action>, a letter first, at most 40 characters', () => {
    for (const name of EVENT_NAMES) {
      expect(name, name).toMatch(/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/);
      expect(name.length, name).toBeLessThanOrEqual(40);
      expect(RESERVED_EVENTS, name).not.toContain(name);
    }
  });

  it('names parameters as GA4 allows, with no reserved name or prefix', () => {
    for (const name of EVENT_NAMES) {
      for (const param of Object.keys(specs[name]!.params)) {
        expect(param, `${name}.${param}`).toMatch(/^[a-z][a-z0-9_]{0,39}$/);
        expect(RESERVED_PARAMS, `${name}.${param}`).not.toContain(param);
        for (const prefix of RESERVED_PREFIXES) expect(param.startsWith(prefix), `${name}.${param}`).toBe(false);
      }
    }
  });

  it('keeps within GA4’s limits: 25 parameters an event, 50 custom dimensions, 30 key events', () => {
    for (const name of EVENT_NAMES) expect(Object.keys(specs[name]!.params).length, name).toBeLessThanOrEqual(25);
    expect(customDimensions.length).toBeLessThanOrEqual(50);
    expect(EVENT_NAMES.filter((name) => specs[name]!.keyEvent).length).toBeLessThanOrEqual(30);
  });

  it('marks the owner’s conversions: generate_lead primary, book_call_click and contact_click secondary', () => {
    const keyEvents = Object.fromEntries(
      EVENT_NAMES.filter((name) => specs[name]!.keyEvent).map((name) => [name, specs[name]!.keyEvent]),
    );
    expect(keyEvents).toEqual({
      generate_lead: 'primary',
      book_call_click: 'secondary',
      contact_click: 'secondary',
    });
    for (const name of Object.keys(keyEvents)) expect(specs[name]!.ga4, name).toBe(true);
  });

  it('sends page_view with GA4’s own fields only, and keeps consent_update out of GA4', () => {
    expect(Object.keys(specs.page_view!.params)).toEqual([...GA4_FIELDS]);
    expect(specs.consent_update!.ga4).toBe(false);
    expect(customDimensions).not.toContain('page_path');
    expect(customDimensions).not.toContain('source_page');
  });

  it('gives every enum a closed set of short, distinct values', () => {
    for (const name of EVENT_NAMES) {
      for (const [param, spec] of Object.entries(specs[name]!.params)) {
        if (spec.kind !== 'enum') continue;
        expect(spec.values.length, `${name}.${param}`).toBeGreaterThan(0);
        expect(new Set(spec.values).size, `${name}.${param}`).toBe(spec.values.length);
        for (const value of spec.values) expect(value.length, value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('has a LinkedIn conversion slot for exactly the events it marks for LinkedIn', () => {
    const marked = EVENT_NAMES.filter((name) => specs[name]!.linkedin).sort();
    expect(Object.keys(accounts.linkedinConversionIds).sort()).toEqual(marked);
  });
});

describe('the accounts’ IDs (accounts.ts)', () => {
  it('are null until sent, and in their shape once set', () => {
    const checks: [string | null, RegExp][] = [
      [accounts.ga4MeasurementId, ACCOUNT_FORMATS.ga4MeasurementId],
      [accounts.metaDatasetId, ACCOUNT_FORMATS.metaDatasetId],
      [accounts.linkedinPartnerId, ACCOUNT_FORMATS.linkedinPartnerId],
      [accounts.googleAdsCustomerId, ACCOUNT_FORMATS.googleAdsCustomerId],
      ...Object.values(accounts.linkedinConversionIds).map((id): [string | null, RegExp] => [
        id,
        ACCOUNT_FORMATS.linkedinConversionId,
      ]),
    ];
    for (const [id, format] of checks) if (id !== null) expect(id).toMatch(format);
  });
});
