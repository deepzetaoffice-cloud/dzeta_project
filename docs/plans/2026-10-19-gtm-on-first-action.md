# GTM loads on the visitor's first action

Status: APPROVED (the owner, in chat, 2026-10-19: "Yes: load GTM and its tags after the visitor's first scroll, tap or key press, so Best Practices reaches 100. I accept that visitors who leave without interacting aren't counted.")

**North Star:** a fast, AI-search-ready site that proves its claims: Best Practices 100 on every page under the Lighthouse standard (decision 0034).

## Why

On every page Lighthouse's Best Practices is 73, and all of it comes from the GTM container's tags:
- the Meta pixel's two blocked endpoints and UET's blocked Clarity script (console errors and DevTools issues)
- Bing's and Facebook's third-party cookies

Lighthouse never scrolls, taps or types, so tags that wait for the first action never run in its test.

## The change

- **The tracking runtime starts GTM on the first scroll, pointer down, touch start or key press**, whichever comes first, once per document. Before this it started GTM after the first paint (decision 0022).
- **Nothing else moves:**
  - the Consent Mode defaults are still `dataLayer[0]`, set before hydration
  - page views, `view_service` and click events still go into `dataLayer` at once
  - GTM reads that queue when it starts, so the queued events reach the tags
  - the loader (`gtm.ts`) is unchanged
- **The cost, accepted by the owner:**
  - a visitor who leaves without scrolling, tapping or typing is never counted
  - a first tap that leaves the page at once can go before the container arrives
- **This goes against 09 §2 rule 2** ("Never idle-defer GTM"). The owner's instruction ranks higher (00 §3). The rule's new wording and a conflict-register entry are proposed to the owner (both protected), and decision 0035 records the change.

## Allowed files

| File | Action | Why |
|---|---|---|
| `src/components/layout/TrackingRuntime.tsx` | MODIFY | Start GTM on the first action instead of past the first paint |
| `tests/e2e/tracking.spec.ts` | MODIFY | No container before the first action; one container after it (outside and inside Europe) |
| `docs/decisions/0035-gtm-on-first-action.md` | CREATE | The decision, superseding 0022's timing |
| `docs/decisions/README.md` | MODIFY | The index row |
| `docs/plans/2026-10-19-gtm-on-first-action.md` | CREATE | This plan |

## Gates

`verify:fast`, `format:check`, `knip`, the unit tests, `build`, the tracking and consent e2e specs (09's condition for these files), the full e2e, and Lighthouse's Best Practices on a local production build with the container. Then `verify:ci` green in CI, and the owner's "merge".

## Out of scope

- The GTM container itself: the Meta and UET settings behind the blocked requests, which still happen for real visitors once their tags run. That is the owner's dashboard work (09 §2 rule 10).
- The protected rule text (09 §2 rule 2, the conflict register): proposed, not edited.
