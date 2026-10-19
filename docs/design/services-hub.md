# Services hub (`/services`)

Status: CONFIRMED (Figma approved 2026-10-18) · As built in Phase D3 (2026-10-19; the owner approved this sync the same day) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Services hub (`1:6`), Desktop 1440 `58:34`, Mobile 390 `58:2466` · Content: `src/content/en/services-hub.ts`, `navigation.ts`, `faq-bank.ts`, the catalogue · Registry: R010 · Content rules: [engine §3](../seo/seo-geo-domination-engine.md)

## Idea

A calm, colourful directory. A buyer finds the right service by problem (the chooser) or by pillar (the bento of directories). A utility page: no signature moment.

## Sections

| # | Figma section | Content | Effects |
|---|---|---|---|
| 01 | Hero · compact stage + Dot Field | The breadcrumb Home / Services inside the stage (a white mono label, with its BreadcrumbList); the H1 (`text-hero-line`); the direct answer; "Book a free AI audit"; "Find your service by problem" (On colour, to §02); four pillar chips (to each directory) | `dot-field`: still dots; a spot follows a fine pointer (`src/lib/fx/hub.ts`); a hovered or focused pillar chip lights its pillar's dots by CSS alone. `press-scale` |
| 02 | Which service do you need? | [01] "Common problems and the service for each": a real `<table>` with a `<caption>` and `scope` (Your problem → The service), 8 rows in the owner's words. A row links when its service is live (its pillar square, the name and an arrow). Stacked rows below 640 px, never a sideways scroll | A live row tints on hover or focus |
| 03 | Start here | [02] "Starter offers": the catalogue's §0 offers as three cards (0.1 Free AI Automation Audit on the stage, with "Book a free AI audit"; 0.2 AI Readiness Assessment; 0.3 Website & AI Search Health Check). A card's offer name becomes its link once that page is live | `hover-lift` on live cards |
| 04 | Every service, by pillar | [03] "Four pillars": a bento of four pillar panels in catalogue order. Each has its wash head with the Pillar pixels mark, the name and a 40–75-word lede, the pillar's gradient bar, then every lead and core service by its exact catalogue name in one flat list, as Figma draws it (a link and arrow when live, plain text otherwise), and "All {pillar} services" once the pillar page is live. The headings keep the ids `hub-pillar-{pillar}`, which the hero's chips and Home's doors link to | `hover-lift` on live service links |
| 05 | Ongoing care · Solutions | [04] "Retainer and add-ons" (Figma: "Section 6"): the AI Ops Retainer and the care add-ons on violet soft; [05] "Bundles": the six bundle names as chips (links once R090 and the bundle pages ship) | — |
| 06 | FAQ | [06] the FAQ module ([faq.md](faq.md)) in its stacked layout, 4–6 hub questions from `faq-bank.ts` | `accordion` |
| — | Footer | [footer.md](footer.md) | |

## Hero details

- **The H1 and the direct answer are the LCP:** visible at first paint, with no entrance animation (13 §3).
- **The stage is compact** (706 px at 1440 in Figma): the hub is a utility page. `dot-field` is a background; it carries no content.

## Content flags (all resolved in the build, 2026-10-19)

- **"Learn more" on the starter offers (§03)** is a banned anchor (08 §2.9; `check:links`): each card's link text is the offer's name instead.
- **The Websites lede** says what we do: "optimised for mobile networks and measured against Core Web Vitals at launch" (10 §3.7).
- **"E-Invoicing Ready"** shows the name alone, with no clock, until an APPROVED citation backs the UAE e-invoicing dates (10 §3.5).
- **The FAQ answers** come from `faq-bank.ts`'s hub questions.

## Layout and access

- **Every link names its service.**
- **No client JavaScript of its own** beyond `dot-field` (loaded in view) and the FAQ's accordion.
- **Reduce effects and no-JS** show everything: static dots, every answer in the HTML.

## Shell links to the hub

The mega menu's "All services" link (its first link), the mobile menu's "All services", and the footer's Services column ([header.md](header.md), [footer.md](footer.md)).

## Breakpoints

Checked side by side with `58:34` and `58:2466` at 390, 834 and 1440 px.
