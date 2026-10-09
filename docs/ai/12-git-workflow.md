# 12 · Git Workflow

> **Applies to:** every change committed to the repository · **Precedence:** below 00 · **Last reviewed:** 2026-10-09 (Build Mode, decision 0029)

---

## 1. Branches

- `main` is **production**: Vercel publishes every change on it to deepzeta.ai. Nobody (human or AI) commits on `main`. Work reaches it only as the merge of a task branch ([decision 0017](../decisions/0017-owner-approved-merges.md)), when all of these are true:
  - the branch's gates pass ([03](03-verification-gates.md) §2, gates by risk: the local static gates, and `lhci` when the change can reach Home)
  - CI is green on the branch's head commit
  - the short report (02 §5) has been sent
  - the owner has said **"merge"** in chat for that work (one "merge" per batch, decision 0029)

  Then the agent runs `git merge --no-ff <branch>` on `main`, pushes, and confirms the Vercel production deployment. A pull request is optional, and wherever the rules say "PR", read it as this approved merge.
- One branch per task, named `<type>/<short-slug>` (e.g. `feat/header-mega-menu`, `fix/cls-hero`, `content/service-whatsapp-agent`, `chore/p0-tooling`).
- Types: `feat`, `fix`, `perf`, `content`, `seo`, `style`, `refactor`, `test`, `docs`, `chore`.

## 2. Commits

- **Conventional Commits:** `<type>(<scope>): <summary>` in imperative mood, ≤ 72 characters, e.g. `feat(header): add keyboard-accessible mega menu`.
- **Commit only after `verify:fast` passes** (see [03](03-verification-gates.md) §2); the merge commit lists the branch's gates.
- Small, focused commits: one logical change each. Never mix unrelated changes.
- AI-made commits include the attribution line required by the tool's current instructions.
- **Agents commit only when the owner has asked for commits in the current task** (the approved plan may grant this for its own branch).

## 3. Merge message (and optional pull requests)

The merge commit's message (or a PR's description, if the owner opens one) follows this template:

```markdown
Merge branch '<branch>'

<what shipped, one or two lines; the plan's path>
Gates: <gate → result, one line each; Home's lhci when it ran>
```

## 4. Forbidden without explicit owner approval in the current request

`git push --force` (any form), `git reset --hard`, `git clean`, `git rebase` on shared branches, `git checkout -- <path>` / `git restore` over uncommitted work, deleting branches, rewriting history, amending pushed commits, skipping hooks (`--no-verify`).

## 5. Rollback

1. Every merge to `main` is a single, revertible merge commit.
2. To roll back production: `git revert -m 1 <merge-commit>` on a new branch → gates → the owner's "merge" (or use Vercel's instant rollback while the revert is prepared).
3. Large feature sets (e.g. Arabic) ship as their own merge so they can be reverted as one unit.
4. Record what happened in [lessons-learned.md](lessons-learned.md).

## 6. Never commit

`.env*` (except `.env.example`), secrets, `node_modules/`, build output, `.scratch/`, large binaries that belong in asset storage, personal settings (`.claude/settings.local.json`).
