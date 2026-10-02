# Design specs (surfaces)

> **What this is:** composition specs for each surface of the deepzeta website:
> - which effects go where (IDs from [docs/ai/13](../ai/13-experience-design.md))
> - content slots, states, breakpoints and icons
>
> **Rank:** a design source at 00 §3 level 5, alongside the Planning Folder sources. Where a spec differs from the blueprint, the conflict register records it (C16–C24).
>
> **Last reviewed:** 2026-10-01

**Specs never restate rules.** Each topic lives in one place:

| Topic | Lives in |
|---|---|
| Tokens | 05 |
| Effects | 13 |
| Costs | 07 |
| Content structure | 10 and 08 |
| RTL | 11 |
| Icons | Icon Master Rules |

Decision: [0008](../decisions/0008-design-language-signal-and-depth.md). These files are protected; edits need the owner's approval (00 §5). Prototypes in `prototypes/` are never a source.

## Status legend

| Status | Meaning |
|---|---|
| **CONFIRMED** | Approved by the owner; build it. |
| **LAB** | Decided in the Design Lab prototype; don't build yet. |
| **LATER** | Parked for a later owner session; don't build. |
| **OPEN (Cn)** | Blocked by an open conflict or decision. |

## Index

| Spec | Surface | Page tier | Status |
|---|---|---|---|
| [header.md](header.md) | Header "Proof Bar", mega menu, mobile sheet, AI View | All pages | CONFIRMED |
| [footer.md](footer.md) | Footer "The Landing", Page Nutrition Label | All pages | CONFIRMED |
| [conversion-path.md](conversion-path.md) | Book-audit flow, floating elements, sticky CTA | All pages | CONFIRMED |
| [home.md](home.md) | Home, 12 sections | T1 | CONFIRMED |
| [service-page.md](service-page.md) | Service page visual treatment | T2 | CONFIRMED |
| [automation.md](automation.md) | Automation "Control Room" | T2 | CONFIRMED |
| [studio.md](studio.md) | Designer Studio index + concept frame | T2 / T3 | CONFIRMED frame; concepts LATER |
| [tools.md](tools.md) | Deepzeta Sync (tools hub, `/tools`) + tool page anatomy | T2 | CONFIRMED frame and two tools; sales flow LATER |
| [app-demo.md](app-demo.md) | App demo | T3 | LATER (frame proposed) |
| [faq.md](faq.md) | FAQ module "Questions, answered" | Every page with a FAQ | LAB (validate in the Design Lab) |

## How builders use a spec

1. The page plan (04 §4) copies the spec's effect IDs into its effect register, with costs (13 §10).
2. Content comes from `src/content/` (10); schema comes from the builders (08).
3. Anything marked LAB, LATER or OPEN is not built.

## Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-29 | Design Direction v2 "Signal & Depth": all specs created | Owner (plan `docs/plans/2026-09-29-design-direction-v2.md`) |
| 2026-09-29 | Lab v1 verdicts: header nav marker is the mini cluster; Studio hero word; terminal window; system map | Owner (decision 0009) |
| 2026-09-29 | C6 resolved to the four pillars: mega-menu columns, Home doors, footer columns and pillar colours; Automation page URL `/services/ai-automation` | Owner (conflict C6) |
| 2026-09-29 | The tools hub is named **Deepzeta Sync** (URL stays `/tools`); it joins the header nav, mega-menu rail, mobile sheet and footer Company links once the page ships | Owner (conflict C31) |
| 2026-09-30 | FAQ module spec added (LAB); Home §09 has 4 industry-group tiles; Home and service pages use the FAQ module | Owner (plan approval: SEO/GEO Domination Engine) |
| 2026-10-01 | P2 Layout shell built: header.md (the inline logo, live-only nav, the mega menu's full-width columns and strip, three services out of the menu, "Designer Studio", the popover and the modal sheet, the sheet's heading-size items, the display controls never in the bar, Reduce effects = `glass-frost`), footer.md (the display headline C41, live-only columns, the social letter tiles C49, the display controls, the `<address>`), conversion-path.md (the C42 hand-off, the sticky bar) | Owner (P2 plan approval with its end-of-phase edits; verdicts at steps 8, 11, 13 and 15; decision 0019) |
| 2026-10-02 | P3 Analytics & consent: footer.md (the opening hours line, part A; the Cookie settings button at the legal line's inline end, for every visitor), conversion-path.md (the consent banner, Europe only: `glass-frost` with the muted tint, first in the Tab order after the skip link, the sticky bar hidden while it shows, the scroll reserve, the settings dialog) | Owner (P3 plan approval, section O; this row approved at part B's close, 2026-10-02) |
