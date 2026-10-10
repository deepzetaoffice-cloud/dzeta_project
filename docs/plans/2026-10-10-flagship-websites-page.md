# Plan: The flagship Custom-Coded Websites page (R060)
Status: APPROVED (owner, 2026-10-10: "approved", with the three open questions answered as proposed)
Phase: P6 · Branch: `feat/flagship-websites` · Page tier: T2 (standard floor, decision 0029)

## Goal
*"A fast, custom-coded … site that … proves every claim it makes."* Ship `/services/custom-coded-websites`
(catalogue 2.1, the flagship) with the two extras its spec asks for (`docs/design/service-page.md`,
"Extras for the Websites service page"): a **Code ↔ Page** slider that reveals the real code behind a
real section of this page, and a **build terminal** that replays a real run of this site's own build
and checks. The page proves the service on itself.

## What the page is
The service template's sections in engine §3.1's order, with two swaps:
- **§3 How it works:** the visible step list stays (HowTo stays honest, 13 §4.8); beside it, the
  **Code ↔ Page** slider (`story-before-after`) instead of a `story-flow`.
  - The page side is the live hero of this page.
  - The code side is that hero's real source, read from the repo at build time, so it can never drift
    from the code that ships.
  - A native `<input type="range">` drives it, so the arrow keys work without extra code. Without
    JavaScript, the code and the page sit one above the other.
- **§7 Proof:** the **build terminal** (`story-terminal`) instead of a demo stub.
  - A macOS-style window (close, minimise and maximise buttons, decorative).
  - It replays a real, recorded run of this site's gates: `npm run build` (the route table),
    `check:schema`, `check:seo`, `check:links`, then Home's Lighthouse result.
  - It is labelled with its date and commit ("Recorded on … from commit …"), never "live".
  - It plays once when it scrolls into view and pauses when it scrolls away.
  - It has Play / Pause / Replay / Step controls, because it runs longer than 5 s (WCAG 2.2.2).
  - Under reduced motion or Reduce effects it shows the full output, still.

Everything else is the template: the hero with the page's new Tier 2 icon (Websites pillar), the
before → after rows, what you get, works with, is it right for you, UAE specifics, pairs well with,
the FAQ (6–8, lead service: 1,200–1,800 words), and the CTA.

## How it stays off Home (C73: no Home changes)
- **A dedicated route** `src/app/(en)/services/custom-coded-websites/page.tsx` renders the shared
  section components plus the two extras. The `[slug]` route skips that slug.
- **Its CSS lives in a template stylesheet** (decision 0026 §4): `src/styles/templates/websites.css`,
  imported only by this route. It uses tokens only, and nothing is added to the shared sheet beyond
  any new Tailwind utilities, which I avoid by reusing existing ones. The shared sheet's size is
  reported at exit.
- **Its JavaScript is one small client island on this route only:**
  - the slider's value written to one CSS custom property;
  - the terminal's controls and its pause when scrolled away (the shared observer's `.is-in` starts it).

  Nothing goes into `src/lib/fx/lazy.ts`, so Home's first-load JS is unchanged. Budget: ≤ 2 KB
  gzip for the controls (13 §7, "story controls") and ≤ 6 KB for each story's data and markup;
  measured at exit.
- These are the shared story controls' first build. The Automation pillar and Deepzeta Sync reuse
  the terminal and its controls later (13 §9).

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `src/app/(en)/services/custom-coded-websites/page.tsx` | CREATE | The flagship route |
| `src/app/(en)/services/[slug]/page.tsx` | MODIFY | Skip slugs that have their own route |
| `src/components/sections/CodePage.tsx` | CREATE | The Code ↔ Page slider (server-rendered) |
| `src/components/sections/StoryTerminal.tsx` | CREATE | The terminal window (server-rendered) |
| `src/components/sections/StoryControls.tsx` | CREATE | The client island: slider value, terminal controls |
| `src/styles/templates/websites.css` | CREATE | The template's own rules (tokens only) |
| `src/content/en/services/custom-coded-websites.ts` | CREATE | The page's copy |
| `src/content/en/services/build-run.ts` | CREATE | The recorded terminal run (typed data, dated, with its commit) |
| `src/content/en/services/index.ts`, `types.ts` | MODIFY | Register the page; type the two extras |
| `src/content/en/faq-bank.ts` | MODIFY | The page's FAQ (new unique ids) |
| `src/components/icons/registry.ts` | MODIFY | The Tier 2 icon `custom-coded-websites` (Websites pillar, no knockout, existing motion) |
| `src/lib/routes.ts`, `docs/seo/url-registry.md` | MODIFY | R060 → live, with a change-log row |
| `scripts/check-facts.mjs` | MODIFY | Exempt `build-run.ts` only (question 1) |
| `tests/e2e/websites.spec.ts` | CREATE | Slider by keyboard, terminal controls, pause off-screen, reduced motion, no-JS, axe |
| `tests/fixtures/schema/services-hub.json` | MODIFY | The hub's list gains 2.1 (additions only) |
| `docs/plans/2026-10-10-flagship-websites-page.md` | MODIFY | Progress |

## Steps
1. Types and the dedicated route skeleton (the template's sections, no extras yet).
2. The copy and FAQ (Content Writer), the icon (the icon recipe), R060 live.
3. Code ↔ Page: the server component and the build-time source read.
4. The terminal: record a real run on a clean build, trim it, store it with its date and commit.
5. The client island: the controls, the pause when off-screen, reduced motion.
6. The e2e spec; the gates; the owner's review on the preview.

## Effect register
| Section | Effect ID | Cost → mitigation |
|---|---|---|
| §3 How it works | `story-before-after` ("Code ↔ Page") | A native range input plus one custom property; no layout animation (clip-path on a composited layer); static split without JS |
| §7 Proof | `story-terminal` | CSS line reveals (opacity/transform), one-shot; controls ≤ 2 KB; pauses off-screen; full static output when reduced |
| The terminal window | `glass-frost` | The existing class; one window per view |

## Dependencies, risks
- **No dependency.** The code side gets simple token colouring at build time (server-side, zero client JS); no highlighter library.
- **Gates (03 §2, a new template):** the branch row; `lhci` on Home (the `[slug]` route and the
  registry change can reach the shell's menus; Home's numbers must not move); the SEO/GEO and
  Performance & Accessibility auditors once; the owner's Rich Results Test on the preview.

## Open questions
1. **The terminal's numbers.** A real run prints real numbers (pages built, links checked,
   Performance 96, LCP in ms). `check:facts` rejects any number outside the allowlist. I propose
   exempting `build-run.ts` alone, because it is a dated recording of our own run, not a claim.
   Approve?
2. **The run to record.** Build → schema → SEO → links → Home's Lighthouse, as above. Or would you
   rather show a shorter run (build and Lighthouse only)?
3. **Try it.** The page's demo slot becomes the terminal. AI View ("See how AI reads this page",
   P7) can join later. Agree?

**Answered (owner, 2026-10-10):** 1. yes, `build-run.ts` alone is exempt; 2. the full run; 3. agreed.

## Progress
