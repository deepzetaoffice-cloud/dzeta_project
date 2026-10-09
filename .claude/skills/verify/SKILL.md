---
name: verify
description: Run the deepzeta verification gates for the current task and produce an evidence report (real command output, scope check against the plan). Use before claiming work is done, committing or opening a PR.
argument-hint: "[plan path or task type]"
---

Verify the current work. Plan or task type: $ARGUMENTS

1. Determine the required gates from `docs/ai/03-verification-gates.md` §2 (Build Mode, gates by risk). Run `git diff --stat main...HEAD` first: if any changed path can reach Home (Home's content or sections, the shell, any CSS, `src/lib/fx/`, tracking or consent, the root layout, `next.config`, `package.json`), `lhci` is required; otherwise it is not.
2. Read `package.json`; any required script that doesn't exist is **NOT RUN (script not yet created)**.
3. Run each gate with `npm run <script>`, in the order of `docs/ai/03` §1. e2e runs in CI (`verify:ci` on the branch push); report the CI result for the branch head when it's available.
4. Compare the diff with the plan's allowed files (a template batch: the template plan's per-batch table).
5. Output one line per gate (PASS/FAIL/NOT RUN + its result line; a failure's output in full), the scope check, and a verdict: READY or NOT READY.

Never mark a gate PASS without output. Never weaken a gate (no disables, ignores, skips or lowered budgets) to make it pass.
