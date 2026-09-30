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

- **Phase:** P0 Foundation is done (merged to `main` 2026-09-30):
  - part 1: `docs/plans/2026-09-30-p0-foundation.md`
  - part 2: `docs/plans/2026-09-30-p0-design-tokens-themes-fonts.md`, the tokens (`src/styles/tokens.css`), the themes (every first visit dark) and the self-hosted fonts, decision 0015
- **P1 Brand primitives is done** (`docs/plans/2026-09-30-p1-brand-primitives.md`, decision 0018): the locked logo served as it is and shown by crops (`src/components/ui/Logo.tsx`), the app icons and manifest (`npm run brand:icons`), and the icon registry with `Icon` and `IconDefs` (Tier 1–2; `docs/ai/05` §6). Merged when the owner says "merge".

  **Next: P2 Layout shell** (header, mega menu, mobile nav, footer, shared effect controllers, Reduce effects; 04 §2). P2 mounts `IconDefs`, adds Tier 3 icons and caches the logo (0018 Consequences). Open for the owner: the icon line-centre rule (0018). The app is scaffolded (Next.js 16.3.7, React 19.3, TypeScript 6.0.3, Tailwind 4.3, versions in decision 0012). Every gate is an npm script: `npm run verify:fast` after each step, `npm run verify` before a merge (03). Work goes live only when the owner says "merge" (12 §1, decision 0017). Local runs need `.env.local` (`docs/owner/p0-setup-guide.md`).
- **Decisions.** Decided on 2026-09-30: the JS budget (C8, decision 0014 option A: the 136.4 KB framework baseline plus our own budget per page), the pre-launch indexing lock (0013), and the design tokens, themes and fonts (0015). Decided on 2026-09-29: the company entity (D2, Deepzeta Digital Solutions L.L.C.), the service structure (C6, the four pillars) and the brand name "Deepzeta AI" (C29). The domain is `deepzeta.ai` (0006). See `docs/decisions/README.md`.
- **Stack and performance tiers** accepted in decisions 0004 and 0005 (`docs/decisions/`). Motion is native-first; GSAP only on T2/T3 pages; automation runs on n8n.
- **Design Direction v2 "Signal & Depth"** accepted in decision 0008: responsive-only motion; effects in `docs/ai/13-experience-design.md`; surface specs in `docs/design/`. Parked for owner sessions: the 15+ Studio concepts, the Deepzeta Sync sales automation, the App demo. Design Lab verdicts: decision 0009. Tokens specimen: `docs/design/prototypes/tokens-specimen.html` (0015).
- **SEO/GEO Domination Engine** (`docs/seo/`, 2026-09-30): the content system, the V1 URL registry (about 99 pages), linking, FAQ, E-E-A-T, robots/llms. **Reminder:** pSEO starts only after every V1 registry row is live; then remind the owner (engine §10).

## Working agreement

1. Non-trivial work: write a plan (`/plan-task`), wait for the owner's approval, then implement.
2. Only touch the plan's allowed files. Read before editing. Verify APIs against installed versions.
3. Finish with the report format in `docs/ai/02` §5, including real gate output (`/verify`).
4. Never edit the logo, `.env*` or lockfiles. Edit the rule system and the design specs only when the owner explicitly asks in the current request (`docs/ai/00-project-master-rules.md` §5); otherwise propose the change.
