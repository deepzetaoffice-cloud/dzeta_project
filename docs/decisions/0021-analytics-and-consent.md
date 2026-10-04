# 0021 · Analytics and consent (P3)

Status: ACCEPTED (owner). §1 and §2 on 2026-10-02, in chat at P3 step B6; the rest (consent by region C52, the taxonomy C55, the generated GTM container and the round trip, the third-party caps and the C5 measurement, the CSP header split and C61's European lab-LCP allowance) at the phase's exit, 2026-10-04.

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
- **Re-measured after the B10 audit fixes** (2026-10-02, lhci, 5 runs on each profile): **11,048 B** (150,716 B), 216 B under the cap, on Home with the banner, on Home as a UAE campaign landing (`?utm_source=…&gclid=…`) and on the review page. `scripts/check-page-weight.mjs` now fails any Home run over the baseline + 11 KB, the campaign landing included; the campaign capture (`attribution.ts`) loads on the visitor's first action, which kept that landing 1,441 B over the cap until it did. LCP medians 2,334 ms (Home), 2,328 ms (campaign), 2,481 ms (review); Performance 98.

### 2. GTM's loader
GTM is loaded by the site's own loader, `src/lib/tracking/gtm.ts`, not by `@next/third-parties` ([C56](../ai/conflict-register.md)): Google's container snippet's two steps, called once by the tracking runtime after hydration, at normal priority, never idle-deferred (lesson L6), after the Consent Mode defaults. `@next/third-parties` is uninstalled. [09](../ai/09-analytics-tracking.md) §2.1 and [0004](0004-tech-stack.md)'s tracking row say so.

## 3. The phase's exit (2026-10-04): the container, the caps, the measurement

- **The generated container is live.** The generator (`scripts/build-tracking.mjs`, `npm run tracking:build`) writes it from `taxonomy.ts` and `accounts.ts`; the GTM round trip (part C step C3) proved the import format against real GTM, and the owner imported it (B1–B8 done, 2026-10-04). The parity test (`tests/unit/tracking-artifacts.test.ts`) keeps the committed artifacts equal to a fresh generation and the taxonomy.
- **The third-party caps, from C5's measurement with the real container** (07 §2): Europe before consent — GTM only, ≤ 2 requests and 160 KB (`gtm.js` 133.4 KB, and in some runs GTM's own 59 B telemetry pixel); the UAE campaign profile — ≤ 4 requests and 350 KB (GTM, the Google tag, GA4's collect; Meta and UET fire on the production host only, so PSI measures them after launch). Enforced per run by lhci and by `check-page-weight.mjs`.
- **`OWN_JS_HOME` is 11,077 B** after C5 fixed the `EVENT_DETAILS` leak C1b had shipped to browsers (`RETIRED_EVENTS` and its parity test); Home's 11 KB cap (§1) holds again, and the security headers now serve pages only (`/_next/` carries `nosniff` alone — the owner's C5 amendment), so the ~550 B/response of ignored header bytes no longer counts.
- **[C61](../ai/conflict-register.md):** European Home's lab-LCP allowance is 2,550 ms (measured on the 2.5 s line: 2,412–2,524 ms over 10 runs, from the CSP header bytes and `gtm.js`, not a regression — UAE Home stays 2,329–2,407 ms). The UAE profile and every other page keep the 2,500 ms assertion; the 2.5 s hard limit (07 §1) stands for field data (PSI/CrUX) after launch.

## Consequences

- **The review page** (`/shell-review`) is 187,811 B of its 192,000 B allowance after the header split ([C57](../ai/conflict-register.md); 4.1 KB left). Home is 174,081 B of 190,868 B. Real pages with the full shell remain the P6 question decision [0019](0019-layout-shell.md) raised.
- **Home has 3,841 B of first-party JS room** (150,932 − 147,091) until a P5 plan measures and decides its own sections.
- ~~Proposed, not made: 04 §2's P3 row and `.claude/rules/analytics-tracking.md` still name `@next/third-parties`~~ — both were fixed at part C step C0 (2026-10-02).
- **Still open, by design:** Microsoft's "primary" goal setting is unquoted (its help pages were unreachable offline; guide B8 carries the click path for the owner), and PSI on production measures Meta and UET after launch (a pre-launch register row).
