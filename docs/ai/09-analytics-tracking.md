# 09 · Analytics, Tracking & Consent

> **Applies to:** analytics, pixels, consent, lead forms, CRM hand-off · **Precedence:** below 00 · **Last reviewed:** 2026-10-02

Tracking code is fragile and failures are silent. These rules are strict on purpose.

---

## 1. Architecture

```
Components ──trackEvent()──► src/lib/analytics.ts ──► window.dataLayer ──► GTM container
                                                                            ├─ GA4
                                                                            ├─ Microsoft Advertising (UET)
                                                                            ├─ Meta Pixel (+ server CAPI)
                                                                            └─ LinkedIn Insight (+ CAPI) — after launch
Lead form ──► server action ──(signed webhook)──► n8n ──► Google Sheet (CRM v0; HubSpot/Zoho later)
            (PII goes here only, never through GTM)   ├─► Gmail auto-reply + owner alert
                                                      ├─► WhatsApp Cloud API
                                                      └─► server-side CAPI events (Meta, LinkedIn)
Google Ads ◄── scheduled offline-conversion import from the Sheet
```

---

## 2. Rules

1. **One loader:** Google Tag Manager, loaded by the site's own loader (`src/lib/tracking/gtm.ts`, [C56](conflict-register.md)) from the tracking runtime, once per document in the **root document only**. It does what Google's container snippet does, after hydration. Never hand-paste GTM or gtag snippets elsewhere. Never load gtag.js directly alongside GTM (double counting).
2. **`dataLayer[0]` rule:** an inline script in the root layout initialises `window.dataLayer` and the **Consent Mode v2 defaults** before GTM loads. GTM loads at normal priority. **Never idle-defer GTM** (the reference project lost GA4 data this way). Other vendor scripts may be deferred.
3. **`trackEvent()` only.** Components never call `sendGTMEvent`, `gtag`, `fbq` or `lintrk` directly.
4. **Taxonomy first:** an event is added to the table in §3 (APPEND-ONLY) **before** any component fires it. Names are `snake_case` `<object>_<action>`. Existing names never change; an event the owner drops is marked **retired** in the taxonomy, never deleted, and `trackEvent()` refuses it in its types and at run time ([C59](conflict-register.md)).
5. **`value` is numeric only**; string details go in named params.
6. **No PII through GTM or the dataLayer** (names, emails, phones, messages). PII goes only to the server route → CRM and server-side conversion APIs (hashed where the vendor requires).
7. **Consent Mode v2, by region** ([C52](conflict-register.md); the owner, 2026-10-02):
   - **Visitors from the EEA, the UK and Switzerland** see the consent banner, and every analytics and advertising tag waits for their choice (basic consent mode: no tag fires before Accept, not even Google's cookieless pings).
   - **Every other visitor** gets analytics and advertising consent granted by default, with no banner, and can switch either off at any time in Cookie settings, in every footer.
   - **The region** comes from Vercel's `x-vercel-ip-country` through a CDN header rule (`Server-Timing: dz-region`), so pages stay static. A missing or unreadable region counts as Europe.
   - The defaults are set in `dataLayer[0]` before GTM loads, never also by a GTM template; the banner is mounted once in the root document. Consent wording follows `docs/content-drafts/legal/consent-copy.md`.
   - **Microsoft's UET follows the same rule** (its Basic consent mode, [C60](conflict-register.md)): the tag requires `ad_storage`, so it fires only after Accept in Europe and with the default grant elsewhere. The GTM template's **Inherit initial consent** option stays on, so an Accept made before a tag's trigger still counts.
8. **Click IDs** (`gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `msclkid`) and UTM parameters are captured (first touch + last touch) into hidden form fields and sent to the CRM with the lead. They're written to the visitor's browser only with Marketing consent (granted by default outside Europe); until then they're held in memory. The capture code loads on the visitor's first action on the landing page (a scroll, a tap, a click or a key), so it's never in a page's first load; a visitor who leaves without one isn't recorded (the owner, 2026-10-02).
   - **Campaign-link rule (added at C4, 2026-10-02):** every link to `https://deepzeta.ai` placed outside the site itself carries exactly three parameters — `utm_source`, `utm_medium` and `utm_campaign` — with values the site's campaign table names, `snake_case`, letters, digits and `_` only (the capture code's allowlist accepts up to 200 characters, but the rule stays short). Click IDs (`gclid`, `msclkid`…) are never typed by hand: each ad platform appends its own. A link with no tags is never "fixed" by adding them by hand later; a new link is generated instead, so attribution stays truthful. The Business Profile's website link is the one exception in shape: it carries `utm_source=google&utm_medium=organic&utm_campaign=business_profile`, because local search has no ad click ID to pair with.
9. **Page-view tracker** mounted once in the root layout (inside `<Suspense>`), never also in nested layouts.
10. **Dashboard work** (GTM tags/triggers, **publishing the container**, GA4 key events, Ads/Meta/LinkedIn setup) is done by the owner from a checklist the agent writes. Never assume it's done.
11. If server-side conversion APIs are used alongside browser pixels, send the same `event_id` from both for deduplication.

**Protected files (once built):** `src/lib/analytics.ts`, `src/lib/tracking/taxonomy.ts`, `src/lib/tracking/consent.ts` and `consent-init.ts` (the dataLayer and consent defaults), `src/components/layout/ConsentBanner.tsx`, `ConsentSettings.tsx` and `TrackingRuntime.tsx`, `src/lib/tracking/gtm.ts` (the GTM loader, C56), `src/lib/tracking/clicks.ts` and `attribution.ts`, form tracking hooks. Changing them requires a request that explicitly asks for a tracking change, a plan naming the file, and the tracking e2e test passing.

---

## 3. Event taxonomy (APPEND-ONLY; finalised in P3)

**The source is the code:** `src/lib/tracking/taxonomy.ts` ([C55](conflict-register.md); the owner's tracking-parity rule). It names every event and its parameters, whether it goes to GA4, whether it's a key event, and its Meta, Microsoft and LinkedIn mapping. `trackEvent()`'s types, the GTM container and the GA4 tables are generated from it, and a unit test keeps them in step. Its readable table is generated too: `docs/owner/tracking/taxonomy.md` (from P3 part C; until then, section F of [the P3 plan](../plans/2026-10-02-p3-analytics-consent.md)).

1. **APPEND-ONLY:** an entry is added before anything fires it (04 §1.5), in a plan that names the file. Names and parameters never change or disappear once added.
2. **Names:** `snake_case` `<object>_<action>`, a letter first, at most 40 characters. No GA4 reserved event name except `page_view`, used as GA4 means it; no reserved parameter name (`gclid`, `uid`, `user_id`, `session_id`, `currency`…) or prefix (`_`, `firebase_`, `ga_`, `google_`, `gtag.`).
3. **Limits:** at most 25 parameters per event; string values cut to 100 characters (`page_location` 1,000, `page_title` 300); at most 50 custom dimensions and 30 key events in all.
4. **Parameters** hold closed sets of values or identifiers, never free text (rule 6).
5. **Key events** (the owner, 2026-10-02, changed the same day at part C): `generate_lead` and `contact_click` are primary; `book_call_click` is retired (never sent, [C59](conflict-register.md)). A confirmed Cal.com booking comes later, server-side through n8n.
6. **GA4's own automatic events** stay off where they would double ours (the tracking guide, A3.7): page views from browser history, outbound clicks (`outbound_click` is ours) and form interactions.

---

## 4. Verification

- **Unit tests:** `trackEvent()` pushes the expected shape, and its types reject unknown names and parameters; the taxonomy keeps §3's naming rules and limits; the consent init script gives the right defaults for every region and stored choice; the generated GTM container and GA4 tables equal a fresh generation from the taxonomy.
- **E2E (production build):** `dataLayer[0]` holds the consent defaults, before GTM; a visitor from outside Europe sees no banner and has consent granted; a European visitor sees the banner, and nothing is granted until Accept; key events fire **exactly once**; the lead webhook is mocked, so no real leads are created; GTM requests are answered by a stub, so tests never send data.
- **The GTM import:** the export format isn't documented, so a generated file is checked against an export of a hand-built reference container and imported into a throwaway container before the real import (P3 plan, L).
- **Owner checklist:** GTM Preview from inside and outside Europe (a VPN) → GA4 DebugView → Meta/LinkedIn test events → publish the container.
