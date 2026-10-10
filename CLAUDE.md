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

## Build Mode (decision 0029, 2026-10-09)

Build fast, test what matters. **Never relaxed:** Home's performance (07 in full, `lhci` on every change that can reach Home), design (tokens, logical CSS, effects by ID, the `docs/design/` specs, contrast, axe), SEO/GEO (`check:schema`, `check:seo`, `check:links`, `check:facts`, the registry and the engine's blueprints, no invented facts).
- **Plans:** one template plan covers a page type's pilot and every copy (batches of up to 10, no more plans); short plans for unique builds; no written plan for a change of up to 3 files with no dependency and no protected file (04 §4).
- **Gates by risk (03 §2):** `verify:fast` per commit; per branch the local static gates + `verify:ci` green in CI; `lhci` only when the change can reach Home (Home, the shell, any CSS, `src/lib/fx/`, tracking, the root layout, `next.config`, dependencies). Non-Home pages: no lab performance gate; 70 in PSI on production before launch.
- **Records:** decisions only for real choices; reports short (02 §5); progress one line per batch; this section stays short.
- **Parallel tracks** in their own worktrees (04 §1). The owner's "merge" per batch (0017).

## Current state

- **Live (3 of 100 V1 URLs):** `/` (R001), `/services` (R010), `/services/speed-to-lead-system` (R027, the service template's pilot). Production serves `main` (`a86b6ba`, 2026-10-09).
- **Built:** P0 foundation, tokens, themes, fonts (0012, 0015) · P1 brand primitives (0018) · P2 shell, header, mega menu, footer, effect controllers (0019) · P3 analytics, consent, GTM (0021, owner setup `docs/owner/p3-tracking-setup-guide.md`) · P4 schema engine (`src/lib/schema/`, registry `docs/seo/schema-graph.md`) · P5 Home (`docs/plans/2026-10-06-p5-homepage.md`) · P6 A1 + A2 (`docs/plans/2026-10-07-p6a-core-pages-foundation.md`: the services hub, the template pilot) · the CTA set (0024: phone and WhatsApp `+971 54 547 6335`, the floating WhatsApp button, the header's "Deepzeta AI" button via `agentHref()`) · the full header menu · Home's proof cards and the watch-build scene.
- **Home's weight (C73):** production measures 193,416 B against the 190,868 B hard limit (2026-10-09). The owner checked PSI (Performance at its best) and chose **no performance edits for now**; re-checked on production before launch. Home's PSI SEO score shows 66 only because of the pre-launch `noindex` lock (0013), lifted at P10.
- **Next:**
  1. Service pages from the pilot template: `docs/plans/2026-10-08-service-pages-standing-plan.md`, batches of up to 10 (57 planned service rows). Batch 1 on `content/services-batch-1`.
  2. The header's unlinked menu items: mist text on the light-page glass is 3.73:1 (axe, the 404 page in the light theme); the owner's call on the fix.
  3. Template plans for the other page types: pillars, solutions, industries, company and legal pages, then P7 demos and tools and P8 resources as parallel tracks.
- **Automation Track A (the WhatsApp agent):** the plan `docs/plans/2026-10-07-automation-pipeline.md` (decision 0027, C72), merged as docs; no website code. Deepzeta is client #1 of the n8n + Supabase stack. The owner's setup is `docs/owner/n8n-automation-setup-guide.md`; go-live only after the owner's full test. **Remind:** the team WhatsApp number for alerts.
- **Owner items:** every manual task before launch is in `docs/owner/pre-launch-register.md`.
- **Parked for owner sessions:** the 15+ Studio concepts, the Deepzeta Sync sales automation, the App demo. **Remind:** pSEO starts only after every V1 registry row is live (engine §10).
- **Stack:** Next.js 16.3.7, React 19.3, TypeScript 6.0.3, Tailwind 4.3 (0012); motion native-first, GSAP only on non-Home pages (0004, 0005); Design Direction v2 "Signal & Depth" (0008). Domain `deepzeta.ai` (0006), brand "Deepzeta AI" (C29), entity Deepzeta Digital Solutions L.L.C. (D2), the four pillars (C6). Decisions index: `docs/decisions/README.md`.
- **Local runs:** `.env.local` (`docs/owner/p0-setup-guide.md`); e2e and `lhci` need `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXING=on` in the shell, and `.env.local` holds the real `NEXT_PUBLIC_GTM_ID` (CI has it too; e2e stubs GTM, 09 §4). Tracking names come only from the taxonomy (09 §3).

## Working agreement

1. Check whether a plan is needed (04 §4). If yes, write it short (`/plan-task`) and wait for the owner's approval; a template plan covers its copies.
2. Only touch the plan's allowed files. Read before editing. Verify APIs against installed versions.
3. Run the gates by risk (03 §2, `/verify`) and finish with the short report (`docs/ai/02` §5).
4. Never edit the logo, `.env*` or lockfiles. Edit the rule system and the design specs only when the owner explicitly asks in the current request (`docs/ai/00-project-master-rules.md` §5); otherwise propose the change.
