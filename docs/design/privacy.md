# Privacy Policy (`/privacy`)

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Privacy and 404 (`1:9`), Desktop 1440 `61:34`, Mobile 390 `61:594` · Content: `src/content/en/legal/privacy.ts` (`privacyPolicy`, `privacyFaq`) · Schema: WebPage, BreadcrumbList, FAQPage when visible (08 §3)

## Idea

A calm, readable legal page: a soft hero you can touch, the policy at a glance, then the full text with sticky contents.

## Sections

| # | Figma section | Content | Effects |
|---|---|---|---|
| — | Header | The "Desktop · light page" header ([header.md](header.md)) | |
| 01 | Hero · Drape Background | The breadcrumb Home / Privacy; the H1 "Privacy Policy"; the direct answer (`privacyPolicy.answer`); "Last updated · 12 October 2026" (`lastUpdatedLabel`, `lastUpdated`, equal to `dateModified`) | `drape` (lazy WebGL; static pleats under Reduce effects and without WebGL) |
| 02 | At a glance | `glanceHeading` and the four glance cards (title + line), with UI glyphs | `section-reveal` |
| 03 | Sections · sticky contents + policy text | "On this page": the contents list, sticky at the inline start on desktop, a disclosure on mobile, each item an anchor to its section; the numbered sections rendered from `privacy.ts`'s blocks (paragraphs, lists and tables) | — |
| 04 | Questions about your data? · Related | "Questions about your data?" with `hello@deepzeta.ai` and "Email us"; three related cards (Contact Deepzeta AI, About us, Terms of service), each a link only once live | `hover-lift` |
| — | The FAQ | `privacyFaq`, through the FAQ module, after §03 (not drawn in the frame; kept so the visible FAQ and its FAQPage stay) | `accordion` |
| — | Footer | [footer.md](footer.md) | |

- **"Open" on the related cards** is not an anchor text: each card's link text is its title (08 §2.9).
- **The policy text is never shortened or reworded by the design.** Its words, dates and the legal name come from `privacy.ts` and the site config (10 §2).
- **Anchors** land below the header (`scroll-padding-block-start` equals the header height) and work with Lenis (13 §12).

## Breakpoints

Checked side by side with `61:34` and `61:594` at 390, 834 and 1440 px.
