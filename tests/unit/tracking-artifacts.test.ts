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

// The B0 round trip (guide B0, step C3, 2026-10-03): GTM accepted the generated test container, and
// its re-export (committed byte-identical as the fixture) equals the generated build after
// normalising what GTM legitimately changes: renumbered IDs and cross-references (each side mapped
// through its own ID map), added fingerprints, the target container's accountId/containerId,
// removed empty eventSettingsTable lists, and a dropped empty formatValue number format
// (DLV - turn). The comparison runs against .scratch/tracking-test-imported/ (the snapshot of the
// exact build the owner imported, gitignored); if that snapshot is absent the test is skipped, and
// the committed fixture itself is always checked for test IDs and the right shape.
describe('the GTM round trip (B0)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roundtrip: any = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/gtm/roundtrip-export.json'), 'utf8'));
  const rtVersion = roundtrip.containerVersion;

  it('the fixture is GTM\'s own export: test IDs only, and the counts match', () => {
    const text = JSON.stringify(roundtrip);
    expect(text).toContain('G-TEST123456');
    for (const realId of [accounts.ga4MeasurementId, accounts.metaDatasetId, accounts.microsoftUetTagId]) {
      if (realId !== null) expect(text).not.toContain(realId);
    }
    expect(rtVersion.tag.length).toBe(23);
    expect(rtVersion.trigger.length).toBe(20);
    expect(rtVersion.variable.length).toBe(20);
    expect(rtVersion.builtInVariable.length).toBe(5);
  });

  it('GTM\'s export equals the generated build after normalisation', () => {
    const snapshotPath = join(ROOT, '.scratch/tracking-test-imported/deepzeta-gtm-container.json');
    let snapshot: string;
    try {
      snapshot = readFileSync(snapshotPath, 'utf8');
    } catch {
      return; // the gitignored snapshot isn't around (fresh clone, cleaned scratch): nothing to diff
    }
    // The GTM export shape isn't a type we own; loose typing is the point of this comparison.
    type Json = Record<string, unknown> & { formatValue?: unknown; firingTriggerId?: unknown; parameter?: unknown[] };
    const generated = JSON.parse(snapshot) as { containerVersion: Record<string, Json[]> };

    const stripAndSort = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(stripAndSort);
      if (value === null || typeof value !== 'object') return value;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(value as Record<string, unknown>).sort()) {
        if (['fingerprint', 'accountId', 'containerId'].includes(key)) continue;
        out[key] = stripAndSort((value as Record<string, unknown>)[key]);
      }
      return out;
    };
    const dropEmptySettingsLists = (entity: Json): Json => {
      if (!Array.isArray(entity?.parameter)) return entity;
      return { ...entity, parameter: entity.parameter.filter((p) => !((p as Json).type === 'LIST' && ((p as Json).list as unknown[] | undefined)?.length === 0)) };
    };
    const normaliseFormatValue = (entity: Json): Json => {
      const fv = entity?.formatValue;
      if (!fv || typeof fv !== 'object') return entity;
      const clean: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(fv)) {
        if (val && typeof val === 'object' && Object.keys(val).length === 0) continue;
        clean[key] = val;
      }
      return { ...entity, formatValue: clean };
    };
    const idMap = (entities: Json[]): Map<string, string> =>
      new Map(entities.map((e) => [String(e.tagId ?? e.triggerId ?? e.variableId), String(e.name)]));
    const mapTriggers = (ids: unknown, map: Map<string, string>): unknown =>
      Array.isArray(ids)
        ? ids.map((id) => map.get(String(id)) ?? (String(id) === '2147479573' ? 'INIT' : `?${id}`)).sort()
        : ids;

    const byName = (list: Json[], map: Map<string, string>, idKey: string) => {
      const out = new Map<string, unknown>();
      for (const item of list) {
        const normalised = normaliseFormatValue(dropEmptySettingsLists(item));
        const cleaned = stripAndSort(normalised) as Record<string, unknown>;
        cleaned.firingTriggerId = mapTriggers(item.firingTriggerId, map);
        delete cleaned[idKey];
        out.set(String(item.name), cleaned);
      }
      return out;
    };

    const genVersion = generated.containerVersion;
    const rtTriggers = rtVersion.trigger as Json[];
    for (const kind of ['tag', 'trigger', 'variable'] as const) {
      const idKey = kind === 'tag' ? 'tagId' : kind === 'trigger' ? 'triggerId' : 'variableId';
      const genList = (genVersion[kind] ?? []) as Json[];
      const rtList = (rtVersion[kind] ?? []) as Json[];
      const genMap = idMap((genVersion.trigger ?? []) as Json[]);
      const expected = byName(genList, genMap, idKey);
      const actual = byName(rtList, idMap(rtTriggers), idKey);
      expect([...actual.keys()].sort()).toEqual([...expected.keys()].sort());
      for (const name of expected.keys()) {
        expect(JSON.stringify(actual.get(name)), `${kind} ${name} matches`).toBe(JSON.stringify(expected.get(name)));
      }
    }
    // Built-ins: type → name pairs.
    const genBuiltins = new Map(((genVersion.builtInVariable ?? []) as Json[]).map((b) => [String(b.type), String(b.name)]));
    const rtBuiltins = new Map((rtVersion.builtInVariable as Json[]).map((b) => [String(b.type), String(b.name)]));
    expect([...rtBuiltins.entries()].sort()).toEqual([...genBuiltins.entries()].sort());
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

  it('the export matches the reference fixture\'s structural shape (B0\'s first finding: the import refused the shape-less file)', () => {
    // The reference export (the owner's A8 file) is the only ground truth for GTM's undocumented
    // import format. Every top-level and containerVersion key the reference carries, the generated
    // container carries too (with our deterministic values), or the import shows "Not Found".
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reference: any = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/gtm/reference-export.json'), 'utf8'));
    const refVersion = reference.containerVersion;
    for (const key of Object.keys(refVersion)) {
      if (key === 'tag' || key === 'trigger' || key === 'variable' || key === 'builtInVariable') continue;
      expect(Object.hasOwn(cv, key), `containerVersion.${key} present`).toBe(true);
    }
    for (const key of Object.keys(reference)) {
      if (key === 'containerVersion') continue;
      expect(Object.hasOwn(container, key), `top-level ${key} present`).toBe(true);
    }
    // The container metadata block, with the fields the importer displays.
    for (const key of Object.keys(refVersion.container)) {
      expect(Object.hasOwn(cv.container, key), `containerVersion.container.${key} present`).toBe(true);
    }
    // Non-zero IDs (all-zero was refused).
    expect(cv.accountId).not.toBe('0');
    expect(cv.containerId).not.toBe('0');
  });

  it('lookup map rows use key/value, not parameter/parameterValue (B0\'s second finding)', () => {
    const lookup = variables.find((v: { type: string }) => v.type === 'smm');
    expect(lookup).toBeDefined();
    const rows = lookup.parameter.find((p: { key: string }) => p.key === 'map').list;
    expect(rows.length).toBe(2);
    for (const row of rows) {
      const keys = row.map.map((m: { key: string }) => m.key);
      expect(keys).toEqual(['key', 'value']);
    }
    const hosts = rows.map((r: { map: { key: string; value: string }[] }) => r.map.find((m) => m.key === 'key')?.value);
    expect(hosts).toEqual(['deepzeta.ai', 'www.deepzeta.ai']);
    // And the settings tables keep the reference's parameter/parameterValue shape.
    const googleTag = tags.find((t: { name: string }) => t.name === 'Google tag');
    const configRow = googleTag.parameter
      .find((p: { key: string }) => p.key === 'configSettingsTable')
      .list[0].map.map((m: { key: string }) => m.key);
    expect(configRow).toEqual(['parameter', 'parameterValue']);
  });

  it('the marketing tags fire on either production-host trigger, apex or www (B0\'s third finding)', () => {
    const apex = triggers.find((t: { name: string }) => t.name === 'WL - production');
    const www = triggers.find((t: { name: string }) => t.name === 'WL - production www');
    expect(apex).toBeDefined();
    expect(www).toBeDefined();
    for (const name of ['HTML - Meta base', 'UET - base']) {
      const tag = tags.find((t: { name: string }) => t.name === name);
      expect(tag.firingTriggerId).toContain(apex.triggerId);
      expect(tag.firingTriggerId).toContain(www.triggerId);
    }
  });

  it('no unreferenced constants (B0\'s fourth finding)', () => {
    // Every variable the generator writes is one of: a DLV for a taxonomy parameter (a parameter
    // the site sends with its event; its consumer may be a future tag, so existence — not use — is
    // what's guaranteed), or the traffic_type lookup (referenced by the Google tag). The finding
    // was the vendor-ID constants, which nothing referenced at all: they're gone.
    for (const v of variables) {
      const isDlv = v.type === 'v' && v.parameter.some((p: { key: string; value: string }) => p.key === 'name');
      expect(isDlv || v.type === 'smm', `${v.name} is a DLV or the lookup`).toBe(true);
    }
    const text = JSON.stringify(cv);
    expect(text).toContain('{{Lookup - traffic_type}}');
    expect(variables.some((v: { name: string }) => v.name.startsWith('Const -'))).toBe(false);
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

  it('the marketing base tags fire once per page (the owner\'s B0 note: window load and a later Accept are two triggers to one base)', () => {
    for (const name of ['HTML - Meta base', 'UET - base']) {
      const tag = tags.find((t: { name: string }) => t.name === name);
      expect(tag.tagFiringOption).toBe('ONCE_PER_PAGE');
    }
    for (const tag of tags) {
      if (['HTML - Meta base', 'UET - base'].includes(tag.name)) continue;
      expect(tag.tagFiringOption, `${tag.name} stays per event`).toBe('ONCE_PER_EVENT');
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
