---
paths:
  - "src/lib/analytics*"
  - "src/components/**/*Consent*"
  - "src/components/**/*Tracker*"
  - "src/app/layout.tsx"
---

These are protected tracking/sitewide files. Read `docs/ai/09-analytics-tracking.md` first. Change them only if the owner's current request explicitly asks for it and an approved plan names the file.
Reminders: GTM via `@next/third-parties` in the root layout only, never idle-deferred · `trackEvent()` only · taxonomy first · no PII · sitewide output mounted once.
