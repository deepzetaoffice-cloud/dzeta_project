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
| Styling, tokens, components, icons, motion | `docs/ai/05-design-system.md` + `Planning Folder/For Ai/DeepZeta Icon Master Rules.md` |
| Any effect, animation, hover, scroll, 3D, glass or animated explainer | `docs/ai/13-experience-design.md` (effects only by ID) |
| Building a page, the header, the footer or a demo surface | Its spec in `docs/design/` (index: `docs/design/README.md`) |
| TypeScript, Next.js, dependencies, security | `docs/ai/06-code-standards.md` |
| Images, fonts, scripts, animation, anything that affects speed | `docs/ai/07-performance-budget.md` |
| Metadata, headings, schema, robots, sitemap, `llms.txt` | `docs/ai/08-seo-geo-aeo-schema.md` |
| Page content structure, internal links, FAQ, E-E-A-T, robots/llms content, pSEO | `docs/seo/seo-geo-domination-engine.md` |
| Adding, naming or linking any page (every URL) | `docs/seo/url-registry.md` |
| Analytics, consent, forms, CRM | `docs/ai/09-analytics-tracking.md` |
| Any website copy | `docs/ai/10-content-voice.md` + `docs/facts/company-facts.md` + `docs/facts/external-sources.md` + the Services Catalogue + the engine's page blueprint |
| Layout direction, URLs, locale, Arabic | `docs/ai/11-i18n-rtl-readiness.md` |
| Branches, commits, PRs | `docs/ai/12-git-workflow.md` |
| Something the sources disagree on | `docs/ai/conflict-register.md` |
| Before writing any plan | `docs/ai/lessons-learned.md` |

## Current state

- **Phase:** P-1 Pre-build (rule system and design direction). No application code exists yet. Node.js v24 is installed, but there is no `package.json` until Phase 0: run `node scripts/check-rules.mjs` directly; the npm gates start in P0.
- **Open decisions** that block related work: JS budget (C8). Decided on 2026-09-29: the company entity (D2, Deepzeta Digital Solutions L.L.C.), the service structure (C6, the four pillars) and the brand name "Deepzeta AI" (C29). The domain is `deepzeta.ai` (0006). See `docs/decisions/README.md`.
- **Stack and performance tiers** accepted in decisions 0004 and 0005 (`docs/decisions/`). Motion is native-first; GSAP only on T2/T3 pages; automation runs on n8n.
- **Design Direction v2 "Signal & Depth"** accepted in decision 0008: responsive-only motion; effects in `docs/ai/13-experience-design.md`; surface specs in `docs/design/`. Parked for owner sessions: the 15+ Studio concepts, the Deepzeta Sync sales automation, the App demo. Next: the Design Lab prototype (its own plan).
- **SEO/GEO Domination Engine** (`docs/seo/`, 2026-09-30): the content system, the V1 URL registry (about 99 pages), linking, FAQ, E-E-A-T, robots/llms. **Reminder:** pSEO starts only after every V1 registry row is live; then remind the owner (engine §10).

## Working agreement

1. Non-trivial work: write a plan (`/plan-task`), wait for the owner's approval, then implement.
2. Only touch the plan's allowed files. Read before editing. Verify APIs against installed versions.
3. Finish with the report format in `docs/ai/02` §5, including real gate output (`/verify`).
4. Never edit the logo, `.env*` or lockfiles. Edit the rule system and the design specs only when the owner explicitly asks in the current request (`docs/ai/00-project-master-rules.md` §5); otherwise propose the change.
