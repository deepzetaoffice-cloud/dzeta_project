# 0007 · Roo Code as a second implementer

Status: PROPOSED

## Context
The owner builds the site in VS Code with two AI tools: Claude Code (primary, see [0001](0001-ai-rule-system.md)) and Roo Code. Planning and design discussion also happen in the Claude desktop app, which writes plans and decisions to this repo.

`docs/ai/01` §4 says any new tool is added by decision record. Roo Code has none yet. Only Claude Code enforces the rules with hooks and permissions; Roo Code follows them only if it loads them, so it needs its own guardrails.

Verified Roo Code behaviour (docs, 2026-09-27):
- Roo loads `AGENTS.md` from the workspace root by default. VS Code setting: `roo-cline.useAgentRules` (default `true`).
- Project custom modes live in `.roomodes` at the project root. An `edit` group with `fileRegex` blocks edits to any file that doesn't match (`FileRestrictionError`).

## Decision

### 1. Role
Roo Code acts **only as Implementer** (`docs/ai/01` §2). It builds plans that the owner has approved in `docs/plans/`. It does not plan, review, verify or write decisions.

### 2. Allowed
- Read any file in the repo.
- Edit only the files listed in the approved plan's allowed-files table, inside these folders: `src/`, `tests/`, `scripts/`, `public/`, `.scratch/`, plus root config files when the plan lists them (`package.json`, `tsconfig.json`, `next.config.*`, `postcss.config.*`, `eslint.config.*`, `playwright.config.*`, `vitest.config.*`, `.env.example`).
- Run read-only and gate commands: `npm run …` scripts from `docs/ai/03`, `git status`, `git diff`, `git log`.

### 3. Not allowed
- Editing `docs/**` (including plans and decisions), `CLAUDE.md`, `AGENTS.md`, `.claude/**`, `.roomodes`, `Planning Folder/**`, the logo SVG, `.env*` (except `.env.example`), `package-lock.json`.
- Editing the tracking core (`src/lib/analytics.ts`) or schema core (`src/lib/schema/**`) unless the plan names them and the owner switches mode deliberately.
- Commits, pushes, branch changes, merges. The owner or Claude Code does these.
- Installing packages not listed in the plan.
- Destructive commands: `rm -rf`, `git reset --hard`, `git clean`, `git push --force`, `--no-verify`.
- Claiming "done". Work is done only after Claude Code runs `/verify` and the reviewer passes it.

### 4. Working rules
- **One writer at a time.** Roo Code and Claude Code never edit the repo in the same period. Commit (or stash) before switching tools.
- Always use the **deepzeta Implementer** mode below, never the built-in Code mode.
- Keep auto-approve **off** for commands and for writes outside `src/`.
- Roo Code finishes with the report format in `docs/ai/02` §5, marking every gate it didn't run as NOT RUN.

### 5. Enforcement: `.roomodes` (to be created by the owner, or by Claude Code after approval)

```yaml
customModes:
  - slug: deepzeta-implementer
    name: deepzeta Implementer
    roleDefinition: >-
      You are the Implementer for the deepzeta website. You execute an approved plan
      from docs/plans/ exactly, one step at a time. You never plan, never edit rules,
      and never invent facts, packages, APIs, paths or env vars.
    whenToUse: Building an approved plan from docs/plans/ for the deepzeta website.
    customInstructions: >-
      Before any edit: read AGENTS.md, docs/ai/00, 01, 02 and the domain files the plan
      lists, then the approved plan. If there is no approved plan for the task, stop and
      ask. Edit only the plan's allowed files. Do not commit, push or change branches.
      Never run rm -rf, git reset --hard, git clean, git push --force or --no-verify.
      End with the report format in docs/ai/02 section 5; mark gates you did not run as
      NOT RUN.
    groups:
      - read
      - - edit
        - fileRegex: ^(?!src[\\/]lib[\\/](analytics\.ts|schema[\\/]))((src|tests|scripts|public|\.scratch)[\\/].+|package\.json|tsconfig\.json|next\.config\.(ts|mjs|js)|postcss\.config\.(mjs|js)|eslint\.config\.(mjs|js)|playwright\.config\.ts|vitest\.config\.ts|\.env\.example)$
          description: deepzeta implementer scope (no docs, rules, logo, env or lockfile)
      - command
```

**First-use check:** in this mode, ask Roo to add a blank line to `CLAUDE.md`. It must be refused with a file restriction error. If it isn't, the regex path format differs on this machine and must be fixed before real work.

### 6. Rule files to update after acceptance (protected: owner applies)
- `docs/ai/01-ai-agent-roles.md` §4: add a row "Roo Code: Implementer only, mode `deepzeta-implementer` (see 0007)".
- `AGENTS.md`: add one line: "Roo Code: use the `deepzeta-implementer` mode; see `docs/decisions/0007`".
- `docs/decisions/README.md`: add 0007 to the index.

## Consequences
- Roo Code can't touch rules, docs, the logo, env files or the lockfile, even by mistake.
- Commands are not restricted by `fileRegex`; the command limits depend on keeping auto-approve off and on the mode's instructions.
- All verification still runs through Claude Code (`/verify`, reviewer), so Claude Code stays required.
- If Roo Code changes how it loads rules or modes, re-check this record against its docs.
