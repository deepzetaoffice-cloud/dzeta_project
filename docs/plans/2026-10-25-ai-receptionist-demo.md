# Plan: AI receptionist live demo (`/ai-receptionist`)
Status: APPROVED (owner, 2026-10-25, in chat: build it, the page-only security exception, the official package, `/ai-receptionist`, a preview link before the merge)
Phase: demo surface · Branch: feat/ai-receptionist-demo · Figma frames: n/a (no frame yet; built from the v3 tokens and components, owner's instruction 2026-10-25)

## Goal
Proof over claims (00 §1, "visitors try the automations"): a branded page where a visitor talks to Deepzeta's AI receptionist in the browser, with no third-party branding, URL or widget visible. Unlinked and `noindex` for now: a demo the owner shares by link.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/app/(en)/ai-receptionist/page.tsx` | CREATE | The page: hero, the voice console, "Try asking", the next step |
| `src/components/demos/VoiceReceptionist.tsx` | CREATE | The client island: session, orb, live transcript, typed fallback |
| `src/app/api/voice-session/route.ts` | CREATE | Server route: mints a one-time WebRTC session token; the API key never reaches the browser |
| `src/content/en/ai-receptionist.ts` | CREATE | The page's copy (10) |
| `src/styles/ai-receptionist.css` | CREATE | The page's styles, tokens only (05) |
| `src/lib/voice-demo-headers.ts` | CREATE | The page-only CSP and Permissions-Policy, derived from `security-headers.ts` (unchanged) |
| `next.config.ts` | MODIFY | One header rule for `/ai-receptionist` after the sitewide rule (last match wins) |
| `.env.example` | MODIFY | `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` (server-only) |
| `package.json`, `package-lock.json` | MODIFY | `@elevenlabs/react` 1.19.1 via `npm install --save-exact` (npm 11), owner-approved |
| `docs/seo/url-registry.md` | APPEND-ONLY | R180 in §3.8 (noindex) and a change-log row |
| `docs/plans/2026-10-25-ai-receptionist-demo.md` | CREATE | This plan |

## Steps
1. Install the package; read its installed types before use (02 §2).
2. Server route: `GET https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=…` with `xi-api-key`; same-origin requests only; `no-store`.
3. Page-only headers: `microphone=(self)` in place of `microphone=()`; `connect-src` + `wss://` and `https://livekit.rtc.elevenlabs.io` (the WebRTC signalling host the package uses for the default "us" location); `script-src` + `blob:` (the package's audio worklet, which it loads from a blob URL). Every other page keeps today's headers exactly.
4. Page + island + copy + styles. No overrides sent to the agent (they need the agent's override switches); typed messages and context use the session's own channels.
5. Gates (03 §2), the response headers checked on the built page, a preview deployment for the owner's mic test.

## Effect register (visual work only; IDs from docs/ai/13 §4)
| Section | Effect ID | Purpose · reduced-motion fallback · loading |
|---|---|---|
| Console buttons, prompt chips | `press-scale` | Feedback · kept · CSS |
| Everything interactive | `focus-ring` | State · same · CSS |
| Console status dot while connected | `status-pulse` | State: the line is live · solid dot · CSS |

**Proposed for 13 §4 (owner to add; not cited above until it exists):** `voice-orb`: the console's orb scales with the live voice level and a ring of bars follows the agent's voice. Purpose: feedback (who is speaking). Reduced motion: no scaling; the orb's colour and the status text change instead. Runs only while connected and the tab is visible.

## Dependencies, risks (only if real)
- `@elevenlabs/react` 1.19.1 (with `@elevenlabs/client` 1.30.0 and `livekit-client`): a hand-rolled WebRTC client would mean reimplementing the vendor's signalling and audio pipeline, which changes without notice. Client JS on this page only (the route's own chunk).
- The token route can be called by anyone who can reach the page: it accepts same-origin requests only, and the agent's usage limits stay in the owner's ElevenLabs settings.
- "No trace": nothing visible on the page names the vendor; its host appears in this page's CSP header and in the browser's network panel, as with any hosted voice service.

## Open questions
- Figma frame and the `voice-orb` library row (owner, later).

## Progress
- 2026-10-25: built on `feat/ai-receptionist-demo`; preview for the owner's test.
