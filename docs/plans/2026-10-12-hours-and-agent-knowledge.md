# Plan: Monday-to-Friday hours, and the agent's sales knowledge
Status: APPROVED (owner, 2026-10-12)
Phase: Track A (decision 0027) + a sitewide facts change · Branch: `feat/automation-track-a` (main merged in first) · Page tier: n/a (text only; reaches Home through the footer and the schema)

## Goal
Booked audits, and proving every claim: the site and the WhatsApp agent both state the owner's new hours (2026-10-12: Monday to Friday, closed Saturday and Sunday), and the agent answers from the owner's approved sales brief (`docs/facts/sales-knowledge.md`, topics 1–8) and the owner's own edits to the generated knowledge file.

## Allowed files
| Path | Action | Purpose |
|---|---|---|
| `docs/facts/company-facts.md` | MODIFY | Restore the plain table format the owner's editor changed, and keep the owner's values: opening hours Monday to Friday, closed Saturday and Sunday; the audit's booking hours Monday to Friday under the official labels; the Google Business Profile URL (CONFIRMED); primary market UAE, then GCC, then worldwide; the Wasleen sites built by Deepzeta's team (§4.1 rule); the founder's background pointer (§4 bio note; the credentials cell stays UNKNOWN) |
| `src/lib/site-config.ts` | MODIFY | `openingHours.display` and `days` equal the new fact |
| `src/lib/schema/nodes/organization.ts` | MODIFY | Comment only (Monday–Friday); the hours come from the site config |
| `tests/unit/site-config.test.ts` | MODIFY | The hours pattern reads "closed Saturday and Sunday" |
| `tests/unit/schema/organization.test.ts` | MODIFY | The test title (Monday–Friday) |
| `tests/fixtures/schema/*.json` | MODIFY | Regenerated: `dayOfWeek` without Saturday |
| `src/content/en/legal/privacy.ts` | MODIFY | "business days (Monday to Friday)" |
| `docs/content-drafts/legal/privacy-policy.md` | MODIFY | The same two lines as the page |
| `docs/facts/sales-knowledge.md` | MODIFY | §9: the owner's additions from the knowledge review (the "all languages" answer, the Arabic answer, the two highlights) |
| `scripts/build-agent-knowledge.mjs` | MODIFY | Add the APPROVED sales answers (OPEN rows never), the Google Business Profile, the owner's highlight wording, and a precedence line (the sales answers win where a published FAQ is more general) |
| `tests/unit/agent-knowledge.test.ts` | MODIFY | Approved sales rows included, OPEN rows excluded |
| `docs/facts/agent-knowledge.md` | MODIFY | Regenerated (`npm run agent:knowledge`); the owner reviews it before the upload (Part G) |
| `docs/plans/2026-10-07-automation-pipeline.md` | MODIFY | One progress line |

Outside the repo: the DZ-0000 row's `business_profile` in Supabase takes the regenerated profile (the agent reads it in every prompt).

## Steps
1. Merge `main` into the branch (the privacy page and the 6 newer commits).
2. Facts file: format and values, as above.
3. Site config, the schema comment, the tests and fixtures, the privacy page and its draft: Monday to Friday.
4. Generator and its test; sales-knowledge §9; regenerate.
5. Gates (03 §2): `verify:fast`, the local static gates, `lhci` (the footer and the schema reach Home), then `verify:ci` green in CI. Then `business_profile` in Supabase.

## Out of scope
- The website's FAQ wording: the timeline answer ("no standard timeframe"), the Arabic and "all languages" answers, and the highlights on the site. These are content changes, with numbers that need the `check:facts` allowlist. They get a separate content task.
- The Google Business Profile in the site's `sameAs`, the footer and the schema (facts §2 rule). This is a separate change.
- The agent's rules, the expert follow-up and the six safety fixes (stage 2, owner-approved 2026-10-12). Those are n8n and Supabase changes only.

## Open questions
None.

## Progress
