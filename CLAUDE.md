# deepzeta website: Claude Code instructions

**North Star:** *A fast, custom-coded, AI-search-ready site that turns UAE business owners into booked AI audits, and proves every claim it makes.*

This is deepzeta's own website and its first case study. Speed, custom code, SEO/GEO built in, and honesty are not negotiable. Details: `docs/ai/00-project-master-rules.md`.

## Always-loaded core rules

@docs/ai/00-project-master-rules.md
@docs/ai/01-ai-agent-roles.md
@docs/ai/02-anti-hallucination-and-edit-safety.md

## Read before working in an area

| If the task touches… | Read first |
|---|---|
| Any code change (which gates, what evidence) | `docs/ai/03-verification-gates.md` |
| Planning, phases, the plan template | `docs/ai/04-build-sequence.md` |
| Styling, tokens, components, icons, motion | `docs/ai/05-design-system.md` + `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` + the Figma file "Deepzeta AI · Website v3" (`tYw7bSV9m4zX2vrVs7XYpE`, decision 0033) |
| Any effect, animation, hover, scroll, 3D, video or animated explainer | `docs/ai/13-experience-design.md` (effects only by ID, from the Figma motion spec) |
| Building a page, the header, the footer or a demo surface | Its spec in `docs/design/` (index: `docs/design/README.md`) |
| TypeScript, Next.js, dependencies, security | `docs/ai/06-code-standards.md` |
| Images, video, fonts, scripts, anything that affects speed | `docs/ai/07-performance-budget.md` (guidance and reporting, no budgets) + `docs/ai/08-seo-geo-aeo-schema.md` §7 (`MediaAsset`) |
| Metadata, headings, schema, robots, sitemap, `llms.txt` | `docs/ai/08-seo-geo-aeo-schema.md` |
| Page content structure, internal links, FAQ, E-E-A-T, robots/llms content, pSEO | `docs/seo/seo-geo-domination-engine.md` |
| Adding, naming or linking any page (every URL) | `docs/seo/url-registry.md` |
| Analytics, consent, forms, CRM | `docs/ai/09-analytics-tracking.md` |
| Any website copy | `docs/ai/10-content-voice.md` + `docs/facts/company-facts.md` + `docs/facts/external-sources.md` + the Services Catalogue + the engine's page blueprint |
| Layout direction, URLs, locale, Arabic | `docs/ai/11-i18n-rtl-readiness.md` |
| Branches, commits, PRs | `docs/ai/12-git-workflow.md` |
| Something the sources disagree on | `docs/ai/conflict-register.md` |
| Before writing any plan | `docs/ai/lessons-learned.md` |

## Build Mode (decisions 0029 and 0033)

Build fast, test what matters. **Never relaxed:** design (the approved Figma file and the `docs/design/` specs, tokens, logical CSS, effects by ID, contrast, axe, reduced motion and pause controls), SEO/GEO (`check:schema`, `check:seo` with the SEO contract, `check:links`, `check:facts`, the registry and the engine's blueprints, no invented facts). **Performance is measured and reported, never a gate** (N1, 0033): no `lhci`, no floors, no weight limits, and copy never promises a score.
- **Plans:** one template plan covers a page type's pilot and every copy (batches of up to 10, no more plans); short plans for unique builds; no written plan for a change of up to 3 files with no dependency and no protected file (04 §4).
- **Gates by risk (03 §2):** `verify:fast` per commit; per branch the local static gates + `verify:ci` green in CI (with `knip` from Phase C); a Lighthouse and a bundle report attached for information.
- **Records:** decisions only for real choices; reports short (02 §5); progress one line per batch; this section stays short.
- **Parallel tracks** in their own worktrees (04 §1). The owner's "merge" per batch (0017).

## Current state

- **Website v3 built, waiting for the merge** (decision 0033; plan `docs/plans/2026-10-17-redesign-v3.md` with its as-built tables; branch `claude/redesign-v3-69988d`, `verify:ci` green in CI). The owner rejected "Signal & Depth" (0008) on 2026-10-17 and approved the Figma file "Deepzeta AI · Website v3" (`tYw7bSV9m4zX2vrVs7XYpE`) on 2026-10-18: Direction B "Spectrum" with C's diagrams, solid violet `#6430FA` (no green), light only, the rotating hero phrase over one stable H1.
  - **Done (2026-10-19):** Phase A (the rules reset), Phase B (the Figma design), Phase C (the fresh foundation) and Phase D: the shell (D1), Home (D2), the hub and the 11 service pages (D3), the flagship, privacy, the 404 and the error page (D4). The `docs/design/` specs and 13 are synced with the build. The owner settled the LCP contract (the H1 or the hero answer), Home's H1 (Figma's words), the flagship's Core Web Vitals wording and a fresh v3 build recording.
  - **Left before the merge:** the owner's GTM preview check on the branch's Vercel preview (tracking parity: the same events and parameters, the pixels after consent) and a look at the preview against Figma; then the owner's "merge" for Phase E (the swap, in one deploy).
  - **Open with the owner:** the newsletter's promise line and service (C84); Home's FAQ answer "performance budgets enforced in our pipeline" (a 0033 flag: v3 enforces none); the Services Catalogue's 2.1 line "Every page passes Core Web Vitals" (`Planning Folder` is read-only), which reaches the WhatsApp agent through `docs/facts/agent-knowledge.md`; re-syncing the agent's knowledge after a regenerate; the video loops (V01–V04 required, the owner's folder path to come) and the screen recordings (SR01–SR18).
- **Live (15 URLs in code, the old design until the swap):** `/`, `/services`, 11 service pages from the template (the pilot R027 and batch 1: R029, R031–R034, R038, R051, R068, R070, R076), `/services/custom-coded-websites` and `/privacy`.
- **Built before v3 and kept verbatim:** P3 analytics, consent, GTM (0021, owner setup `docs/owner/p3-tracking-setup-guide.md`) · P4 schema engine (`src/lib/schema/`, registry `docs/seo/schema-graph.md`) · the content in `src/content/**` · the CTA set's click contract (0024 as amended by 0033: phone and WhatsApp `+971 54 547 6335`, the floating WhatsApp button, the header's audit button with its WhatsApp fallback).
- **Automation Track A (the WhatsApp agent):** the plan `docs/plans/2026-10-07-automation-pipeline.md` (decision 0027, C72), merged as docs; no website code. Deepzeta is client #1 of the n8n + Supabase stack. The owner's setup is `docs/owner/n8n-automation-setup-guide.md`; go-live only after the owner's full test. **Remind:** the team WhatsApp number for alerts.
- **Owner items:** every manual task before launch is in `docs/owner/pre-launch-register.md`.
- **Parked for owner sessions:** the 15+ Studio concepts (0032 is the Studio's UI-kit decision, recorded in another session), the Deepzeta Sync sales automation, the App demo. **Remind:** pSEO starts only after every V1 registry row is live (engine §10).
- **Stack:** Next.js 16.3.7, React 19.3, TypeScript 6.0.3, Tailwind 4.3 (0012); v3 adds `knip` 6.39.0 (Phase C) and GSAP 3.15.0 (Phase D: ScrollTrigger, CustomEase and MotionPath, loaded only on Home and the flagship). Everything else is custom code: the native popover, `<dialog>` and `<details>`, CSS 3D and a raw-WebGL drape; no Lenis, React Three Fiber, Radix, Motion or copied KokonutUI/Aceternity components (0033 still allows them). Bundle report: `npm run analyze`. Domain `deepzeta.ai` (0006), brand "Deepzeta AI" (C29), entity Deepzeta Digital Solutions L.L.C. (D2), the four pillars (C6). Decisions index: `docs/decisions/README.md`.
- **Local runs:** `.env.local` (`docs/owner/p0-setup-guide.md`); e2e needs `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXING=on` in the shell, and `.env.local` holds the real `NEXT_PUBLIC_GTM_ID` (CI has it too; e2e stubs GTM, 09 §4). Tracking names come only from the taxonomy (09 §3).
## Working agreement

1. Check whether a plan is needed (04 §4). If yes, write it short (`/plan-task`) and wait for the owner's approval; a template plan covers its copies.
2. Only touch the plan's allowed files. Read before editing. Verify APIs against installed versions.
3. Run the gates by risk (03 §2, `/verify`) and finish with the short report (`docs/ai/02` §5).
4. Never edit the logo, `.env*` or lockfiles. Edit the rule system and the design specs only when the owner explicitly asks in the current request (`docs/ai/00-project-master-rules.md` §5); otherwise propose the change.
