---
name: new-page
description: Recipe for adding a page/route to the deepzeta website with metadata, schema, content structure, internal links and tracking done right. Use only inside an approved plan that lists the page's files.
argument-hint: "[route, e.g. /services/whatsapp-ai-agent]"
---

Build the page: $ARGUMENTS. First confirm an **approved plan** lists every file you will touch. If not, stop and run `/plan-task`.

Read first:
- `docs/ai/05`, `06`, `07`, `08`, `09`, `10`, `11` §1
- `docs/ai/13-experience-design.md`
- the page's spec in `docs/design/`, if it has one (index: `docs/design/README.md`)

## Checklist
1. **Route:** `src/app/<route>/page.tsx` as a Server Component. Lowercase kebab-case URL, no trailing slash.
2. **Metadata:** `generateMetadata`/`metadata` with unique title (50–60 chars, no brand; the root template adds it), description (140–160), self canonical from the shared URL builder, OG image, robots.
3. **Content:** from `src/content/en/…` as typed data; no hardcoded copy. Structure: H1 → direct answer → sections with 40–75-word answers → proof → FAQ → CTA ("Book a free AI audit").
4. **Schema:** use the builders in `src/lib/schema/` for the page-type stack in `docs/ai/08` §3. Never redefine `#organization`/`#website`. Only include FAQ/HowTo if visible on the page.
5. **Links:** breadcrumb, link to the hub and 3+ related pages with descriptive anchors; add the page to nav/footer only if the plan says so; never link to pages that don't exist yet.
6. **Tracking:** events only from the taxonomy (`docs/ai/09` §3) via `trackEvent()`; add a `page_type` if needed through the approved plan.
7. **Performance and effects:**
   - The LCP element is text or a `priority` image, visible and in place at first paint (13 §3).
   - No client JS unless required; heavy widgets load on interaction.
   - The page tier and the effect register (IDs from 13) come from the approved plan.
8. **RTL-ready:** logical CSS only; locale passed to builders.
9. **Gates:** `verify:fast`, `build`, `check:schema`, `check:links`, `test:e2e` and `lhci` for this page, then report with evidence.
