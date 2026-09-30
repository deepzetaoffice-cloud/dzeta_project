# Deepzeta Sync (the tools hub, `/tools`)

Status: CONFIRMED (frame and the two tools); the sales automation behind them is LATER · Page tier: T2 · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## Idea

Free, working tools that give a real, partly masked result, and invite the visitor to get the full version from us. They prove our skills and feed the audit pipeline.

## Tool page anatomy

1. **Answer-first intro:** what the tool does, what data it uses, and a privacy note.
2. **Input wizard** of 1–3 steps. The pixel shows progress; controls use `touch-snap`.
3. **Processing:** a live log of the **real** steps being run (`story-terminal`, direction-B styling).
4. **Report sheet** (`glass-live`, `story-data` gauges).
   - Visible parts are real results.
   - Masked parts are neutral "ghost" layouts under `glass-frost`. The masked data never reaches the browser, not even in page props (06).
5. **"Get the full report" panel** (`glass-liquid`): name, WhatsApp or email, and consent.
6. **Confirmation** (`touch-stamp`), then "what happens next", then an audit offer (conversion-path.md).

## Tools

| Tool | Visitor gives | Visible (real) | Masked, sent after contact |
|---|---|---|---|
| **Website & AI Search Health Check** (the free preview of catalogue service 0.3) | A URL | Speed and Core Web Vitals (Google PageSpeed Insights / CrUX, run on the server); AI-readiness checks: title and meta, schema, `llms.txt`, AI-bot rules in robots | Ranked fix list, competitor comparison |
| **Social Media Content Planner** | Business type, audience, goal, platforms, language | Week 1 of the plan, written by AI (Claude via the AI SDK, 0004) | Weeks 2–4, Arabic captions, hashtags |

**Candidates for later** (the owner picks):
- Automation Opportunity Finder (ends in the audit)
- AI Visibility Snapshot (the model and date are shown)
- Quote Builder demo
- E-Invoicing Readiness Check (official dates cited and re-checked)
- Review Reply Drafter

## Guards

The rules live in 06 and 10 §3:
- SSRF protection on the URL fetcher
- Turnstile + rate limit
- AI token caps and prompt-injection handling
- PDPL consent
- no personal data in URLs or the dataLayer
- a data-retention rule
- no invented findings, no fake urgency

## Tracking

Register these in 09 §3 before building. Proposed:
- `health_check_start`
- `tool_result_view` (with `tool_id`)
- `report_request` (a lead)

## Later

The complete "mega automation" sales flow after "Get the full report" (an owner session).

## Icons

Proposed icons enter the Icon Master Rules through the P1 icon plan.

| Tier | Icon | The pixel is… |
|---|---|---|
| Tier 2 | Health Check | the fix that matters most |
| Tier 2 | Content Planner | the next post going live |
| Tier 1 | Lock | — |
| Tier 1 | Steps | — |
