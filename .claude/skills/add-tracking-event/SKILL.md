---
name: add-tracking-event
description: Recipe for adding an analytics event to the deepzeta website safely (taxonomy first, trackEvent only, no PII, e2e check, owner GTM checklist). Use only inside an approved plan that explicitly asks for a tracking change.
argument-hint: "[event name and trigger]"
---

Event: $ARGUMENTS. Tracking files are **protected** (`docs/ai/09` §2). Continue only if the owner's request explicitly asks for a tracking change and an approved plan names the files. Otherwise stop and run `/plan-task`.

1. Read `docs/ai/09-analytics-tracking.md` fully.
2. **Taxonomy first:** add the event to `src/lib/tracking/taxonomy.ts` (`EVENT_DETAILS`, `EVENT_PARAMS`; `snake_case` `<object>_<action>`, category, params; `value` numeric only) — the taxonomy file is the one source (C55), and only a plan that names it may change it. Never rename an existing event. An event the owner drops is marked `retired` there (never deleted; C59); `trackEvent()` refuses retired names in its types and at run time.
3. **Regenerate the artifacts:** `npm run tracking:build` — the GTM container (`docs/owner/tracking/deepzeta-gtm-container.json`), the GA4 tables and the human taxonomy table all come from the taxonomy file, and `tests/unit/tracking-artifacts.test.ts` fails until they match. A retired event must leave all four (no trigger, no tag, no table row).
4. Fire it with `trackEvent()` from the component. Never call `sendGTMEvent`, `gtag`, `fbq` or `lintrk` directly.
5. **No PII** in params (no names, emails, phones, free text).
6. Add/extend the unit test and the tracking e2e test: the event fires **exactly once** per trigger.
7. Gates: `test`, `build`, `test:e2e`. Report with evidence.
8. Write the owner's GTM checklist: a **new import file** from `npm run tracking:build` (never hand-edit tags in GTM), the GA4 key event (if a conversion) from `ga4-setup.md`, Preview test, **publish the container**.
