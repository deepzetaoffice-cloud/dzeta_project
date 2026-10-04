#!/usr/bin/env node
// The tracking generator (P3 part C, step C2; the P3 plan, section L; `npm run tracking:build`).
// Reads the taxonomy, the accounts and the vendors through Node's own TypeScript loader (as
// next.config imports them), and writes four files the owner copies or imports by hand:
//   docs/owner/tracking/deepzeta-gtm-container.json  the GTM import file
//   docs/owner/tracking/ga4-setup.md                 GA4's custom dimensions and key events
//   docs/owner/tracking/ads-conversions.md           Meta's and Microsoft's conversion tables
//   docs/owner/tracking/taxonomy.md                  the human table 09 §3 points to
// Deterministic (02 §1.5): fixed values and order (a fixed exportTime; fingerprints as fixed
// placeholders). Every shape comes from the owner's reference export
// (tests/fixtures/gtm/reference-export.json, guide A8): the type IDs (`googtag`, `gaawe`, `html`,
// `baut`), the parameter keys — lookup map rows are key/value, settings rows are
// parameter/parameterValue (B0's second finding) — the consentSettings and setupTag shapes, and the
// export's top level: exportTime, path, the container metadata block, fingerprint and tagManagerUrl
// (B0's first finding). A retired event (C59) gets no trigger, tag or table row. A vendor whose ID
// is null (LinkedIn, Google Ads) gets nothing. Microsoft's UET event tags carry no Tag ID (the
// template has no such field in Custom mode; the base config tag holds the ID — the owner's note,
// verified in the reference). UET auto SPA page tracking stays on (the owner's note, 2026-10-02):
// the site's page_view feeds GA4 only, UET produces its own exactly-one page view per page, and no
// UET tag is ever wired to the site's page_view, so nothing doubles. The marketing tags fire on
// either production-host trigger: the apex and www (B0's third finding; production serves on www
// until the redirect-direction fix). No Const variables for the vendor IDs (B0's fourth finding):
// nothing referenced them, and the reference inlines the IDs in its tags.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();

// --- The sources (the same values the site ships) ---------------------------------------------

const { accounts } = await import(pathToFileURL(join(root, 'src/lib/tracking/accounts.ts')).href);
const { EVENT_DETAILS, EVENT_NAMES, EVENT_PARAMS, GA4_FIELDS, isRetired } = await import(
  pathToFileURL(join(root, 'src/lib/tracking/taxonomy.ts')).href
);
// The vendors list isn't read here: the privacy-parity check compares the generated file's tags
// against vendorsInUse (tests/unit/tracking-artifacts.test.ts).

// GTM is served when NEXT_PUBLIC_GTM_ID is set; the generator assumes the live container (the file
// is imported at B1, after the variable is set at C5). Test-ID builds pass --test for B0's flow:
// they write to .scratch/tracking-test/ (gitignored), so a test run can never clobber the committed
// files the owner imports.
const testMode = process.argv.includes('--test');
const OUT_DIR = testMode ? '.scratch/tracking-test' : 'docs/owner/tracking';
const ga4Id = testMode ? 'G-TEST123456' : accounts.ga4MeasurementId;
const metaId = testMode ? '123456789012345' : accounts.metaDatasetId;
const uetId = testMode ? '1234567' : accounts.microsoftUetTagId;

const activeEvents = EVENT_NAMES.filter((name) => !isRetired(name));

// --- GTM entity builders (each shape copied from the reference export) -------------------------

// Non-zero account and container IDs (B0's first finding, 2026-10-03): GTM's importer refused the
// all-zero file with "Not Found". A workspace export carries the container's real IDs, and the
// reference (the owner's A8 export) carries its own; ours are fixed non-zero placeholders, so the
// build stays deterministic and never matches a real container. GTM remaps IDs to the target
// container on import.
const ACCOUNT_ID = '6379445400';
const CONTAINER_ID = '265930100';
let nextId = 10; // deterministic: tags from 10, triggers 30+ below (never colliding)

const id = () => String(nextId++);
const consent = (type) => ({
  consentStatus: 'NEEDED',
  consentType: { type: 'LIST', list: [{ type: 'TEMPLATE', value: type }] },
});
const param = (key, value) => ({ type: 'TEMPLATE', key, value: String(value) });
const boolean = (key, value) => ({ type: 'BOOLEAN', key, value: String(value) });
// A settings-table row (configSettingsTable / eventSettingsTable): parameter/parameterValue, the
// reference's shape (GTM-5WZ3ZJ7V_workspace2.json lines 56–70).
const setting = (parameter, parameterValue) => ({
  type: 'MAP',
  map: [param('parameter', parameter), param('parameterValue', parameterValue)],
});
// A lookup-table map row (smm's `map` list): key/value — NOT parameter/parameterValue. B0's second
// finding: GTM couldn't parse the lookup's rows written as settings rows and the import failed
// ("Not Found"); the reference's lookup uses key/value (lines 613–629).
const lookupRow = (key, value) => ({ type: 'MAP', map: [param('key', key), param('value', value)] });
const triggerRef = (name) => `{{${name}}}`;

// Variables: one Data Layer Variable per parameter (the {{DLV - name}} shape from the reference),
// constants for the vendor IDs, the traffic_type lookup (two rows: apex and www), and GTM's Page
// Hostname built-in (declared in builtInVariable, as the reference does).
const dlvName = (parameter) => `DLV - ${parameter}`;
const variables = [];
const addVariable = (name, type, parameter, formatValue = {}) =>
  variables.push({
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    variableId: id(),
    name,
    type,
    parameter,
    formatValue,
  });

const parameterNames = [...new Set(activeEvents.flatMap((event) => Object.keys(EVENT_PARAMS[event])))].sort();
for (const parameter of parameterNames) {
  addVariable(dlvName(parameter), 'v', [boolean('setDefaultValue', false), param('name', parameter)], {
    ...(parameter === 'turn' ? { number: {} } : {}),
  });
  // dataLayerVersion 2, as the reference writes it
  variables[variables.length - 1].parameter.unshift({ type: 'INTEGER', key: 'dataLayerVersion', value: '2' });
}

// (B0's fourth finding) No Const variables for the vendor IDs: nothing referenced them (the tags
// inline their IDs, exactly as the reference inlines G-TEST123456 in its googtag/gaawe tags), so
// they were dead weight the import would carry for nothing. 23 → 20 variables.

addVariable('Lookup - traffic_type', 'smm', [
  boolean('setDefaultValue', true),
  param('input', '{{Page Hostname}}'),
  param('defaultValue', 'internal'),
  {
    type: 'LIST',
    key: 'map',
    list: [lookupRow('deepzeta.ai', 'public'), lookupRow('www.deepzeta.ai', 'public')],
  },
]);

// Triggers: one Custom Event trigger per active taxonomy event, named exactly as the event (the
// tracking-parity rule); the two after-Accept triggers (the reference's shapes); the production-host
// Window Loaded trigger for the marketing tags.
const triggers = [];
const addTrigger = (name, type, extra) =>
  triggers.push({ accountId: ACCOUNT_ID, containerId: CONTAINER_ID, triggerId: id(), name, type, ...extra });

const eventFilter = (value) => ({
  type: 'EQUALS',
  parameter: [param('arg0', '{{_event}}'), param('arg1', value)],
});
for (const event of activeEvents) {
  addTrigger(event, 'CUSTOM_EVENT', { customEventFilter: [eventFilter(event)] });
}
addTrigger('CE - consent_update - analytics', 'CUSTOM_EVENT', {
  customEventFilter: [eventFilter('consent_update')],
  filter: [
    {
      type: 'CONTAINS',
      parameter: [param('arg0', triggerRef(dlvName('consent_granted_now'))), param('arg1', 'analytics')],
    },
  ],
});
addTrigger('CE - consent_update - marketing', 'CUSTOM_EVENT', {
  customEventFilter: [eventFilter('consent_update')],
  filter: [
    {
      type: 'CONTAINS',
      parameter: [param('arg0', triggerRef(dlvName('consent_granted_now'))), param('arg1', 'marketing')],
    },
  ],
});
// (B0's third finding) The production-host trigger matches both hosts. The export format ANDs the
// filter array, so OR is two triggers, each a single EQUALS row in the reference's exact shape: the
// canonical apex (0006) and www — production currently serves on www (the register's
// redirect-direction row), and the 301 www→apex isn't in place until the owner fixes it in Vercel.
// Preview hosts match neither, so they stay internal.
const productionTriggerNames = ['WL - production', 'WL - production www'];
addTrigger('WL - production', 'WINDOW_LOADED', {
  filter: [{ type: 'EQUALS', parameter: [param('arg0', '{{Page Hostname}}'), param('arg1', 'deepzeta.ai')] }],
});
addTrigger('WL - production www', 'WINDOW_LOADED', {
  filter: [{ type: 'EQUALS', parameter: [param('arg0', '{{Page Hostname}}'), param('arg1', 'www.deepzeta.ai')] }],
});

const triggerIdByName = Object.fromEntries(triggers.map((t) => [t.name, t.triggerId]));
const on = (name) => [triggerIdByName[name]];
// The marketing tags fire on either production-host trigger (the OR, B0's third finding).
const onProduction = () => productionTriggerNames.map((name) => triggerIdByName[name]);

// Tags. Every one has consentSettings (the reference's shape); none without. The marketing base
// tags fire ONCE_PER_LOAD (the owner's B0 note, 2026-10-03): each can be reached by two triggers —
// the window's load and a later Accept's consent_update — and the base must load its script only
// once (fbq and uetq guard it themselves, but the tag firing twice is still wrong). GTM's option is
// the guard. The export value is ONCE_PER_LOAD (GTM's UI "Once per load"; its importer rejected the
// first attempt's ONCE_PER_PAGE, which is no value it knows — the owner's B1 import, 2026-10-03).
// Everything else stays ONCE_PER_EVENT (an event tag firing twice would mean two events, which the
// parity e2e tests catch).
const tags = [];
const addTag = (name, type, parameter, firingTriggerId, consentType, setupTag, extra = {}) =>
  tags.push({
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    tagId: id(),
    name,
    type,
    parameter,
    firingTriggerId,
    tagFiringOption: 'ONCE_PER_EVENT',
    monitoringMetadata: { type: 'MAP' },
    consentSettings: consent(consentType),
    ...(setupTag ? { setupTag: [{ tagName: setupTag }] } : {}),
    ...extra,
  });
const addBaseTag = (name, type, parameter, firingTriggerId, consentType) =>
  tags.push({
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    tagId: id(),
    name,
    type,
    parameter,
    firingTriggerId,
    tagFiringOption: 'ONCE_PER_LOAD',
    monitoringMetadata: { type: 'MAP' },
    consentSettings: consent(consentType),
  });

if (ga4Id !== null) {
  // The Google tag: send_page_view false (the site reports pages itself), traffic_type from the
  // lookup; fires on Initialization and on the analytics after-Accept trigger (a page blocked before
  // Accept is configured then).
  addTag(
    'Google tag',
    'googtag',
    [param('tagId', ga4Id)],
    ['2147479573', triggerIdByName['CE - consent_update - analytics']],
    'analytics_storage',
    undefined,
    {
      parameter: [
        param('tagId', ga4Id),
        {
          type: 'LIST',
          key: 'configSettingsTable',
          list: [setting('send_page_view', 'false'), setting('traffic_type', triggerRef('Lookup - traffic_type'))],
        },
      ],
    },
  );

  // The page-view pair, Google's single-page-site method: a Google tag update (update: true, the
  // page's fields) sequenced before a GA4 Event tag page_view; both fire on the site's page_view and
  // on the analytics after-Accept trigger.
  addTag(
    'Google tag - update',
    'googtag',
    [
      param('tagId', ga4Id),
      {
        type: 'LIST',
        key: 'configSettingsTable',
        list: [
          setting('update', 'true'),
          setting('page_location', triggerRef(dlvName('page_location'))),
          setting('page_title', triggerRef(dlvName('page_title'))),
          setting('content_group', triggerRef(dlvName('content_group'))),
        ],
      },
    ],
    [triggerIdByName['page_view'], triggerIdByName['CE - consent_update - analytics']],
    'analytics_storage',
  );
  addTag(
    'GA4 - page_view',
    'gaawe',
    [
      boolean('sendEcommerceData', false),
      { type: 'LIST', key: 'eventSettingsTable', list: [] },
      param('eventName', 'page_view'),
      param('measurementIdOverride', ga4Id),
    ],
    [triggerIdByName['page_view'], triggerIdByName['CE - consent_update - analytics']],
    'analytics_storage',
    'Google tag - update',
  );

  // One GA4 Event tag per GA4 event, with exactly that event's parameters (per-event tags, so a
  // parameter left in the data layer by an earlier event can't leak into another).
  for (const event of activeEvents) {
    const details = EVENT_DETAILS[event];
    if (!details.ga4 || event === 'page_view') continue;
    addTag(
      `GA4 - ${event}`,
      'gaawe',
      [
        boolean('sendEcommerceData', false),
        {
          type: 'LIST',
          key: 'eventSettingsTable',
          list: Object.keys(EVENT_PARAMS[event]).map((p) => setting(p, triggerRef(dlvName(p)))),
        },
        param('eventName', event),
        param('measurementIdOverride', ga4Id),
      ],
      on(event),
      'analytics_storage',
    );
  }
}

if (metaId !== null) {
  // Meta's own GTM method, Custom HTML: the base code with PageView on the site's page_view and the
  // marketing after-Accept trigger; then fbq('track', …) per mapped event. ad_storage, production
  // host only, fired after the window's load (outside Europe it waits for the load; in Europe the
  // trigger itself waits for Accept).
  const baseHtml =
    `<script>\n` +
    `  !function(f,b,e,v,n,t,s)\n` +
    `  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n` +
    `  n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n` +
    `  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n` +
    `  n.queue=[];t=b.createElement(e);t.async=!0;\n` +
    `  t.src=v;s=b.getElementsByTagName(e)[0];\n` +
    `  s.parentNode.insertBefore(t,s)}(window,document,'script',\n` +
    `  'https://connect.facebook.net/en_US/fbevents.js');\n` +
    `  fbq('init', '${metaId}');\n` +
    `  fbq('track', 'PageView');\n` +
    `  </script>`;
  addBaseTag(
    'HTML - Meta base',
    'html',
    [{ type: 'TEMPLATE', key: 'html', value: baseHtml }, boolean('supportDocumentWrite', false)],
    [...onProduction(), triggerIdByName['CE - consent_update - marketing']],
    'ad_storage',
  );
  for (const event of activeEvents) {
    const meta = EVENT_DETAILS[event].meta;
    if (!meta || meta === 'PageView') continue;
    addTag(
      `HTML - Meta ${meta}`,
      'html',
      [
        {
          type: 'TEMPLATE',
          key: 'html',
          value: `<script>fbq('track', '${meta}');</script>`,
        },
        boolean('supportDocumentWrite', false),
      ],
      on(event),
      'ad_storage',
      'HTML - Meta base',
    );
  }
}

if (uetId !== null) {
  // The UET base tag (the template's exact fields, from the reference): PAGE_LOAD, auto page-view
  // and SPA tracking on, Inherit initial consent on (C60), Enable consent updates on (its default).
  // No Tag ID on the event tags below: the config tag is the only one that holds it.
  addBaseTag(
    'UET - base',
    'baut',
    [
      boolean('c_navTimingApi', false),
      param('tagId', uetId),
      boolean('c_consentInheritGtm', true),
      boolean('c_storeConvTrackCookies', true),
      param('uetqName', 'uetq'),
      boolean('c_removeQueryFromUrls', false),
      boolean('c_disableAutoPageView', false),
      boolean('c_enhancedConversion', false),
      boolean('c_consentUpdates', true),
      param('eventType', 'PAGE_LOAD'),
      boolean('c_enableAutoSpaTracking', true),
    ],
    [...onProduction(), triggerIdByName['CE - consent_update - marketing']],
    'ad_storage',
  );
  for (const event of activeEvents) {
    if (!EVENT_DETAILS[event].microsoft) continue;
    addTag(
      `UET - ${event}`,
      'baut',
      [param('uetqName', 'uetq'), param('customEventAction', event), param('eventType', 'CUSTOM')],
      on(event),
      'ad_storage',
      'UET - base',
    );
  }
}

// --- The container export ----------------------------------------------------------------------

// (B0's first finding) The top level matches the reference export's shape: exportTime, path, and the
// full container metadata block (name, publicId, usageContext, features, tagIds). GTM's importer
// showed "Not Found" without it. Deterministic values only — a fixed exportTime, placeholder IDs,
// the container named after the site — so two runs of the generator write identical bytes.
const EXPORT_TIME = '2026-10-03 00:00:00';
const containerPath = `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/versions/0`;
const container = {
  exportFormatVersion: 2,
  exportTime: EXPORT_TIME,
  containerVersion: {
    path: containerPath,
    accountId: ACCOUNT_ID,
    containerId: CONTAINER_ID,
    containerVersionId: '0',
    container: {
      path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`,
      accountId: ACCOUNT_ID,
      containerId: CONTAINER_ID,
      name: 'deepzeta.ai',
      publicId: 'GTM-GENERATED',
      usageContext: ['WEB'],
      fingerprint: '1000000000000',
      tagManagerUrl: `https://tagmanager.google.com/#/container/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces?apiLink=container`,
      features: {
        supportUserPermissions: true,
        supportEnvironments: true,
        supportWorkspaces: true,
        supportGtagConfigs: false,
        supportBuiltInVariables: true,
        supportClients: false,
        supportFolders: true,
        supportTemplates: true,
        supportTags: true,
        supportTriggers: true,
        supportVariables: true,
        supportVersions: true,
        supportZones: true,
        supportTransformations: false,
      },
      tagIds: ['GTM-GENERATED'],
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [
      { accountId: ACCOUNT_ID, containerId: CONTAINER_ID, type: 'PAGE_URL', name: 'Page URL' },
      { accountId: ACCOUNT_ID, containerId: CONTAINER_ID, type: 'PAGE_HOSTNAME', name: 'Page Hostname' },
      { accountId: ACCOUNT_ID, containerId: CONTAINER_ID, type: 'PAGE_PATH', name: 'Page Path' },
      { accountId: ACCOUNT_ID, containerId: CONTAINER_ID, type: 'REFERRER', name: 'Referrer' },
      { accountId: ACCOUNT_ID, containerId: CONTAINER_ID, type: 'EVENT', name: 'Event' },
    ],
    fingerprint: '1000000000000',
    tagManagerUrl: `https://tagmanager.google.com/#/container/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces?apiLink=container`,
  },
};

// --- The human tables ---------------------------------------------------------------------------

const mdEscape = (text) => text.replaceAll('|', '\\|');
const ga4Events = activeEvents.filter((event) => EVENT_DETAILS[event].ga4);
const customParams = [
  ...new Set(ga4Events.flatMap((event) => Object.keys(EVENT_PARAMS[event]).filter((p) => !GA4_FIELDS.includes(p)))),
].sort();
const keyEvents = activeEvents.filter((event) => EVENT_DETAILS[event].keyEvent);

const ga4Setup = `# GA4 setup (generated — copy each name exactly)

> Generated by \`npm run tracking:build\` from \`src/lib/tracking/taxonomy.ts\`. Never rename anything in a dashboard (guide §0): the site sends these exact names.
> Steps: guide B4 (custom dimensions) and B5 (key events).

## Custom dimensions (B4)

**Admin → Data display → Custom definitions → Create custom dimension.** One row each. **Scope: Event** (it can't be changed later). Data appears after 24–48 hours and isn't backdated, so do this before launch.

| Dimension name (= event parameter) | Event parameter |
|---|---|
${customParams.map((p) => `| \`${p}\` | \`${p}\` |`).join('\n')}

## Key events (B5)

**Admin → Data display → Events** → the star beside each event. An event appears there only after it has been received once (the B2 test sends them).

| Event | Key event | Notes |
|---|---|---|
${ga4Events
  .map((event) => {
    const d = EVENT_DETAILS[event];
    const note = d.keyEvent ? `\`keyEvent: ${d.keyEvent}\`` : '';
    return `| \`${event}\` | ${d.keyEvent ? '★ Yes' : '—'} | ${note} |`;
  })
  .join('\n')}

## Google Ads (postponed)

When Google Ads starts: link GA4 → Ads and import both key events as **primary** (your Q6; no Ads tag in the container, so nothing is counted twice).
`;

const adsRows = activeEvents.flatMap((event) => {
  const d = EVENT_DETAILS[event];
  const rows = [];
  if (metaId !== null && d.meta && d.meta !== 'PageView')
    rows.push(
      `| Meta | \`${event}\` | Standard event **${d.meta}** | Choose the optimisation event per ad set; both stay available |`,
    );
  if (uetId !== null && d.microsoft)
    rows.push(
      `| Microsoft Advertising | \`${event}\` | UET custom event, Action **\`${event}\`** (the taxonomy name exactly) | Goal type **Event**, counted as a conversion${d.keyEvent === 'primary' ? '; **primary**' : ''} |`,
    );
  return rows;
});

const adsConversions = `# Ad-platform conversions (generated — copy each name exactly)

> Generated by \`npm run tracking:build\` from \`src/lib/tracking/taxonomy.ts\`. Steps: guide B8.

| Platform | Event | What to create | Notes |
|---|---|---|---|
${adsRows.join('\n')}

## Notes

- **Microsoft Advertising:** **Tools → Conversion goals → Create conversion goal →** type **Event**, one per row, **named exactly as the event**. Category, Label and Value stay empty (the taxonomy name is the only identifier, by the tracking-parity rule). Microsoft's goal setting that makes a conversion "primary" is quoted in the guide at C4.
- **Meta:** the tags are already in the container (\`Lead\`, \`Contact\`, \`PageView\`). Nothing to create in Events Manager; choose the optimisation event per ad set.
- **Caveat (plan finding 5):** until the audit page (R002) ships, the header's "Book a free AI audit" is an email link, so every click on it is a \`contact_click\` and counts as a primary conversion.
- **LinkedIn and Google Ads are postponed** (your answers, 2026-10-02): their rows are added here in the same change that adds them to the container.
`;

const taxonomyTable = `# The event taxonomy (generated)

> Generated by \`npm run tracking:build\` from \`src/lib/tracking/taxonomy.ts\` — the one list of names (guide §0, rule 09 §3). The source is the code; this table is for people. \`Retired\` names stay reserved (append-only) but are never fired.

| Event | Category | Fired by | GA4 | Key event | Meta | Microsoft | Retired |
|---|---|---|---|---|---|---|---|
${EVENT_NAMES.map((event) => {
  const d = EVENT_DETAILS[event];
  return `| \`${event}\` | ${d.category} | ${mdEscape(d.firedBy)} | ${d.ga4 ? '✓' : '—'} | ${d.keyEvent ?? '—'} | ${d.meta ?? '—'} | ${d.microsoft ? '✓' : '—'} | ${d.retired ? 'Yes' : '—'} |`;
}).join('\n')}

## Parameters

${EVENT_NAMES.filter((event) => Object.keys(EVENT_PARAMS[event]).length > 0)
  .map((event) => {
    const params = Object.entries(EVENT_PARAMS[event])
      .map(([p, spec]) => `\`${p}\` (${spec.kind}${spec.kind === 'enum' ? `: ${spec.values.join(' | ')}` : ''})`)
      .join(', ');
    return `- **\`${event}\`**: ${mdEscape(params)}`;
  })
  .join('\n')}
`;

// --- Write --------------------------------------------------------------------------------------

const files = [
  ['deepzeta-gtm-container.json', `${JSON.stringify(container, null, 2)}\n`],
  ['ga4-setup.md', ga4Setup],
  ['ads-conversions.md', adsConversions],
  ['taxonomy.md', taxonomyTable],
];

for (const [name, content] of files) {
  const path = join(root, OUT_DIR, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

console.log(`tracking:build wrote ${files.length} files to ${OUT_DIR}${testMode ? ' (TEST IDs)' : ''}:`);
console.log(
  `  container: ${tags.length} tags, ${triggers.length} triggers, ${variables.length} variables, 5 built-ins`,
);
console.log(
  `  ga4-setup.md: ${customParams.length} custom dimensions, ${keyEvents.length} key events (of ${ga4Events.length} GA4 events)`,
);
console.log(
  `  vendors in the container: ${[ga4Id !== null && 'GA4', metaId !== null && 'Meta', uetId !== null && 'Microsoft'].filter(Boolean).join(', ')}`,
);
