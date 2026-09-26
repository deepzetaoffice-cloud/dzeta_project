# Lessons Learned

> **Applies to:** every agent (read before planning) · **Precedence:** informs rule changes; not itself a rule · **Last reviewed:** 2026-09-26

Every AI mistake gets an entry, and every entry ends in a **prevention**: a new rule line, a new gate or a new test. Agents propose entries in their task report; the owner adds them.

| # | Date | What went wrong | Root cause | Prevention (rule / gate / test) |
|---|---|---|---|---|

## Imported lessons (from earlier projects, technical only)

| # | Lesson | Prevention in this project |
|---|---|---|
| L1 | Rule files were gitignored or placed where the tool didn't load them, so they silently didn't apply. | Rules live in `docs/ai/` (versioned); `CLAUDE.md`/`AGENTS.md` point to them; `check:rules` gate. |
| L2 | Several files each claimed to be "the source of truth", and copies drifted. | One source per topic ([00](00-project-master-rules.md) §4); no duplicated rule text; conflict register. |
| L3 | Rule text went stale (Tailwind v3 config advice in a v4 project; FID instead of INP; retired rich results still recommended). | "Verify version-sensitive APIs against installed docs" ([02](02-anti-hallucination-and-edit-safety.md) §2); each rule file has a last-reviewed date. |
| L4 | Checks existed only as prose (no typecheck script, broken lint config). | Every check is an npm script run in CI ([03](03-verification-gates.md)). |
| L5 | Sitewide schema and trackers mounted in nested layouts → duplicate `@id`s and double `page_view`. | "Sitewide output mounted once" ([02](02-anti-hallucination-and-edit-safety.md) §3.8); `check:schema` counts sitewide nodes. |
| L6 | GTM was idle-deferred for speed → analytics data lost. | GTM never idle-deferred ([09](09-analytics-tracking.md) §2); tracking e2e test. |
| L7 | Robots AI-bot tiers were overwritten by accident. | `robots.ts` protected; edits need a plan naming it ([08](08-seo-geo-aeo-schema.md) §5). |
| L8 | Build time leaked into `dateModified`. | Deterministic dates from content metadata ([08](08-seo-geo-aeo-schema.md) §3.5). |
| L9 | Shell-quoting accidents on Windows created junk files in the repo root. | Scratch files only in `.scratch/`; multi-line commands via script files ([02](02-anti-hallucination-and-edit-safety.md) §4). |
| L10 | Automated content published without a fact check or a build step. | Fact gate + build + owner review before publishing; pSEO only after launch with per-batch gates. |
| L11 | A subagent reported confident but wrong configuration syntax (2026-09-26, during pre-build). | Verify tool/config syntax against official docs before writing config; never trust a single unverified report. |
