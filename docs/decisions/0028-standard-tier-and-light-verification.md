# 0028 · The standard page tier: 70 for every page except Home, and light verification

Status: ACCEPTED (owner, 2026-10-08, with docs/plans/2026-10-08-standard-tier-and-light-verification.md)

## Context

- Decisions 0005 and 0011 set the non-Home floors at Lighthouse Performance ≥ 90 (T2: every money
  and content page) with the Core Web Vitals hard limits asserted in the lab on every page. C69
  (2026-10-08) had just granted T2 a 2,750 ms lab LCP allowance because every page with the shell
  sits on the lab's ~2,570 ms LCP floor.
- The first two standard pages (the services hub, the Speed-to-Lead pilot) measure Performance
  0.96–0.97, TBT ≤ 30 ms, CLS 0. The gates were fighting lab noise, not real slowness.
- The owner (2026-10-08): Home stays the high-performance page; every other page needs only "a
  normal 70+ performance score in the PageSpeed test"; building must get faster by avoiding
  unnecessary verifications and considerations — without affecting quality, technical SEO or GEO.
- Why that is safe: every page is the same shell + static content; Home — under the full strict
  regime (both profiles, calibration, page weight, the JS caps) — is the canary for the shell, and
  the review page carries the complete shell. The SEO/build gates (schema, seo, links, facts,
  unit, build, e2e incl. axe) run per batch unchanged.

## Decision

1. **Floors.** T1 Home ≥ 95 (unchanged). Every other page — the T2 and T3 lists of 0005/0011,
   whose motion toolkits are unchanged — has the **standard floor: Lighthouse Performance ≥ 0.70**
   (mobile, lab).
2. **Asserted in the lab on every measured page:** CLS ≤ 0.1; Accessibility, Best Practices and
   SEO ≥ 0.95; TTFB; the third-party, font and image caps.
3. **LCP, INP and TBT:** hard limits for real visitors (field data: PSI and CrUX on production,
   the pre-launch register rows). In the lab they are asserted on Home and the review page only.
4. **The lhci standing sample is Home and the review page.** A new template joins for its own
   plan's exit run; a batch of template copies adds one page (`DZ_LHCI_PAGES`) as its spot-check;
   both leave the sample again. The services hub and the pilot leave the standing sample at this
   decision's merge.
5. **Page weight and the JavaScript budgets (07 §2):** asserted on Home and the review page. A
   standard page's bytes are printed by its spot-check and recorded in the batch report, not
   gated; a plan that adds client code to a standard page still states its measured size, and
   Home's caps guard the shared shell and runtime.
6. **Process.** `verify:fast` at each commit and at the task's exit (not after every step);
   branch-push CI runs `verify:ci` (everything but `lhci`), pull requests and manual runs the
   full `verify`; pages built from a proven template ship under standing plans (the first: the
   service pages), batch by batch, with 03 §2's batch gates — no per-page planning session.
7. **Exceptions (0020).** The "never below 86" line stands for Home. Standard pages have no
   exceptions below 70: the change is reworked.

## Consequences

- Supersedes the non-Home floors of 0005 and 0011, and 0020's 86 line for non-Home pages. C69's
  2,750 ms lab allowance remains A2's recorded evidence; later pages assert no lab LCP.
- Rule edits applied with this decision: 03 §1 (the lhci row's sample), §2 (the matrix rows),
  §5 (CI); 07 §1 (the floor row and the tiers note), §2 (where the caps are asserted), §5 (the
  regression rule's scope). C71 records the conflict.
- The speed claim stays proven: Home's numbers are the proof, every batch reports its measured
  scores, and the field-data checks cover real visitors on every page.
