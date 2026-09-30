---
name: verify
description: Run the deepzeta verification gates for the current task and produce an evidence report (real command output, scope check against the plan). Use before claiming work is done, committing or opening a PR.
argument-hint: "[plan path or task type]"
---

Verify the current work. Plan or task type: $ARGUMENTS

1. Determine the required gates from the approved plan, or from `docs/ai/03-verification-gates.md` §2 for the task type.
2. Read `package.json`; any required script that doesn't exist is **NOT RUN (script not yet created)**.
3. Run each gate with `npm run <script>`, in the order of `docs/ai/03` §1. Capture the real output.
4. Run `git diff --stat`; compare with the plan's allowed-files table.
5. Output the QA report table (gate · PASS/FAIL/NOT RUN · key output lines), the scope check, and a verdict: READY or NOT READY.

Never mark a gate PASS without output. Never weaken a gate (no disables, ignores, skips or lowered budgets) to make it pass.
