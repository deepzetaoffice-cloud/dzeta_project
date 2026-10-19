# Custom-Coded High-Performance Websites (the flagship)

Status: CONFIRMED (Figma approved 2026-10-18) · As built in Phase D4 (2026-10-19; the owner approved this sync the same day) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) §4.4 · Figma: page Custom-coded websites (`1:8`), Desktop 1440 `60:34`, Mobile 390 `60:827` · Content: `src/content/en/services/custom-coded-websites.ts` (with `WebsitesExtras`), `build-run.ts`, `faq-bank.ts` · Route: `/services/custom-coded-websites` · Registry: R060

## Idea

The page proves the service with the site itself: the laptop opens onto this site, a slider reveals the real code behind the page, and a recording replays this site's own build and checks.

## Sections

| # | Figma section | Content | Effects | Media |
|---|---|---|---|---|
| 01 | Hero · Macbook Scroll | The breadcrumb Home / Services / Custom-Coded High-Performance Websites (the pillar crumb joins once the Websites pillar page ships); the Websites chip; "2.1 · Flagship"; the H1 (`heading`); the direct answer; "Book a free AI audit"; "See the code behind this page" (to §02); the laptop, its screen this site's opening drawn in HTML (Home's stage and its first rotator phrase) | **`macbook-scroll`**: on desktop with effects on, the lid opens 75° → 0° and the laptop scales as the hero scrolls (GSAP, on this page only, `src/lib/fx/flagship.ts`); open and still otherwise | No S04 GLB or SR18 needed: the screen is HTML, sharp and real; U14 (OG) |
| 02 | Code ↔ Page | [01] `codePage.label`, `codePage.heading` and `codePage.caption`; the compare slider: **Page** shows this page's real opening section rendered again (inert, hidden from screen readers), **Code** shows the real source that renders it (`FlagshipHero`), read from the repository at build time (never typed by hand); `codePage.hint` under it | **`code-page-compare`**: the handle is a native range input (drag, or ← → by 5% when focused, named by `codePage.sliderLabel`); one sweep hint on first view | SR17 (optional) |
| 03 | When your website is only a brochure | [02] "Before and after": five Today → With Deepzeta AI rows (`problem`) | `section-reveal` | — |
| 04 | How we build a custom-coded website | [03] "How we build": the seven real steps (`how.steps`) as numbered cards, our real process, not an example, so the label says so and the HowTo matches | — |
| 05 | What you get · Built on the same stack as this site | [04] "Deliverables" (`deliverables`); "Built on the same stack as this site" (`worksWith`) with its platform chips | — | P20 `custom-coded-website-laptop-phone-dubai` (+ V20 optional) |
| 06 | Watch this site run its own checks | [05] "Proof": `terminal.heading`, `terminal.lede`; the terminal window (`windowTitle`): the full log is in the HTML; Play replays `build-run.ts` line by line, commands typing in (the recording keeps no per-line timing), with pause, replay, "Next step" (to the next command) and the progress bar (`terminal.controls`); the log scrolls inside its window (focusable); "Recorded on {date} from commit {commit}". Nothing plays by itself | **`terminal-replay`** | SR16 (optional) |
| 07 | Is it right for you? · Built for UAE customers · Pairs well with | [06] "Decision aid" (`fit`): the decision-aid cards only, as Figma draws it (no "good fit" card); "Built for UAE customers" (`uae.points`); "Pairs well with": three Service cards (Website Care Plan; AI Citation & Answer Engine Optimisation (AEO/GEO); Local AI Dominance (Bilingual, Hyperlocal)); on a live card the name is the link | `hover-lift` on live cards | — |
| 08 | FAQ | [07] the FAQ module in its stacked layout: the websites questions from `faq-bank.ts` | `accordion` | — |
| — | Footer | [footer.md](footer.md) | | |

- **One signature moment per viewport:** the laptop, then the compare, then the terminal, with calm sections between.
- **`build-run.ts` holds a real, recorded run** (commands and output selected, never edited), with its date and commit: re-recorded on the v3 build, commit `f85a0d4`, 2026-10-19 (`npm run build`, `check:schema`, `check:seo`, `check:links`). The terminal says "replayed, not live" (10 §3.6). The Figma placeholders are filled from it.

## Content flags (resolved by the owner, 2026-10-19; 10 §3.7)

- **The Core Web Vitals lines** (the description, the direct answer, §03's second row, §05's first deliverable, §07's first answer and `faq-bank.ts`'s two websites answers) now say what we do and what we report: optimised for mobile networks, measured against Core Web Vitals and reported at launch. The thresholds appear only as the measure (facts §6). The performance report at launch stays: it is a real deliverable.
- **The terminal's lede and its last step:** the Lighthouse step is gone from the recording, the lede and the websites FAQ answer, since v3 doesn't run it.
- **The FAQ:** its questions and answers come from `faq-bank.ts`.

## Breakpoints

Checked side by side with `60:34` and `60:827` at 390, 834 and 1440 px.
