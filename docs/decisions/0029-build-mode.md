# 0029 · Build Mode: build fast, test what matters

Status: ACCEPTED (owner, 2026-10-09: "apply build mode")

## Context

- After P0–P6 part A2, 3 of the 100 V1 URLs are live (`/`, `/services`, `/services/speed-to-lead-system`).
- The repository holds 76,711 lines of docs against 14,024 lines of source, and `main` has 80 `docs` commits against 59 `feat` commits.
- The time went to process: a plan and an approval per task, a decision and a conflict entry for every lab number, the full `verify` (185 e2e tests + Lighthouse) before each merge, and about five record files touched per change.
- 57 of the 97 remaining pages are service pages on the template the pilot already proved. Most of what is left is data, not design.
- The owner (2026-10-09): our own rules slowed the build; focus on building. Performance is non-negotiable on **Home only** ("we already achieved" it). **Design and SEO/GEO are non-negotiable.**

## Decision

**1. What never relaxes**

- **Home's performance.** The whole of [07](../ai/07-performance-budget.md) applies to Home: T1 ≥ 95, both region profiles, page weight, the JS caps and the regression rule, all asserted by `lhci` on Home and the review page.
- **Design.**
  - Tokens, logical CSS, effects only by ID ([13](../ai/13-experience-design.md)), the surface specs in `docs/design/`, and the icon rules.
  - Contrast (`check:contrast`), axe in e2e, and reduced motion.
  - The owner reviews every new template on the preview.
- **SEO/GEO.**
  - `check:schema`, `check:seo`, `check:links` and `check:facts` run on every batch.
  - Every page follows its URL-registry row and its blueprint in the engine.
  - No invented facts (N3).

**2. Plans: one per template or one-off build, not one per task**

- A **template plan** covers the pilot and every page built from it. The owner approves it once and reviews the pilot on the preview. The other pages then ship in batches of up to **10**, with no further plans.
- **Unique builds** (a new template, a demo, a tool, a shell change) get a **short plan**: goal, allowed files, steps, effect register (visual work only), open questions.
- **No written plan** is needed for:
  - a fix or change touching up to 3 files, with no dependency added and no protected file changed (except registry rows for pages being shipped);
  - a batch under an approved template plan.

  The agent states a one-line plan first.

**3. Gates by risk** (the new [03](../ai/03-verification-gates.md) §2)

- **Every commit:** `verify:fast`.
- **Every branch, before the owner's "merge":**
  - Locally: `build`, `check:schema`, `check:seo`, `check:links` and `check:facts`. All are static and fast.
  - CI: `verify:ci` on the branch push (everything but `lhci`, e2e and axe included). It runs while the next batch is being built.
- **`lhci` (Home and the review page) runs only when a change can reach Home.** That means Home's content or sections, the shell, any CSS (one shared stylesheet, decision 0026), `src/lib/fx/`, tracking or consent, the root layout, `next.config`, or dependencies.
- **Non-Home pages have no lab performance gate.** No spot-check, no new-template `lhci` run.
  - They are fast by construction: the same shell as Home, server-rendered, and no client JS unless a plan budgets it.
  - 70 is their target in PageSpeed Insights on production, checked before launch (the pre-launch register).
- **Auditor subagents** (SEO/GEO, performance and accessibility) run once per new template, not per batch. The Reviewer runs on request. Every branch still gets the `git diff --stat` scope check.

**4. Records: only what changes a decision**

- **Decision records:** only for business, architecture or rule choices. Never for lab measurements.
- **Conflict register:** only for a real disagreement between sources that changes a rule.
- **Lessons learned:** only for a mistake that could repeat.
- **Plan progress notes:** one line per batch.
- **CLAUDE.md "Current state":** short (phase, what is live, what is next, open owner items). History lives in git, the plans and the decisions.
- **Reports:** short ([02](../ai/02-anti-hallucination-and-edit-safety.md) §5): shipped, preview, gates (one line each, with the failing output in full), needs the owner.

**5. Flow**

- Phases may overlap when they don't depend on each other. For example: P6 pages, P7 demos and P8 resources in parallel tracks, each in its own worktree.
- P9 (the GEO layer) and P10 (launch readiness) still close the build.
- The owner's "merge" (decision 0017) stays: one per batch, after CI is green and the short report is sent.

## Consequences

- **Supersedes** 0028 §1 (the 70 floor asserted in the lab), §4 (the per-template and per-batch `lhci` runs), §5 (a standard page's bytes printed by its spot-check) and §6 (batches of 6). 0028's other points stand.
- **Narrows** 0003's plan-first rule to the scope above.
- **Rule edits applied with this decision:**
  - [00](../ai/00-project-master-rules.md): N4, N6
  - [01](../ai/01-ai-agent-roles.md): §1 shortcut, §2 Reviewer and auditors
  - [02](../ai/02-anti-hallucination-and-edit-safety.md): §5
  - [03](../ai/03-verification-gates.md): §1 lhci row, §2, §5
  - [04](../ai/04-build-sequence.md): §1, §2, §4
  - [07](../ai/07-performance-budget.md): §1 floor row and tiers note, §2 where asserted, §5
  - [12](../ai/12-git-workflow.md): §1–§3
  - `CLAUDE.md`, `AGENTS.md`, the `plan-task`, `verify` and `new-page` skills, and the architect agent
  - The service-pages standing plan (batches of 10, the new gates)
- **The speed claim stays proven:** Home is measured strictly on every change that can reach it, and real-visitor data on production remains the judge for every page.
- **Risk:** a non-Home page could regress without a lab gate. It is contained because every page shares Home's shell and runtime, which Home's `lhci` guards. A new template's client JavaScript still needs its own short plan with its measured size.
