# AGENTS.md: instructions for any AI coding agent

This file is the tool-neutral entry point. **Claude Code** uses `CLAUDE.md` (which enforces the same rules with hooks and permissions). Every other agent starts here. Rule text lives only in `docs/ai/`; this file never duplicates it.

## Project in one sentence

A fast, custom-coded, AI-search-ready website for **deepzeta · AI Digital Solutions** that turns UAE business owners into booked AI audits, and proves every claim it makes.

## Read in this order before any task

1. `docs/ai/00-project-master-rules.md`: North Star, non-negotiables, precedence, protected files, sources of truth
2. `docs/ai/01-ai-agent-roles.md`: your role, what you may edit, the plan → approve → implement → verify flow
3. `docs/ai/02-anti-hallucination-and-edit-safety.md`: facts, code, edit scope, scratch files, reporting
4. The domain rule files for your task (index in `CLAUDE.md` under "Read before working in an area")
5. `docs/ai/conflict-register.md` and `docs/ai/lessons-learned.md`

## Hard rules (summary; the files above are authoritative)

- **No approved plan in `docs/plans/`, no code** (except one-file trivial fixes).
- Edit **only** the files the plan allows. Read each file before editing it.
- **Never invent** facts, numbers, clients, reviews, packages, APIs, paths or env vars. Unknown → ask or omit.
- **Never edit:** `docs/ai/**`, `docs/design/*.md`, `docs/decisions/**`, `docs/facts/**`, `CLAUDE.md`, `AGENTS.md`, `.claude/**`, `Planning Folder/**`, the logo SVG, `.env*`, `package-lock.json`.
- **Never run:** force push, `git reset --hard`, `git clean`, `rm -rf`, `--no-verify`.
- Tokens not raw values; logical CSS only (RTL-ready); transform/opacity-only motion; performance budget in `docs/ai/07`.
- Work is done only when the gates in `docs/ai/03` pass **and their output is in your report**.
- Temporary files go in `.scratch/` and are deleted before you finish.
