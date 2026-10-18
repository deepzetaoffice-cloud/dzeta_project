# 0033 · Website v3: the "Spectrum" redesign, performance as information, UI kits allowed

Status: ACCEPTED (owner: the plan approved in chat on 2026-10-17; the Figma file approved on 2026-10-18, "Approved. Proceed"; this record confirmed in chat on 2026-10-18, "Yes, as 0033")

## Context

- On 2026-10-17 the owner rejected the live design, "Signal & Depth" ([0008](0008-design-language-signal-and-depth.md)): dark navy everywhere, heavy white Montserrat, one blue accent, no imagery. It read as amateur.
- The brief: a redesign from zero. Colourful, with real photos and video, motion, hover, parallax, scroll and 3D. An outstanding header and a sectioned footer. Mobile-first. Full technical SEO and GEO on every page. Every analytics, tag and pixel piece kept exactly as it is.
- The owner also removed the 90+ performance-score rule: scores become information only, and no client is ever promised a score.
- The plan is `docs/plans/2026-10-17-redesign-v3.md`. Phase B, the design, was made in Figma: **"Deepzeta AI · Website v3"**, file `tYw7bSV9m4zX2vrVs7XYpE` (https://www.figma.com/design/tYw7bSV9m4zX2vrVs7XYpE).
- 0032 is taken by the Designer Studio's UI-kit decision, recorded in another session; this record is 0033.
- The site is still under the pre-launch `noindex` lock ([0013](0013-pre-launch-indexing-lock.md)), so the rebuild carries no ranking risk.

## Decision

### 1. The design: direction B "Spectrum", with direction C's diagrams

- **The base is Direction B, "Spectrum":** a light canvas, and a rounded "stage" panel filled with the logo's gradient that holds each hero. Type is Unbounded (display), Figtree (body and UI) and Geist Mono (labels and steps).
- **Direction C, "Colour Lab", lends its diagram language** for the explanatory moments: the system diagram, the numbered steps and the scrubber ("See an automation run", "How it works", "This page is the proof").
- **The approved Figma file is the design's source of truth.** Its variables carry WEB code syntax (`var(--dz-…)`), and `src/styles/tokens.css` mirrors those names. [05](../ai/05-design-system.md), [13](../ai/13-experience-design.md) and `docs/design/*.md` are rewritten from it.
- **Light only in V1.** There is no dark mode and no theme switch. The performance-constraint file's dark-mode option is recorded as a conflict (C77).

### 2. Colour: solid violet, no green

- The owner, 2026-10-18: "The green looks cheap on the theme. So use Solid Violet instead of green."
- **Solid violet `#6430FA`** (pillar growth/1) is the action colour everywhere: buttons, the online state, the WhatsApp buttons.
- **WhatsApp green appears only inside the chat mock** (the phone's example conversation).
- The four logo-derived pillar gradients are kept unchanged.

### 3. The Home hero

- **A rotating phrase** in solid violet on bright slabs (white, sun, blush, ice, peach, orchid). It cycles: Business centric → Growth formula → Branding → Custom coded websites → AI Automation → Social media strategy.
- **The H1 stays one stable sentence** for SEO. The rotating phrases are `aria-hidden`, and a pause control stops them (WCAG 2.2.2).

### 4. Libraries: the owner's overrule

- The owner, 2026-10-17: "Overrule the current rule to use the KokonutUIs and other design skills and designs."
- This overrides N2's "no UI kits" and the plan's "no Motion/Framer, no UI kit" line.
- **Allowed:**
  - KokonutUI components, copied in through the shadcn CLI from the registry `@kokonutui` (`https://kokonutui.com/r/{name}.json`)
  - the Aceternity components named in the Figma motion spec
  - other design skills and components where they serve the design
- **Motion (`motion/react`) comes with KokonutUI.** It joins GSAP, which stays the engine for scroll scenes.
- **Every copied component is ours to keep:**
  - restyled through the tokens
  - logical CSS
  - accessible, with its reduced-motion fallback
  - its own dependencies verified at install (02 §2)
- **Still banned:** icon libraries. Copied components use the 18 in-house UI glyphs from Figma instead of `lucide-react`. Also banned: templates, page builders, themes and a CMS.
- **The rest of the stack**, from the plan: GSAP (ScrollTrigger, SplitText, MotionPath), Lenis, `three` with `@react-three/fiber` and `@react-three/drei` (lazy-loaded), Radix primitives, `knip` and `@next/bundle-analyzer`.

### 5. Performance is measured and reported, never a blocker

- **Removed:**
  - the Lighthouse floors (0005, 0011, 0028)
  - the Home page-weight limit, the JavaScript, font and image byte caps (0014, 0021's Home cap) and the effect byte caps
  - the regression rule and the exception limit (0020)
  - the lab allowances (0022's TBT row, 0023), the CPU calibration (0025) and the Studio exemption (0031, now moot)
- **Deleted in Phase C:** `lhci` and its configs and scripts.
- **Kept, because they cost nothing visually:**
  - `next/image` (AVIF and WebP, explicit sizes)
  - lazy 3D and video, with posters
  - self-hosted fonts
  - Server Components by default
  - reserved space for anything that loads late
- **Reported for information on every branch:** a Lighthouse report and a bundle report.
- **Copy never promises** a Lighthouse or PageSpeed score. It claims a Core Web Vitals result only when a real measurement shows it (N3).

### 6. Media

- **Photos:** 21 made with ElevenLabs (Seedream 5 Lite, 3072 × 2304 masters, 2400 px web JPEGs). They're outside the repo, in `D:\DeepZeta Ai\Deepzeta Media\Website v3 media\`.
- **Videos:** the owner makes them, from that folder's `video-prompts.json`.
  - V01–V04, the Home door loops, are required. V05–V21 are optional.
  - Each is 6 s and silent, at 1440 × 1080 and 1080 × 1350.
  - Every video slot is built now, with its photo as the poster and the fallback. The build never waits for a video.
- **The rules:**
  - UAE places; hands, backs, spaces and devices only
  - never an AI face shown as a client or team member
  - no readable text or logos in images
  - screen recordings show real systems with demo data, captioned "Built by Deepzeta AI" or labelled "Example"
- **Every asset goes through the SEO contract's `MediaAsset`** ([08](../ai/08-seo-geo-aeo-schema.md) §7).

### 7. The logo

- The locked logo stays as it is.
- The owner's white-background variants (`D:\DeepZeta developemnts\Logos\DeepZeta_WhiteBG_logos\`) are used on light surfaces. The header uses `DeepZeta_Wordmark_D_As_Symbol_Plus_Pixels_WhiteBG.svg`.
- They join the repo as new locked files only with the owner's approval (C78).
- In the lockups, the tagline lines are near-white, so they don't show on white.

### 8. Effects

- [13](../ai/13-experience-design.md) §4 is rewritten from the Figma motion spec: 35 effect IDs, each with a purpose, trigger, timing, reduced-motion fallback and build technique.
- The Signal & Depth IDs are retired and never reused.
- Their surfaces that aren't redesigned yet (the Designer Studio, Deepzeta Sync, the automation page, the app demo) keep them until each is redesigned.

### 9. The header and the conversion path

- **The approved header** carries "Book a free AI audit" as its button and an "Agent online" status island.
- This replaces [0024](0024-conversion-cta-set.md)'s "Deepzeta AI" header button. The website agent now opens from the hero's AI input.
- The click contract is unchanged:
  - the header button is `data-cta="header"` with `cta_id` `book_audit`
  - until the audit page ships, it falls back to WhatsApp honestly (`tracking.spec.ts`)
- The sticky mobile CTA bar, the mobile sheet's CTA and the footer finale's CTA keep their `data-*` hooks.
- The status island shows only while the WhatsApp agent is live.

### 10. Kept verbatim

- Tracking, consent, schema and the SEO core. The full list is in the plan's Phase C.
- `tracking.spec.ts` and `consent.spec.ts` pass unchanged. That keeps the `/shell-review` page, the sticky bar, the native `<dialog class="dz-sheet">` mobile menu and the footer's Cookie settings button.
- All 15 live URLs keep their paths.

## Supersedes

| Decision | Part |
|---|---|
| [0008](0008-design-language-signal-and-depth.md) | In full |
| [0009](0009-design-lab-v1-verdicts.md) | Its visual verdicts (token values, glass, the cluster nav marker, the Studio word ripple's place in the old library) |
| [0015](0015-design-tokens-themes-fonts.md) | §2 Themes, §3 Colour rules, §5 Fonts; §4's values (the token mechanism, §1, stays) |
| [0018](0018-brand-primitives.md) | §1 and §2, their navy-only parts (the logo's crops on navy, the app icons on navy) |
| [0019](0019-layout-shell.md) | §2 (dark default, theme switch), §5 (glass), §7–§9 (the Signal & Depth header, sheet, footer and The Landing), §10 (the effects feasibility gate) |
| [0005](0005-performance-tiers.md), [0020](0020-performance-exception-limit.md) | In full (performance tiers and the exception limit) |
| [0014](0014-empty-page-baseline-and-js-budget.md), [0023](0023-row-profile-tbt-and-performance-allowance.md), [0025](0025-lighthouse-cpu-calibration.md) | In full: their numbers become information |
| [0021](0021-analytics-and-consent.md), [0022](0022-gtm-deferral-and-row-tbt-budget.md), [0028](0028-standard-tier-and-light-verification.md) | Only their lab budgets and floors; the tracking, consent, GTM deferral and light verification stand |
| [0024](0024-conversion-cta-set.md) | The header button's label and target (§9 above); the rest stands |
| [0029](0029-build-mode.md) | The "never relaxed: Home's performance" line; design and SEO/GEO stay never relaxed |
| [0031](0031-designer-studio-performance-exempt.md) | Moot: no page has a performance floor |

## Consequences

- **Rule files:** [00](../ai/00-project-master-rules.md) (N1, N2, §4, §7), [01](../ai/01-ai-agent-roles.md) (the auditor's role), [03](../ai/03-verification-gates.md), [05](../ai/05-design-system.md) (rewritten), [06](../ai/06-code-standards.md) §5, [07](../ai/07-performance-budget.md) (rewritten as guidance and reporting), [08](../ai/08-seo-geo-aeo-schema.md) (the SEO contract), [10](../ai/10-content-voice.md) §3, [13](../ai/13-experience-design.md) (rewritten).
- **Records:** the conflict register gets C77–C84. `CLAUDE.md` is updated, with the auditor agent and the `verify` and `new-page` skills.
- **Design specs:** `docs/design/` is rewritten for the 15 URLs and the shell. The specs of surfaces not yet redesigned keep their frame decisions, but their Signal & Depth styling is superseded.
- **Code:** the old visual code is deleted in Phase C. The new foundation keeps the tracking and schema code verbatim, adds the SEO contract and `knip`, and removes `lhci`.
- **Content flags for the owner (copy is not changed silently):**
  - `services-hub.ts` (the Websites lede) and `custom-coded-websites.ts` promise "built to pass Core Web Vitals"
  - `faq-bank.ts` says "performance budgets enforced in our pipeline"
  - the flagship terminal includes Lighthouse checks
