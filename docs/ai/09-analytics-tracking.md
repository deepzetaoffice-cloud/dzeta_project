# 09 · Analytics, Tracking & Consent

> **Applies to:** analytics, pixels, consent, lead forms, CRM hand-off · **Precedence:** below 00 · **Last reviewed:** 2026-09-29

Tracking code is fragile and failures are silent. These rules are strict on purpose.

---

## 1. Architecture

```
Components ──trackEvent()──► src/lib/analytics.ts ──► window.dataLayer ──► GTM container
                                                                           ├─ GA4
                                                                           ├─ Google Ads
                                                                           ├─ Meta Pixel (+ server CAPI)
                                                                           └─ LinkedIn Insight (+ CAPI)
Lead form ──► server action ──(signed webhook)──► n8n ──► Google Sheet (CRM v0; HubSpot/Zoho later)
            (PII goes here only, never through GTM)   ├─► Gmail auto-reply + owner alert
                                                      ├─► WhatsApp Cloud API
                                                      └─► server-side CAPI events (Meta, LinkedIn)
Google Ads ◄── scheduled offline-conversion import from the Sheet
```

---

## 2. Rules

1. **One loader:** Google Tag Manager via `@next/third-parties` `<GoogleTagManager>` in the **root layout only**. Never hand-paste GTM or gtag snippets. Never load gtag.js directly alongside GTM (double counting).
2. **`dataLayer[0]` rule:** an inline script in the root layout initialises `window.dataLayer` and the **Consent Mode v2 defaults** before GTM loads. GTM loads at normal priority. **Never idle-defer GTM** (the reference project lost GA4 data this way). Other vendor scripts may be deferred.
3. **`trackEvent()` only.** Components never call `sendGTMEvent`, `gtag`, `fbq` or `lintrk` directly.
4. **Taxonomy first:** an event is added to the table in §3 (APPEND-ONLY) **before** any component fires it. Names are `snake_case` `<object>_<action>`. Existing names never change.
5. **`value` is numeric only**; string details go in named params.
6. **No PII through GTM or the dataLayer** (names, emails, phones, messages). PII goes only to the server route → CRM and server-side conversion APIs (hashed where the vendor requires).
7. **Consent Mode v2** with UAE PDPL-appropriate wording; defaults set before GTM; banner mounted once in the root layout. Non-essential tags fire only after consent.
8. **Click IDs** (`gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `msclkid`) and UTM parameters are captured (first touch + last touch) into hidden form fields and sent to the CRM with the lead.
9. **Page-view tracker** mounted once in the root layout (inside `<Suspense>`), never also in nested layouts.
10. **Dashboard work** (GTM tags/triggers, **publishing the container**, GA4 key events, Ads/Meta/LinkedIn setup) is done by the owner from a checklist the agent writes. Never assume it's done.
11. If server-side conversion APIs are used alongside browser pixels, send the same `event_id` from both for deduplication.

**Protected files (once built):** `src/lib/analytics.ts`, the dataLayer/consent init block in the root layout, the consent banner, form tracking hooks. Changing them requires a request that explicitly asks for a tracking change, a plan naming the file, and the tracking e2e test passing.

---

## 3. Event taxonomy (APPEND-ONLY; draft, finalised in P3)

| Event | Trigger | Category | Params |
|---|---|---|---|
| `page_view` | Route change | navigation | `page_path`, `page_type` |
| `cta_click` | Any primary/secondary CTA | engagement | `cta_id`, `cta_location` |
| `audit_start` | Book-audit form opened/first field | lead | `source_page` |
| `generate_lead` | Audit/lead form submitted successfully | lead | `form_id`, `service_interest` |
| `book_call_click` | Booking (Cal.com) opened | lead | `source_page` |
| `contact_click` | WhatsApp / phone / email link | contact | `method` |
| `demo_open` | A live demo opened | engagement | `demo_id` |
| `agent_message_sent` | Visitor sends a message to the AI agent demo | engagement | `turn` (number) |
| `calculator_complete` | ROI calculator result shown | engagement | `industry` |
| `speed_test_request` | 60-second speed-to-lead test submitted | lead | `source_page` |
| `view_service` | Service/solution page viewed | content | `service_slug`, `pillar` |
| `pricing_view` | Pricing page viewed | content | — |
| `case_study_view` | Case study scrolled to 75% | content | `case_slug` |
| `faq_expand` | FAQ item opened | engagement | `faq_id` |
| `outbound_click` | External link | navigation | `destination_domain` |
| `newsletter_signup` | Newsletter form success | lead | `source_page` |

---

## 4. Verification

- Unit test: `trackEvent()` pushes the expected shape; rejects unknown event names (typed union from the taxonomy).
- E2E (production build): `dataLayer[0]` holds the consent defaults / GTM start marker; key events fire **exactly once**; lead webhook mocked so no real leads are created.
- Owner checklist: GTM Preview → GA4 DebugView → Meta/LinkedIn test events → publish container.
