# 02 · Anti-Hallucination & Edit Safety

> **Applies to:** every agent, every task · **Precedence:** below 00 and 01 · **Last reviewed:** 2026-09-26

These rules exist because AI agents make five kinds of mistakes: **invented facts, invented code, edits outside scope, unverified "done" claims, and loss of focus.** Each section blocks one of them.

---

## 1. Facts: never invent

1. Business facts come **only** from [docs/facts/company-facts.md](../facts/company-facts.md), the Services Catalogue or the blueprint. If a fact isn't there, **ask** or **leave it out**.
2. **Never invent:** statistics, percentages, client names, logos, testimonials, reviews, ratings, awards, certifications, partner badges, founding dates, team sizes, prices, delivery times, or "results".
3. **Placeholders must look fake.** Use `[[TODO: real figure from owner]]`, never a plausible number. The `check:facts` gate fails if a `[[TODO` reaches a production build.
4. **Structured data:** if a real value is missing, **omit the property**. Never fill it with a placeholder or a guess.
5. **Dates** (`datePublished`, `dateModified`, "last reviewed") change only when content really changed or was really reviewed. Never use the build time.
6. **External facts** (laws, platform rules, deadlines such as UAE e-invoicing dates) must cite an official source and be re-checked before publishing.
7. Case studies and numbers need the owner's written confirmation that they are real and publishable.

---

## 2. Code: never invent

1. **Before using a package:** confirm it is in `package.json`. If it isn't, it needs an approved plan that adds it (see [06](06-code-standards.md) §5).
2. **Before using an API** (Next.js, React, Tailwind v4, next-intl, any library): check the **installed version** (`package.json`, `node_modules/<pkg>/package.json`) and use the docs **for that version**. Never write version-sensitive code from memory. Examples of things that changed across versions: Next.js `params` being async, Tailwind v4 `@theme` instead of `tailwind.config.js`, `next lint` deprecation, metadata APIs.
3. **Never invent** file paths, import paths, component names, props, environment variables, npm scripts, CSS tokens or schema types. Confirm each with a search (`Grep`/`Glob`) or by reading the file.
4. **If documentation and memory disagree, documentation wins.** If you can't verify something, say "not verified" in the report.
5. **Environment variables** must be declared in `.env.example` and validated at startup (planned `src/lib/env.ts`). Never read an undeclared variable.

---

## 3. Edits: stay in scope

**Before editing**
1. **Read the whole file** (or the relevant section of a large file) before editing it.
2. **Search every reference** before renaming, moving or deleting anything, and list them in the plan.
3. Confirm the file is in the plan's **allowed-files** table. If it isn't: stop and ask.

**While editing**
4. **Smallest correct change.** No drive-by refactors, renames, reformatting, reordering imports or "improvements" outside the task.
5. **Never delete** files, routes, exports or content without explicit approval in the plan.
6. **Never touch** protected files (see [00](00-project-master-rules.md) §5), lockfiles or `.env*`.
7. **APPEND-ONLY** files (taxonomy tables, registries, content lists) may only get new entries. Existing entries never change without a plan that names them.
8. **Sitewide output is mounted once:** schema `#organization`/`#website`, analytics init, page-view tracker, consent banner and floating widgets live in the **root layout only**, never also in nested layouts.

**After editing**
9. Run `git diff --stat`. The file list must match the plan exactly. Any extra file means revert it or explain it.
10. Re-read the changed lines to confirm the edit landed as intended (edits can silently fail or duplicate).
11. Run the fast gate (see [03](03-verification-gates.md)).

---

## 4. Scratch files and shell safety

1. Temporary files, test scripts and dumps live **only** in `.scratch/` (gitignored). Delete them before the task ends.
2. Never create files in the project root unless the plan lists them.
3. **Windows:** don't pass multi-line code through nested shell quotes (it creates junk files named after code fragments). Write a script file in `.scratch/`, run it, then delete it.
4. **Never run destructive commands:** `rm -rf`, `git reset --hard`, `git clean -fd`, `git push --force`, `git checkout -- .`. If one seems needed, stop and ask.

---

## 5. Honesty in reports

Every task ends with this report:

```
## Report
Goal served: <North Star phrase>
Done: <bullet list of changes, each with path>
Verified: <gate> → PASS/FAIL (paste key output lines)
Not run / skipped: <gate> — <reason>
Assumptions: <list, or "none">
Open questions / proposed rule changes: <list, or "none">
```

- "I don't know" and "not verified" are always acceptable. **Guessing is not.**
- Never write "should work", "probably fine" or "tested" without output.
- If a gate fails, say so plainly, with the output. Don't hide or soften it.

---

## 6. Focus: keep the North Star

1. Every plan opens with the **goal served** (from [00](00-project-master-rules.md) §1) and an **out of scope** list.
2. If a request drifts from the North Star (e.g. heavy effects that break the performance budget, generic template sections, unverifiable claims), **point out the conflict** before doing it.
3. Don't add features, sections, pages, animations or dependencies nobody asked for.
4. When a mistake happens, the fix includes a proposed entry in [lessons-learned.md](lessons-learned.md), so the same mistake gets a rule or a gate.
