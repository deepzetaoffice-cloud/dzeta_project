import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { accounts } from '@/lib/tracking/accounts';
import {
  EVENT_DETAILS,
  EVENT_NAMES,
  EVENT_PARAMS,
  GA4_FIELDS,
  isRetired,
  type EventDetails,
  type EventName,
} from '@/lib/tracking/taxonomy';
import { vendorsInUse } from '@/lib/tracking/vendors';

// The tracking artifacts (P3 plan, section L "Keeping them in step"; docs/ai/09 §4): the committed
// generated files equal a fresh generation, and the container matches the taxonomy and the vendors.
// The generator reads the TypeScript sources through Node's loader, so these tests call the script
// the same way `npm run tracking:build` does.

const ROOT = process.cwd();
const OUT = 'docs/owner/tracking';
const run = (args: string[] = []) =>
  execFileSync('node', ['--disable-warning=MODULE_TYPELESS_PACKAGE_JSON', 'scripts/build-tracking.mjs', ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });

// The container's shape is the reference export's (a GTM file), not a type we own; loose typing is
// the point here: the tests check the shape itself.
const readGenerated = (name: string) => readFileSync(join(ROOT, OUT, name), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const container: any = JSON.parse(readGenerated('deepzeta-gtm-container.json'));
const cv = container.containerVersion;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tags: any[] = cv.tag;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const triggers: any[] = cv.trigger;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const variables: any[] = cv.variable;

// The taxonomy's const objects narrow to literal unions; these give the wide view the checks need.
const detailsOf = (event: EventName): EventDetails => EVENT_DETAILS[event] as EventDetails;
const paramsOf = (event: EventName): readonly string[] => Object.keys(EVENT_PARAMS[event]);
const ga4Fields = GA4_FIELDS as readonly string[];
const tagNames = new Set(tags.map((t) => t.name));
const triggerNames = new Set(triggers.map((t) => t.name));
const variableNames = new Set(variables.map((v) => v.name));

const activeEvents = EVENT_NAMES.filter((name) => !isRetired(name));

describe('the committed files equal a fresh generation', () => {
  it('deepzeta-gtm-container.json, ga4-setup.md, ads-conversions.md, taxonomy.md', () => {
    const before = ['deepzeta-gtm-container.json', 'ga4-setup.md', 'ads-conversions.md', 'taxonomy.md'].map(readGenerated);
    run(); // a real run, not --test: the committed files hold the real IDs
    const after = ['deepzeta-gtm-container.json', 'ga4-setup.md', 'ads-conversions.md', 'taxonomy.md'].map(readGenerated);
    expect(after).toEqual(before);
  });
});

describe('the --test build holds test IDs only (guide B0; the round-trip fixture re-exports it)', () => {
  const TEST_OUT = '.scratch/tracking-test';

  it('no real account ID appears in the test container, and the test values are the guide A8 ones', () => {
    run(['--test']);
    const testContainer = readFileSync(join(ROOT, TEST_OUT, 'deepzeta-gtm-container.json'), 'utf8');
    // The three public IDs that ship in accounts.ts must never appear in a B0 test file.
    for (const realId of [accounts.ga4MeasurementId, accounts.metaDatasetId, accounts.microsoftUetTagId]) {
      if (realId !== null) expect(testContainer).not.toContain(realId);
    }
    // The test values are exactly the guide A8 ones (G-TEST123456, and the digits placeholders).
    expect(testContainer).toContain('G-TEST123456');
    expect(JSON.parse(testContainer).containerVersion.tag.some((t: { type: string }) => t.type === 'baut')).toBe(true);
  });
});

describe('the container matches the taxonomy', () => {
  it('every active event has a trigger named exactly as the event; retired ones have none', () => {
    for (const event of activeEvents) expect(triggerNames.has(event)).toBe(true);
    for (const event of EVENT_NAMES.filter((e) => isRetired(e))) {
      expect(triggerNames.has(event)).toBe(false);
      expect([...tagNames].some((name) => (name as string).includes(event))).toBe(false);
    }
  });

  it('every GA4 event has a tag whose event name and parameters equal the taxonomy', () => {
    for (const event of activeEvents) {
      // page_view rides the Google tag update instead (its own test below)
      if (!detailsOf(event).ga4 || event === 'page_view') continue;
      const tag = tags.find((t) => t.name === `GA4 - ${event}`);
      expect(tag, `GA4 tag for ${event}`).toBeDefined();
      expect(tag.parameter.find((p: { key: string }) => p.key === 'eventName').value).toBe(event);
      const settings = tag.parameter.find((p: { key: string }) => p.key === 'eventSettingsTable');
      const sent = new Set(
        (settings?.list ?? []).map(
          (row: { map: { key: string; value: string }[] }) => row.map.find((m) => m.key === 'parameter')?.value,
        ),
      );
      expect([...sent].sort()).toEqual([...paramsOf(event)].sort());
    }
  });

  it("page_view's parameters ride the Google tag update (Google's single-page-site method)", () => {
    // The GA4 Event tag fires page_view with no parameters of its own; the sequenced Google tag
    // update sets page_location, page_title and content_group as config settings, and GA4 reads
    // them from the config (developers.google.com, single-page applications with GTM).
    const event = tags.find((t) => t.name === 'GA4 - page_view');
    expect(event).toBeDefined();
    expect(event.parameter.find((p: { key: string }) => p.key === 'eventSettingsTable').list).toEqual([]);
    const update = tags.find((t) => t.name === 'Google tag - update');
    const config = update.parameter.find((p: { key: string }) => p.key === 'configSettingsTable');
    const setParams = (config.list as { map: { key: string; value: string }[] }[]).map((row) =>
      row.map.find((m) => m.key === 'parameter')?.value,
    );
    expect(setParams).toEqual(['update', 'page_location', 'page_title', 'content_group']);
    expect(event.setupTag?.[0]?.tagName).toBe('Google tag - update');
  });

  it('every parameter has a Data Layer Variable; every {{reference}} resolves', () => {
    for (const parameter of new Set(activeEvents.flatMap((e) => Object.keys(EVENT_PARAMS[e])))) {
      expect(variableNames.has(`DLV - ${parameter}`), `DLV - ${parameter}`).toBe(true);
    }
    const text = JSON.stringify(cv);
    for (const match of text.matchAll(/{{((?!_event|Page Hostname)[^}]+)}}/g) ?? []) {
      expect(variableNames.has(match[1]) || tagNames.has(match[1]), `reference {{${match[1]}}} resolves`).toBe(true);
    }
  });

  it('every tag has consent settings; no Custom JavaScript Variables (jsm); no vendor without an ID', () => {
    for (const tag of tags) {
      expect(tag.consentSettings?.consentStatus).toBe('NEEDED');
      expect(tag.consentSettings?.consentType?.list?.length).toBeGreaterThan(0);
    }
    expect(variables.every((v: { type: string }) => v.type !== 'jsm')).toBe(true);
    const hasGa4 = accounts.ga4MeasurementId !== null;
    const hasMeta = accounts.metaDatasetId !== null;
    const hasMicrosoft = accounts.microsoftUetTagId !== null;
    expect(tags.some((t) => t.type === 'googtag')).toBe(hasGa4);
    expect(tags.some((t) => t.type === 'gaawe')).toBe(hasGa4);
    expect(tags.some((t) => t.name === 'HTML - Meta base')).toBe(hasMeta);
    expect(tags.some((t) => t.name === 'UET - base')).toBe(hasMicrosoft);
    expect(tags.some((t) => t.name.includes('LinkedIn'))).toBe(accounts.linkedinPartnerId !== null);
  });

  it('the UET event tags carry no Tag ID (the template has none in Custom mode); the base holds it', () => {
    const base = tags.find((t) => t.name === 'UET - base');
    expect(base?.parameter.find((p: { key: string }) => p.key === 'tagId')?.value).toBe(accounts.microsoftUetTagId);
    for (const event of activeEvents.filter((e) => detailsOf(e).microsoft)) {
      const tag = tags.find((t) => t.name === `UET - ${event}`);
      expect(tag, `UET - ${event}`).toBeDefined();
      expect(tag.parameter.find((p: { key: string }) => p.key === 'tagId')).toBeUndefined();
      expect(tag.parameter.find((p: { key: string }) => p.key === 'customEventAction')?.value).toBe(event);
      expect(tag.setupTag?.[0]?.tagName).toBe('UET - base');
    }
  });

  it('keeps UET auto SPA page tracking on, and no UET tag is fired by the site page_view', () => {
    const base = tags.find((t) => t.name === 'UET - base');
    expect(base?.parameter.find((p: { key: string }) => p.key === 'c_enableAutoSpaTracking')?.value).toBe('true');
    expect(base?.parameter.find((p: { key: string }) => p.key === 'c_disableAutoPageView')?.value).toBe('false');
    const pageViewTriggerId = triggers.find((t) => t.name === 'page_view')?.triggerId;
    for (const tag of tags.filter((t) => t.type === 'baut')) {
      expect(tag.firingTriggerId).not.toContain(pageViewTriggerId);
    }
  });
});

describe('the GA4 tables list exactly the taxonomy', () => {
  const ga4Setup = readGenerated('ga4-setup.md');

  it('the custom dimensions are the taxonomy custom parameters, and nothing else', () => {
    const expected = [
      ...new Set(
        activeEvents
          .filter((e) => detailsOf(e).ga4)
          .flatMap((e) => paramsOf(e).filter((p) => !ga4Fields.includes(p))),
      ),
    ].sort();
    for (const parameter of expected) expect(ga4Setup).toContain(`\`${parameter}\` | \`${parameter}\``);
    for (const field of GA4_FIELDS) expect(ga4Setup).not.toContain(`\`${field}\` | \`${field}\``);
  });

  it('the key events are the taxonomy key events', () => {
    for (const event of activeEvents.filter((e) => detailsOf(e).keyEvent)) {
      expect(ga4Setup).toContain(`\`${event}\``);
    }
    for (const event of EVENT_NAMES.filter((e) => isRetired(e))) {
      expect(ga4Setup).not.toContain(`\`${event}\``);
    }
  });
});

describe('privacy parity (the register row: the policy names exactly the tools in the container)', () => {
  it('the vendors in the container equal the vendors in use (the CSP and cookie list)', () => {
    const inUse = vendorsInUse({ gtm: true }, accounts).map((v) => v.id);
    // gtm_preview is Tag Assistant's preview session (CSP-only, no container tags): it stands with
    // GTM itself, so both are present exactly when the container exists.
    const containerVendors = ['gtm', 'gtm_preview', 'ga4', 'meta', 'microsoft', 'linkedin'].filter((id) => {
      if (id === 'ga4') return tags.some((t) => t.type === 'googtag' || t.type === 'gaawe');
      if (id === 'meta') return tags.some((t) => t.name.startsWith('HTML - Meta'));
      if (id === 'microsoft') return tags.some((t) => t.type === 'baut');
      if (id === 'linkedin') return tags.some((t) => t.name.includes('LinkedIn'));
      return true; // gtm and its preview
    });
    expect([...containerVendors].sort()).toEqual([...inUse].sort());
  });

  it('no LinkedIn or Google Ads tag exists while their IDs are null', () => {
    if (accounts.linkedinPartnerId === null) {
      expect(tags.every((t) => !t.name.toLowerCase().includes('linkedin'))).toBe(true);
    }
    if (accounts.googleAdsCustomerId === null) {
      expect(tags.every((t) => !t.name.toLowerCase().includes('google ads'))).toBe(true);
    }
  });
});
