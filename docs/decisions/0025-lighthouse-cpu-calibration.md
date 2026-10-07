# 0025 · Lighthouse's CPU slowdown calibrated to each machine

Status: ACCEPTED (owner, 2026-10-07: the P6 part A plan's Q1 "yes", then the reference "4,000: your PC")

(The P6 part A plan named this record 0024. That number was taken by another session's PROPOSED conversion-CTA record, so this one is 0025.)

## Context

- **The noise.** On identical code (the P5 branch and its follow-up, 2026-10-06/07), CI's runners measured benchmarkIndex from 2,408 to 4,443. Lighthouse in simulate mode multiplies every observed CPU task by `cpuSlowdownMultiplier` (default 4). So the same page read slower on a slow runner:
  - Home's TBT, Europe: 24 ms (benchmarkIndex 4,039), 49 (2,917), 109 (2,796), 117 (2,451), 126 (2,408).
  - Home's TBT, the UAE campaign profile: 84 ms (4,443), 160 (3,082), 213 (2,725), 274 (2,451), 263 (2,450). Performance fell to 91 on the slow runners, under 0023's floor of 0.93.
- **LCP doesn't follow the runner.** Home's median LCP ran 2,651–2,761 ms in no order of benchmarkIndex, and single runs jump between about 2.1 and 2.7 s. Calibration can't remove that; it gets margin from Home's lighter bytes (the P6 part A plan, S2–S5).
- **LCP does carry some CPU time.** Measured locally (benchmarkIndex ~3,900, 3 runs each): Home's LCP median 2,604 ms at 2.5×, 2,712 at 4×, 2,741 at 5.6×.
- **Lighthouse's guidance** (`docs/throttling.md` at v12.6.1): calibrate the multiplier when the host's benchmarkIndex differs from the expected range; 2–10 is the documented range.

## Decision

- `npm run lhci` runs `scripts/lhci-run.mjs`.
  1. It measures the machine's benchmarkIndex: one 3-run collect of Home, the median.
  2. It sets **multiplier = 4 × benchmarkIndex ÷ 4,000**, clamped to 2–8 and rounded to 2 decimals.
  3. It runs the unchanged chain (both region profiles, assert, upload, the page-weight gate), with `DZ_LHCI_CPU_MULTIPLIER` read by both lhci configs.
- **The reference is 4,000**, the owner's choice: the owner's machine (~3,900) and CI's fast runners (~4,000–4,400), where every current allowance was measured. Those machines keep about 4×, and slower runners get a lighter slowdown so they read like them.
  - The CI median (2,774) was weighed. It would give fast machines 5.6× and put Home's LCP 9 ms under C63's 2,750 ms.
- **No threshold changes.** Every LCP, TBT, Performance and page-weight limit and allowance stands.
- A `DZ_LHCI_CPU_MULTIPLIER` already set in the environment skips the calibration (a fixed value for experiments). CI prints the calibration as an annotation, and each run's multiplier in its Lighthouse line.

## Consequences

- **Steadier verdicts.** TBT and Performance verdicts no longer depend on which runner CI gets. LCP's run-to-run spread stays: it doesn't come from CPU speed.
- **Cost.** Every `lhci` run costs one extra 3-run collect.
- **Rules.** 07 §1's test conditions and 03 §1's lhci row name the calibration.
- **A future reference change** is the owner's, like a threshold change, because it moves every lab number.
