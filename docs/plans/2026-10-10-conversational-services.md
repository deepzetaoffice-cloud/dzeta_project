# Plan: The conversational service pages (`story-chat` variant of the service template)
Status: DRAFT
Phase: P6 · Branch: `content/services-conversational` · Page tier: standard (decision 0029)

## Goal
*"… turns UAE business owners into booked AI audits, and proves every claim it makes."* Ship the
seven services that are conversations, with the story the design spec gives them
(`docs/design/service-page.md`: "one `story-flow`, or `story-chat` for conversational services"):

| Row | Service | Type | Story | Try it (07 §4) |
|---|---|---|---|---|
| R020 | 1A.1 WhatsApp AI Agent | 🔥 lead, W1 | chat | `ai-agent` |
| R021 | 1A.2 AI Voice Receptionist | 🔥 lead, W1 | call transcript | none |
| R022 | 1A.3 AI Outbound Calling Agent | ⭐ core | call transcript | none |
| R023 | 1A.4 Website AI Chat Agent | ⭐ core | chat | `ai-agent` |
| R024 | 1A.5 Omnichannel Inbox AI | ⭐ core | chat | `ai-agent` |
| R025 | 1A.6 Internal Knowledge Assistant | ⭐ core | chat (a staff question) | `ai-agent` |
| R036 | 1D.1 AI Customer Support Automation | ⭐ core | chat | `ai-agent` |

## How the template grows
- **A shared `StoryChat` component** (`src/components/sections/StoryChat.tsx`, server-rendered):
  - **The script:** a typed script of 3–6 messages (customer or agent) and an optional closing note ("Booked · Tuesday 16:00").
  - **Labels:** "Example conversation", or "Example call" for the two voice services (10 §3.6), with an accessible description of the whole exchange.
  - **Static first:** the full exchange is in the HTML, and it is the resting state without JavaScript and under Reduce effects (13 §3.3).
- **Its timing in the service template's own stylesheet**, `src/styles/templates/service.css` (decision 0026 §4), imported by the `[slug]` route only. The bubbles reuse the shared chat styles that Home already ships. Each bubble's delay comes from its index, so a script can have any length. Home's own chat stays exactly as it is (C73).
- **Replay** (13 §2.1: stories play once, with a replay control): the story controls' small island on service pages that have a chat (≤ 2 KB, the island the flagship page built). A chat stays under 5 s, so it needs Replay only, not Play/Pause.
- **The content type:** `how.chat?` (the script). When present, ServiceHow shows the chat instead of the `story-flow`, beside the same visible step list (HowTo stays honest).
- **Icons:** 1A.1 and 1A.2 exist. The icon recipe adds five Tier 2 icons (1A.3–1A.6, 1D.1), with no knockouts and existing motions only.
- **Copy:** the Content Writer, from each catalogue entry. The scripts are examples, never claims ("Example conversation"). The UAE section keeps to our own practice (no APPROVED citations); the WhatsApp agent's own facts follow decision 0027 (Deepzeta is client #1 of the stack).

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/components/sections/StoryChat.tsx` | CREATE | The shared chat story |
| `src/components/sections/service/ServiceSections.tsx` | MODIFY | ServiceHow shows `how.chat` when present |
| `src/components/sections/StoryControls.tsx` | MODIFY | A Replay control for a chat |
| `src/styles/templates/service.css` | CREATE | The chat's per-message timing (tokens only) |
| `src/app/(en)/services/[slug]/page.tsx` | MODIFY | Import the template stylesheet |
| `src/content/en/services/types.ts`, `index.ts` | MODIFY | `how.chat`; register the seven pages |
| `src/content/en/services/<seven slugs>.ts` | CREATE | The pages' copy |
| `src/content/en/faq-bank.ts` | MODIFY | Their FAQs |
| `src/components/icons/registry.ts` | MODIFY | Five Tier 2 icons |
| `src/lib/routes.ts`, `docs/seo/url-registry.md` | MODIFY | R022–R025, R036 rows where missing; the seven → live; a change-log row |
| `tests/e2e/services.spec.ts` | MODIFY | The chat: complete without JS, still when reduced, Replay works |
| `tests/fixtures/schema/services-hub.json` | MODIFY | The hub's list gains the seven (additions only) |
| `docs/plans/2026-10-10-conversational-services.md` | MODIFY | Progress |

## Effect register
| Section | Effect ID | Cost → mitigation |
|---|---|---|
| §3 How it works | `story-chat` | CSS one-shot (opacity/translate) on the shared observer's `.is-in`; complete without JS and when reduced; Replay in the ≤ 2 KB island; template stylesheet only, Home untouched |

§7 Try it uses the existing demo stub, which loads on first use; it is a component, not an effect.

## Dependencies, risks
- **No dependency.**
- **Gates:** a template change, so the branch row plus the SEO/GEO and Performance & Accessibility auditors once. `lhci` on Home runs because `ServiceSections.tsx` and the island are shared modules; Home doesn't render them, but its numbers must not move.

## Open questions
1. **The voice services' story.** I'd show a call as a transcript in the same chat styling, labelled "Example call", rather than build a new audio-style graphic. Agree?
2. **The batch size.** All seven in one branch (within the batch limit of 10), or the two 🔥 lead pages (WhatsApp AI Agent, AI Voice Receptionist) first as the template's pilot for your review, then the other five?

## Progress
