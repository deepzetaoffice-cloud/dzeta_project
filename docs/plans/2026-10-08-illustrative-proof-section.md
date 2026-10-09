# Plan: Illustrative proof in Home §06 ("Watch this page build itself")
Status: APPROVED (owner, 2026-10-08)
Phase: P6 (Home polish, within the P5 Homepage scope)
Branch: feature/home-proof-illustrative
Page tier: T1 (decision 0005) — Home ≥ 95, keep the current 100 Lighthouse score

## Goal served
"Prove every claim it makes" (North Star, 00 §1) — the proof section (§06) currently shows only the
pinned "page builds itself" scene. The owner wants a case-study look there, but no real client results
exist yet. This adds **labeled illustrative** examples (conflict C18) so the section demonstrates the
kind of system Deepzeta builds, without inventing a client, a result or a statistic.

## Context
- §06 today is "Watch this page build itself" ([`src/content/en/home.ts`](src/content/en/home.ts:96),
  [`src/components/sections/home/MidSections.tsx`](src/components/sections/home/MidSections.tsx:45)): a
  scroll-pinned CSS laptop plus a live LCP stamp. The owner found the laptop's starting frame ("a plain
  field") confusing and asked to add case-study content behind a "Show" button.
- Hard constraint A — **never invent facts** ([`docs/ai/02-anti-hallucination-and-edit-safety.md`](docs/ai/02-anti-hallucination-and-edit-safety.md:11))
  and conflict C18 ([`docs/ai/conflict-register.md`](docs/ai/conflict-register.md:26)): fictional showcase
  content is allowed **only** when labelled (`Concept by Deepzeta AI · fictional business`) and must contain
  **no reviews, ratings, client logos or statistics**. The owner chose this labelled-illustrative path.
- Hard constraint B — the `check:facts` numbers gate ([`scripts/check-facts.mjs`](scripts/check-facts.mjs:59))
  fails on any number in `src/content/**` that is not in the allowlist (`60 seconds`, `24/7`, `2.5`, `200`,
  `0.1`). So the illustrative cards carry **no invented figures**; outcomes are written in words, reusing
  only allowlisted design targets where a number is wanted.
- The `data-fx-lazy="home"` region already wraps §06 ([`src/app/(en)/page.tsx`](src/app/(en)/page.tsx:61));
  its enhancer touches only `.dz-story-chat` and `[data-lcp-value]`, so static content added here needs no
  new JavaScript and cannot shift layout or the LCP.

## Out of scope
- No change to the pinned scene itself (the `.dz-pinned-scene` / `.dz-lap-layer` / `.dz-lcp-stamp` markup and CSS).
- No new images, charts, animations, dependencies or JavaScript.
- No new H2 section (the e2e test asserts the exact H2 order, [`tests/e2e/home.spec.ts`](tests/e2e/home.spec.ts:32)).
- No real-client claims; no un-labelled "fake" numbers.
- No change to the LCP element (the hero H1/answer stays the LCP).

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/content/en/home.ts` | MODIFY | Add the `illustrativeProof` typed copy (label, show/hide labels, 3 illustrative cards — number-free except allowlisted targets) |
| `src/components/sections/home/MidSections.tsx` | MODIFY | Add the `ProofExamples` component and render it after the pinned scene (fragment inside `BuildItself`) |

No other files change. `src/app/(en)/page.tsx` is untouched: `BuildItself` keeps its export shape and
renders the new block itself, so the page composition does not change.

## Steps
1. Add `illustrativeProof` typed data to [`src/content/en/home.ts`](src/content/en/home.ts) — 3 labelled
   concept cards, word-based outcomes only. → gate: `check:facts`
2. Add `ProofExamples` (native `<details>`/`<summary>` "Show" button, glass cards) to
   [`src/components/sections/home/MidSections.tsx`](src/components/sections/home/MidSections.tsx) and render
   it from `BuildItself` via a fragment. → gate: `verify:fast` + `build`
3. Run the Home e2e + axe and `lhci` (Home) to confirm the H2 order, accessibility and 100 score are intact.
   → gate: `test:e2e` (home) + `lhci`

## Effect register (visual work only)
| Section | Effect ID | Cost → mitigation | Byte cap (13 §7) | Verify items |
|---|---|---|---|---|
| §06 proof examples | `glass-frost` (existing; static cards via the dz-glass class, no new effect) + native `<details>` | zero JS, no animation, ~a few hundred bytes of markup | no first-load JS added | axe clean; no layout shift; LCP unchanged |

The "Show" behaviour is the native `<details>` element (works with JavaScript off, keyboard-operable, crawlable),
styled with existing utility classes and tokens only — no new CSS.

## Dependencies to add
None.

## Risks & mitigations
- **Numbers gate** — any invented figure fails `check:facts`. Mitigation: outcomes in words only; reuse
  allowlisted `60 seconds` where the Speed-to-Lead target is meant.
- **H2 order e2e** — a new H2 breaks [`tests/e2e/home.spec.ts`](tests/e2e/home.spec.ts:40). Mitigation: the block
  uses an H3, and the section is labelled with `aria-labelledby` (accessible name without a new `main h2`).
- **axe** — an unlabelled section or a `<summary>` lacking a name. Mitigation: `aria-labelledby` → the H3.
- **Fictional names vs trademarks** (C18/10 §3.6) — a manual owner check that the fictional business names do not
  collide with real UAE businesses. Mitigation: names are generic ("Luma Properties", "Nova Health Clinic",
  "Atlas Interiors"); the owner ticks the manual checklist.
- **Layout shift / LCP** — none: static server-rendered text, no media, no new JS, inside the existing lazy region.

## Gates (from 03 §2)
- `verify:fast` (`typecheck` + `lint` + `check:tokens` + `check:contrast`)
- `check:facts`
- `build`
- `test:e2e` (Home)
- `lhci` (Home profile, unchanged budgets)

`check:content` is NOT RUN — the script does not exist yet (03 §1 marks it "planned, P4").

## Manual checklist (owner)
- Confirm the three fictional business names don't collide with a real UAE business or trademark.
- Visually confirm the "Show" disclosure reads as intended on mobile and desktop.

## Open questions
- Card count (proposed: 3) and whether to keep fictional names or switch to industry descriptors —
  defaults chosen; owner may adjust at approval.
