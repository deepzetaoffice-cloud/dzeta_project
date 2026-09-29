# FAQ module: "Questions, answered"

Status: LAB (validate in the Design Lab before P5) · Page tier: every page with a FAQ · Decision 0008 · Effects: [13](../ai/13-experience-design.md) · Content rules: [engine §6](../seo/seo-geo-domination-engine.md)

## Idea

The FAQ is where a hesitant buyer gets the last answers before booking. It's also the block that AI engines quote most. So it's calm and generous, never a cramped accordion wall.

Every answer is real HTML, always in the page, and matches the FAQPage schema word for word (08 §3).

## Desktop (≥ 1024 px)

- **Two columns.**
  - **Inline-start column (sticky while the list scrolls):**
    - the H2 (for example "Questions, answered")
    - a one-sentence intro
    - **topic chips** (Cost · Timeline · Data & privacy · Arabic · Integrations · Ownership · Results · Support), only the topics this page uses
    - the **"Still have a question?" card**
  - **Inline-end column:** the question list.
- **Questions** are native `<details>` / `<summary>` elements.
  - The first question is open on load.
  - The summary text is the question, in the reader's words.
- **The open question** is marked by the **Zeta Pixel** at inline-start. The pixel means "the current place" (13 §8), so it's never decorative.
- **Rows:** `hover-guide-line` on hover and focus (the pillar colour of the page); `touch-press` on the summary.
- **Open and close:**
  - The height transition uses native `::details-content` / `interpolate-size`, inside `@supports`. Otherwise it's instant.
  - Always instant under reduced motion or Reduce effects.
- **Topic chips:**
  - They filter the list on the client: a toggle button group with `aria-pressed`, and a live region announcing the count.
  - With no JavaScript, the chips aren't shown and every question is visible.
  - Filtering hides questions visually only when JS runs. The HTML always contains every question.

## Mobile (< 1024 px)

- **Stacked:** heading, intro, chips, list, then the "Still have a question?" card.
- **Chips wrap onto new lines.** The page never scrolls sideways.
- **Tap targets** are at least 44 px.

## "Still have a question?" card

- **Surface:** `glass-frost`, with three actions in ladder order (engine §5.2):
  - "Ask our AI agent" (the live demo)
  - "WhatsApp us" (shown once the number exists; facts §2)
  - **"Book a free AI audit"** (the one primary CTA in this view, 05 §2)
- **One line of copy:** "Can't find your question? Ask us directly."

## Links, sharing, tracking

- **Each question has a stable id** from the question bank: `#faq-<id>`.
  - Opening a URL with that hash opens and focuses the question.
  - A small "Copy link" icon button (Tier 1 icon, `aria-label`) copies the link.
- **An answer may contain one contextual link** (engine §6.3).
- **Tracking:** `faq_expand` with `faq_id` (09 §3), fired once per question per page view.

## Accessibility

- **Native semantics:** `<details>` / `<summary>` give keyboard and screen-reader support for free. Nothing is recreated with ARIA.
- **Headings:** the section heading is an H2. The questions are `<summary>` text, not headings, so the page outline stays clean.
- **Focus parity:** focus gets the same visual state as hover (13 §2.10).
- **Forced colours:** the pixel marker falls back to a system-colour bar.

## States

- Default (first open)
- Question open / closed
- Filtered by topic
- Deep-linked (opened from a hash)
- Reduced motion / Reduce effects (instant, no transitions)
- No JS (all questions visible, no chips)

## Icons

- **Tier 1:** chevron (the summary marker), link (copy link), chat, WhatsApp mark (the official mark, never redrawn).
- **The Zeta Pixel** is the open-state marker.

## Performance

- **Zero JS for the base module.** Native `<details>` does the work.
- The chip filter and copy-link add up to about 1 KB of first-party JS (within the T1 ≤ 10 KB budget on Home, 13 §7).

## Breakpoints

360, 390, 768, 1024, 1280 and 1536 px (05 §7).
