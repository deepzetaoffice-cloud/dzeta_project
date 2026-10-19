# 0035 · GTM loads on the visitor's first action

Status: ACCEPTED (owner, in chat, 2026-10-19). Supersedes [0022](0022-gtm-deferral-and-row-tbt-budget.md)'s timing ("past the first paint"). Plan: `docs/plans/2026-10-19-gtm-on-first-action.md`.

## Context

- Under the Lighthouse standard ([0034](0034-lighthouse-standard.md)), Best Practices measured 73 on every page. All of it came from the GTM container's tags:
  - the Meta pixel's two endpoints and UET's Clarity script, which the Content Security Policy blocks (console errors and DevTools issues)
  - Bing's and Facebook's third-party cookies
- The site's own code logged nothing.
- The owner, 2026-10-19: "Yes: load GTM and its tags after the visitor's first scroll, tap or key press, so Best Practices reaches 100. I accept that visitors who leave without interacting aren't counted."

## Decision

1. **The tracking runtime starts GTM on the visitor's first action:** the first scroll, pointer down, touch start or key press, once per document (`TrackingRuntime.tsx`, `onFirstAction`). The loader (`gtm.ts`) is unchanged.
2. **Nothing else about tracking moves:**
   - the Consent Mode defaults are still `dataLayer[0]`, before hydration
   - page views, `view_service` and click events are still pushed at once
   - GTM reads the queued events when it starts, so the tags get them
3. **The cost, accepted by the owner:**
   - a visitor who leaves without scrolling, tapping or typing is never counted in GA4 or by the ad pixels
   - a first tap that leaves the page at once can go before the container arrives
4. **Lab tests never act,** so no tag runs in Lighthouse or PageSpeed Insights.
   - Real visitors who act still load every tag. The blocked Meta and Clarity requests still happen in their browsers, until the owner changes those tags in GTM.

## Consequences

- **This goes against [09](../ai/09-analytics-tracking.md) §2 rule 2** ("Never idle-defer GTM"). The owner's instruction ranks above it (00 §3). The rule's new wording and a conflict-register entry are proposed to the owner, since both files are protected.
- **`tracking.spec.ts` checks the new timing:** no container before the first action, one after it, inside and outside Europe.
