# Automation: "Control Room"

Status: CONFIRMED · Page tier: T2 · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

This is one page, never two competing ones: the AI Automation pillar page at `/services/ai-automation` (C6 resolved to the pillars). The header's "Automation" item links here.

## Idea

The visitor sits in an operations control room (blueprint direction B). They pick a bottleneck, watch the automation handle it, then build their own.

## Sections

1. **Hero:** a statement headline plus an EXAMPLE operations board (`glass-live`) running one `story-flow`.
2. **Pick your bottleneck:** missed calls · slow replies · no-shows · stuck quotes · unpaid invoices · reviews.
   - Each one loads its own `story-flow`.
   - The data lives in `src/content/`; service names come from the catalogue.
3. **Before / after:** a `story-before-after` of the same day with and without automation.
4. **Build your automation:**
   1. The visitor picks a trigger and actions.
   2. The flow assembles (`scroll-assemble` / `story-flow`).
   3. A summary card appears.
   4. "Send this to our team" (with consent) sends an audit request prefilled with their choices (conversion-path.md).
5. **The 6 Systems** (catalogue §5), each as a `story-system-map` (13 §4.8):
   - a glass hub holding the System's Tier 3 icon, on depth rings
   - the services orbiting as glass chips with their Tier 2 icons
   - curved connectors that draw in once
   - a pixel that travels to whichever service you point at
6. **Industry rail** (catalogue §7.5): Tier 2 icons, `hover-card`.
7. **Platforms we connect** (catalogue §8): official monochrome marks, `scroll-drift`.
8. **ROI calculator** (`story-data`), then the FAQ, then the CTA.

## Honesty

- Flows are labelled "Example".
- Any time or result figure comes from the facts allowlist or from the visitor's own inputs (10 §3).

## Icons

- **Tier 2:** bottlenecks and flow nodes.
- **Tier 3:** the Systems.
