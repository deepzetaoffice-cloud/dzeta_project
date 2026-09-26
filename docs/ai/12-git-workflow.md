# 12 · Git Workflow

> **Applies to:** every change committed to the repository · **Precedence:** below 00 · **Last reviewed:** 2026-09-26

---

## 1. Branches

- `main` is **protected**: production, deployed by Vercel. Merges only via pull request with all CI checks green. Nobody (human or AI) pushes to `main` directly.
- One branch per task, named `<type>/<short-slug>` (e.g. `feat/header-mega-menu`, `fix/cls-hero`, `content/service-whatsapp-agent`, `chore/p0-tooling`).
- Types: `feat`, `fix`, `perf`, `content`, `seo`, `style`, `refactor`, `test`, `docs`, `chore`.

## 2. Commits

- **Conventional Commits:** `<type>(<scope>): <summary>` in imperative mood, ≤ 72 characters, e.g. `feat(header): add keyboard-accessible mega menu`.
- **Commit only after the task's gates pass** (see [03](03-verification-gates.md)). The body lists the gates run.
- Small, focused commits: one logical change each. Never mix unrelated changes.
- AI-made commits include the attribution line required by the tool's current instructions.
- **Agents commit only when the owner has asked for commits in the current task** (the approved plan may grant this for its own branch).

## 3. Pull requests

PR description template:

```markdown
## What & why
<summary; link to docs/plans/... >

## Goal served
<North Star phrase>

## Files changed
<must match the plan's allowed files>

## Gates
<gate → result, with key output>

## Screenshots / Lighthouse (for UI changes)

## Risks / follow-ups
```

## 4. Forbidden without explicit owner approval in the current request

`git push --force` (any form), `git reset --hard`, `git clean`, `git rebase` on shared branches, `git checkout -- <path>` / `git restore` over uncommitted work, deleting branches, rewriting history, amending pushed commits, skipping hooks (`--no-verify`).

## 5. Rollback

1. Every merge to `main` is a single, revertible PR merge.
2. To roll back production: `git revert <merge-commit>` on a new branch → PR → merge (or use Vercel's instant rollback while the revert PR is prepared).
3. Large feature sets (e.g. Arabic) ship behind their own PR so they can be reverted as one unit.
4. Record what happened in [lessons-learned.md](lessons-learned.md).

## 6. Never commit

`.env*` (except `.env.example`), secrets, `node_modules/`, build output, `.scratch/`, large binaries that belong in asset storage, personal settings (`.claude/settings.local.json`).
