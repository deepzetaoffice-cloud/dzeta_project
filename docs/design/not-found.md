# 404 and the error page

Status: CONFIRMED (Figma approved 2026-10-18) · Decision 0033 · Effects: [13](../ai/13-experience-design.md) §4.4 · Figma: page Privacy and 404 (`1:9`), 404 Desktop 1440 `61:1054`, Mobile 390 `61:1200` · Content: `src/content/en/not-found.ts`, `src/content/en/error.ts` · Schema: none (`noindex`, 08 §3)

## The 404

- **The "Desktop · light page" header**, then the copy block centred on the canvas:
  - "404" (mono label)
  - the H1 "Page not found" (`notFoundContent.heading`)
  - "This page doesn't exist." (`body`)
  - "Go to the Deepzeta AI home page" (`homeLink`, a Primary button)
  - the hint "Grab a shape and throw it — each one is a page you can go to."
- **The playground (`shape-throw`):** the four Pillar pixels marks and eight page chips (Services, Automation, Free AI audit, Websites, Pricing, Work, Designer Studio, Deepzeta Sync) scattered on the canvas. You can drag and throw them; the physics has friction.
  - **Each chip is a real link,** and only to a live page. A chip for an unshipped page is left out, so the eight shrink to the live ones.
  - **Keyboard and screen readers** get the same links as an ordinary list (the chips in DOM order, focusable).
  - **Under Reduce effects, without JavaScript or on touch-only devices** without the physics, the shapes sit still and the links work.
- **Copy flag:** the hint line is new copy from the Figma file. It joins `not-found.ts` through the Content Writer.
- **The region hint still applies** (`tracking.spec.ts` asks `/this-page-does-not-exist` for it), and the page is `noindex`.

## The error page

- **The same calm layout as the 404, without the playground:** the copy from `error.ts`, a retry button and the link home.
- **The root error page imports only what it shows** (0026's rule): no 3D, no physics, no scroll libraries.

## Breakpoints

Checked side by side with `61:1054` and `61:1200` at 390, 834 and 1440 px.
