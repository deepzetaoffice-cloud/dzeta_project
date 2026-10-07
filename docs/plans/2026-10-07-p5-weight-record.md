# Plan: Correct Home's production page-weight record (C65), and the lint ignore for worktrees

Status: APPROVED (owner, in chat, 2026-10-07: "yes, option 1", which also approves the ESLint ignore)
Phase: P5 follow-up (before P6)
Branch: `fix/p5-weight-record` (from `main` at `dc31d2b`, the P5 merge)

## Goal served

00 §1: the site "proves every claim it makes". The P5 records say production delivers Home at about 179 KB, under the 190,868 B hard limit (07 §2). Measured on production after the merge, it is 198,396 B. The record must say what is true.

## What happened

C64 used a local Brotli estimate (quality 5 on every file) for what production serves. Production's real transfer, measured on www.deepzeta.ai on 2026-10-07 with `curl -H "Accept-Encoding: br"` (headers included):

| Response | Headers | Body | Total |
|---|---|---|---|
| Document | 1,748 | 26,929 | 28,677 |
| CSS (1) | 634 | 15,779 | 16,413 |
| JS (7) | 4,553 | 148,753 | 153,306 |
| **First load** | | | **198,396 B** |

- **HTML:** Vercel's Brotli does shrink it (26.9 KB against 35.7 KB with gzip in the lab).
- **CSS and JS:** Vercel's Brotli is no smaller than gzip for these.
- **Headers:** production's response headers are larger than the local ones.
- **Result:** Home is **7,528 B over** the hard limit for real visitors, and under its 204,800 B lab allowance.

## The owner's decision (option 1)

Correct the record and keep the exception for now. P6 brings Home's real transfer back under 190,868 B before launch. The levers: the CSS architecture (the inline-CSS measurement task is running), the FAQPage schema sent once, and anything else P6's plan finds.

## Out of scope

Any change to Home's code or the lab gates. Slimming is P6's.

## Allowed files

| Path | Action | Purpose |
|---|---|---|
| `docs/plans/2026-10-07-p5-weight-record.md` | CREATE | This plan |
| `docs/ai/conflict-register.md` | APPEND-ONLY (protected, owner-approved) | C65: the measured production weight, superseding C64's estimate |
| `lighthouserc.cjs` | MODIFY | The `HOME_FIRST_LOAD_LIMIT` comment's production figure (comment only) |
| `CLAUDE.md` | MODIFY (protected, owner-approved) | The P5 state line's production figure, and P6's slimming duty |
| `docs/owner/pre-launch-register.md` | MODIFY | The production row's figure, and a change-log row |
| `docs/plans/2026-10-06-p5-homepage.md` | MODIFY | One correction line in its Progress notes |
| `eslint.config.mjs` | MODIFY | Ignore `.claude/worktrees/**`: another session's worktree build output failed `verify:fast` here |
| `scripts/check-rules.mjs` | MODIFY | The same cause: its walk of `.claude/` descended into the worktree (a full checkout with `node_modules`) and failed `check:rules`. It now skips `.claude/worktrees` |

## Gates

`verify:fast`, `format:check`, `check:rules`, `check:facts`, `test`; CI green on the branch head; merge on the owner's "merge".
