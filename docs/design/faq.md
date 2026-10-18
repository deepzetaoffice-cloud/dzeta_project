# FAQ module: "Questions, answered"

Status: CONFIRMED (Figma approved 2026-10-18) · Every page with a FAQ · Decision 0033 · Effects: [13](../ai/13-experience-design.md) (`accordion`) · Figma: FAQ item `35:333` (Closed · Open); the FAQ sections of Home (§11), the hub, the service template, the flagship · Content rules: [engine §6](../seo/seo-geo-domination-engine.md) · Questions: `src/content/en/faq-bank.ts`

## Idea

The FAQ is where a hesitant buyer gets the last answers before booking, and the block AI engines quote most. Calm and generous, never a cramped accordion wall.

**Every answer is real HTML, always in the page,** and matches the FAQPage schema word for word (08 §3).

## Layout

- **Desktop (from 1,024 px), two columns:**
  - **The inline-start column, sticky while the list scrolls:** the mono label "FAQ", the H2, the one-sentence lede (for example "The questions UAE business owners ask before automating — answered directly. Can't find yours? Ask us."), and "Ask our AI agent" (Secondary; WhatsApp until the agent ships, as the hero's input).
  - **The inline-end column:** the question list.
- **Mobile:** stacked: heading, lede, the list, then "Ask our AI agent".
- **A FAQ item** (Figma `35:333`): the question in `text-h4`, the + / − glyph at the inline end, the answer in `text-body` below a hairline. The first question is open on load.

## Behaviour

- **Built so every answer is in the server HTML:** either Radix Accordion with `forceMount` (closed answers hidden with the `hidden` attribute, not unmounted) or native `<details>` / `<summary>`. Either way find-in-page and crawlers reach every answer. **Verify** Radix's `forceMount` behaviour at build (13 §12).
- **Opening** plays `accordion` (220 ms ease-out); it is instant under reduced motion or Reduce effects.
- **Each question has a stable id** from the question bank, `#faq-<id>`. Opening a URL with that hash opens and focuses the question.
- **An answer may contain one contextual link** (engine §6.3).
- **Tracking:** `faq_expand` with `faq_id` (09 §3), once per question per page view.

## Accessibility

- **Headings:** the section heading is an H2. The questions are buttons or `<summary>` text, not headings, so the page outline stays clean.
- **The trigger's state is announced** (`aria-expanded`, or the native `open`).
- **Focus parity:** focus gets the same visual state as hover (13 §2.8).
- **Forced colours:** the glyph and the hairline use system colours.

## States

Default (the first open) · open / closed · deep-linked (opened from a hash) · reduced motion / Reduce effects (instant) · no JS (every answer visible).

## Breakpoints

360, 390, 834, 1024, 1280 and 1440 px (05 §4).
