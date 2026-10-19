# Design specs (surfaces)

> **What this is:** composition specs for each surface of the Deepzeta AI website:
> - the section order, the Figma frames to build from, and the effects in each section (IDs from [docs/ai/13](../ai/13-experience-design.md))
> - content slots and where their copy lives, media slots, states and the contracts the code must keep
>
> **Source:** the approved Figma file "Deepzeta AI · Website v3" (`tYw7bSV9m4zX2vrVs7XYpE`, approved by the owner on 2026-10-18; decision [0033](../decisions/0033-redesign-v3.md)). The frames are the visual source; these specs carry what a frame can't show.
>
> **Rank:** a design source at 00 §3 level 5. Where a spec and its Figma frame differ, the frame wins and the spec is corrected.
>
> **Last reviewed:** 2026-10-18

**Specs never restate rules.** Each topic lives in one place:

| Topic | Lives in |
|---|---|
| Tokens, components | 05 |
| Effects and motion | 13 |
| Loading habits | 07 |
| Content structure | 10 and 08, the engine's blueprints |
| Media metadata | 08 §7 |
| RTL | 11 |
| Icons | 05 §6 and the Icon Master Rules |

These files are protected; edits need the owner's approval (00 §5). Prototypes in `prototypes/` are never a source.

## Status legend

| Status | Meaning |
|---|---|
| **CONFIRMED** | Approved by the owner in Figma; build it. |
| **LATER** | Parked for a later owner session; don't build. |
| **OPEN (Cn)** | Blocked by an open conflict or decision. |
| **NOT REDESIGNED** | Its frame and content decisions stand, but its Signal & Depth styling is superseded (0033); it gets a Figma design before it's built. |

## Index

| Spec | Surface | Figma (desktop / mobile) | Status |
|---|---|---|---|
| [header.md](header.md) | Header, mega menu, mobile menu | `36:285`, `37:863`, `38:583` | CONFIRMED |
| [footer.md](footer.md) | Footer: the audit panel, columns, legal line, wordmark | `39:1070` | CONFIRMED (newsletter OPEN, C84) |
| [conversion-path.md](conversion-path.md) | The CTA set, the sticky bar, the WhatsApp float, the consent banner, the tracking contract | Shell frames + C83 | CONFIRMED |
| [home.md](home.md) | Home, 12 sections + footer | `50:35` / `56:810` | CONFIRMED |
| [services-hub.md](services-hub.md) | Services hub (`/services`) | `58:34` / `58:2466` | CONFIRMED |
| [service-page.md](service-page.md) | The service template (11 pages; the frame is the Speed-to-Lead System) | `59:34` / `59:873` | CONFIRMED |
| [custom-coded-websites.md](custom-coded-websites.md) | The flagship `/services/custom-coded-websites` | `60:34` / `60:827` | CONFIRMED |
| [privacy.md](privacy.md) | `/privacy` | `61:34` / `61:594` | CONFIRMED |
| [not-found.md](not-found.md) | The 404 and the error page | `61:1054` / `61:1200` | CONFIRMED |
| [faq.md](faq.md) | The FAQ module "Questions, answered" | FAQ item `35:333` | CONFIRMED |
| [automation.md](automation.md) | Automation "Control Room" | — | NOT REDESIGNED |
| [studio.md](studio.md) | Designer Studio index + concept frame | — | NOT REDESIGNED (concepts LATER) |
| [tools.md](tools.md) | Deepzeta Sync (tools hub, `/tools`) + tool page anatomy | — | NOT REDESIGNED |
| [app-demo.md](app-demo.md) | App demo | — | LATER |

The motion spec (page Motion spec, `62:33`) and the media plan (page Media plan, `63:33`) are in the same file.

## How builders use a spec

1. **The page plan** (04 §4) copies the spec's effect IDs into its effect register (13 §10).
2. **Content** comes from `src/content/` (10), and schema comes from the builders (08). A copy difference between a Figma frame and `src/content/` is raised with the owner, never changed silently.
3. **Media** comes from the media plan, through `MediaAsset` (08 §7). A missing video loop uses its photo.
4. **Each piece is checked side by side** with its Figma frames at 390, 834 and 1440 px in the browser pane, before the owner's review.
5. **Anything marked LATER, OPEN or NOT REDESIGNED is not built.**

## Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-29 | Design Direction v2 "Signal & Depth": all specs created | Owner (plan `docs/plans/2026-09-29-design-direction-v2.md`) |
| 2026-09-29 to 2026-10-07 | Lab v1 verdicts, C6 pillars, Deepzeta Sync, the FAQ module, the P2 shell, P3 consent, the services hub (see git history) | Owner (decisions 0009, 0019, 0026) |
| 2026-10-18 | **Website v3 "Spectrum":** the specs for the shell and the 15 URLs rewritten from the approved Figma file; `custom-coded-websites.md`, `privacy.md` and `not-found.md` added; the specs of surfaces not yet redesigned marked NOT REDESIGNED | Owner (Figma approval, 2026-10-18; decision 0033) |
