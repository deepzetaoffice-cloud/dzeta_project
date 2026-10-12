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
- **The fixed Google Meet room** for audit calls (the owner, 2026-10-12): **https://meet.google.com/aoo-ssoq-jkh**, created as deepzeta.office@gmail.com. It is `clients.config.meet_link` for DZ-0000: Google Meet bookings put it in the calendar event, the agent's confirmation and the customer's email. If it ever changes, update that one value.

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
| `docs/facts/external-sources.md` | APPEND-ONLY | PROPOSED rows: Meta's customer-service window and template rule, and OpenAI's and DeepSeek's API data handling (decision 0030), each with its official source and the date checked |
| `docs/facts/agent-knowledge.md` | CREATE | The generated knowledge: what the agent knows, reviewed by the owner |
| `scripts/build-agent-knowledge.mjs` | CREATE | The generator (catalogue + CONFIRMED facts + FAQ bank) |
| `package.json` | MODIFY (scripts only) | `agent:knowledge` |
| `tests/unit/agent-knowledge.test.ts` | CREATE | Pins the knowledge to its sources |
| `docs/content-drafts/legal/privacy-policy.md` | MODIFY | Names OpenAI (US), Supabase (Mumbai) and n8n (Frankfurt) beside DeepSeek (China) (decisions 0027 and 0030). For the owner's re-approval |

**External systems, changed through the connectors (no repo files):**

| System | Action | Purpose |
|---|---|---|
| n8n `DZ · Booking Tools` | MODIFY | A `meeting_type` input (phone_call / google_meet / office_visit): validated, written to the event (title, location, Meet link) and returned in the confirmation. An optional `customer_email`: when it's given, a Gmail confirmation goes to the customer |
| n8n `DZ · Scheduled Jobs` | MODIFY | The summary prompt keeps the name, email, what they asked for and the enquiry's details. It still never keeps medical, ID or payment details. The model `deepseek-chat` becomes `deepseek-flash` (decision 0030) |
| Supabase migration `purge_old_summaries` | CREATE | One function that clears `summary` and `name` on contacts silent for `config.summary_retention_months` (default 12), and one daily cron job beside `purge-old-messages` |
| n8n `DZ · Inbound WhatsApp` | MODIFY | The `check_availability` and `book_appointment` tool definitions pass `meeting_type`. Decision 0030: OpenAI's three jobs stay as built (moderation, embeddings, transcription); `Transcribe Voice Note` uses `gpt-transcribe` (`whisper-1` as the fallback), with a conversion step only if OpenAI rejects WhatsApp's `.ogg`; the model `deepseek-chat` becomes `deepseek-flash` |
| n8n `DZ · Team Alert`, `DZ · Scheduled Jobs`, `DZ · Error Alerts`, `DZ · Knowledge Upload (form)`, `DZ · Booking Tools` | MODIFY | Email steps move from SMTP to the Gmail credential (`deepzeta.office@gmail.com` until Google Workspace is active, then `hello@deepzeta.ai`; the owner, 2026-10-11). Customer-facing "DeepZeta" text becomes "Deepzeta AI" (C29) |
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
     - understand and reply in the customer's language, whatever it is (decision 0030); the fixed messages stay EN/AR
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
     - booking on, `calendar_id`, voice notes transcribed in the language spoken (decision 0030)
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
- **2026-10-11:** the owner finished Part 0 (the number +971 54 547 6335 registered on the Cloud API: Phone number ID 1460584370460068, WhatsApp account 1432051959064319, app Deepzeta Connect 1573718627333039; the payment method; the system user token) and A1, A3, A5, A6. **Decision 0030** (final the same day): DeepSeek writes every reply; OpenAI keeps its three supporting jobs (voice notes in any language with `gpt-transcribe`, moderation, embeddings); the agent replies in the customer's language. The owner first chose DeepSeek alone, then reversed it because voice notes must be understood. Open risk: WhatsApp's `.ogg` against OpenAI's listed formats, tested at check 4. S2–S4 stay to do.
- **2026-10-11 (later):** A2 done (the OpenAI key). The owner chose `deepzeta.office@gmail.com` for the calendar and the email steps until Google Workspace is active (guide A4, Part B, Part E), and said "start now" for S2–S4.
- **2026-10-11 · S2 done** (a 2026-10-07 draft, never committed, brought up to date on this branch):
  - **The generator:** `scripts/build-agent-knowledge.mjs` (`npm run agent:knowledge`) writes `docs/facts/agent-knowledge.md`, 68,097 characters. The business profile is 957 of 1,500 characters.
  - **What it reads:** the typed catalogue names, the catalogue's descriptions, the CONFIRMED facts in `FACT_LABELS` (the phone is in: it is CONFIRMED since the cta-set plan), the industries, **every published FAQ** (Home, the hub and the 12 service pages, verbatim), and the founder.
  - **What it leaves out:** the e-invoicing deadline and phase sentences (external facts), the catalogue's §7.6 and §9, the "30–45 minute" line, and the internal calendar gap.
  - **The facts:** the audit booking row is split into length, booking hours and an internal calendar gap; the meeting types say "Deepzeta AI".
  - **The test:** `tests/unit/agent-knowledge.test.ts` (10 tests) pins the file to a fresh generation, checks every FAQ list in the bank, and keeps unconfirmed, external and old-brand text out.
  - **Gates:** `npm test` 568/568, typecheck, lint, check:tokens, check:contrast, check:facts and prettier pass.
- **2026-10-11 · S3 done** (Supabase, through the connector; read back after the write):
  - **The 2026-10-07 reading was wrong:** the table summary shows estimated row counts (0). The stack already held its builder's defaults from 2026-10-01: seven `settings` keys and the agency row **`DZ-0000`** (not DZ-0001), active and paid until 2099-12-31. S3 updated them instead of inserting; the guide's Part C now says `DZ-0000`.
  - **`global_rules`** are shared by every future client, so only three generic lines were added: say once that it's an AI, ask people not to share sensitive data, and hand off on legal or refund questions and after two failed answers. The builder's text (any language, Emirati Arabic, the JSON shape) stays.
  - **Deepzeta's own rules** (no prices, the meeting type first, confirm slot and type, email optional, the hand-off wording, no payments, no follow-ups) live in the client row's `config.rules`, which `Build Prompt` appends (S4).
  - **The client row:** "Deepzeta AI", the WhatsApp IDs, the S2 business profile, booking on, `calendar_id` deepzeta.office@gmail.com, `team_emails` deepzeta.office@gmail.com, and `config`: Mon–Sat 10:00–17:00, the audit at 30 minutes plus a 30-minute buffer, 120 minutes' minimum notice, 30 days ahead, the three meeting types with the office address, `meet_link` empty, the reminder template `dz_booking_reminder` (EN, AR), and 12 months' retention.
  - **`agency`:** name "Deepzeta AI", alerts to deepzeta.office@gmail.com, WhatsApp 971545476335. **`meta`:** `graph_version` v26.0 (Meta's latest, checked 2026-10-11); the existing webhook secrets are untouched.
  - **`payment_details`** held `[BANK NAME]`, `[IBAN]` and `[SWIFT]` placeholders, which the agent could have sent to a visitor. It now holds a safe interim message; real details wait for the first paying client (a register row).
- **2026-10-11 · S4, the part that needs no credentials** (n8n, through the connector; each update is a named version in n8n's history):
  - **`DZ · Inbound WhatsApp`:**
    - **Found broken:** `Build Prompt` and `Build Payment Details Reply` didn't parse (raw line breaks inside JavaScript strings), so the agent would have failed on its first message. Both were rewritten with the same logic, and `Parse & Polish Reply`'s fence regex was fixed (`^\s*`). Every Code node in all eight `DZ ·` workflows now parses (checked offline).
    - **`Build Prompt`:** "Bookable hours" (not "Opening hours", which the office keeps at 08:00–17:00), the meeting types, `config.rules` last, and the agency payment note only when `config.payments_enabled`.
    - **Models:** `deepseek-flash` at temperature 0.3. Voice notes go to `gpt-transcribe` first (an HTTP request: n8n's OpenAI node has no model choice and always uses `whisper-1`); on an error the same file goes to the existing `whisper-1` node. n8n's OpenAI node lists `ogg` as supported, so the `.ogg` risk is smaller than 0030 feared; check 4 still tests it.
    - **The tools:** `check_availability` and `book_appointment` pass `meeting_type`; `book_appointment` also passes an optional `customer_email`.
  - **`DZ · Booking Tools`:** the two inputs. The type must be a configured one, and the email is checked. The calendar event's title, location and description carry the type and the email. The booking notes and the team alert carry the type. The confirmation tells the agent how the meeting happens.
  - **Meet links:** a service account can't create Meet links or invite guests on a Gmail calendar (no domain-wide delegation outside Workspace). Google Meet bookings therefore use `config.meet_link`, a fixed room the owner creates (a register row); until then the alert asks the team to send the link.
  - **`DZ · Scheduled Jobs`:** the summary uses `deepseek-flash` and keeps the email and the enquiry's details.
  - **Waiting for the owner's credentials (Part B):** the Gmail steps (the SMTP nodes become Gmail, the customer's email confirmation, alerts to deepzeta.office@gmail.com), linking every credential, and the error workflow setting (n8n accepts only a published `DZ · Error Alerts`).
  - **Waiting for the owner's approval:** the retention migration below.

- **2026-10-11 · the retention migration applied** (the owner: "approve cleanup"): `purge_old_summaries` and the daily cron job `purge-old-summaries` (23:25 UTC) exist; EXECUTE only for `postgres` and `service_role`; a first run cleared 0 rows; the security advisors show only the existing INFO notes (RLS on with no policies, the service-role-only design), nothing new. The guide's A4 is now click by click, with the calendar sharing (E1) folded in as A4.6.

- **2026-10-11 · A4 done:** the service account `deepzeta-calendar@spry-kingdom-511305-m8.iam.gserviceaccount.com` (Google Cloud project deepzeta-automation, ID spry-kingdom-511305-m8), the Calendar API on, deepzeta.office@gmail.com's main calendar shared with "Make changes to events". Part A is complete; Part B (the credentials) is next.

- **2026-10-11 · Part B done and S4 finished** (n8n through the connector, then re-read and checked offline):
  - The owner saved all seven credentials (n8n's default names; one per type). A6 had not been saved: the owner made the two random secrets then (letters and digits, 48 characters).
  - **Linked:** 51 nodes across the seven in-scope workflows each carry the credential of their type (Supabase, DeepSeek, OpenAI, Google service account, Header Auth, Basic Auth, Gmail), including the new `gpt-transcribe` node. `DZ · Renew Client (form)` is left as it is (billing, out of scope, stays off).
  - **Gmail:** the six SMTP nodes in scope (Team Alert, Error Alerts, Scheduled Jobs ×2, Knowledge Upload ×2) are Gmail nodes on the deepzeta.office credential, sender "Deepzeta AI"; team mail goes to deepzeta.office@gmail.com.
  - **The customer's email confirmation:** `DZ · Booking Tools` sends it after the calendar event when the customer gave an email and the client's `config.email_confirmations` is true (set for DZ-0000); the agent mentions the email only then.
  - **Brand (C29):** the Team Alert footer and the knowledge form's title say "Deepzeta AI"; the form's Client ID hint is DZ-0000.
  - **Check:** every node that needs a credential has one, no SMTP node remains in scope, and every Code node parses (all seven re-read after the update).
  - **Left:** the error workflow setting waits for the owner to publish `DZ · Error Alerts` (guide Part H, step 0).

- **2026-10-12 · Part C done, one value to redo; the Meet room set:**
  - Checked by length and format only, never the values: the gateway forward secret and the Meta verify token are 48 letters and digits each and differ; the WhatsApp token (`wa_token:DZ-0000`, 207 characters) has an access token's format.
  - **The app secret (`wa_app_secret:DZ-0000`) is wrong:** 98 characters with symbols, where a Meta App Secret is 32 hexadecimal characters. The gateway checks every webhook's signature with it, so it must be re-entered before Part D (one-line SQL in the chat, the token left untouched).
  - `config.meet_link` = https://meet.google.com/aoo-ssoq-jkh (Owner inputs above).

- **2026-10-12 · a second retention job** (the privacy page plan `docs/plans/2026-10-12-privacy-page.md`, question 3, owner approved): `purge_old_contacts()` deletes WhatsApp contacts, their bookings and any leftover messages once a contact has been silent for `config.contact_retention_months` (default 24); cron `purge-old-contacts` daily at 23:35 UTC; EXECUTE for `postgres` and `service_role` only; first run deleted nothing; advisors unchanged. Calendar events are cleared by the owner once a year. The owner also moved `/privacy` ahead of the conversational services, so the Meta app can go Live (guide Part D).

- **2026-10-12 · the app secret redone:** `wa_app_secret:DZ-0000` now has a Meta App Secret's format (32 hexadecimal characters; checked by length and pattern only), and `wa_token:DZ-0000` is unchanged. The owner saved `https://deepzeta.ai/privacy` as the app's Privacy Policy URL; the Live switch waits for the page on production (`feat/privacy-page`, CI green).

- **2026-10-12 · Part D done:** `/privacy` merged to `main` (`0696165`) and live; the owner published the Meta app (Live); Meta's webhook verification reached the gateway and got 200 (edge logs, 08:25 UTC); `messages` subscribed (v26.0). Open: the Step 2 checklist shows "Add payment to send business-initiated messages" unticked, to check before the templates are used.

- **2026-10-12 · the sales brief and stage 1 (knowledge):** the owner approved all 8 topics of the sales brief, which are in `docs/facts/sales-knowledge.md`. The plan `docs/plans/2026-10-12-hours-and-agent-knowledge.md` (APPROVED) moved the hours to Monday to Friday sitewide and added the approved answers, the Google Business Profile and the owner's own edits to the generator; `agent-knowledge.md` is regenerated for the owner's review (Part G). The owner also approved stage 2 (the agent's rules, the expert follow-up, and six safety fixes) and stage 3 (testing).
- **2026-10-12 · stage 2 done (Supabase and n8n; the workflows stay unpublished):**
  - Supabase migration `stage2_expert_followup_and_safety` (in the project's migration history):
    - `contacts` gains `lead_priority`, `expert_followup_at` and `last_strike_at`
    - strikes now expire after 30 days, and a mute is logged
    - `wa_batch` returns the blocked-word list
    - `apply_ai_result` saves the priority and the follow-up time
    - a `safety_events` log (no message text) with `rpc_log_safety_event`, EXECUTE for `service_role` only, and a cron `purge-safety-events` (90 days, 23:45 UTC)
  - `settings`:
    - `moderation.blocked_keywords` holds 42 words and phrases (English, Arabic, Arabizi, Hindi/Urdu), editable by the owner (guide, "Edit the blocked words")
    - `global_rules` gains three output fields for every client: `expert_followup`, `lead_priority` and `lead_details`
  - DZ-0000 `config.rules`: 14 rules covering the name "Deepzeta AI Agent", the sales playbook (`sales-knowledge.md`), the expert follow-up, and the earlier booking, price and payment rules. `business_profile` has been regenerated.
  - `DZ · Inbound WhatsApp` (53 → 62 nodes):
    - DeepSeek runs in JSON mode
    - **Classify Safety** adds the blocked words and reports a failed safety check, which **Log: Safety Check Down** records
    - **Record Strike** passes the reason; **Muted Now?** → **Alert Team: Contact Muted**
    - **Check Reply (OpenAI Moderation)** sits before **Parse & Polish Reply**. That step now holds back an unreadable reply, a flagged one, a price or a promised result: the customer gets the holding message, and the team gets a hand-off alert with the held-back text, logged by **Reply Held Back?** → **Log Reply Event**. It also cuts replies at 1,000 characters on a full sentence.
    - **Expert Follow-up Requested?** → **Alert Team: Expert Follow-up**, titled 🔥 HOT, Warm or Cold lead
  - Checked: both code nodes passed 27 local cases (English, Arabic and Hindi words with innocent lookalikes, prices in four forms, negated and plain promises in English and Arabic, broken JSON, long replies), and the deployed workflow matched the tested code. Every Code node compiles, the new credentials and wiring are in place, and the workflow is still inactive (34 checks). Open for stage 3: DeepSeek's JSON mode together with tool calls, tested live.
  - The guide's Part G Client ID is corrected to `DZ-0000`, a section "Edit the blocked words" is added, and the weekly check now covers `safety_events` and the expert follow-ups.
- **2026-10-12 · merged and Part H0:**
  - The owner approved the knowledge file and said "merge": `main` is at `cf7b47d`, and production shows the Monday-to-Friday hours (footer and `/privacy`, checked live).
  - Part F: `dz_booking_reminder` in English and Arabic is submitted and in review. Meta flagged `team_alert` as Marketing in two wordings, most likely because `{{2}}` holds a whole free-text alert. It waits for a redesign with fixed blanks, before the team number is used; until then team alerts are email only.
  - Part H0: `DZ · Error Alerts` is published (active), and it's set as the error workflow on the 6 workflows in use (`DZ · Renew Client` stays off).
  - The migration `wa_inbound_test_mode` lets `config.test_numbers`, while non-empty, limit the AI to those numbers; everyone else gets the paused notice once a day. It's empty until the owner sends the test numbers.
  - The owner's n8n screen showed "19 hours left" on the Cloud trial (0/1000 executions): a paid plan is needed before the workflows can keep running.

**The retention migration (S4), as applied:**

```sql
-- Clears the memory (summary and name) of contacts silent for config.summary_retention_months (default 12)
create or replace function public.purge_old_summaries()
returns integer
language plpgsql
set search_path to 'public'
as $function$
declare n int;
begin
  update public.contacts ct
     set summary = null, summary_updated_at = null, name = null
    from public.clients c
   where c.id = ct.client_id
     and (ct.summary is not null or ct.name is not null)
     and coalesce(greatest(ct.last_inbound_at, ct.last_outbound_at), ct.created_at)
         < now() - make_interval(months => coalesce(nullif(c.config->>'summary_retention_months', '')::int, 12));
  get diagnostics n = row_count;
  return n;
end $function$;
revoke execute on function public.purge_old_summaries() from public, anon, authenticated;
grant execute on function public.purge_old_summaries() to service_role;
-- Daily at 23:25 UTC (03:25 in Dubai), ten minutes after purge-old-messages
select cron.schedule('purge-old-summaries', '25 23 * * *', 'select public.purge_old_summaries()');
```
