import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanValue, eventPayload, trackEvent } from '@/lib/analytics';

// trackEvent() (docs/ai/09 §2.3, §2.6, §4; P3 plan, F): the payload's shape, the checks on each value,
// and the push after a yield. Its types are checked by `typecheck`: the @ts-expect-error lines below
// fail the build if an unknown event or a wrong parameter ever type-checks.

describe('eventPayload', () => {
  it('pushes the event and its parameters, nothing else', () => {
    expect(eventPayload('cta_click', { cta_id: 'book_audit', cta_location: 'header' })).toEqual({
      event: 'cta_click',
      cta_id: 'book_audit',
      cta_location: 'header',
    });
    expect(eventPayload('pricing_view', {})).toEqual({ event: 'pricing_view' });
  });

  it('drops a value outside its enum', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error: not a contact method
    expect(eventPayload('contact_click', { method: 'fax' })).toEqual({ event: 'contact_click' });
    expect(warn).toHaveBeenCalledWith('trackEvent: contact_click.method dropped');
    warn.mockRestore();
  });
});

describe('cleanValue', () => {
  beforeEach(() => vi.spyOn(console, 'warn').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('takes ids as lowercase slugs only, never anything personal', () => {
    expect(cleanValue({ kind: 'id' }, 'ai-front-desk')).toBe('ai-front-desk');
    expect(cleanValue({ kind: 'id' }, 'audit_form')).toBe('audit_form');
    expect(cleanValue({ kind: 'id' }, 'Audit Form')).toBeUndefined();
    expect(cleanValue({ kind: 'id' }, 'name@example.com')).toBeUndefined();
    expect(cleanValue({ kind: 'id' }, '971-50-123-4567')).toBeUndefined();
    expect(cleanValue({ kind: 'id' }, 'a'.repeat(101))).toBeUndefined();
  });

  it('lowercases a domain and rejects anything else', () => {
    expect(cleanValue({ kind: 'domain' }, 'WWW.LinkedIn.com')).toBe('www.linkedin.com');
    expect(cleanValue({ kind: 'domain' }, 'https://linkedin.com')).toBeUndefined();
    expect(cleanValue({ kind: 'domain' }, 'localhost')).toBeUndefined();
  });

  it('keeps campaign tags and click IDs in the page address, and drops a query value holding an email', () => {
    const url = 'https://deepzeta.ai/?utm_source=linkedin&gclid=Cj0KCQ123&email=name%40example.com';
    expect(cleanValue({ kind: 'url' }, url)).toBe('https://deepzeta.ai/?utm_source=linkedin&gclid=Cj0KCQ123');
    expect(cleanValue({ kind: 'url' }, `https://deepzeta.ai/?x=${'a'.repeat(2000)}`)).toHaveLength(1000);
    expect(cleanValue({ kind: 'url' }, 'not a url')).toBeUndefined();
  });

  it('cuts a title to 300 characters, and takes numbers only when finite', () => {
    expect(cleanValue({ kind: 'title' }, 'T'.repeat(400))).toHaveLength(300);
    expect(cleanValue({ kind: 'title' }, '  ')).toBeUndefined();
    expect(cleanValue({ kind: 'number' }, 3)).toBe(3);
    expect(cleanValue({ kind: 'number' }, Number.NaN)).toBeUndefined();
    expect(cleanValue({ kind: 'number' }, '3')).toBeUndefined();
  });

  it('takes an enum value only from its set', () => {
    const spec = { kind: 'enum', values: ['granted', 'denied'] } as const;
    expect(cleanValue(spec, 'granted')).toBe('granted');
    expect(cleanValue(spec, 'GRANTED')).toBeUndefined();
  });
});

describe('trackEvent', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('does nothing on the server', () => {
    expect(() => trackEvent('outbound_click', { destination_domain: 'linkedin.com' })).not.toThrow();
  });

  it('pushes after a yield, so the push never runs inside the click', () => {
    vi.useFakeTimers();
    const win: { dataLayer?: unknown[] } = {};
    vi.stubGlobal('window', win);
    trackEvent('contact_click', { method: 'email' });
    expect(win.dataLayer ?? []).toEqual([]);
    vi.runAllTimers();
    expect(win.dataLayer).toEqual([{ event: 'contact_click', method: 'email' }]);
  });

  it('is typed by the taxonomy, and never sends an event it doesn’t know', () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const win: { dataLayer?: unknown[] } = {};
    vi.stubGlobal('window', win);
    // @ts-expect-error: an event that isn't in the taxonomy
    trackEvent('button_click', {});
    // @ts-expect-error: a missing parameter
    trackEvent('cta_click', { cta_id: 'book_audit' });
    // @ts-expect-error: an event with parameters needs them
    trackEvent('demo_open');
    trackEvent('pricing_view');
    vi.runAllTimers();
    expect(win.dataLayer).toEqual([
      { event: 'cta_click', cta_id: 'book_audit' },
      { event: 'demo_open' },
      { event: 'pricing_view' },
    ]);
    expect(warn).toHaveBeenCalledWith("trackEvent: button_click isn't in the taxonomy");
    warn.mockRestore();
  });
});
