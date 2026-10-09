# Plan: Automation Track A — tenant zero (Deepzeta's own WhatsApp agent on the existing stack)

Status: APPROVED (owner, 2026-10-07; the open questions answered the same day; see "Owner answers")
Phase: P7's automation half, pulled forward for the n8n and Supabase side only. No website code. This is the owner's choice in chat, 2026-10-07: "WhatsApp now, website later".
Branch: `feat/automation-track-a`, in **its own git worktree**, because a P6 session is working in the main working tree.
Page tier: n/a (no page changes)
Decision: [0027](../decisions/0027-automation-pipeline.md)

## Goal served

00 §1, *prove what we sell.* Deepzeta sells a WhatsApp AI agent, booking automation and reminders (catalogue 1A.1, 1C.1). This plan switches on the stack Deepzeta already built for clients, with **Deepzeta as client #1**. A UAE business owner who messages Deepzeta's WhatsApp talks to the same agent Deepzeta would install for them, and can book a free AI audit in the chat.

## Context

- **Decision [0027](../decisions/0027-automation-pipeline.md)** records the architecture and the owner's four choices (2026-10-07):
  - the existing stack, with Deepzeta as tenant zero
  - one Google Calendar as the diary of record
  - a form inside the website agent's panel
  - WhatsApp now, the website agent in P7
- **What exists (read through the connectors, 2026-10-07; everything inactive):**
  - **n8n (`deepzeta.app.n8n.cloud`):**
    - `DZ · Inbound WhatsApp` (51 nodes; webhook `dz-whatsapp-inbound`)
    - `DZ · Booking Tools` (33)
    - `DZ · Send WhatsApp`, `DZ · Team Alert`
    - `DZ · Scheduled Jobs` (webhook `dz-jobs`)
    - `DZ · Error Alerts`, `DZ · Knowledge Upload (form)`, `DZ · Renew Client (form)`
  - **Supabase `deepzeta-automation` (Mumbai):**
    - tables: `clients`, `contacts`, `messages`, `bookings`, `payments`, `kb_documents`, `settings`, `delivery_failures`
    - the `whatsapp-gateway` edge function
    - Vault secrets, through `set_client_secrets(code, wa_token, app_secret)`
    - cron: `dispatch-jobs` every 15 minutes, and `purge-old-messages` daily (90 days)
- **How Deepzeta fits in:** the stack models Deepzeta as the row with `clients.is_agency = true`.
  - `wa_sender(null)` sends from that row's number, and team alerts go out from it.
  - Billing skips the agency row.
  - The inbound gate still needs `is_active` and a `paid_until` date.
- **What's missing before it can answer:**
  - n8n has **0 credentials**, and `settings` is **empty** (no AI rules, fixed replies, moderation settings or URLs).
  - There's **no client row**, and **no knowledge**.
  - Booking has **no meeting type** and no Meet link.
  - The email steps use an SMTP sender (`automation@deepzeta.ai`) with no credential.
  - The website's Cal.com bookings aren't connected.
- **Base guide:** [`docs/owner/n8n-setup-guide.md`](../owner/n8n-setup-guide.md)
  - Parts 1–5, 7, 8 and 9 still apply (Workspace, Meta app and number, Cal.com, n8n plan, credentials, number registration, lead intake, Cal.com bookings).
  - Part 6 (`DZ · Error Handler`) is replaced by `DZ · Error Alerts`.
  - Part 10 (`DZ · WhatsApp Inbound` with n8n's WhatsApp Trigger) is **never built**: Meta allows one webhook per app, and it belongs to the gateway.

## Out of scope

- **Track B, the website agent (P7):**
  - the route, the panel and its form
  - the rate limit, Turnstile and token caps
  - the taxonomy events
  - the `wa.me` reference code and **its parser in the inbound flow** (nothing sends a reference code until Track B exists, so the parser moves there)
  - the header button swap (owned by the cta-set plan)
- Billing and renewals for paying clients (`DZ · Renew Client`, the `payments` table, `payment_details`), and the Showcase flow.
- **Follow-up messages** (`config.templates.followup` stays empty, so the stack sends none). An owner decision later.
- WhatsApp reminders for website (Cal.com) bookings. They get Cal.com's email reminders in v1.
- Any change to the database schema, the gateway function or the knowledge-search engine. **One exception:** the 12-month summary retention, which needs one function and one cron job (S4).
- A form for the team to reply from the Deepzeta number. The owner chose personal WhatsApp; a reply form, coexistence through a Meta Tech Provider account, or the Deepzeta Sync app's inbox are later options.
- The Automation page's "real pipeline" idea (`docs/design/automation.md` keeps "Example" flows), and the conversion-path and header specs.
- Prices in answers: no price is CONFIRMED, so the agent offers the free audit instead.

## Owner inputs

- **The number is chosen:** +971 54 547 6335, Deepzeta's main contact number, not yet on WhatsApp. S3 writes the client row without the WhatsApp IDs. They're added when the owner has registered the number (guide Part 0) and sends:
  - the **Phone number ID**
  - the **WhatsApp Business Account ID**
- **The Google Calendar shared** with the service account, and its **Calendar ID** (guide Part E). This is added to the row the same way.
- **The team WhatsApp number** for alerts is still to come (a pre-launch register row). Until then, alerts go by email only.

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-07-automation-pipeline.md` | MODIFY | This plan and its Progress notes |
| `docs/decisions/0027-automation-pipeline.md` | MODIFY (until accepted) | The decision |
| `docs/decisions/README.md` | MODIFY (the 0027 row only) | Status on acceptance |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected; the owner asked on 2026-10-07) | C72 (renumbered from C69 at the merge) |
| `CLAUDE.md` | MODIFY (protected; the owner asked on 2026-10-07) | The "Current state" bullet for Track A |
| `docs/owner/n8n-automation-setup-guide.md` | MODIFY | The owner's click-level guide |
| `docs/owner/n8n-setup-guide.md` | MODIFY | Part 6 points to `DZ · Error Alerts`. Part 9 describes the extended `DZ · Cal.com Bookings`. Part 10 is marked superseded, with a pointer to the new guide |
| `docs/owner/pre-launch-register.md` | APPEND-ONLY | Rows: the live test script passed, the privacy policy names the four processors, the legal check, spend limits, the follow-ups decision |
| `docs/facts/company-facts.md` | MODIFY (only the rows the owner confirms) | Phone and WhatsApp +971 54 547 6335 (CONFIRMED 2026-10-07), the meeting types, the audit's length, gap and booking hours, the team email |
| `docs/facts/external-sources.md` | APPEND-ONLY | PROPOSED rows: Meta's customer-service window and template rule, and OpenAI's API data handling, each with its official source and the date checked |
| `docs/facts/agent-knowledge.md` | CREATE | The generated knowledge: what the agent knows, reviewed by the owner |
| `scripts/build-agent-knowledge.mjs` | CREATE | The generator (catalogue + CONFIRMED facts + FAQ bank) |
| `package.json` | MODIFY (scripts only) | `agent:knowledge` |
| `tests/unit/agent-knowledge.test.ts` | CREATE | Pins the knowledge to its sources |
| `docs/content-drafts/legal/privacy-policy.md` | MODIFY | Names OpenAI (US), Supabase (Mumbai) and n8n (Frankfurt) beside DeepSeek (China), for the owner's re-approval |

**External systems, changed through the connectors (no repo files):**

| System | Action | Purpose |
|---|---|---|
| n8n `DZ · Booking Tools` | MODIFY | A `meeting_type` input (phone_call / google_meet / office_visit): validated, written to the event (title, location, Meet link) and returned in the confirmation. An optional `customer_email`: when it's given, a Gmail confirmation goes to the customer |
| n8n `DZ · Scheduled Jobs` | MODIFY | The summary prompt keeps the name, email, what they asked for and the enquiry's details. It still never keeps medical, ID or payment details |
| Supabase migration `purge_old_summaries` | CREATE | One function that clears `summary` and `name` on contacts silent for `config.summary_retention_months` (default 12), and one daily cron job beside `purge-old-messages` |
| n8n `DZ · Inbound WhatsApp` | MODIFY | The `check_availability` and `book_appointment` tool definitions pass `meeting_type`. Nothing else changes |
| n8n `DZ · Team Alert`, `DZ · Scheduled Jobs`, `DZ · Error Alerts`, `DZ · Knowledge Upload (form)`, `DZ · Booking Tools` | MODIFY | Email steps move from SMTP to the Gmail credential (`hello@deepzeta.ai`). Customer-facing "DeepZeta" text becomes "Deepzeta AI" (C29) |
| n8n `DZ · Cal.com Bookings` | CREATE | Base guide Part 9, extended: a Team Alert, plus the `dz_booking_confirmed` template when the booker gave a WhatsApp number and consent |
| Every `DZ ·` workflow | MODIFY (settings) | Error workflow = `DZ · Error Alerts` |
| Supabase `settings` | INSERT (non-secret values) | `meta` (`n8n_inbound_url`, `n8n_jobs_url`, `graph_version`), `global_rules`, `fixed_messages`, `moderation`, `agency`, `jobs` |
| Supabase `clients` | INSERT one row | The agency row (code `DZ-0001` expected), non-secret fields only |

**Secrets are the owner's alone:** the verify token, the forward secret, the WhatsApp token, the Meta app secret and every API key. The guide gives the owner the exact places and SQL with placeholders. Claude never enters or sees them.

## Steps

1. **S1 · Docs.** This plan, decision 0027 (renumbered), and the rewritten owner guide. → gate: the owner's approval of this plan.

2. **S2 · Knowledge.** `scripts/build-agent-knowledge.mjs` writes `docs/facts/agent-knowledge.md` from:
   - the Services Catalogue: names exact; the four pillars, the services, the free audit (0.1), industries
   - CONFIRMED company facts only
   - `src/content/en/faq-bank.ts`: answers verbatim

   It includes a "what we never do" section (no invented prices, clients or results). It also writes a short `business_profile` block (≤ ~1,500 characters) for the client row. `tests/unit/agent-knowledge.test.ts` checks:
   - every service name matches the catalogue
   - no `[[TODO`, PENDING or UNKNOWN value leaks into the knowledge
   - numbers stay inside the facts allowlist

   → gates: `npm run agent:knowledge`, `npm test`, `verify:fast`, and the owner reads the doc and confirms.

3. **S3 · Supabase seed** (connector; non-secret values; each write shown to the owner first).
   - **`global_rules`** is the rules the agent obeys, and the JSON shape `Parse & Polish Reply` reads: `reply`, `language`, `intent`, `customer_name`, `lead_status`, `followup_in_days` (always null at launch), `followup_reason`, `handoff`, `send_payment_details` (existing clients only). The rules:
     - never invent; facts come only from the profile and the knowledge search
     - no prices; offer the audit
     - one question at a time
     - **ask the meeting type before checking availability**
     - **confirm the exact slot and type before `book_appointment`**
     - when booking, ask for the visitor's name, and their email (optional) for the confirmation
     - reply in the visitor's language (EN/AR)
     - steer off-topic questions back in one polite line
     - tell new contacts it is an AI assistant
     - ask visitors not to share sensitive personal data (medical, ID, payment)
     - hand off on complaints, legal or refund questions, a request for a person, or two failed answers. Tell the customer that a member of the team will contact them shortly from their own WhatsApp number
   - **`fixed_messages`** in EN and AR: `media_unsupported`, `paused_notice`, `opted_out`, `crisis`, `moderation_refusal`, `error_fallback`, `voice_failed`.
   - **`moderation`**: `rate_limit_per_hour` 30, and opt-out keywords in EN and AR (listed for the owner).
   - **`agency`**: name, website, email, WhatsApp, alert emails.
   - **`jobs`**: the billing marker, so the job never re-runs.
   - **`meta`**:
     - the two n8n webhook URLs
     - `graph_version`, checked against Meta's current Graph version at the time (the base guide uses v26.0)
   - **The agency client row:**
     - "Deepzeta AI"; `is_agency`, `is_active`; `paid_until` 2099-12-31 (needed by the inbound gate; billing skips agency rows)
     - tone, `default_language` en, and the `business_profile` from S2
     - booking on, `calendar_id`, voice notes transcribed
     - `team_emails` = deepzeta.office@gmail.com, and `team_whatsapp` empty until the owner gives the number
     - the WhatsApp IDs and `calendar_id`, added later (Owner inputs)
     - `config`:
       - timezone Asia/Dubai
       - **booking hours Mon–Sat 10:00–17:00** (the office hours stay 08:00–17:00 in the facts)
       - the service "Free AI Automation Audit": **30 minutes plus a 30-minute buffer**
       - minimum notice and `max_days_ahead`
       - the meeting types (phone_call / google_meet / office_visit), and the office address (facts §2)
       - `templates.reminder = dz_booking_reminder` and the template languages
       - `summary_retention_months` 12

   → gate: SQL read-back of each key and the row. Then the owner sets the secrets (guide Part C).

4. **S4 · n8n edits and the retention migration** (connectors), as in the external-systems table.
   - **The migration** (`purge_old_summaries()` and its daily cron job) is shown to the owner before it's applied. Afterwards the Supabase security advisors must show nothing new.
   - **Meet links:** created by Google Calendar's conference request. A service account may need Workspace domain-wide delegation to create one, so this is checked first. The fallback is a fixed Meet room link in `config`.

   → gate: `validate_workflow` clean on every edited workflow, a test run of `DZ · Booking Tools` per meeting type with pinned data where the connector allows it, and a change summary for the owner.

5. **S5 · Owner setup** (guide Parts A–H). → gate: every credential appears in n8n and no workflow shows a missing credential (connector check). The owner publishes in the guide's order.

6. **S6 · The end-to-end test** (guide Part I, from the owner's phone). → gate: the owner records the 13 results here. Claude reads the matching n8n executions and Supabase rows (read-only) as evidence.

7. **S7 · Exit.**
   - the pre-launch rows, and the updated privacy draft
   - 0027's status per the owner
   - a **proposed** conflict-register entry (the next free C-number; 0004's and 0016's scope changes) and a **proposed** `CLAUDE.md` state line, both for the owner to apply or approve (the rule system is protected)
   - the report. Merge on the owner's "merge" (0017).

## Effect register

None (no visual work).

## Dependencies to add

None.

## Risks & mitigations

- **Live before the privacy page.** The agent may go live before `/privacy` is live (P6), so it would process personal data before the policy is published. Mitigation: the AI disclosure and the "don't share sensitive data" line in the first reply. Go-live waits for the owner's verified full test (owner answer 5).
- **Team replies from personal numbers.** The customer hears from a different number than Deepzeta's. Mitigation: the agent warns the customer at hand-off. A reply form or coexistence remain later options.
- **Secrets.** These are owner-only: Vault for WhatsApp, n8n Credentials for API keys. Claude handles only IDs and URLs.
- **Meet links from a service account** may need domain-wide delegation. This is checked in S4, with a fixed room link as the fallback.
- **Meta.** Webhooks aren't delivered while the app is in Development mode (base guide :241). The display name and the business verification can take days. The app's single webhook must point at the gateway: nothing else may claim it, so base guide Part 10 is never built.
- **Double bookings.** Cal.com checks the same Google Calendar. Booking Tools re-checks the exact slot and reserves it in the database before it creates the event. A website booking that lands between the agent's offer and the confirmation is caught by that re-check.
- **Hallucination.**
  - Knowledge comes only from the sources (S2's test), and `global_rules` forbid invention.
  - The model's temperature is 0.5 today. S4 lowers it to 0.3 for steadier facts.
- **Cost.** 30 messages per contact per hour, spend limits where providers offer them (guide Part J), and the gateway drops status events. Each inbound message is one n8n execution, so the base guide's Part 4 plan choice applies.
- **Moderation false positives.** Abuse triggers a refusal and a strike. The weekly check reviews contacts with strikes.
- **A concurrent P6 session** in the main working tree. Track A runs in its own worktree. The files both branches touch are `docs/decisions/README.md`, `docs/ai/conflict-register.md` and `CLAUDE.md`. Each gets one-row additions, so a merge conflict is a matter of keeping both rows.

## Gates (03 §2)

- **Repo:** `verify:fast` and `npm test` after S2. Full `verify` before the merge, as 03 requires, although no app code changes.
- **External:** `validate_workflow` per edited workflow, test runs, and the owner's live test script (S6).

## Owner answers (in chat, 2026-10-07)

1. **Meeting channels:** a **phone call** (Deepzeta calls the visitor at the booked time; nothing automates the call, and WhatsApp calls aren't available in the UAE), **Google Meet**, or an **office visit**.
2. **The audit in the calendar:** a **30-minute call plus a 30-minute gap**, booked **Monday to Saturday, 10:00–17:00 GST**. The last start is 16:30, and Cal.com gets the same settings.
3. **Memory:** the summary keeps the name, email, what they asked for and the enquiry's details. It's **kept 12 months** after the last message, then cleared (S4's migration). Messages are deleted after 90 days.
4. **Hand-off:** complaints, legal or refund questions, someone asking for a person, two failed answers.
5. **Go-live:** only after the full test passes and the working conditions are verified.
6. **Team alerts:**
   - the email is **deepzeta.office@gmail.com**
   - the WhatsApp number comes later (a pre-launch register row and a memory reminder)
   - the team replies to hand-offs **from personal WhatsApp**, through the alert's `wa.me` link. At hand-off the agent tells the customer that a team member will contact them from their own number.

**What follows from the answers:** the agent asks for an email (optional) when booking, and a Gmail confirmation goes to the customer (Booking Tools, S4).

**The number:** +971 54 547 6335. On the Cloud API it can't be used in the WhatsApp app (coexistence needs a Meta partner). Calls and SMS work as usual.

## Track B · the website agent (P7 stub; its own plan later)

- **The route** `src/app/api/agent/route.ts`: DeepSeek via the AI SDK (versions verified, 06 §5), streaming. The knowledge comes from S2's generator.
- **The panel** loads on tap (`src/lib/fx/lazy.ts`). The header "Deepzeta AI" button switches from its WhatsApp fallback (cta-set plan).
- **The contact form** in the panel goes to a server action, then `DZ · Lead Intake` (`X-DZ-Secret`, Turnstile). DeepSeek never sees the contact details.
- **The hand-off:** `wa.me` with a prefilled reference code, plus the parser in `DZ · Inbound WhatsApp` that links the WhatsApp contact to the website lead.
- **Limits:** the Upstash rate limit (06:74) and token caps (06:76).
- **Tracking:** the taxonomy events are registered first (04 §1.5).
- **Tests:** unit and e2e. lhci must be unchanged on Home (C65 binds).

## Progress notes

- **2026-10-07:** the first draft (a Sheets + blocklist + Cal.com pipeline) was reviewed against the live n8n and Supabase stack. The owner chose all four recommendations in chat. The decision was renumbered to 0027 (0025 and 0026 were taken), and this plan was rewritten as Track A. The `wa.me` reference-code parser moved to Track B.
- **2026-10-07 (later):** the owner answered the open questions (above), chose the main number +971 54 547 6335, and asked to "update rules files to approve".
  - Decision 0027 is ACCEPTED, recorded as C72 (renumbered from C69 at the merge), with the `CLAUDE.md` state line written.
  - The plan moved to its own worktree (`D:\DeepZeta Ai\Website DeepZeta-automation`, branch `feat/automation-track-a`), apart from the P6 session.
  - Additions: the customer email confirmation, the summary content, and the 12-month retention migration.
