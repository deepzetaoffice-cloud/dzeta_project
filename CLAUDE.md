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
- **P1 Brand primitives is done** (`docs/plans/2026-09-30-p1-brand-primitives.md`, decision 0018): the locked logo served as it is and shown by crops (`src/components/ui/Logo.tsx`), the app icons and manifest (`npm run brand:icons`), and the icon registry with `Icon` and `IconDefs` (Tier 1–2; `docs/ai/05` §6). Merged to `main` 2026-09-30. The icon line-centre rule has an exception for the 11 prototype icons (C39).

- **P2 Layout shell is done** (`docs/plans/2026-09-30-p2-layout-shell.md`, decision 0019): the header, mega menu, mobile sheet, footer "The Landing", the conversion path (C42: one gradient CTA in view), the effect controllers in `src/lib/fx/`, Reduce effects and the theme switch, Tier 3 icons, per-weight fallback fonts. Only live registry rows are linked (`src/lib/routes.ts`); `/shell-review` (R165) shows the complete shell and is 404 in production. The effects feasibility gate passed in the lab; the budget Android and iPhone checks are on the pre-launch list (C51). Merged to `main` 2026-10-02 (`ca3fa0a`; parts A and B on 2026-10-01).

- **P3 Analytics & consent is done** (`docs/plans/2026-10-02-p3-analytics-consent.md` parts A–B and `docs/plans/2026-10-02-p3c-gtm-container.md` part C, decision 0021): the event taxonomy as the one source of every name (`src/lib/tracking/taxonomy.ts`, APPEND-ONLY, retired events refused by `trackEvent()`), the consent banner for Europe only with the region hint from a CDN rule (C52), the enforced CSP from `vendorsInUse()` (C53), GTM by the site's own loader (C56), and the generated container — proven by a GTM round trip (C3) and imported by the owner (B1–B8 done, 2026-10-04). The third-party caps are measured and enforced per region profile (Europe 2 requests/160 KB before consent; UAE 4/350 KB), the security headers serve pages only (`/_next/` carries nosniff alone, the C5 amendment), and European Home's lab LCP has a 2,550 ms allowance (C61; the 2.5 s hard limit stands for field data). The events that need pages and demos (`generate_lead`, `view_service`…) are in the taxonomy and the container already, so P5–P8 only start firing them.

- **P4 Data & schema engine is done** (`docs/plans/2026-10-04-p4-data-schema-engine.md`, implementing the approved spec `docs/plans/2026-09-29-schema-system.md`): the typed JSON-LD graph engine (`src/lib/schema/` — pure generators, `checkedGraph()` dedupe/resolution guards, the escaping `JsonLd` component), the typed catalogue and emirates/industries data (`src/content/`), the founder and his companies in the site config, the numbers allowlist in `check:facts`, and the `check:schema` gate extended with the spec §4 assertions plus golden fixtures. Two blocks ship now: the sitewide block (Organization + WebSite + the logo) in the `(en)` root layout, and Home's page block (WebPage + the four-pillar ItemList); every other assembler ships with its page in P5–P8, each in its page's plan. The schema registry is `docs/seo/schema-graph.md`. GTM now loads past the first paint and the UAE campaign profile carries lab allowances of TBT 275 ms and Performance 0.93 (decisions 0022 and 0023 — the granted third-party scripts' execution cost inside the TBT window is intrinsic; 07 §1's ≤ 200 ms and 0.95 stand everywhere). CI green end-to-end on the branch head `6e99462`. **Next: the owner's manual validators (03 §4 — Rich Results Test and the Schema Markup Validator on the deployed preview), then P5 Homepage** (04 §2; the design `docs/design/home.md`; the FAQ becomes visible, so Home's FAQPage block ships there).

  Tracking names come from one taxonomy (09 §3) and GTM and GA4 are configured from it, never typed by hand: the owner's setup is `docs/owner/p3-tracking-setup-guide.md` (Part A before P3, Part B after). Every manual task before launch is in `docs/owner/pre-launch-register.md`; each phase adds its rows. The app runs Next.js 16.3.7, React 19.3, TypeScript 6.0.3, Tailwind 4.3 (decision 0012). Every gate is an npm script: `npm run verify:fast` after each step, `npm run verify` before a merge (03). Work goes live only when the owner says "merge" (12 §1, decision 0017). Local runs need `.env.local` (`docs/owner/p0-setup-guide.md`); e2e and lhci need `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXING=on` in the shell, and `.env.local` holds the real `NEXT_PUBLIC_GTM_ID` (CI has it too; e2e stubs GTM, 09 §4).
- **Decisions.** Decided on 2026-09-30: the JS budget (C8, decision 0014 option A: the 136.4 KB framework baseline plus our own budget per page), the pre-launch indexing lock (0013), and the design tokens, themes and fonts (0015). Decided on 2026-09-29: the company entity (D2, Deepzeta Digital Solutions L.L.C.), the service structure (C6, the four pillars) and the brand name "Deepzeta AI" (C29). The domain is `deepzeta.ai` (0006). See `docs/decisions/README.md`.
- **Stack and performance tiers** accepted in decisions 0004 and 0005 (`docs/decisions/`). Motion is native-first; GSAP only on T2/T3 pages; automation runs on n8n.
- **Design Direction v2 "Signal & Depth"** accepted in decision 0008: responsive-only motion; effects in `docs/ai/13-experience-design.md`; surface specs in `docs/design/`. Parked for owner sessions: the 15+ Studio concepts, the Deepzeta Sync sales automation, the App demo. Design Lab verdicts: decision 0009. Tokens specimen: `docs/design/prototypes/tokens-specimen.html` (0015).
- **SEO/GEO Domination Engine** (`docs/seo/`, 2026-09-30): the content system, the V1 URL registry (about 99 pages), linking, FAQ, E-E-A-T, robots/llms. **Reminder:** pSEO starts only after every V1 registry row is live; then remind the owner (engine §10).

## Working agreement

1. Non-trivial work: write a plan (`/plan-task`), wait for the owner's approval, then implement.
2. Only touch the plan's allowed files. Read before editing. Verify APIs against installed versions.
3. Finish with the report format in `docs/ai/02` §5, including real gate output (`/verify`).
4. Never edit the logo, `.env*` or lockfiles. Edit the rule system and the design specs only when the owner explicitly asks in the current request (`docs/ai/00-project-master-rules.md` §5); otherwise propose the change.
