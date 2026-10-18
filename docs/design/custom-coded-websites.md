# Custom-Coded High-Performance Websites (the flagship)

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) §4.4 · Figma: page Custom-coded websites (`1:8`), Desktop 1440 `60:34`, Mobile 390 `60:827` · Content: `src/content/en/services/custom-coded-websites.ts` (with `WebsitesExtras`), `build-run.ts`, `faq-bank.ts` · Route: `/services/custom-coded-websites` · Registry: R060

## Idea

The page proves the service with the site itself: the laptop opens onto this site, a slider reveals the real code behind the page, and a recording replays this site's own build and checks.

## Sections

| # | Figma section | Content | Effects | Media |
|---|---|---|---|---|
| 01 | Hero · Macbook Scroll | The breadcrumb Home / Services / Websites / Custom-Coded High-Performance Websites; the Websites chip; "2.1 · Flagship"; the H1 (`heading`); the direct answer; "Book a free AI audit"; "See the code behind this page" (to §02); the laptop, its lid opening onto this site as you scroll | **`macbook-scroll`** | S04 (laptop scene, optional), SR18 (the laptop screen: a scroll through Home), its poster; U14 (OG) |
| 02 | Code ↔ Page | [01] `codePage.label`, the heading and `codePage.caption`; the compare slider: **Page** shows this page's real opening section, **Code** shows the real source that renders it, read from the repository at build time (never typed by hand); the handle's hint and its keyboard note | **`code-page-compare`** (drag, or ← → by 5% when focused) | SR17 (optional) |
| 03 | When your website is only a brochure | [02] "Before and after": five Today → With Deepzeta AI rows (`problem`) | `section-reveal` | — |
| 04 | How we build a custom-coded website | [03] "How we build": the seven real steps (`how.steps`), our real process, not an example, so the label says so and the HowTo matches | `section-reveal` | — |
| 05 | What you get · Built on the same stack as this site | [04] "Deliverables" (`deliverables`); "Built on the same stack as this site" (`worksWith`) with its platform chips | — | P20 `custom-coded-website-laptop-phone-dubai` (+ V20 optional) |
| 06 | Watch this site run its own checks | [05] "Proof": `terminal.heading`, `terminal.lede`; the terminal window (`windowTitle`) replaying `build-run.ts` at its recorded timing, with play, pause, replay and step controls (`terminal.controls`); "Recorded on {date} from commit {commit}" | **`terminal-replay`** | SR16 (optional) |
| 07 | Is it right for you? · Built for UAE customers · Pairs well with | [06] "Decision aid" (`fit`); "Built for UAE customers" (`uae.points`); "Pairs well with": three Service cards (Website Care Plan; AI Citation & Answer Engine Optimisation (AEO/GEO); Local AI Dominance (Bilingual, Hyperlocal)), each one link to a live page | `hover-lift` | — |
| 08 | FAQ | [07] the FAQ module: the websites questions from `faq-bank.ts` | `accordion` | — |
| — | Footer | [footer.md](footer.md) | | |

- **One signature moment per viewport:** the laptop, then the compare, then the terminal, with calm sections between.
- **`build-run.ts` holds a real, recorded run** (commands and output trimmed, never edited), with its date and commit. The terminal says "replayed, not live" (10 §3.6). The Figma placeholders `[[result from build-run.ts]]`, `[[date]]` and `[[commit]]` are filled from a real run before the page ships.

## Content flags (raised with the owner, not changed silently; 10 §3.7)

These promise a Core Web Vitals result or a score that v3 no longer measures as a gate:
- **The description and the direct answer:** "every page designed / built to pass Core Web Vitals".
- **§03's second row, §05's first deliverable** ("LCP under 2.5 s, INP under 200 ms, CLS under 0.1") and **§07's first answer.**
- **`faq-bank.ts`'s websites answers:** "the base for building every page to pass Core Web Vitals"; "Every page is built to pass Core Web Vitals…".
- **The terminal's lede and its last step** run "the homepage's Lighthouse checks". `lhci` is removed in Phase C, so the recording either keeps an honest Lighthouse run shown as information (no score claimed) or drops that step.
- **Recommended wording:** what we do and what we report ("images, fonts and code optimised for mobile networks, measured against Core Web Vitals and reported at launch"), unless a real measurement backs a pass. The performance report at launch stays: it is a real deliverable.
- **The FAQ** in the frame is `[[TODO]]`; its questions and answers come from `faq-bank.ts`.

## Breakpoints

Checked side by side with `60:34` and `60:827` at 390, 834 and 1440 px.
