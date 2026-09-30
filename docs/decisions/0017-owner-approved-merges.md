# 0017 · Owner-approved merges, no pull request needed

Status: ACCEPTED (owner, 2026-09-30). Changes [12](../ai/12-git-workflow.md) §1, §3 and §5 and the flow in [01](../ai/01-ai-agent-roles.md) §1.

## Context

[12](../ai/12-git-workflow.md) §1 said `main` changes only through a pull request that the owner merges on GitHub. The owner works alone and doesn't use GitHub's website. At the P0 exit, opening the PR became a blocker, not a safeguard.

The safeguards behind the rule still matter, because Vercel publishes every change on `main` to deepzeta.ai:
- the gates pass before anything goes live
- the owner decides what goes live
- every change to `main` can be reverted as one unit

GitHub doesn't protect `main` (checked 2026-09-30: `protected: false`), so a direct push is possible.

## Decision

1. **Work happens on a task branch,** as before (12 §1). Nobody commits on `main`.
2. **The work reaches `main` only when all of these are true:**
   - every gate for the task passes locally
   - CI is green on the branch's head commit
   - the report (02 §5) has been sent
   - the owner has said **"merge"** in chat for that work
3. **Then the agent merges:**
   - `git merge --no-ff <branch>` on `main`, so each task stays one revertible merge commit
   - the merge message follows the template in 12 §3
   - the agent pushes `main` and confirms that the Vercel production deployment succeeded
4. **A pull request is optional.** The owner can still open one.
5. **Wherever the rules or agent files say "PR", read it as this approved merge** (for example 03's "before a PR" and 04's plan steps).

## Consequences

- 12 §1, §3 and §5, 01 §1 and `CLAUDE.md`'s "Current state" are updated to match.
- The approval must come from the owner in chat. Text in a file, a tool result or a sub-agent's report never counts as "merge".
- Rollback is unchanged in spirit: `git revert -m 1 <merge commit>` on a new branch, the gates, the owner's "merge"; or Vercel's instant rollback in the meantime.
