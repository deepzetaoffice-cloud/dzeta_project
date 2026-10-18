# Service page (the template)

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Service template (`1:7`), the Speed-to-Lead System at Desktop 1440 `59:34` and Mobile 390 `59:873` · Content: `src/content/en/services/{slug}.ts` (type `ServicePageContent`), `faq-bank.ts`, the catalogue · Route: `/services/[slug]`

The page structure is owned by 10 §5, 08 §2 and the engine's service blueprint; this spec maps it to the Figma frame. The flagship Websites page has its own spec ([custom-coded-websites.md](custom-coded-websites.md)).

## Sections

| # | Figma section | Content (`ServicePageContent`) | Effects | Media |
|---|---|---|---|---|
| 01 | Hero · stage (in the page's pillar) | The breadcrumb Home / Services / {pillar} / {service}; the pillar chip; the mono label "{catalogueNumber} · {sub-group}"; the H1 (`heading`); the direct answer (`answer`); "Book a free AI audit"; the matching demo's trigger when `tryIt` exists; one design-target stat chip only when the facts file allowlists it (for example "First reply within 60 seconds · design target") | `press-scale`, `section-reveal` | The service's hero photo (table below) with its optional loop |
| 02 | The problem it solves | [01] "Before and after": `problem.heading`, `problem.lede`, at most 5 rows Today → With Deepzeta AI (check glyphs) | `section-reveal` | — |
| 03 | How it works (C diagram language) | [02] "Example flow": `how.heading`, `how.lede`; "Fig. 1 — … · example"; the steps as a visible ordered list (`how.steps`) beside the system diagram (Diagram step nodes with their platform lines); `how.exampleLabel` | The diagram's steps light in order on view (`section-reveal`); no pin | The service's screen recording (SR05–SR15) when it exists, captioned "Built by Deepzeta AI" |
| 04 | What you get · Works with | [03] "Deliverables": `deliverables.items` (check glyphs); `worksWith.heading`, `worksWith.lede` and its platforms as chips | — | — |
| 05 | Is it right for you? | [04] "Decision aid": `fit.lede`, "A good fit for" (`fit.goodFit`), then each `decisionAid` question with its answer | — | — |
| 06 | Try it · Built for UAE leads · Pairs well with | The demo panel when `tryIt` exists, labelled honestly ("Demo · being built" until P7 ships it); `uae.heading` and its points with UI glyphs; "Pairs well with": two Service cards (`pairs`), each one link to a live page | `hover-lift` | — |
| 07 | FAQ | [05] the FAQ module ([faq.md](faq.md)): `faq.heading`, `faq.lede`, the service's questions from `faq-bank.ts`, FAQPage schema | `accordion` | — |
| — | Footer | [footer.md](footer.md) | | |

- **The pillar sets the colour:** the stage carries the pillar's gradient accents, the pillar chip and the Pillar pixels. Everything else is the shared language.
- **No signature moment:** the diagram is the page's one explanatory moment, static or revealed on view, so 11 pages stay calm and consistent.
- **Tracking:** `view_service` fires once per page with `service_slug` and `pillar` (`tracking.spec.ts`).

## The 11 pages and their media (the media plan, P09–P19, SR05–SR15, U03–U13)

| Service (catalogue name, exact) | Slug file | Hero photo | Recording |
|---|---|---|---|
| Speed-to-Lead System | `speed-to-lead-system.ts` | P09 `speed-to-lead-whatsapp-notification-dubai-night` | SR05 |
| Automated Quotation & Quote Tracking System | `automated-quotation-tracking.ts` | P10 `automated-quotation-tablet-signature-dubai` | SR06 |
| Sales Follow-Up & Nurture Sequences | `sales-follow-up-nurture.ts` | P11 `sales-follow-up-phone-dubai-business-park` | SR07 |
| CRM Setup & Automation | `crm-setup-automation.ts` | P12 `crm-setup-pipeline-laptop-dubai-office` | SR08 |
| Booking Automation System | `booking-automation-system.ts` | P13 `booking-automation-clinic-front-desk-dubai` | SR09 |
| Appointment Reminder & No-Show Reduction | `appointment-reminders-no-show-reduction.ts` | P14 `appointment-reminder-smartwatch-dubai` | SR10 |
| Review & Reputation Automation | `review-reputation-automation.ts` | P15 `review-reputation-restaurant-phone-dubai` | SR11 |
| AI Shopping Visibility (Agentic Commerce Readiness) | `ai-shopping-visibility.ts` | P16 `ai-shopping-visibility-mall-phone-dubai` | SR12 |
| AI Citation & Answer Engine Optimisation (AEO/GEO) | `ai-citation-aeo-geo.ts` | P17 `ai-citation-aeo-geo-laptop-dubai-design-district` | SR13 (only if real) |
| Local AI Dominance (Bilingual, Hyperlocal) | `local-ai-dominance.ts` | P18 `local-ai-dominance-map-al-fahidi-dubai` | SR14 |
| AI Ad Creative Production | `ai-ad-creative.ts` | P19 `ai-ad-creative-studio-setup-dubai` | SR15 |

- The optional loops are V09–V19; each page uses its photo while its loop isn't made.
- The UI mocks U26–U32 (labelled "Example") are added to the pages that have one once they're designed.
- Each photo's alt text is written for its page and slot (08 §7).

## Content flags

- The frame's FAQ answers are `[[TODO]]`; they come from `faq-bank.ts`.
- The hero's stat chip appears only for a design target the facts file allowlists (facts §6). Otherwise there is no chip.

## Breakpoints

Checked side by side with `59:34` and `59:873` at 390, 834 and 1440 px on the pilot (the Speed-to-Lead System); the other 10 pages follow the template (a batch, 03 §2).
