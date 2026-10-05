# Plan: GTM deferral past first paint + the row-profile TBT budget
Status: APPROVED (owner, 2026-10-05: "Approve all recommendations: add the one clarifying sentence to protected 07 §2, use the 1,500 ms timeout trigger, decision number 0022. Implement D1–D3 now.")
Phase: P4 (the last failing gate; continues on `feat/schema-system` from `cfc2940`)
Page tier: T1 (the tracking runtime ships on every page; measured on Home, both region profiles)

## Goal served

*"A fast site that turns UAE business owners into booked AI audits."* The UAE campaign-landing
scenario (consent granted, no banner) must meet the T1 performance floor on the lab budget phone,
without losing a single tracked visit and without weakening a gate silently.

## Context — the owner's decision (2026-10-05)

CI on the P4 head (`173479d`) passes everything except `lhci`'s assert step, on the row profile only
(the UAE campaign landing): Performance 0.92–0.95 vs ≥ 0.95 and TBT 227–264 ms vs ≤ 200 ms. The
schema work is inert JSON-LD bytes; the TBT comes from the GTM-granted third-party scripts executing
on the main thread during the TBT window — gtm.js is fetched by
[`loadGtm()`](../..//src/lib/tracking/gtm.ts) from a plain `useEffect` in the tracking runtime, after
hydration but before the browser has painted.

**The owner decided: do both.**
- **(a) Option 2 — defer the GTM tag scripts past first paint**, so the UAE campaign-landing
  scenario (GTM granted, no banner) stops blocking the main thread.
- **(b) Option 3 — raise the row-profile TBT budget from 200 to 225 ms** as headroom against runner
  noise. With (a) in place TBT should land well under 200, so (b) is a safety margin, not a licence.

Both halves are recorded in [decision 0022](../decisions/0022-gtm-deferral-and-row-tbt-budget.md).

## Constraints honoured

- **09 §2.2 — "Never idle-defer GTM"** (the reference project lost GA4 data; lesson L6): the
  deferral is not an idle defer. The idle wait carries a **hard 1,500 ms timeout** and ends in a
  double `requestAnimationFrame`, so the container always loads on the page's first load, well
  inside GA4's session window. A hidden tab (no paint signal exists) loads at once.
- **The consent order never moves** (09 §2.2): `dataLayer[0]` and the Consent Mode v2 defaults are
  set by the inline script in the root layout — before hydration, before GTM, before paint. Only the
  container *fetch* moves later. Europe (denied defaults, banner) and row (granted, no banner)
  behave exactly as today, a few hundred ms later.
- **07 §1's hard limit table stays ≤ 200 ms** for every page; the 225 ms is the row-profile *lab*
  allowance only (the C61 precedent: the asserted number lives in `lighthouserc.cjs` and the
  decision record).
- **The tracking e2e tests keep their semantics** (a UAE visitor still gets the tags): exactly one
  container request after hydration and after the consent default, nothing else third-party, the
  DE container still loading while consent is denied. Where the deferral makes a wait racy, only the
  wait changes (a poll), never an assertion's meaning.

## Design

### 1. The deferral (D1)

[`TrackingRuntime.tsx`](../../src/components/layout/TrackingRuntime.tsx) gains a module-level
`afterFirstPaint(run)`:

- `document.visibilityState === 'hidden'` → `run()` at once (no paint signal will ever come).
- Otherwise: `requestIdleCallback(painted, { timeout: 1500 })` where `painted` is a double rAF
  (two frames ⇒ the browser has painted); without `requestIdleCallback` (older Safari),
  `setTimeout(painted, 0)`.
- The GTM effect calls `loadGtm(gtm)` through it, with a `cancelled` guard for an unmount before
  the callback (React's dev double-mount); `loadGtm()` itself stays byte-identical — its
  once-per-document guard and the unit tests in `tests/unit/gtm.test.ts` are untouched.

### 2. The e2e waits (D1, only if racy)

The GTM-loader cases in [`tracking.spec.ts`](../../tests/e2e/tracking.spec.ts) assert after
`networkidle`; a deferred container request can in principle land after the idle window closes. The
request assertions become `expect.poll`s (wait for the same fact, robustly) — the dataLayer reads
happen after the request is seen, so `gtm.start`'s position after the consent default stays
assertable. `consent.spec.ts` changes only if its timings prove sensitive (not expected: it stubs
GTM and waits on the banner, not the container).

### 3. The budget (D2)

- [`lighthouserc.cjs`](../../lighthouserc.cjs) `rowThirdParty`: a row-profile
  `'total-blocking-time': ['error', { maxNumericValue: 225, ...medianRun }]` with the decision-0022
  comment (headroom against runner noise; with the deferral, expected well under 200).
- **07 §2** (protected, named): the "Third-party requests outside Europe" row's parenthetical gains
  the one clarifying sentence pointing at the 225 ms lab allowance and decision 0022.
- **Decision 0022** records both halves, dated 2026-10-05; the decisions README gains its index row.
- The P4 plan's S10 note gets the resolution appended.

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-05-gtm-deferral-row-tbt.md` | CREATE | This plan and its Progress notes |
| `src/components/layout/TrackingRuntime.tsx` | MODIFY (protected, 09) | The `afterFirstPaint` trigger around `loadGtm()` |
| `tests/e2e/tracking.spec.ts` | MODIFY | Wait robustness only (polls), semantics unchanged |
| `tests/e2e/consent.spec.ts` | MODIFY (only if needed) | Same, if consent timings shift |
| `lighthouserc.cjs` | MODIFY | Row-profile TBT assertion → 225 ms, decision-0022 comment |
| `docs/ai/07-performance-budget.md` | MODIFY (protected, named) | One clarifying sentence in §2's row-profile context |
| `docs/decisions/0022-gtm-deferral-and-row-tbt-budget.md` | CREATE | Both halves of the owner's decision |
| `docs/decisions/README.md` | MODIFY | The 0022 index row |
| `docs/plans/2026-10-04-p4-data-schema-engine.md` | MODIFY | The resolution appended to the S10 note |
| `.scratch/` validation scripts | CREATE + DELETE | Local logic validation (vitest can't collect locally); deleted before finishing |

**Not touched:** `src/lib/tracking/gtm.ts`, the taxonomy, the consent code, the generated GTM
artifacts, `.github/workflows/ci.yml` (it already runs `lhci` on the branch), `lighthouserc.row.cjs`.

## Steps

1. **D1 · The deferral:** `afterFirstPaint` in `TrackingRuntime.tsx`; the poll adjustments in
   `tracking.spec.ts` → `verify:fast` + local logic validation via a `.scratch/` Node-TS-loader
   script (deleted after) + `build`; `test` and `test:e2e` run in CI (the known local quirks: the
   vitest collection failure, the port-3000 dev server).
2. **D2 · The budget:** `lighthouserc.cjs` row TBT 225 + comment; 07 §2's sentence; decision 0022 +
   the README index row; the S10 resolution → `check:rules` + `format:check` + `lint`.
3. **D3 · Verify and close:** push; watch CI (logs fetched with the stored git credential if
   needed); confirm every step green end-to-end including `lhci`; report the run and the actual
   row-profile TBT numbers.

## Gates (03 §2)

- Analytics change: `test` + `build` + `test:e2e` (tracking) — CI's run is the suite and e2e
  evidence; every gate that can run locally is run locally and its output reported.
- Budget change: `lhci` green on CI with the 225 assertion, the row-profile TBT reported.
- Docs: `check:rules`.
- Before the P4 merge: CI green on the branch head.

## Risks & mitigations

- **A late container loses a fast-bounce page view** — the 1,500 ms hard timeout and the double rAF
  bound the wait; the e2e page-view cases pin that the event still lands; GA4's session stitching
  tolerates a late `gtm.start`.
- **`requestIdleCallback` absent** (older Safari) — the `setTimeout` fallback keeps the trigger
  unconditional.
- **A hidden tab (prerender)** — `visibilityState === 'hidden'` loads at once.
- **The 225 ms becomes a licence** — it can't: 07 §1 keeps ≤ 200 ms for every page; 0022 records
  the allowance as headroom, and the deferral is expected to land runs well under 200. If CI shows
  the row TBT consistently above ~200 with the deferral in place, that's reported as a finding, not
  absorbed by the margin.
- **A racy e2e wait** — the request assertions poll for the same facts; if a poll ever flakes, the
  deferral's timing is revisited, not the assertion.
- **The other session shares this checkout** (lesson 8) — `git diff` on every shared file before
  staging; every `git add` names its files; the other session's unstaged files are never staged.

## Progress notes

- **D1+D2 done (2026-10-05).** `afterFirstPaint()` added to `TrackingRuntime.tsx` (hidden tab → at
  once; `requestIdleCallback` with a 1,500 ms timeout → double rAF; `setTimeout(0)` fallback), the
  GTM effect deferred through it with a `cancelled` guard, and the header comment's GTM bullet
  updated to name the decision. `tracking.spec.ts`'s two GTM-loader cases now poll their container
  requests (`expect.poll`) instead of reading the request list once after `networkidle` — the same
  assertions (exactly one request, nothing else third-party; the DE container loads while denied),
  robust against the container arriving after the idle window. `gtm.ts` is untouched; `gtm.test.ts`
  untouched. D2: the row-profile `'total-blocking-time'` assertion is 225 ms (median-run) in
  `lighthouserc.cjs` with the decision-0022 comment; 07 §2's third-party-outside-Europe row carries
  the one clarifying sentence; decision 0022 written with both halves and the README index row
  added; the S10 resolution appended to the P4 plan. Gates: `verify:fast` PASS (typecheck, lint,
  tokens, contrast); `check:rules` PASS (18 entry files); `format:check` PASS on all eight touched
  files; the deferral's branches validated with a `.scratch/` script — 12/12 PASS (idle path, the
  no-idle-callback fallback, the hidden tab, the cancellation guard, the 1,500 ms bound, the
  double-rAF sequence); `build` PASS (the metadataBase warning is pre-existing, from the OG-images
  work P4's open question 4 defers); the row assertion verified loaded:
  `["error",{"maxNumericValue":225,"aggregationMethod":"median-run"}]`. `test` + `test:e2e` NOT
  RUN locally (the known machine quirks: the vitest collection failure, the port-3000 dev server) —
  CI is the evidence, reported in D3.
