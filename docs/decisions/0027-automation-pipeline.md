# 0027 · The automation pipeline: Deepzeta is client #1 of its own WhatsApp AI stack

Status: ACCEPTED (owner, 2026-10-07: the four choices, the answers to the plan's open questions, and "update rules files to approve"). Recorded as conflict C72 (renumbered from C69 when the A2, header and standard-tier merges took C69–C71).

Renumbered from the 2026-10-07 draft "0025 · The full automation pipeline". Both 0025 and 0026 were taken by then.
This record replaces that draft and was rewritten after the owner's review on the same day.

## Context

Decision [0004](0004-tech-stack.md) set the automation backbone:
- n8n, with Google Sheets as CRM v0
- Gmail as the email sender, and Cal.com for booking

Decision [0016](0016-ai-provider-deepseek.md) made DeepSeek the AI. Decision [0024](0024-conversion-cta-set.md) made WhatsApp the primary CTA and the header's "Deepzeta AI" button the website agent. It also chose n8n + Meta's WhatsApp Cloud API, not Twilio.

On 2026-10-07 the owner chose AI answers at launch ("Option B"), and briefed what the pipeline must do:
- A WhatsApp agent answers every enquiry in the visitor's language, on topic, and never invents.
- Booking confirms the meeting type (call, Google Meet or office visit) before it books. A WhatsApp and email confirmation follows, and the team is notified.
- Moderation blocks abuse and spam, and steers unrelated questions back politely.
- Memory recognises a returning visitor.
- A website agent with the same brain hands over to WhatsApp.

A first draft planned a new pipeline built on Google Sheets, a bad-word list and Cal.com.

**What the review found (read through the n8n and Supabase connectors, 2026-10-07):** a complete multi-client WhatsApp AI stack already exists. It was built on 2026-10-01, and none of it is active yet:
- **n8n Cloud** (`deepzeta.app.n8n.cloud`). Eight `DZ ·` workflows and one showcase flow:
  - `DZ · Inbound WhatsApp`: message batching, dedupe, mute, a rate limit, voice-note transcription, a moderation model with strikes and a crisis reply, a DeepSeek agent with knowledge search and booking tools, structured memory, human handoff and an error holding reply.
  - `DZ · Booking Tools`: Google Calendar free/busy, a slot reservation that can't double-book, and cancel/list.
  - `DZ · Send WhatsApp`, `DZ · Team Alert`, `DZ · Scheduled Jobs` (memory summaries, reminders, follow-ups, billing), `DZ · Error Alerts`, `DZ · Knowledge Upload (form)` and `DZ · Renew Client (form)`.
- **Supabase** project `deepzeta-automation` (region ap-south-1, Mumbai):
  - eight tables, with RLS on
  - a `whatsapp-gateway` edge function: Meta's single webhook enters here. It checks Meta's signature, drops status events and forwards each message to n8n.
  - secrets in Supabase Vault, and two cron jobs: dispatching scheduled jobs every 15 minutes, and purging messages older than 90 days.
- **The agency row:** the stack already models Deepzeta itself as a client (`clients.is_agency`). Team alerts go out from that row's WhatsApp number, and it answers renewal questions.
- **What's missing:** n8n has no credentials, the `settings` table is empty, and there are no client rows.

The draft would have built a second, weaker brain beside this one, and the one on our own number would not have been the one we sell. Meta also allows one webhook per app, so the draft's n8n WhatsApp Trigger and the gateway can't both own it.

## Decision

**Deepzeta runs its own WhatsApp agent on the existing stack, as client #1 ("tenant zero").** The agent answering Deepzeta's enquiries is the same one Deepzeta installs for clients. That is the strongest "prove what we sell" the site can make (00 §1).

The owner decided the four choices in chat on 2026-10-07:

| Concern | Choice |
|---|---|
| WhatsApp transport | Meta's WhatsApp Business Cloud API → the Supabase `whatsapp-gateway` → n8n `DZ · Inbound WhatsApp`. No Twilio, and no n8n WhatsApp Trigger |
| The brain | DeepSeek ([0016](0016-ai-provider-deepseek.md)) in n8n's AI Agent node, with the rules in `settings.global_rules` and Deepzeta's profile in its client row |
| Knowledge | Per-client knowledge search (Supabase pgvector, chunks tagged by client). Deepzeta's knowledge is **generated from the sources of truth**: the Services Catalogue, CONFIRMED company facts and the published FAQ bank. It's reviewed by the owner and uploaded through `DZ · Knowledge Upload` |
| Moderation | OpenAI's moderation model before the AI (abuse → a polite fixed refusal and a strike; self-harm → a caring fixed reply and a team alert). Off-topic questions are steered back by the AI's rules, never hard-blocked, so a real lead is never dropped |
| Memory | Supabase: the message history, deleted after 90 days, and a summary per contact. The summary keeps **the name, email, what they asked for and the details of the enquiry**, and never medical, ID or payment details. **Summaries are cleared 12 months after the contact's last message** (a small function run by a daily cron job, beside the 90-day message purge) |
| Booking | **One Google Calendar is the diary of record.** WhatsApp books through `DZ · Booking Tools`:<br>• the agent asks the meeting type: a **phone call** (Deepzeta calls the visitor at the booked time; nothing automates the call, and WhatsApp calls aren't available in the UAE), **Google Meet** or an **office visit**<br>• it checks availability, offers slots, and books only after the visitor confirms one exact slot and type<br>• the free audit is a **30-minute call with a 30-minute gap after it**, booked **Monday to Saturday, 10:00–17:00 GST**<br>The website's "Book a free AI audit" uses **Cal.com** with the same length, gap and hours. Cal.com is connected to the same Google Calendar for conflicts, so the two paths can't double-book |
| Confirmations | **WhatsApp bookings:** confirmed in the chat itself (the customer-service window is open). The agent also asks for an email (optional), and a Gmail confirmation goes to the customer.<br>**Website (Cal.com) bookings:** Cal.com's email confirmation. A WhatsApp confirmation template also goes out when the visitor gave a WhatsApp number and WhatsApp consent.<br>**Every booking alerts the team:** by email to **deepzeta.office@gmail.com**, and by WhatsApp once the owner gives the team number. System error alerts stay on hello@deepzeta.ai |
| Hand-off | The agent hands over on **complaints, legal or refund questions, a request for a person, or two failed answers**. The team gets an alert with a `wa.me` link and **replies from a team member's personal WhatsApp**. At hand-off the agent tells the customer that a member of the team will contact them shortly from their own WhatsApp number. The AI keeps answering on the Deepzeta number |
| The number | **+971 54 547 6335**, Deepzeta's main contact number, registered on Meta's Cloud API.<br>• It **can't be used in the WhatsApp or WhatsApp Business app**: using both on one number ("coexistence") is onboarded only by Meta Solution Partners and Tech Providers.<br>• Calls and SMS to it work as usual.<br>• Later options for team replies from the Deepzeta number: a reply form, a Tech Provider account with coexistence, or the Deepzeta Sync app's inbox |
| Go-live | The agent goes live only after the owner's full end-to-end test passes and the working conditions are verified |
| Reminders | About 24 hours before each WhatsApp booking, by an approved template (`DZ · Scheduled Jobs`). Website bookings get Cal.com's email reminders; WhatsApp reminders for them are out of scope for v1 |
| CRM | Supabase holds the conversation state. **Google Sheets (`deepzeta CRM v0`) stays the owner's CRM view** for website leads and Cal.com bookings ([0004](0004-tech-stack.md)) |
| Email | The stack's email steps move to the Gmail credential from the base guide (`hello@deepzeta.ai`, [0004](0004-tech-stack.md)): one email credential for everything |
| Website agent | **Track B, P7**, after the P6 core pages and the Home weight fix (C65). DeepSeek through the AI SDK on a Vercel route, loaded on tap (0016), with knowledge from the same generator. **Name, mobile and email are collected by a small form inside the panel**, sent to our server and then to n8n's lead intake. The model never sees them. A `wa.me` link carries a reference code, so the WhatsApp conversation is linked to the website lead |

**Vendors and where the data is:**
- **Meta** (WhatsApp)
- **n8n Cloud**: EU, Frankfurt
- **Supabase**: India, Mumbai
- **DeepSeek**: China, external source S007
- **OpenAI**: the United States; moderation, voice transcription and knowledge embeddings
- **Google Workspace**: Calendar and Gmail
- **Cal.com**

## Consequences

- **Supersedes** in [0004](0004-tech-stack.md):
  - the "Google Sheets as CRM v0" scope for WhatsApp conversations (Sheets stays for website leads and bookings)
  - the "Cal.com for booking" scope for WhatsApp bookings (Cal.com stays for the website)
- **Extends [0016](0016-ai-provider-deepseek.md):** OpenAI is a second AI vendor, used only for moderation, transcription and embeddings, never for answers.
- **Supersedes the human-first `DZ · WhatsApp Inbound`** in [`docs/owner/n8n-setup-guide.md`](../owner/n8n-setup-guide.md) Part 10, which is never built. The base guide's `DZ · Error Handler` (Part 6) is also replaced by the existing `DZ · Error Alerts`.
- **Plan:** [`docs/plans/2026-10-07-automation-pipeline.md`](../plans/2026-10-07-automation-pipeline.md) (Track A: tenant zero). Track B is recorded there as a P7 stub.
- **Owner guide:** [`docs/owner/n8n-automation-setup-guide.md`](../owner/n8n-automation-setup-guide.md), the click-level setup of the existing stack.
- **Secrets stay with the owner.** WhatsApp tokens and Meta app secrets go into Supabase Vault, through `set_client_secrets`, run by the owner. API keys go only into n8n Credentials and the password manager.
- **Templates Meta must approve:**
  - `team_alert`: the name the stack already uses
  - `dz_booking_reminder`
  - `dz_booking_confirmed`: website bookings only
  - `dz_lead_welcome`: from the base guide
  - The draft's `dz_blocked_reply` is dropped: the visitor has just written, so a normal reply is allowed.
- **Follow-up messages** (the stack can send a follow-up template after N days) **stay off at launch.** Turning them on is an owner decision, with an approved template.
- **Privacy (needs the owner's legal confirmation, as 0016 already flagged):**
  - Visitor messages are processed by DeepSeek (China) and OpenAI (US), and stored in Supabase (India) and n8n (EU).
  - The privacy-policy draft must name all four before the agent goes live.
  - In WhatsApp chats, the visitor's name and email are processed by DeepSeek: the agent asks for them, and the summary keeps them (the owner's choice). The website agent still collects contact details in a form the model never sees.
  - The agent tells visitors not to share sensitive personal data (medical, ID, payment) until DeepSeek's training opt-out is confirmed.
  - Retention: messages 90 days (the existing cron), summaries 12 months after the last message (the new cron).
- **Cost:** DeepSeek and OpenAI are metered, and every inbound message is one n8n execution. The gateway drops delivery and read events so they don't use executions. The stack's per-contact hourly rate limit (30 by default) caps abuse. The owner sets a spend limit where each provider offers one.
- **Conflict register:** recorded as **C72** (renumbered from C69 when the A2, header and standard-tier merges took C69–C71), covering 0004's and 0016's scope changes and P7's automation half pulled forward. The owner asked for the rule-file update on 2026-10-07.
- **Reminder:** the team WhatsApp number for alerts is still to come from the owner (pre-launch register).
