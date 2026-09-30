# 0020 · The performance exception limit: Performance 86, LCP a little over 2.5 s

Status: ACCEPTED (owner, 2026-10-01: the option chosen in chat during P2 step 2, then "OK 0020" for its rule edits). Accepted together with those edits (lesson 5): conflict entry C43 and one line in [07](../ai/07-performance-budget.md) §5.

(0019 is reserved for the P2 layout-shell record, named in the P2 plan.)

## Context

- **The rules:** [07](../ai/07-performance-budget.md) §1 makes LCP ≤ 2.5 s a hard limit that is never crossed. [Decision 0005](0005-performance-tiers.md) sets the Lighthouse mobile Performance floors: T1 (Home) ≥ 95, T2 ≥ 90, T3 ≥ 70. `lhci` asserts them on every run, and 07 §5 lets the owner approve an exception, recorded in the conflict register.
- **The measurements:** Home's local lab LCP is 2333 ms, 167 ms under the limit (the P2 baseline, 2026-10-01). CI's medians have been lower (1745–1957 ms, P1). Every KB added before the first paint moves the lab LCP towards the limit (0014, 0015).
- **The owner's instruction (2026-10-01):** "a small difference from 2.5 s limit to little higher is ok. at least minimum we need 86+ performance score. that's our minimum goal."
- It ranks above the rule files ([00](../ai/00-project-master-rules.md) §3), but it conflicts with 07 §1 and 0005, so the conflict is recorded rather than settled silently.

## Decision

**The owner's figures are an exception limit, not new gates.**

1. **The gates stay as they are:** T1 ≥ 95, T2 ≥ 90, T3 ≥ 70, LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, in `lhci` and in 07. A change that fails them still stops, with the numbers, as the plans say today.
2. **When a gate stops a change, the owner may accept the result as an exception** (07 §5), recorded in the conflict register with the measured numbers, **within this limit:**
   - Performance never below **86** on a T1 or T2 page
   - LCP only **a little over 2.5 s**, decided case by case from the measured numbers
3. **Beyond the limit, the change is reworked, not excepted.**
4. **T3 keeps its own floor (70)**, from 0005 and [0011](0011-content-pages-t2.md): the 86 applies to T1 and T2 pages.
5. **It applies to the lab gates** (`lhci` locally and on CI). Field data (PageSpeed Insights, CrUX after launch) is reported to the owner as it is.

## Consequences

- **Rule edits, applied with the owner's OK** (protected files, 00 §5):
  - [conflict-register.md](../ai/conflict-register.md), appended: **C43** · the owner's instruction against 07 §1 and 0005 · resolved by this decision.
  - [07](../ai/07-performance-budget.md) §5, one line added: "The owner's exception limit ([decision 0020](../decisions/0020-performance-exception-limit.md)): an exception never takes a T1 or T2 page below Performance 86, and LCP only a little over 2.5 s. Beyond that, the change is reworked, not excepted."
- **No code changes:** `lighthouserc.cjs` keeps its assertions. An accepted exception is recorded in the conflict register; changing an assertion needs the plan that ships it to name it.
- **The speed claim stays proven by default,** because every page still has to pass the gates unless the owner accepts a named exception.

## Alternatives considered

- **Lower the gates now** (Home's floor 86, the LCP limit a little above 2.5 s): not chosen. Results over the current limits would pass silently.
- **Decide later** (keep the gates, record the statement as an open conflict): not chosen. The owner gave the limit now.
