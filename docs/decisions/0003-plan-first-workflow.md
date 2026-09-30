# 0003 · Plan-first workflow, Git and GitHub

Status: ACCEPTED (owner, 2026-09-26)

## Context
AI agents make out-of-scope edits and unverified "done" claims when they act without an agreed plan, and mistakes can't be undone cleanly without version control.

## Decision
- **Plan first, then execute:** non-trivial tasks start with a written plan in `docs/plans/` that the owner approves; small single-file fixes may proceed with a one-line plan (see `docs/ai/01` §1).
- **Git from day one, with a private GitHub repository**; `main` protected; one branch per task; PRs with CI gates (see `docs/ai/12`).

## Consequences
- Every change is reviewable and reversible.
- The GitHub repository and branch protection are set up by the owner (the GitHub CLI isn't installed on this machine yet).
