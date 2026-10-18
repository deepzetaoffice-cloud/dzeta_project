# Services hub (`/services`)

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Services hub (`1:6`), Desktop 1440 `58:34`, Mobile 390 `58:2466` · Content: `src/content/en/services-hub.ts`, `navigation.ts`, `faq-bank.ts`, the catalogue · Registry: R010 · Content rules: [engine §3](../seo/seo-geo-domination-engine.md)

## Idea

A calm, colourful directory. A buyer finds the right service by problem (the chooser) or by pillar (the bento of directories). A utility page: no signature moment.

## Sections

| # | Figma section | Content | Effects |
|---|---|---|---|
| 01 | Hero · compact stage + Dot Field | The breadcrumb Home / Services (visible, with its BreadcrumbList); the H1 (`text-hero-line`); the direct answer; "Book a free AI audit"; "Find your service by problem" (to §02); four pillar chips (to each directory) | `dot-field` (a hovered pillar chip lights its pillar's dots), `press-scale` |
| 02 | Which service do you need? | [01] "Common problems and the service for each": a real `<table>` with a `<caption>` and `scope` (Your problem → The service), 8 rows in the owner's words. A row links when its service is live. Stacked rows below 640 px, never a sideways scroll | `section-reveal` |
| 03 | Start here | [02] "Starter offers": the catalogue's §0 offers as three cards (0.1 Free AI Automation Audit, with "Book a free AI audit"; 0.2 AI Readiness Assessment; 0.3 Website & AI Search Health Check). Each card is a link once its page is live | `hover-lift` |
| 04 | Every service, by pillar | [03] "Four pillars": a bento of four pillar panels in catalogue order. Each has its Pillar pixels mark, name, a 40–75-word lede, every lead and core service by its exact catalogue name (a link when live, plain text otherwise), and "All {pillar} services" | `section-reveal`, `hover-lift` on live service links |
| 05 | Ongoing care · Solutions | [04] the AI Ops Retainer and the care add-ons as chips; [05] "Bundles · Solutions": the six bundle names (links once R090 and the bundle pages ship) | — |
| 06 | FAQ | [06] the FAQ module ([faq.md](faq.md)), 4–6 hub questions from `faq-bank.ts` | `accordion` |
| — | Footer | [footer.md](footer.md) | |

## Hero details

- **The H1 and the direct answer are the LCP:** visible at first paint, with no entrance animation (13 §3).
- **The stage is compact** (706 px at 1440 in Figma): the hub is a utility page. `dot-field` is a background; it carries no content.

## Content flags (raised with the owner, not changed silently)

- **"Learn more" on the starter offers (§03)** is a banned anchor (08 §2.9; `check:links`). Each card's link text is the offer's name instead.
- **The Websites lede** promises "built to pass Core Web Vitals on every page". Under 10 §3.7 it changes to what we do, for example "optimised for mobile networks and measured against Core Web Vitals at launch", unless real measurements back it.
- **"E-Invoicing Ready ⏰":** the clock implies a deadline. It stays only with an APPROVED citation for the UAE e-invoicing dates (10 §3.5); otherwise it's the name alone.
- **The FAQ answers** in the frame are `[[TODO]]`; they come from `faq-bank.ts`'s hub questions, written by the Content Writer.

## Layout and access

- **Every link names its service.**
- **No client JavaScript of its own** beyond `dot-field` (loaded in view) and the FAQ's accordion.
- **Reduce effects and no-JS** show everything: static dots, every answer in the HTML.

## Shell links to the hub

The mega menu's "All services" link (its first link), the mobile menu's "All services", and the footer's Services column ([header.md](header.md), [footer.md](footer.md)).

## Breakpoints

Checked side by side with `58:34` and `58:2466` at 390, 834 and 1440 px.
