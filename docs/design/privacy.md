# Privacy Policy (`/privacy`)

Status: CONFIRMED (Figma approved 2026-10-18) · As built in Phase D4 (2026-10-19; the owner approved this sync the same day) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) · Figma: page Privacy and 404 (`1:9`), Desktop 1440 `61:34`, Mobile 390 `61:594` · Content: `src/content/en/legal/privacy.ts` (`privacyPolicy`, `privacyFaq`) · Schema: WebPage, BreadcrumbList, FAQPage when visible (08 §3)

## Idea

A calm, readable legal page: a soft hero you can touch, the policy at a glance, then the full text with sticky contents.

## Sections

| # | Figma section | Content | Effects |
|---|---|---|---|
| — | Header | The "Desktop · light page" header ([header.md](header.md)); the hero starts under it | |
| 01 | Hero · Drape Background | The breadcrumb Home / Privacy policy in the hero (a mono label); the H1 "Privacy Policy"; the direct answer (`privacyPolicy.answer`); the "Last updated · 12 October 2026" chip (`lastUpdatedLabel`, `lastUpdated`, equal to `dateModified`) | `drape`: CSS pleats, which a small raw-WebGL canvas (no library, `src/lib/fx/privacy.ts`) takes over while effects are on, with a fine pointer; it draws only while the pleats move. A veil keeps the middle pale under the text. Static pleats under Reduce effects, on touch and without WebGL |
| 02 | At a glance | `glanceHeading` and the four glance cards (title + line), each glyph on its violet-soft tile | — |
| 03 | Sections · sticky contents + policy text | "On this page": the contents list, sticky at the inline start on desktop, a disclosure on mobile, each item an anchor to its section; the section being read is marked (`aria-current="location"`, set by the page's scene); the numbered sections ("1 · Introduction") rendered from `privacy.ts`'s blocks (paragraphs, lists and tables) | — |
| 04 | Questions about your data? · Related | "Questions about your data?" on the stage, with its line, `hello@deepzeta.ai`, "Email us" and WhatsApp while it is set; three related cards (Contact Deepzeta AI, About us, Terms of service), each shown only once its page is live, its title the link. While none is live, the contact card takes the row | `hover-lift` on the related cards |
| — | The FAQ | `privacyFaq`, through the FAQ module in its stacked layout, after §03 (not drawn in the frame; kept so the visible FAQ and its FAQPage stay) | `accordion` |
| — | Footer | [footer.md](footer.md) | |

- **"Open" on the related cards** is not an anchor text: each card's link text is its title (08 §2.9).
- **The policy text is never shortened or reworded by the design.** Its words, dates and the legal name come from `privacy.ts` and the site config (10 §2).
- **Anchors** land below the header (`scroll-padding-block-start` covers the header and the stage inset). The site scrolls natively; Lenis isn't used.

## Breakpoints

Checked side by side with `61:34` and `61:594` at 390, 834 and 1440 px.
