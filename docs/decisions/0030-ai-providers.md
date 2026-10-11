# 0030 · DeepSeek is the only AI provider, everywhere

Status: ACCEPTED (owner, 2026-10-11: "we will use DeepSeek instead of OpenAI with the same API key … change to DeepSeek API completely for the automation and other tools that we use in the website and n8n")

## Context

- [Decision 0016](0016-ai-provider-deepseek.md) made DeepSeek the site's AI provider: the AI agent demo, the Social Media Content Planner and pSEO drafting. No Anthropic API use remains in the plans. The remaining mentions are crawler rules, "tools we work with" lists and historical records.
- [Decision 0027](0027-automation-pipeline.md) added OpenAI to the WhatsApp agent stack for three jobs, never the answers. The live n8n workflows were checked on 2026-10-11:
  - **moderation:** `Safety Check (OpenAI Moderation)` in `DZ · Inbound WhatsApp`
  - **voice-note transcription:** `Transcribe Voice Note`
  - **knowledge embeddings:** `OpenAI Embeddings` (`text-embedding-3-small`, 1536 dimensions) in `DZ · Inbound WhatsApp` (search) and twice in `DZ · Knowledge Upload` (saving). They feed the Supabase vector store `kb_documents` / `match_documents`.
  - `DZ · Scheduled Jobs` already uses DeepSeek only (memory summaries).
- DeepSeek's API, checked on 2026-10-11 ([api-docs.deepseek.com](https://api-docs.deepseek.com/)), offers chat models only: `deepseek-flash` and `deepseek-v4-pro`, with a 1M-token context and context caching. It offers **no embeddings, no speech-to-text and no moderation endpoint**.

## Decision

1. **DeepSeek is the only AI provider** for the WhatsApp agent stack, the website's AI tools and n8n. One account, one API key (the owner's A1). OpenAI is removed, and so are its key, its n8n credential and its spend limit.
2. **The three OpenAI jobs, replaced:**
   - **Moderation:** a short DeepSeek classification call before the agent (`deepseek-flash`, JSON out: ok, abuse or self-harm). It keeps the strikes, the polite fixed refusal and the caring fixed reply with a team alert (0027).
   - **Knowledge:** no embeddings. A client's whole knowledge is given to the agent in its instructions. It is small (Deepzeta's is a few thousand words), and DeepSeek's context caching makes the repeat cheap. The vector search tool and the embedding steps in `DZ · Knowledge Upload` are removed; knowledge is saved as plain text per client. A client whose knowledge outgrows this gets Postgres full-text search in Supabase later. That is still no other vendor, and it gets its own plan.
   - **Voice notes:** DeepSeek can't transcribe audio. A voice note gets the fixed reply `voice_failed` (EN/AR), politely asking the customer to type the message, and is logged. ⚠️ **The trade-off:** many UAE customers send voice notes. The owner can later approve a speech-to-text provider in a new decision.
3. **Model names:** the stack's `deepseek-chat` becomes `deepseek-flash`, DeepSeek's current name, in S4.

## Consequences

- **Supersedes** 0027's OpenAI items: the moderation row, OpenAI as a processor, "Extends 0016: OpenAI is a second AI vendor", and OpenAI in the cost line. The rest of 0027 stands.
- **[C72](../ai/conflict-register.md)'s part (2)** (0016 named DeepSeek as the only AI) is true again.
- **Processors** in the privacy policy: DeepSeek (China), Supabase (India), n8n (EU). OpenAI (US) is removed.
- **Updated with this decision:**
  - the automation plan (S4's edits, the allowed files, the progress note)
  - the owner's guide: Part A2 and credential 3 removed; Part I's voice-note check; Part J; the weekly check
  - the pre-launch register's privacy and spend-limit rows
- **Track B** (the website agent, P7) and Deepzeta Sync's tools use DeepSeek only, as 0016 already says.
