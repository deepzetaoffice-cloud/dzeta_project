---
name: plan-task
description: Write an approval-ready task plan for the deepzeta website (goal served, out of scope, exhaustive allowed-files table, steps with gates, risks). Use before any non-trivial change.
argument-hint: "[what the task should achieve]"
---

Write a plan for: $ARGUMENTS

1. Read `docs/ai/00-project-master-rules.md`, `docs/ai/02-anti-hallucination-and-edit-safety.md`, `docs/ai/04-build-sequence.md`, `docs/ai/conflict-register.md` and `docs/ai/lessons-learned.md`, plus the domain files the task touches (index in `CLAUDE.md`).
2. Check the current phase in `docs/ai/04-build-sequence.md` §2. If the task belongs to a later phase or depends on an OPEN conflict/decision, say so and stop with a question.
3. Search the codebase for things to reuse; cite paths.
4. Verify every package/API against the installed version or official docs; mark anything unverified.
5. Write `docs/plans/YYYY-MM-DD-<slug>.md` using the template in `docs/ai/04-build-sequence.md` §4, `Status: DRAFT`.
6. Reply with the plan path, a short summary, and open questions. **Do not start implementing.** Wait for the owner to approve.
