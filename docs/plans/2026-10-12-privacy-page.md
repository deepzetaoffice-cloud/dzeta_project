# Plan: the privacy policy page (`/privacy`, R006)
Status: APPROVED (owner, 2026-10-12; questions 1–3 answered (a))
Phase: P6 (registry W1) · Branch: `feat/privacy-page` · Page tier: standard (T2)

## Goal

00 §1, *proves every claim it makes*: a privacy policy that states only what the site and the WhatsApp agent really do. It also unblocks Track A: Meta switches the WhatsApp app to **Live** only with a privacy policy URL, so customers get answers only after this page is on production. Ships `/privacy` from the approved draft `docs/content-drafts/legal/privacy-policy.md` (layout: its Part 1; content: its Part 2), brought up to date first. The owner chose this order on 2026-10-12, ahead of the conversational services.

**Out of scope:** `/terms`, `/contact`, `/about` (their links appear only once they're live, 04 §1.4) · the Meta Live switch (the owner, automation guide Part D) · Arabic (P11) · any change to tracking or consent behaviour.

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-12-privacy-page.md` | CREATE | This plan |
| `docs/content-drafts/legal/privacy-policy.md` | MODIFY | Step 2's updates; the owner re-approves the wording |
| `docs/facts/external-sources.md` | APPEND-ONLY | PROPOSED rows: DeepSeek's and OpenAI's API data use, from their official pages (step 1) |
| `src/content/en/legal/privacy.ts` | CREATE | The typed page content (the draft's Part 2, its tokens read from `site-config`) |
| `src/content/en/faq-bank.ts` | APPEND-ONLY | `privacyFaq` (engine §6.3 format) |
| `src/app/(en)/privacy/page.tsx` | CREATE | The route: metadata, the page graph, the sections |
| `src/components/sections/legal/LegalSections.tsx` | CREATE | Hero, at a glance, contents + sections + tables, contact, related links; `/terms` reuses it |
| `src/components/sections/legal/toc-enhance.ts` | CREATE | `aria-current` on the section in view (the draft's Part 1, block 3) |
| `src/lib/fx/lazy.ts` | MODIFY | Registers `toc`, loaded only where a page marks it |
| `src/styles/templates/legal.css` | CREATE | Sticky contents, tables that scroll in their own box, section spacing (decision 0026) |
| `src/components/icons/registry.ts` | MODIFY | `lock`, `mail`, `shield` (Tier 1), only if question 1 is (a) |
| `src/lib/schema/graphs/legal.ts` | CREATE (schema core, 00 §5) | WebPage (`dateModified` = the "Last updated" date) + BreadcrumbList + FAQPage |
| `docs/seo/schema-graph.md` | MODIFY (protected; named here) | "Shipping today": the legal page block |
| `tests/fixtures/schema/privacy.json` | CREATE | The golden fixture |
| `tests/gates/schema.spec.ts` | MODIFY | Adds the fixture to the list |
| `tests/e2e/privacy.spec.ts` | CREATE | Headings and anchors, the FAQ matching its schema, no sideways scroll at 360 px, axe, the footer and banner links |
| `scripts/check-facts.mjs` | MODIFY | Question 2 |
| `src/lib/routes.ts` | MODIFY | R006 `live: true`: the footer's "Privacy" and the consent banner's policy link appear |
| `docs/seo/url-registry.md` | MODIFY (R006's status only) | `planned` → `live` |
| `docs/owner/pre-launch-register.md` | MODIFY (tick) + APPEND-ONLY | Tick the privacy row on approval; a row for Meta's Privacy Policy URL and the Live switch |
| Supabase migration `purge_old_contacts` (external; question 3) | CREATE | Bookings and WhatsApp contacts with no contact for 24 months are deleted; a daily cron job beside `purge-old-summaries`. Shown to the owner before it's applied |
| `docs/plans/2026-10-07-automation-pipeline.md` | MODIFY (Progress only) | Records the migration on Track A's side |

## Steps

1. **External facts.** Read DeepSeek's and OpenAI's official API privacy and data-use pages: where data is stored, and whether API inputs train their models (the check decision 0016 requires before this page ships). Record them as PROPOSED rows; the owner approves. If DeepSeek trains on API inputs, §6 and its FAQ say so plainly.
2. **Bring the draft to today's truth** (N3), then the owner re-approves the wording and the "Last updated" date is that day:
   - **Phone and WhatsApp** are CONFIRMED now, so they show.
   - **Providers (Table C, FAQ Q4):** only the active ones (Part 3 note 3): Vercel, Google (Gmail, Google Calendar, Tag Manager, Analytics), n8n, DeepSeek, OpenAI, Supabase, Meta (WhatsApp, ad measurement), Microsoft Advertising. Cloudflare, Upstash, Cal.com and PageSpeed Insights come back with the features that use them.
   - **§6 and Q6:** the WhatsApp AI assistant replaces the demo and tool text (they return when they ship). DeepSeek writes its replies. OpenAI transcribes voice notes, checks messages for safety and finds answers in our knowledge. The assistant says it's an AI. At a hand-off, a team member replies from their own WhatsApp number (decisions 0027, 0030).
   - **§8 and Q5:** add India (Supabase, Mumbai) to the EU (n8n), the US (OpenAI and others) and China (DeepSeek).
   - **Table E:** what actually runs: WhatsApp messages deleted after 90 days; the assistant's short memory (name, email, what you asked) cleared 12 months after the last message; bookings and phone numbers per question 3.
3. **Build** from the approved text: content, components, CSS, schema graph and fixture, route, R006 live, the registry row, the e2e spec. Reuse `Breadcrumbs`, `Faq`, `JsonLd`, `CtaButton`, `Icon` and the `data-fx-lazy` pattern (`src/app/(en)/services/page.tsx`, `src/lib/schema/graphs/servicesHub.ts`).
4. **Gates (03 §2):** the static gates and `verify:ci`, plus `lhci` on Home, because the footer and the consent banner gain a link.
5. **After the merge and deploy:** the owner adds `https://deepzeta.ai/privacy` in Meta (App settings → Basic → Privacy Policy URL), then switches the app to Live (automation guide Part D).

## Effect register (13 §4)

| Section | Effect ID | Cost → mitigation |
|---|---|---|
| At a glance cards | `glass-tint` | A static fill, no blur |
| Text links | `hover-underline` | CSS only |
| Sections | none: `scroll-reveal` stays off on a legal page (the draft's Part 1) | — |

## Dependencies, risks

- **No new dependency.** Client JS: only `toc-enhance`, loaded on this page; its size is measured and reported.
- **Home:** the footer and the banner each gain one link. Home is over its hard limit (C73); the owner's no-performance-edits choice stands, and `lhci` reports the delta.
- **Track A:** `privacyFaq` joins the FAQ bank, so `docs/facts/agent-knowledge.md` is regenerated when `feat/automation-track-a` takes this branch from `main`.

## Open questions

1. **"At a glance" icons:** (a) three new Tier 1 icons, lock, mail and shield, that `/terms` and `/contact` reuse (recommended); or (b) text cards with the Zeta Pixel marker.
2. **The facts gate:** the policy's periods (12, 14, 24 months, 90 and 30 days, 24 hours, 18 years) and "Decree-Law No. 45" are commitments and a law's name, not business claims. (a) Exempt `src/content/en/legal/privacy.ts`, as `build-run.ts` is (recommended); or (b) add each number to the allowlist.
3. **Bookings and WhatsApp numbers** have no automatic deletion today. (a) Delete them 24 months after the last contact, by extending the cleanup job (a small Track A migration; it matches the draft's 24 months) (recommended); or (b) the policy says they're kept until you ask us to delete them.

**Answers (owner, 2026-10-12):** 1 (a) three new icons; 2 (a) exempt the privacy content file; 3 (a) delete after 24 months.

## Progress

- 2026-10-12: plan drafted, then approved with questions 1–3 answered (a).
- 2026-10-12 · steps 1–2 done: decision 0016's check and the providers' facts from official pages (external sources S012–S015); the draft brought to today's truth; the owner re-approved the wording and approved S001, S002, S007, S012, S014 and S015 ("Last updated" 12 October 2026), confirmed hello@deepzeta.ai receives email, and chose a yearly clear-out of old calendar events (a register row). The `purge_old_contacts` migration is applied (daily at 23:35 UTC; first run deleted nothing; advisors unchanged).
