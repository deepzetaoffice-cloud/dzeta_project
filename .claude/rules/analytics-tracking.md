---
paths:
  - "src/lib/analytics*"
  - "src/lib/tracking/**"
  - "src/components/**/*Consent*"
  - "src/components/**/*Tracking*"
  - "src/components/layout/SiteDocument.tsx"
---

These are protected tracking/sitewide files. Read `docs/ai/09-analytics-tracking.md` first. Change them only if the owner's current request explicitly asks for it and an approved plan names the file.
Reminders: GTM by the site's own loader (`src/lib/tracking/gtm.ts`, C56), mounted once in the root document, never idle-deferred · `trackEvent()` only · taxonomy first · no PII · sitewide output mounted once.
