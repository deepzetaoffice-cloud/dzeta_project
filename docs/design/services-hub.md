# Services hub (`/services`)

Status: CONFIRMED (the owner's approval of the P6 part A plan, 2026-10-07) · Page tier: T2 · Decisions 0008 and 0026 · Effects: [13](../ai/13-experience-design.md) · Content rules: [engine §3](../seo/seo-geo-domination-engine.md)

Registry row R010. The content order comes from engine §3 (Hub) and R010's intent.

## Idea

A calm directory with a chooser. A buyer finds the right service by problem (the chooser) or by pillar (the directories). A utility page: no signature moment.

## Order

1. **Breadcrumb:** Home › Services.
2. **Hero:** the H1, a 40–60-word direct answer, the primary CTA. See "Hero details" below.
3. **"Which service do you need?":** a table (`<caption>`, `scope`) of common problems in the owner's words → the service. A row links when its service is live.
4. **Start here:** the Free AI Automation Audit and the other starter offers (catalogue §0), each linked when live. The audit CTA stands in until R002 ships.
5. **Four pillar directories,** in catalogue order:
   - the Tier 3 head, the pillar's name and promise (catalogue)
   - a 40–75-word lede
   - the catalogue's sub-groups, listing every lead and core service by its exact name
   - a live service is a link; the rest are plain text
   - add-ons stay on pillar pages (registry §3.4)
6. **Ongoing care and Solutions:** the AI Ops Retainer; the six bundle names, and the solutions hub once R090 ships.
7. **FAQ:** 4–6 questions (the FAQ module, [faq.md](faq.md)).
8. **The next step:** the footer's finale ([footer.md](footer.md)).

## Hero details

- **The H1 and the answer are the LCP:** visible at first paint, with no entrance animation (13 §3 rule 2).
- **The H1's size:** `text-h1` below 640 px, the statement size (`text-statement`) from 640 px, as Home since P5 S7. So Linux and Android font wrapping never puts it under the European consent banner at 360 × 640.
- **The primary CTA** joins the hand-off (C42, [conversion-path.md](conversion-path.md)).

## Effects

- `glass-frost`: the directory panels.
- `hover-underline`: links, the breadcrumb's included.
- `hover-guide-line`: the chooser table's rows.
- `scroll-reveal`: sections.
- `hover-charge`, `pointer-magnet` and `touch-press`: the primary CTA.

No story graphics and no signature moment. One Tier 3 head per pillar section, so few Tier 3 stories start in one viewport (05 §6).

## Icons

- **Tier 3:** one head per pillar section.
- **Tier 2:** beside a service that has one. A service without a Tier 2 icon shows its pillar's pixel, as in the mega menu ([header.md](header.md)).
- **Tier 1:** UI.

## Layout and access

- **The table** becomes stacked rows below 640 px. It never scrolls the page sideways.
- **Every link names its service.**
- **Reduce effects and no-JS** show everything.
- **No client JavaScript of its own.** The FAQ module's enhancement is the module's, loaded on use.

## Shell links to the hub

- **Header:** the first link of the mega menu, in the full panel and the lite panel ([header.md](header.md)).
- **Footer:** among the footer's service links ([footer.md](footer.md)).

## Breakpoints

360, 390, 768, 1024, 1280 and 1536 px (05 §7).
