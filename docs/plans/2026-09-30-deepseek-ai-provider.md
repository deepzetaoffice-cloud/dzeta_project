# Plan: switch the site's AI provider from Anthropic (Claude) to DeepSeek
Status: APPROVED (owner, 2026-09-30; scope "everywhere it's named", pSEO drafting included)
Phase: P0 (docs and config only; the AI features are built in P7)
Branch: `docs/deepseek-ai-provider`, from the head of `chore/p0-close-out` (both edit `docs/decisions/README.md`); it merges after the close-out PR
Page tier: n/a

## Goal served
*"… AI-search-ready site that … **proves every claim it makes**."*
- The site's AI features and its privacy wording name the provider that actually runs them.
- No rule, spec, draft or setup file contradicts another (lesson 5).

## Context
- **The owner's decision (2026-09-30):** the DeepSeek API replaces the Anthropic API for the AI agent demo, the Social Media Content Planner and pSEO drafting.
- **No code change:** nothing in `src/` reads an AI key (`src/lib/env.ts` reads only `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXING` and `VERCEL_ENV`), and no AI package is installed.
- **Verified 2026-09-30:**
  - The AI SDK provider is `@ai-sdk/deepseek`. It reads `DEEPSEEK_API_KEY` by default, and its base URL is `https://api.deepseek.com` (ai-sdk.dev).
  - Keys are created at `platform.deepseek.com` → API keys (api-docs.deepseek.com).
  - Billing and spend limits aren't documented, so the owner checks them at sign-up.
- **Privacy fact:** DeepSeek's privacy policy (updated 2026-02-10) says it stores personal data in the People's Republic of China (Hangzhou DeepSeek Artificial Intelligence Co., Ltd.). It uses inputs "to train and improve our technology", with an opt-out.
- **Decision number 0016:** 0015 is reserved by the draft P0 part 2 plan, and lesson 5 records a duplicate-number mistake.

## Out of scope
- **Historical plans:** `2026-09-26-stack-rule-changes`, `2026-09-29-design-direction-v2`, `2026-09-29-seo-geo-technical-adoption` and `2026-09-30-seo-geo-domination-engine` are records; 0016 supersedes them.
- **Other mentions that stay:**
  - vendor names in content rules (08 §2.4)
  - AI crawler names
  - Claude Code as the development tool
  - `Planning Folder/**` (read-only)
- **Generic "our AI provider" lines** in the consent and terms drafts: still correct.
- **Choosing a model:** the P7 plan and the pSEO plan.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `.env.example` | MODIFY | The AI key block only: `ANTHROPIC_API_KEY` → `DEEPSEEK_API_KEY`, and its comment |
| `docs/decisions/0016-ai-provider-deepseek.md` | CREATE | The decision; supersedes 0004's "AI agent demo" row and its "Anthropic API account" input (0004 isn't edited) |
| `docs/decisions/README.md` | MODIFY | The 0016 row; the 0004 row's status notes the superseded row |
| `docs/ai/06-code-standards.md` | MODIFY (protected, the owner approved it in the request) | §1 "AI agent" row |
| `docs/design/tools.md` | MODIFY (protected, as above) | The Content Planner row |
| `docs/seo/seo-geo-domination-engine.md` | MODIFY (protected, as above) | §10.5 drafting, and the "Improve" list item |
| `docs/content-drafts/legal/privacy-policy.md` | MODIFY | §6, Table C, Q4 and Q6: DeepSeek. §8 and Q5: add China. Header: the re-approval note |
| `docs/facts/external-sources.md` | APPEND-ONLY | S007 (PROPOSED), plus a change-log line |
| `docs/owner/deepzeta-owner-checklist.html` | MODIFY | §4.6 DeepSeek Platform; the "before the live demos" line |
| `docs/plans/2026-09-30-deepseek-ai-provider.md` | CREATE | This plan |

## Steps
1. Edit the files above. → gate: `git diff --stat` matches the table.
2. Search for `Anthropic|ANTHROPIC|Claude model|with a Claude|Claude via`. The only hits left are in accepted 0004, historical plans, vendor and crawler mentions and dev-tool lines. → gate: the search output.
3. → gate: `check:rules`, `check:effects`, `format:check`, `verify:fast`.
4. `reviewer` subagent: the diff against this plan. Then commit, push, and give the owner the PR link.

## Effect register
None.

## Dependencies to add
None. `@ai-sdk/deepseek` is added by the P7 plan with its verified version.

## Risks and mitigations
- **UAE PDPL:** visitor inputs to the demo and the planner go to servers in China.
  - The privacy draft discloses this; the owner re-approves it, and S007 is approved before `/privacy` ships.
  - Whether the cross-border conditions are met is the owner's legal call (there's no external legal review).
- **Training on inputs:** P7 checks whether the API is covered and turns on the opt-out if one exists. The demo keeps its "don't share personal information" note.

## Gates
`check:rules`, `check:effects`, `format:check`, `verify:fast`, plus the reviewer.

## Open questions
None.
