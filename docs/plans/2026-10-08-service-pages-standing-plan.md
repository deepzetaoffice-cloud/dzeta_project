# Plan: Service pages from the pilot template — the standing plan

Status: APPROVED with 2026-10-08-standard-tier-and-light-verification.md (decision 0028);
active since the A2 pilot merged. Amended 2026-10-09 by Build Mode (decision 0029): batches of up
to 10, the gates of 03 §2.
Phase: P6 (Parts B and D) · Branch per batch: `content/services-<slugs-or-batch>` from `main`
Page tier: standard (floor 70, decision 0028)

## What this plan covers

Every service page built from the pilot template (`/services/[slug]`, R027's shape) whose URL
registry row is planned, in **batches of up to 10 pages per branch** (decision 0029). This plan is the approved
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
3. **Gates (03 §2, Build Mode):** `verify:fast` at each commit; per batch locally `build` +
   `check:schema` + `check:seo` + `check:links` + `check:facts` (+ `test` if a unit row
   changed), and `verify:ci` green in CI on the branch head (e2e and axe). No `lhci`: these pages
   don't reach Home (no CSS, no shell change). If a batch needs CSS, it is no longer a template copy.
4. **Report and merge:** the short report (02 §5) with the preview link, and the owner's "merge"
   per batch (0017).

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

## Notes

- These pages do not enter the shell's markup (the menu's lite panel and the footer list the hub
  and the pillar pages only — L8/L9, decision 0026), so they do not spend Home's byte headroom.
  The pillar pages still wait for it (the owner, 2026-10-08: "fix in Part B").
- New live services grow the hub's ItemList and the OfferCatalog (live services only, 04 §1.4):
  the hub is the spot-check page for any batch that grows it materially.
- The SEO/GEO Auditor and the Performance & Accessibility Auditor ran for the service template in
  A2; they don't run per batch. The batch's scope check is `git diff --stat` against the table
  above (decision 0029).

## Progress notes

(batches record themselves here)

- **Batch 1 (2026-10-09, `content/services-batch-1`):** 1B.3, 1B.5, 1B.6, 1C.1, 1C.2, 1D.3, 1I.2, 4A.1, 4A.3, 4B.6 live (R029, R031–R034, R038, R051, R068, R070, R076). Beyond the copy: the template names each page's demo (`tryIt.demoId`, optional), eight new Tier 2 icons, six headings shortened to clear the European banner at 360 px, and the header's unlinked items in the link colour (the owner). Gates: build, schema/seo/links/facts, e2e services + themes 101/101, Home lhci (perf 96, LCP 2,717 ms). Deferred: the conversational services (1A.1, 1A.2) wait for a `story-chat` variant of the template; 2.1 waits for its spec extras; 1F.2 waits for APPROVED citations.
