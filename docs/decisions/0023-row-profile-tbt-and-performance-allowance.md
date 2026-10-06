# 0023 · The UAE campaign profile's TBT and Performance lab allowances
Status: ACCEPTED (owner, 2026-10-05)

## Context

Decision [0022](0022-gtm-deferral-and-row-tbt-budget.md) deferred the GTM container fetch past
first paint (`afterFirstPaint()` in the tracking runtime) and set the UAE campaign profile's TBT
lab allowance to 225 ms, expecting the deferral to bring runs well under 200 ms.

The CI evidence on `83562da` (two full runs, 2026-10-05, after the GitHub Actions outage cleared —
runs 37379155228 attempt 1 on a post-outage runner, attempt 2 on a healthy one) showed the
deferral works (every tracking e2e green, the container loading once after the consent default,
the Europe profile fully green) but **cannot bring the row TBT under the line**: TBT 247–266 ms
against ≤ 225, Performance 0.93–0.95 against ≥ 0.95.

The reason is structural: Lighthouse's TBT window runs from first paint to TTI (~3 s on this
page). Deferring the fetch past first paint keeps the granted scripts (gtm.js → the Google tag →
GA4's collect) off the paint work, but their **execution** still lands inside the window. Moving
them past TTI would be exactly the idle-defer 09 §2.2 forbids (the L6 data-loss failure mode).
The row-profile TBT is therefore the intrinsic lab cost of the granted third-party scripts on a
throttled budget CPU. Run 1's Europe LCP (2625 ms) and row LCP (2632 ms) were post-outage runner
noise — run 2's Europe profile passed fully, and the row LCP is capped at the true 2.5 s hard
limit in every run.

## Decision

The owner accepted the intrinsic cost (2026-10-05):

- The UAE campaign profile's **TBT lab allowance is 275 ms** (superseding 0022's 225 ms).
- That one profile's **Performance floor is 0.93** (the C61 precedent: a scoped lab allowance for
  one profile, with the reason recorded).

Both live in `lighthouserc.cjs` alone, with 07 §2's third-party-outside-Europe row pointing here.
0022's first half — the deferral itself — stands unchanged: it keeps the granted scripts off the
main thread's paint work and is worth its bytes regardless.

## Consequences

- 07 §1's hard limits stand for every page and profile: TBT ≤ 200 ms, T1 Performance ≥ 0.95. The
  row exceptions cover the granted third-party scripts' lab cost only; any first-party regression
  that pushes TBT or Performance below these allowances fails CI as before.
- The allowance is sized from the two measured runs (247–266 ms; 0.93–0.95) with a small margin —
  ~10 ms of TBT headroom and one Performance point. If runs drift toward the ceilings, that is a
  finding to report, not room to grow into.
- PSI/CrUX field data on production after launch remains the real arbiter of what visitors
  experience; the lab exceptions are CI assertions, not user-facing targets.
- The Europe profile keeps its full T1 assertions (including the C61 LCP allowance); only the
  row profile's two assertions change.
