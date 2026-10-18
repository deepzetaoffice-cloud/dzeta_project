# 07 · Performance: Guidance and Reporting

> **Applies to:** every page, component, asset and third-party script · **Precedence:** below 00 (N1: measured and reported, never a blocker) · **Last reviewed:** 2026-10-18 (Website v3, decision 0033)

Performance is **information, not a gate** ([decision 0033](../decisions/0033-redesign-v3.md)). No page has a Lighthouse floor, a weight limit or a byte cap, and no number here blocks a merge. Visual ambition comes first.

The habits below stay because they cost nothing visually, and because a fast page still helps every visitor. Core Web Vitals are also a small Google ranking signal.

---

## 1. What changed in v3

- **Removed:**
  - the Lighthouse floors and the page tiers (0005, 0011, 0028)
  - the Home page-weight limit, the JavaScript, font, image and effect byte caps (0014, 0021's Home cap, the old 13 §7)
  - the regression rule and the exception limit (0020)
  - the lab allowances and the CPU calibration (0022's TBT row, 0023, 0025)
  - the Designer Studio exemption (0031, now moot)
- **Deleted in Phase C:** `lhci`, `lighthouserc*.cjs`, `scripts/lhci-run.mjs`, `scripts/check-page-weight.mjs`, `scripts/measure-prod-weight.mjs` and `@lhci/cli`.
- **The copy rule ([10](10-content-voice.md) §3):** no page promises a Lighthouse or PageSpeed score. A Core Web Vitals result is claimed only when a real measurement shows it (N3).

---

## 2. Reporting (every branch, information only)

| Report | How | Where it goes |
|---|---|---|
| Lighthouse (mobile) for Home and one changed page | Lighthouse in Chrome DevTools or PageSpeed Insights on the Vercel preview | The branch's short report (02 §5): the four scores and LCP, INP (or TBT), CLS |
| Bundle report | `@next/bundle-analyzer` (added in Phase C) | The branch's report: first-load JS per route, and what grew |
| Field data, after launch | PageSpeed Insights / CrUX on production | The pre-launch register and the monthly check |

A number that looks wrong is a **fix task proposed in the report**, never a blocked merge. The owner decides whether it's worth doing.

---

## 3. Habits that stay

**Images and media**
- Through `MediaAsset` and `next/image` only (08 §7): AVIF and WebP, explicit width and height, a correct `sizes`, served at 800, 1200, 1600 and 2400 px.
- `priority` only on the image that is the page's LCP element, when it is one. The hero's H1 is the usual LCP element (13 §3).
- **Video:** muted loops start only when their card is in view and pause off-screen and in a hidden tab. Each has a poster, `preload="none"` until it nears the viewport, and the photo as its fallback. No sound ever autoplays.
- **3D:** `three` and React Three Fiber load by dynamic import, only in sections with a scene, after the first paint. Each scene has a 2400 px poster for reduced motion, Save-Data and devices without WebGL2. A scene renders on demand and stops off-screen.

**Fonts**
- Self-hosted through `next/font` (Unbounded, Figtree, Geist Mono; [05](05-design-system.md) §3): latin subset, `display: swap`. No Google Fonts `<link>`, and no request goes to Google at runtime.

**JavaScript**
- Server Components by default; client components small and deep in the tree.
- Heavy widgets load on interaction or visibility: the agent chat on tap, the ROI calculator in view, a scroll scene's library when its section nears the viewport.
- Note each new dependency's compressed size in its commit.
- No blocking work in event handlers; break up long tasks.

**CSS and motion**
- Animate transform, opacity, clip-path and filter only ([13](13-experience-design.md) §3).
- Pause anything off-screen or in a hidden tab.
- Reserve space for anything that loads late (aspect-ratio boxes, min-heights), so layout shift stays near 0. A pinned scene's height is set before its script loads.

**Third parties**
- GTM loads as [09](09-analytics-tracking.md) sets out (deferred past the first paint, never idle-deferred, decision 0022). Other vendors load after consent and/or idle. Nothing else goes in the head.
- Every third party added needs a plan.

---

## 4. Demo and effect costs (to watch, never caps)

| Demo / effect | Cost | Mitigation |
|---|---|---|
| The website AI agent | A chat script | The AI input renders first; the chat code loads on the first focus or tap |
| `message-to-booking`, `workflow-connect`, `exploded-layers`, `macbook-scroll` (3D) | `three` + React Three Fiber + a GLB (≤ ~5 MB, Draco) | Dynamic import after first paint, in view only; poster under reduced motion, Save-Data and no WebGL2 |
| Pinned scroll scenes | GSAP ScrollTrigger + Lenis | Loaded with their section; no pin under reduced motion or on short viewports |
| Door and industry video loops | A 720p MP4/WebM each | In view only, paused off-screen, poster first |
| `drape`, `shape-throw` (WebGL or physics) | Their KokonutUI code and its dependencies | Loaded on intent or in view; static fallback |
| ROI calculator | Small | Only on pages that show it |
