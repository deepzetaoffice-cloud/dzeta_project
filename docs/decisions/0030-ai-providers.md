# 0030 · AI providers: DeepSeek writes, OpenAI listens and checks

Status: ACCEPTED (owner, 2026-10-11)

**History:** on the same day, before this record reached `main`, the owner first chose DeepSeek alone. That would have left voice notes untranscribed. The owner then decided: "we must understand the voice notes from the customer … in their language … our system must be strong and perfect. I think we need OpenAI API." The final answers:
- **OpenAI role:** all three jobs.
- **Reply language:** the customer's language.

## Context

- [Decision 0016](0016-ai-provider-deepseek.md) made DeepSeek the site's AI provider: the AI agent demo, the Social Media Content Planner and pSEO drafting. **No Anthropic API use remains.** The remaining mentions are crawler rules, "tools we work with" lists and historical records.
- [Decision 0027](0027-automation-pipeline.md) gave OpenAI three supporting jobs in the WhatsApp agent stack. The live n8n workflows were checked on 2026-10-11:
  - **moderation:** `Safety Check (OpenAI Moderation)` in `DZ · Inbound WhatsApp`, `omni-moderation-latest`
  - **voice-note transcription:** `Transcribe Voice Note`
  - **knowledge embeddings:** `text-embedding-3-small`, 1536 dimensions, in `DZ · Inbound WhatsApp` and `DZ · Knowledge Upload`. They feed the Supabase vector store `kb_documents` / `match_documents`.

  DeepSeek writes every reply and the memory summaries (`DZ · Scheduled Jobs`).
- DeepSeek's API (checked on 2026-10-11) offers chat models only: `deepseek-flash` and `deepseek-v4-pro`. It has no embeddings, speech-to-text or moderation endpoint.
- OpenAI's speech-to-text guide (checked on 2026-10-11) recommends `gpt-transcribe` for "transcribing recorded speech in its original language". `whisper-1` supports 98 languages. Files can be up to 25 MB.

## Decision

1. **DeepSeek writes, everywhere.** Every reply the WhatsApp agent sends, the memory summaries, and the website's AI tools (0016). The model name `deepseek-chat` becomes `deepseek-flash`, DeepSeek's current name, in S4.
2. **OpenAI listens and checks, in the WhatsApp agent only, and never writes a reply.** These are 0027's three jobs, kept as built:
   - **voice notes,** transcribed in the language spoken, with `gpt-transcribe` (`whisper-1` as the fallback)
   - **the safety check,** with OpenAI's moderation model (free, multilingual)
   - **knowledge search,** with OpenAI embeddings over each client's own knowledge
3. **The agent understands and replies in the customer's language,** whatever it is: English, Arabic, Hindi, Urdu, Malayalam, Tagalog, Russian, Chinese and others. This replaces the plan's "EN/AR" rule.
   - The fixed messages (opt-out, errors, refusals) stay English and Arabic.
   - A customer can always ask for a person.

## Consequences

- **0027 stands as written**, with two changes: its language rule (point 3) and the transcription model (point 2).
- **Processors** in the privacy policy: DeepSeek (China), OpenAI (US), Supabase (India) and n8n (EU).
- **The owner's keys:** A1 (DeepSeek) and A2 (OpenAI, with a monthly usage limit).
- **Risk: the voice-note format.** WhatsApp sends voice notes as `.ogg` (Opus). OpenAI's current guide lists `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav` and `webm`, not `ogg`. The stack sends `.ogg` as built. Part I's check 4 tests it with a real voice note before go-live. If OpenAI rejects the file, S4 adds a conversion step, and the agent never stays silent: it falls back to `voice_failed`.
- **Updated with this decision:**
  - the automation plan: the external-systems table, the language rule in S3, the progress note
  - the owner's guide: A2, credential 3, check 4, Part J, the weekly check
  - the pre-launch register: the privacy and spend-limit rows
