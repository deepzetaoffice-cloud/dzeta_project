# Plan: AI voice clone live demo (`/ai-voice-clone`)
Status: APPROVED (owner, 2026-10-25, in chat: a second demo page with his own cloned voice; the persona "Jamsheed's AI twin"; `/ai-voice-clone`; English and Arabic; a preview link before the merge)
Phase: demo surface · Branch: feat/ai-voice-clone-demo (from feat/ai-receptionist-demo) · Figma frames: n/a (the `/ai-receptionist` layout, reused)

## Goal
Proof over claims (00 §1): a visitor talks, in the browser, to an AI twin of the founder speaking in his own cloned voice, made with his permission. Same design, console and safeguards as `/ai-receptionist` (plan `2026-10-25-ai-receptionist-demo.md`). Unlinked and `noindex`: shared by link.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/app/(en)/ai-voice-clone/page.tsx` | CREATE | The page: metadata + the shared demo page |
| `src/components/demos/VoiceDemoPage.tsx` | CREATE | The demo page's body, shared by both demo pages (moved from the `/ai-receptionist` page, unchanged in output) |
| `src/app/(en)/ai-receptionist/page.tsx` | MODIFY | Metadata + the shared demo page |
| `src/components/demos/VoiceReceptionist.tsx` | MODIFY | An `agent` prop chooses which agent the session route starts; a widened copy type |
| `src/app/api/voice-session/route.ts` | MODIFY | `?agent=clone` starts the clone agent (`ELEVENLABS_CLONE_AGENT_ID`); no parameter keeps today's agent |
| `src/content/en/ai-voice-clone.ts` | CREATE | The page's copy (10), labelled as an AI clone made with the founder's permission |
| `src/content/en/ai-receptionist.ts` | MODIFY | Export the shared copy type only |
| `src/lib/voice-demo-headers.ts` | MODIFY | `VOICE_CLONE_PATH` |
| `next.config.ts` | MODIFY | The same page-only header rule for `/ai-voice-clone` |
| `.env.example` | MODIFY | `ELEVENLABS_CLONE_AGENT_ID` (server-only) |
| `docs/seo/url-registry.md` | APPEND-ONLY | R181 in §3.8 (noindex) and a change-log row |
| `docs/plans/2026-10-25-ai-voice-clone-demo.md` | CREATE | This plan |

## Steps
1. Agent (outside the repo, done in the owner's voice account): a copy of the Sara agent with the owner's voice `DRoVInpyX4vSNfPzOHAi`, the AI-twin persona, English and Arabic greetings that say it is an AI.
2. Route, island and shared page; the clone page; copy; headers; registry.
3. Gates (03 §2), the headers checked on the built page, the agent ID added in Vercel (Preview and Production), a preview deployment for the owner's mic test.

## Effect register (IDs from docs/ai/13 §4)
Same as `/ai-receptionist`: `press-scale`, `focus-ring`, `status-pulse`; the proposed `voice-orb` stays proposed.

## Risks (only if real)
- A cloned voice can be mistaken for the person: the page, the greeting and the agent's prompt all say it is an AI twin made with his permission, and the agent never makes promises in his name.

## Progress
- 2026-10-25: built on `feat/ai-voice-clone-demo`; preview for the owner's test.
