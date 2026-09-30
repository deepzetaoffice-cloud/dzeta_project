---
name: plan-task
description: Write an approval-ready task plan for the deepzeta website (goal served, out of scope, exhaustive allowed-files table, steps with gates, risks). Use before any non-trivial change.
argument-hint: "[what the task should achieve]"
---

Write a plan for: $ARGUMENTS

1. Read first:
   - `docs/ai/00-project-master-rules.md`
   - `docs/ai/02-anti-hallucination-and-edit-safety.md`
   - `docs/ai/04-build-sequence.md`
   - `docs/ai/conflict-register.md`
   - `docs/ai/lessons-learned.md`
   - the domain files the task touches (index in `CLAUDE.md`)
   - for visual work, also `docs/ai/13-experience-design.md` and the surface spec in `docs/design/`
2. Check the current phase in `docs/ai/04-build-sequence.md` §2. If the task belongs to a later phase or depends on an OPEN conflict/decision, say so and stop with a question.
3. Search the codebase for things to reuse; cite paths.
4. Verify every package/API against the installed version or official docs; mark anything unverified.
5. Write `docs/plans/YYYY-MM-DD-<slug>.md` using the template in `docs/ai/04-build-sequence.md` §4, `Status: DRAFT`. For visual work, fill in the page tier and the effect register (13 §10).
6. Reply with the plan path, a short summary, and open questions. **Do not start implementing.** Wait for the owner to approve.
