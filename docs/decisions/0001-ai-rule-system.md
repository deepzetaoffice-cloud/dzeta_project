# 0001 · AI rule system

Status: ACCEPTED (owner, 2026-09-26)

## Context
The website is built mainly by AI agents. Earlier projects showed that rules which don't load automatically, aren't versioned, or exist in several drifting copies fail silently. The owner first chose Claude Code + Roo Code; Roo Code shut down on 2026-05-15.

## Decision
- `docs/ai/` is the **single source** of all AI rules, versioned in Git.
- **Claude Code** is the primary tool. `CLAUDE.md` holds the North Star and core imports; `.claude/` holds subagents, skills, hooks and permissions that enforce the rules.
- `AGENTS.md` is the tool-neutral entry file for any other AI tool. It points to `docs/ai/` and never duplicates rule text.
- Agents cannot edit the rule system (enforced by permissions and a hook); rule changes come from the owner.

## Consequences
- Only Claude Code has hard enforcement (hooks/permissions). Any other tool follows rules by prose and must go through PR review and CI gates.
- Adding a new AI tool requires a new decision record.
