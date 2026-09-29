# Plan: rule-file changes for decisions 0004 and 0005
Status: DONE (approved by the owner 2026-09-29 via `docs/plans/2026-09-29-design-direction-v2.md`; applied on branch `docs/stack-decision`; amended per that plan's review: WebGL wording, C14 citation, 03 lhci row, Node step)
Phase: P-1
Branch: docs/stack-decision

## Goal served
*"A fast, custom-coded, AI-search-ready site … proves every claim it makes."* This aligns the rule system with the stack ([0004](../decisions/0004-tech-stack.md)) and the performance tiers ([0005](../decisions/0005-performance-tiers.md)), so agents don't get conflicting instructions.

## Out of scope
- Accepting 0004/0005 (owner)
- Installing any package (each needs its own P0/P7 plan with a verified version and size)
- Information architecture changes (`/integrations` hub etc., which depend on C6)
- n8n workflow build and guides (separate plans)

## Allowed files (owner edits)
| Path | Action | Purpose |
|---|---|---|
| `docs/ai/06-code-standards.md` | MODIFY §1, §5 | Stack rows; GSAP allowed per page tier; bans added: Lenis/smooth-scroll, plus **extras for owner review**: `motion` everywhere (was "on the critical path"), React Hook Form, `lucide-react`/icon libraries (from 0004 "Not adopted") |
| `docs/ai/05-design-system.md` | MODIFY §5 rules 2 and 5 | Motion toolkit per tier |
| `docs/ai/07-performance-budget.md` | MODIFY §1, §5 | Tier floors; per-tier regression |
| `docs/ai/09-analytics-tracking.md` | MODIFY §1 | CRM path via n8n → Sheets |
| `docs/ai/03-verification-gates.md` | MODIFY §1 (`lhci` row) | Per-tier budgets |
| `docs/ai/conflict-register.md` | APPEND-ONLY | C12–C15 |
| `docs/decisions/README.md` | MODIFY index | 0004/0005 → ACCEPTED |
| `CLAUDE.md` | MODIFY "Current state" | Reference 0004/0005 |

---

## 1. `docs/ai/06-code-standards.md`

**§1: add these rows after the `Content` row:**
```
| Motion | Native CSS/SVG/View Transitions first; GSAP only on page tier T2/T3; WebGL/Rive only on T3, plus one post-LCP WebGL moment on Home | Page tiers in decision 0005 |
| Forms | Native `<form>` + Server Actions + `useActionState`; Zod on the server | No React Hook Form |
| Spam / rate limit | Cloudflare Turnstile (on form focus) + Upstash Redis rate limit | Serverless-safe store (§4) |
| Automation | n8n (hosting per decision 0004), called only from the server via signed webhook; workflow JSON in the repo | Decision 0004 |
| CRM / email | Google Sheets v0 + Gmail (Workspace) via n8n; HubSpot/Zoho later | Swap inside n8n only |
| AI agent | AI SDK + Claude on a route handler, streaming; UI loaded on tap | Model chosen in P7 plan |
```

**§5 item 3: replace**
> **Banned by default:** jQuery, CSS frameworks other than Tailwind, UI kits/templates, page builders, styled-components/Emotion/Sass, Lodash/Moment, GSAP, Framer Motion on the critical path, Lottie, state libraries where React state suffices, `next-seo`.

**with**
> **Banned by default:** jQuery, CSS frameworks other than Tailwind, UI kits/templates, page builders, styled-components/Emotion/Sass, Lodash/Moment, `motion`/Framer Motion, Lottie, Lenis or any smooth-scroll/scroll-jacking library, React Hook Form, `lucide-react` and other icon libraries, state libraries where React state suffices, `next-seo`. **GSAP** is allowed only on page tier T2/T3, loaded when its section is visible, never on Home (decision 0005).

## 2. `docs/ai/05-design-system.md` §5

**Rule 2: replace**
> 2. **CSS first.** No heavy animation libraries (no GSAP, no Framer Motion on the critical path, no Lottie).

**with**
> 2. **Native first.** CSS transitions, CSS scroll-driven animations, View Transitions, `@property`, SVG. GSAP only on page tier T2/T3 (not the icon story tiers above), loaded when visible. No `motion`/Framer Motion, no Lottie (decision 0005).

**Rule 5: replace**
> 5. **At most one WebGL/3D moment on the whole site**, loaded late, only on capable devices, with a complete static fallback.

**with**
> 5. **Real-time 3D (WebGL):** at most one moment on Home, loaded after LCP (or on first scroll or tap) on capable devices, with a static SVG/CSS LCP element, and only while `lhci` still shows ≥ 95; allowed on page tier T3. Always a complete static fallback, gated on device capability, reduced motion and Save-Data (decision 0005). CSS 3D transforms are not "real-time 3D" and follow the normal motion rules.

## 3. `docs/ai/07-performance-budget.md`

**§1: replace the row**
> | Lighthouse Performance (mobile) | ≥ 95 | ≥ 90 |

**with**
> | Lighthouse Performance (mobile) | per tier | T1 Home ≥ 95 · T2 money pages ≥ 90 · T3 experience pages ≥ 70 (decision 0005). Unlisted pages = T2. |

**and add under the table:**
> *Tiers:* Core Web Vitals hard limits (LCP, INP, CLS) apply to **every** tier. The tier only changes the Lighthouse score floor and the motion toolkit allowed.

**§5: replace**
> Once a page has a Lighthouse baseline, a change that drops its mobile Performance score by **more than 2 points** or breaks any hard limit **blocks the merge**

**with**
> Once a page has a Lighthouse baseline, a change that drops its mobile Performance score by **more than 2 points**, takes it below its **tier floor**, or breaks any hard limit **blocks the merge**

## 4. `docs/ai/09-analytics-tracking.md` §1

**Replace**
```
Lead form ──► server route ──► CRM (HubSpot or Zoho) ──► offline conversion import to Ads
            (PII goes here only, never through GTM)
```
**with**
```
Lead form ──► server action ──(signed webhook)──► n8n ──► Google Sheet (CRM v0; HubSpot/Zoho later)
            (PII goes here only, never through GTM)   ├─► Gmail auto-reply + owner alert
                                                      ├─► WhatsApp Cloud API
                                                      └─► server-side CAPI events (Meta, LinkedIn)
Google Ads ◄── scheduled offline-conversion import from the Sheet
```

## 5. `docs/ai/conflict-register.md` (append)
```
| C12 | An AI-agent stack brief (Roo Code, written for the reference project) recommended `motion` sitewide, React Hook Form, HubSpot now, a third-party CMP, Payload CMS, PostHog, `lucide-react`, `SoftwareApplication` schema and Next.js 15.2.4. | Foundation kept; additions replaced per decision 0004 (native-first motion + GSAP per tier, native forms, n8n → Sheets CRM v0, custom consent banner, in-house icons, `Service` schema, latest stable Next.js). | Owner | 2026-09-26 | Resolved |
| C13 | 07 §1 sets one Lighthouse floor (≥ 90) for every page; the owner wants maximum speed on Home and more design freedom elsewhere. | Three tiers per decision 0005: Home ≥ 95, money pages ≥ 90, experience pages ≥ 70; Core Web Vitals hard limits on every page. | Owner | 2026-09-26 | Resolved |
| C14 | The standing performance constraint allows a single WebGL hero moment and no heavy JS animation libraries, and the blueprint (§6 design directions) says "only one 3D or WebGL moment on the whole site"; decision 0005 allows GSAP on page tiers T2/T3 and WebGL on T3. | Owner override per decision 0005. The constraint's CWV limits, no-scroll-jacking rule and cost/mitigation rule still apply on every page. | Owner | 2026-09-26 | Resolved |
| C15 | The blueprint tech stack (§9) says n8n self-hosted, the chat agent runs on n8n, and the CRM is HubSpot or Zoho. | Decision 0004: n8n Cloud recommended (owner to confirm hosting), the chat agent on an AI SDK route, Google Sheets as CRM v0 with HubSpot/Zoho later. | Owner | 2026-09-26 | Resolved (hosting pending) |
```

## 6. `CLAUDE.md` "Current state"

**Add a bullet:**
> - **Stack and performance tiers** accepted in decisions 0004 and 0005 (`docs/decisions/`). Motion is native-first; GSAP only on T2/T3 pages; automation runs on n8n.

## 7. `docs/ai/03-verification-gates.md` §1

**In the `npm run lhci` row, replace**
> Lighthouse CI on the fixed URL sample with budgets from [07](07-performance-budget.md)

**with**
> Lighthouse CI on the fixed URL sample with per-tier budgets from [07](07-performance-budget.md) (page tiers: decision 0005)

## Steps
1. Owner accepts 0004 and 0005 (done: both files say ACCEPTED; the index is updated in this change).
2. Apply sections 1–7 above (owner approves each protected-file edit).
3. Run `node scripts/check-rules.mjs` (Node v24 is installed; there is no `package.json` until P0) → gate after step.

## Risks & mitigations
- Rule text and decisions drift → the conflict register entries reference the decisions; `check-rules` runs in P0.
- T3 pages become a dumping ground for heavy effects → Core Web Vitals stay hard limits, and each effect's plan states its cost and mitigation.

## Open questions
- none (open business inputs are listed in 0004 Consequences)
