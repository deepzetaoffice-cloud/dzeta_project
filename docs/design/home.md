# Home

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) §4.3, §5 · Figma: page Home (`1:5`), Desktop 1440 `50:35`, Mobile 390 `56:810` · Content: `src/content/en/home.ts`, `faq-bank.ts` · Registry: R001

**Section order:** understand → believe → try → book (blueprint §8; engine §3.1).

## Story arc

Hook (§01: the H1 + direct answer) → Pain (§03) → System (§04, §05) → Show (§06) → Proof (§07, §08) → Plan (§09, §10) → Action (§12).

## Sections

| # | Figma section | Content | Effects | Media |
|---|---|---|---|---|
| 01 | Hero · stage (signature 1: from message to booking) | The location chip ("Based in Dubai · serving the UAE first, then the GCC"); the **H1** and the rotator (below); "See how we work →" (to §08); the direct answer (`heroAnswer.answer`); the AI input (placeholder "Ask our AI agent anything, in Arabic or English…", the "WhatsApp mode" chip) with three suggestion chips; "Book a free AI audit" | `hero-word-rotator` + its pause button, `background-paths`, **`message-to-booking`** (the phone, calendar and CRM cards, "Drag to rotate", the scrubber "Scroll to run the example": 01 Message · 02 Reply · 03 Booked · 04 CRM) | S01 (phone scene), U16/U17 (posters), U18–U21 (phone states); SR02, SR03, SR04 (optional recordings) |
| 02 | Platform strip · marquee | "The platforms we build on" + the platform names as plain text (`proofStrip`; catalogue §8). No client logos or partner badges (facts §5) | `marquee` + its pause button | — |
| 03 | Problem → outcome | [01] "Three leaks" · "Sound familiar?" · lede; three rows "Today" → "With Deepzeta AI", each opening to its 40–75-word answer (`problemOutcome`). The 60-second reply is labelled a design target, not a measured result (facts §6) | `problem-reveal`, `section-reveal` | — |
| 04 | Four doors (signature 2) | [02] "Four pillars" · "Four ways we build your growth" · lede; four door cards (number, pillar, promise, three services, "All {pillar} services", linking to the pillar page once live); the closing line | **`pixels-to-doors`**, `door-video`, `door-tilt`, `hover-lift` | P01–P04 (posters) + V01–V04 (loops; mobile: the Momentum Rail) |
| 05 | How an automation works (signature 3) | [03] "Example workflow" · "See an automation run" · lede; "Fig. 2 — one workflow, end to end · example"; the five steps as a visible ordered list (01 Lead · 02 AI reply · 03 Booking + CRM · 04 Reminder · 05 Review); the diagram's nodes with their pillar chips; "Ends on the real flow ↓" | **`workflow-connect`** (pinned ~200 vh; vertical on mobile), the Scrubber | S02 (optional 3D), U22 (poster); SR01: the real n8n flow, captioned "Built by Deepzeta AI" |
| 06 | This page is the proof (signature 4) | [04] "This page is the proof" · "Watch this page build itself" · lede; the "How AI reads this page" toggle; "This visit's LCP — s, measured live"; the four layers 01 Design · 02 Code · 03 Schema · 04 SEO, showing this page's real `<title>`, description, H1, step list, JSON-LD (from the page's own script) and `llms.txt` | **`exploded-layers`**, `lcp-stamp` | S03, U23/U24 (posters) |
| 07 | Illustrative proof · concepts | [05] "Concepts" · "The kind of system we build"; three concept cards (`illustrativeProof`), each labelled "Concept by Deepzeta AI · fictional business" (C18) | `hover-lift`, `section-reveal` | — |
| 08 | How we work | [06] "Audit → Build → Launch → Improve" · "How we work" · lede; four step cards (`howWeWork`) | `section-reveal` | P21 (+ V21 optional) |
| 09 | Industries (signature 5) | [07] "Four industry groups" · "Built for your industry" · lede; four cards (B2B, Corporate & Tech · E-Commerce & Consumer Brands · Real Estate, Construction & Professional · Local, Medical & Field Services), each flipping to its ready-made automations and "See the {group} page" (a link once R101–R104 ship) | **`industry-rail`** (pinned on desktop; swipe on mobile), `industry-flip` | P05–P08 (+ V05–V08 optional) |
| 10 | ROI calculator (signature 6) | [08] "Your numbers only" · "What is manual work really costing you?" · lede; three sliders (hours per week, cost per hour in AED, weeks per year) labelled "Example inputs — move the sliders to your numbers"; the yearly value and the formula, always shown | **`roi-count-up`** | — |
| 11 | FAQ | [09] the FAQ module ([faq.md](faq.md)): 8 questions from `faq-bank.ts`, "Ask our AI agent", FAQPage schema | `accordion` | — |
| 12 | Final CTA | "Start with a free AI automation audit" + its line + "Book a free AI audit"; the "Demo" panel "The speed-to-lead test" (the 60-second target, facts §6) + "Take the speed-to-lead test" | `section-reveal` | — |
| — | Footer | [footer.md](footer.md) | | |

## The hero, in detail

- **The H1 is one stable sentence and the page's LCP element:**
  - visible at first paint, with no entrance animation (13 §3)
  - its text content is exactly the stable sentence (`heroAnswer.heading`), for crawlers and screen readers alike
  - its visible part is the tail ("built for UAE businesses."); the lead-in is visually hidden
- **The rotator** (decision 0033 §3) sits in the same headline block, outside the `<h1>` element:
  - `aria-hidden`, with only its first phrase in the server HTML
  - the six phrases in order: Business centric → Growth formula → Branding → Custom coded websites → AI Automation → Social media strategy
  - each phrase in solid violet on its slab (`--dz-slab-1` to `-6`), with the "01 / 06" counter
  - the pause button (Icon button, labelled) stops it; it also pauses on hover and focus, off-screen and in a hidden tab
- **The AI input** opens the website agent (P7). Until the agent ships, sending opens WhatsApp with the visitor's text prefilled, and the input says so. Never a fake chat. The suggestion chips fill the input.
- **The phone scene** labels its conversation "Example conversation" (10 §3.6). The 3D scene loads after the first paint, on capable devices only; otherwise the poster shows the final state with the same text in HTML.
- **The scrubber's steps are buttons,** so the scene can be run by keyboard. With reduced motion there is no pin, and all four states show.

## Content flags (raised with the owner, not changed silently)

- **The H1's words:** Figma reads "AI automation and custom-coded websites, built for UAE businesses." and `home.ts` reads "AI automation and custom-coded websites for UAE businesses". Recommended: the Figma wording, written into `home.ts` by the Content Writer.
- **New copy the Figma file adds:** the rotator's phrases (the owner's own, decision 0033 §3), the location chip, the AI input's placeholder and chips, the doors' and the scene's labels, and §06's layer lines. It goes into `home.ts` from the Figma text, through the Content Writer, before the build uses it.
- **§09's back faces** are `[[TODO: best-fit automation from the group page]]`. They're filled from the catalogue's industry groups before the page ships (`check:facts` fails on a TODO).
- **§06's code layer** shows build output ("✓ Compiled · 15 routes"). It is this site's real recorded output (`build-run.ts`), or labelled "Example".

## Per-viewport check

One signature moment in view at a time (13 §2.3): the hero scene, then the doors, the workflow, the proof, the rail and the calculator, with a calm section (§02, §03, §07, §08, §11) between the loud ones. Two pinned scenes are never adjacent.

## Breakpoints

Checked side by side with `50:35` and `56:810` at 390, 834 and 1440 px, plus 360 (the consent banner never covers the H1 at 360 × 640) and 1280.
