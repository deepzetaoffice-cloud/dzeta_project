# 0022 · GTM deferred past first paint; the row-profile TBT lab allowance 225 ms
Status: ACCEPTED (owner, 2026-10-05)

## Context

P4's branch head passed every CI gate except `lhci`'s assert step, on the UAE campaign-landing
profile only (consent granted by default, no banner): Performance 0.92–0.95 against the ≥ 0.95 T1
floor, TBT 227–264 ms against the ≤ 200 ms hard limit. The evidence showed the TBT came from the
GTM-granted third-party scripts (gtm.js → the Google tag → GA4's collect) executing on the main
thread during the TBT window — the container was fetched by `loadGtm()` from a plain `useEffect`,
after hydration but before the browser had painted. The schema work in the same run was inert
JSON-LD bytes; Home's own JavaScript was unchanged.

The rule that any fix had to respect: 09 §2.2 — **"Never idle-defer GTM"** (the reference project
lost GA4 data that way; lesson L6).

Three options were put to the owner: (1) accept the failing gate as noise, (2) defer the GTM tag
scripts past first paint, (3) raise the row-profile TBT budget.

## Decision

The owner decided **both** (2026-10-05):

1. **Defer the GTM tag scripts past first paint** (option 2). The tracking runtime
   (`src/components/layout/TrackingRuntime.tsx`) fetches the container through `afterFirstPaint()`:
   a `requestIdleCallback` with a **hard 1,500 ms timeout** ending in a double
   `requestAnimationFrame` (two frames ⇒ painted); a `setTimeout(0)` fallback where
   `requestIdleCallback` doesn't exist; a hidden tab loads at once. This is **not** an idle defer in
   the L6 sense: the timeout bounds the wait and the container always loads on the page's first
   load, well inside GA4's session window — the tracking e2e tests prove it fires on every load,
   after the consent default, in both regions.
2. **Raise the row-profile TBT lab allowance from 200 to 225 ms** (option 3), in `lighthouserc.cjs`
   alone, as headroom against runner noise. With the deferral in place, TBT is expected to land
   well under 200 ms, so the margin is a safety net, not a licence.

## Consequences

- The UAE campaign-landing scenario stops competing with first paint for the main thread; the TBT
  from the granted tags moves past the paint window.
- The consent order never moves: `dataLayer[0]` and the Consent Mode v2 defaults stay in the inline
  root-layout script, set before hydration, before GTM, before paint. Europe (denied defaults, the
  banner) and the row profile (granted, no banner) behave exactly as before, a few hundred ms later
  in the container fetch.
- **07 §1's ≤ 200 ms TBT hard limit stands for every page.** The 225 ms is the row-profile *lab*
  allowance only (the C61 precedent: the asserted number lives in `lighthouserc.cjs` and this
  record; 07 §2's third-party row carries one clarifying sentence pointing here). If runs
  consistently sit above ~200 ms with the deferral in place, that is reported as a finding, not
  absorbed by the margin.
- The tracking e2e cases poll their container-request assertions (the same semantics: exactly one
  request after hydration and after the consent default, nothing else third-party), because a
  deferred request can land after the `networkidle` window closes.
- `loadGtm()` itself (`src/lib/tracking/gtm.ts`, C56) is unchanged, as are its unit tests, the
  taxonomy, the consent code and the generated GTM container artifacts.
- A fast-bouncing visitor's page view can be lost if they leave within the deferral window —
  bounded by the 1,500 ms timeout and the double rAF, and accepted by the owner with this decision.
