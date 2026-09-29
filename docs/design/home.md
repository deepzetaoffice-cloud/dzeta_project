# Home

Status: CONFIRMED · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

**Page tier: T1** (≥ 95). At first load only native CSS plus ≤ 10 KB of first-party effect JS (decision 0008).

**Section order:** blueprint §8 (understand → believe → try → book).

## Story arc

Hook (H1 + direct answer) → Pain (§03) → System (§04) → Show (§05) → Proof (§06) → Plan (§07, §08) → Action (§11).

## Sections

| # | Section | Effects | Notes |
|---|---|---|---|
| 01 | Hero | Primary CTA: `hover-charge` + `pointer-magnet`. "Try our AI agent": `hover-outline`. Background: `pointer-grid-wake`. **Signature:** `story-chat` in a `glass-liquid` proof card, then **The Assembly** (13 §5) on first scroll | See "Hero details" below. |
| 02 | Proof strip | `scroll-drift` | Tool names as plain text. Client logos and partner badges appear only once confirmed (facts §5). |
| 03 | Problem → outcome | `story-before-after` rows; the pixel travels each connector | Outcomes use allowlisted design targets until measured results exist (facts §6). |
| 04 | Four doors | `glass-frost` cards, Tier 3 icon stories, `hover-card`, `pointer-tilt` | The four pillars (C6), each linking to its pillar page; AI Automation and Websites lead. |
| 05 | Workflow explorer (demo 3) | Accessible tabs that switch a `story-flow` (CSS/SVG only) | Tabs use roving tabindex, arrow keys and `aria-controls` (v1 lesson). |
| 06 | Proof | Until real case-study figures exist: **"Watch this page build itself"** (13 §5), a `scroll-pinned-scene` with a `depth-css` laptop | The final stamp shows this visit's real LCP. Real figures replace the scene once they exist. |
| 07 | How we work | Tier 2 step icons (Audit, Build, Launch, Improve), a journey-line segment, `scroll-reveal` | Timeframes appear only once confirmed. |
| 08 | ROI calculator (demo 2) | `story-data`, `touch-snap` sliders, a `glass-live` result panel | Uses the visitor's own inputs; the formula is shown. |
| 09 | Industries | Calm tiles, `hover-window` | Four tiles, one per catalogue industry group, each linking to its page (URL registry R101–R104). Industry icons in Tier 1 style (Icon Master Rules §14.2 recommendation). |
| 10 | FAQ | The FAQ module ([faq.md](faq.md)) | 8 questions (engine §3). The most breathing room on the page. |
| 11 | Final CTA | The Landing (footer.md), the audit form, and the 60-second WhatsApp test (demo 4) in a `glass-live` panel; `touch-stamp` on success | |
| 12 | Footer | See footer.md | |

### Hero details

- **The statement H1 is the LCP:** visible at first paint, with no entrance animation.
- **The Z0 layer:** the grid, plus the locked logo's Z mark (cropped with `viewBox`; the file is untouched) with one light sweep on load.
- **`story-chat`** plays once (~2.5 s), with a replay control, labelled "Example conversation".

## Per-viewport check

- **Hero:** one signature at a time. First the proof card; after the first scroll, The Assembly.
- **§06:** the pinned scene is the signature. Nothing else moves there.

## Feasibility gate

Before P5 is done, measure the Home shell with every T1 effect switched on:
- with `lhci` (must reach ≥ 95)
- on a budget Android phone

See 04 §2.
