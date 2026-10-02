# 0021 · Analytics and consent (P3)

Status: ACCEPTED in part (owner, 2026-10-02, in chat at P3 step B6): §1 Home's first-party JavaScript cap and §2 GTM's loader. The rest of P3 (consent by region, the taxonomy, the generated GTM container, the third-party caps) is recorded here at the phase's exit.

## Context

[The P3 plan](../plans/2026-10-02-p3-analytics-consent.md) builds analytics and consent. At step B6, lhci measured part B's work on Home (Lighthouse 12.6.1, slow 4G, CPU 4×, 5 runs) and two of the plan's stops applied:
- **Home's first-party JavaScript** would pass its 10 KB cap ([07](../ai/07-performance-budget.md) §2, [13](../ai/13-experience-design.md) §7): the tracking runtime, the consent defaults, `trackEvent()` and the taxonomy's parameter rules run on every page.
- **Home's lab LCP** rose to 2,554–2,577 ms, over the 2.5 s hard limit. The banner wasn't the cause: as a visitor from the UAE (no banner) it was the same, with the H1 as the LCP element.

**What each piece cost** (Home's modern scripts, gzip level 6, contents only): the tracking runtime with consent, `trackEvent()` and the taxonomy 3,618 B; `@next/third-parties`, which brings Next.js's script loader and a chunk of its own, 2,786 B. Without that package, Home's LCP was 2,329–2,410 ms again (part A's range).

## Decision

### 1. Home's first-party JavaScript cap: 11 KB
The owner chose "slim, then a cap decision" for whatever remained:
- **Slimmed first:** the consent code (`applyChoice()` and the rest of `consent.ts`) and the click handling (`clicks.ts`) load when a visitor first uses them, not at first load; the settings panel already did.
- **Measured after slimming** (lhci, 5 runs, no country, so with the banner): Home's scripts 150,552 B, so our own code is **10,884 B** (the 139,668 B baseline subtracted); LCP 2,329–2,408 ms (median 2,331), Performance 98, TBT 11–18 ms, CLS 0; HTML + CSS + JS 177,507 B.
- **The cap is now 11 KB** (11,264 B), the measured amount rounded up to a whole KB as the old cap was (the owner's choice of three). 07 §2 and 13 §7 say so; `lighthouserc.cjs` asserts it, and `OWN_JS_HOME` is the measured 10,884 B.

### 2. GTM's loader
GTM is loaded by the site's own loader, `src/lib/tracking/gtm.ts`, not by `@next/third-parties` ([C56](../ai/conflict-register.md)): Google's container snippet's two steps, called once by the tracking runtime after hydration, at normal priority, never idle-deferred (lesson L6), after the Consent Mode defaults. `@next/third-parties` is uninstalled. [09](../ai/09-analytics-tracking.md) §2.1 and [0004](0004-tech-stack.md)'s tracking row say so.

## Consequences

- **The review page** (`/shell-review`) is 191,211 B against the 190,868 B page-weight limit; [C57](../ai/conflict-register.md) lets it alone reach 192,000 B. Home and every real page keep the limit. Real pages with the full shell remain the P6 question decision [0019](0019-layout-shell.md) raised.
- **Home has 380 B of first-party room** until a P5 plan measures and decides its own sections.
- **Proposed, not made** (outside what the owner approved here): 04 §2's P3 row and `.claude/rules/analytics-tracking.md` still name `@next/third-parties`.
