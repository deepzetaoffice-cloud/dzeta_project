# Plan: Service pages from the pilot template — the standing plan

Status: APPROVED with 2026-10-08-standard-tier-and-light-verification.md (decision 0028);
activates after the A2 pilot review and merge (04 §1.6: pilot, review, then scale)
Phase: P6 (Parts B and D) · Branch per batch: `content/services-<slugs-or-batch>` from `main`
Page tier: standard (floor 70, decision 0028)

## What this plan covers

Every service page built from the pilot template (`/services/[slug]`, R027's shape) whose URL
registry row is planned, in **batches of up to 6 pages per branch**. This plan is the approved
plan (0003): no new planning session per page or per batch. Each batch records itself in the
Progress notes below.

A page qualifies when: its content comes from the Services Catalogue (names used exactly); it
uses only the pilot's modules and effects (the A2 effect register); it adds no client JavaScript,
no new schema type, no route beyond its own slug; and nothing else deviates. Anything else — a
new module or effect, client JS, schema changes, the pillar pages, solutions, industries — needs
its own plan.

## Per batch

1. **Content** (10, the Content Writer rules; sources: the catalogue, the facts allowlist):
   one typed file per page in `src/content/en/services/`, FAQ questions with new unique ids,
   numbers only from the allowlist, "Example" labels on non-real flows.
2. **Wiring:** the slug index; `src/lib/routes.ts` liveness; the registry rows → live; the e2e rows.
3. **Gates (03 §2 "Pages from a proven template"):** `verify:fast` at each commit; per batch:
   `build` + `check:schema` + `check:seo` + `check:content` (or its `.scratch/` equivalent until
   it exists) + `check:links` + `check:facts` + `test` + `test:e2e` (the batch's pages) + one
   `lhci` spot-check (`DZ_LHCI_PAGES=<the first slug>`; the standard assertions, decision 0028).
4. **Report and merge:** the pages, the gate output including the spot-check's scores, and the
   owner's "merge" per batch (0017).

## Allowed files per batch

| Path | Action | Purpose |
|---|---|---|
| `src/content/en/services/*.ts` | CREATE, MODIFY | The batch's pages; the slug index |
| `src/content/en/faq-bank.ts` | MODIFY | New unique question ids only |
| `src/lib/routes.ts` | MODIFY | Liveness rows only |
| `docs/seo/url-registry.md` | MODIFY (protected, named here) | The batch's rows → live; a change-log row |
| `tests/e2e/services.spec.ts` | MODIFY | Rows for the new slugs |
| `tests/unit/routes.test.ts` | MODIFY (only if a row needs it) | Template param liveness |
| `docs/plans/2026-10-08-service-pages-standing-plan.md` | MODIFY | The batch's Progress notes |
| `.scratch/**` | CREATE, then DELETE | The copy-rules check output |

## Notes

- These pages do not enter the shell's markup (the menu's lite panel and the footer list the hub
  and the pillar pages only — L8/L9, decision 0026), so they do not spend Home's byte headroom.
  The pillar pages still wait for it (the owner, 2026-10-08: "fix in Part B").
- New live services grow the hub's ItemList and the OfferCatalog (live services only, 04 §1.4):
  the hub is the spot-check page for any batch that grows it materially.
- The SEO/GEO Auditor and the Performance & Accessibility Auditor run per template, not per batch
  (both ran for the service template in A2). The Reviewer checks every batch's diff against this
  plan. A spot-check score below 80 is reported prominently even though the floor is 70.

## Progress notes

(batches record themselves here)
