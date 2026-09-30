---
name: add-tracking-event
description: Recipe for adding an analytics event to the deepzeta website safely (taxonomy first, trackEvent only, no PII, e2e check, owner GTM checklist). Use only inside an approved plan that explicitly asks for a tracking change.
argument-hint: "[event name and trigger]"
---

Event: $ARGUMENTS. Tracking files are **protected** (`docs/ai/09` §2). Continue only if the owner's request explicitly asks for a tracking change and an approved plan names the files. Otherwise stop and run `/plan-task`.

1. Read `docs/ai/09-analytics-tracking.md` fully.
2. **Taxonomy first:** propose the new row for `docs/ai/09` §3 (`snake_case` `<object>_<action>`, category, params; `value` numeric only). The owner adds it (rule files are owner-edited). Never rename an existing event.
3. Add the name to the typed event union in `src/lib/analytics.ts` (only if the plan lists that file).
4. Fire it with `trackEvent()` from the component. Never call `sendGTMEvent`, `gtag`, `fbq` or `lintrk` directly.
5. **No PII** in params (no names, emails, phones, free text).
6. Add/extend the unit test and the tracking e2e test: the event fires **exactly once** per trigger.
7. Gates: `test`, `build`, `test:e2e`. Report with evidence.
8. Write the owner's GTM checklist: trigger, tag, GA4 key event (if a conversion), Preview test, **publish the container**.
