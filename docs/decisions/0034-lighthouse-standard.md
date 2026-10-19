# 0034 · The Lighthouse standard: Home at 100 everywhere, every page at 100 except speed

Status: ACCEPTED (owner, in chat, 2026-10-19). Narrows [0033](0033-redesign-v3.md)'s "performance measured and reported, never a blocker" for the scores below; everything else in 0033 stands.

## Context

- 0033 made every Lighthouse score information only.
- On 2026-10-19, after v3 went live, the owner set a standard: "only home page need full score in the performance. the rest all pages need full score in 100 Accessibility, 100 Best Practices, SEO, 2/2 Agentic Browsing (so we can speed up the build by leaving the unwanted testing for speed optimization)". The owner measured Home at 100 in every category except SEO, and expects SEO to reach 100 at launch.
- SEO can't be 100 before launch: the pre-launch `noindex` lock ([0013](0013-pre-launch-indexing-lock.md)) fails Lighthouse's "Page is blocked from indexing" audit on every page until P10.

## Decision

1. **Home** (`/`) aims for **100 in all five Lighthouse categories**: Performance, Accessibility, Best Practices, SEO and Agentic Browsing.
2. **Every other page** aims for **100 in Accessibility, Best Practices, SEO and Agentic Browsing** ("2/2" in PageSpeed Insights). Their Performance score is information only.
3. **Speed work and speed testing are for Home only.** Other pages get no performance testing and no speed optimisation, so the build stays fast.
4. **How it's checked:** Lighthouse 13.5 in its mobile setting, as PageSpeed Insights runs it, on production or the branch's Vercel preview. Run it once per batch, before the owner's "merge", with the scores in the report (02 §5). It is not a CI gate: there is no `lhci`.
5. **When a page falls short:**
   - A cause in the site's own code is fixed before the merge.
   - A cause in a third-party tag from the GTM container goes to the owner, with what to change.
   - SEO's "blocked from indexing" audit is expected until launch.

## The baseline (2026-10-19, production `5c65def`, Lighthouse 13.5 mobile, run locally)

| Pages | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
|---|---|---|---|---|---|
| Home, desktop setting | 100 (FCP 0.4 s, LCP 0.5 s, TBT 10 ms, CLS 0) | 100 | 73 | 69 | 100 |
| Home, mobile setting | 80 (FCP 2.0 s, LCP 3.1 s, TBT 360 ms, Speed Index 5.0 s; the machine's benchmark index 3,945, Lighthouse's default 4× CPU slowdown) | 100 | 73 | 69 | 100 |
| The other 14 | not tested | 100 | 73 | 69 | 100 (91–92 on some runs; fixed, below) |

- **Agentic Browsing's 91–92** came from its layout-shift audit (CLS 0.126–0.128). When Geist Mono arrived late, the stage breadcrumb rewrapped from two lines (the wider fallback) to one, and the hero below moved up 14 px. The stage breadcrumb now stays on one line whatever font has loaded, shortening the current page's name with an ellipsis if it must.
- **Home's mobile Performance** spends its blocking time on Home's own scripts (about 500 ms of start-up) and the tags (gtag 183 ms, Meta 174 ms). Its LCP element on a phone is the AI input's placeholder text.

- **Best Practices (73)** loses points only to third-party tags in the GTM container:
  - Meta's pixel tries to reach two endpoints the Content Security Policy blocks.
  - Microsoft's UET tag loads Clarity, which the policy also blocks.
  - Bing and Facebook set third-party cookies.
  - The site's own code logs nothing.
- **SEO (69)** fails only "Page is blocked from indexing" (the 0013 lock).

## Amendment (owner, in chat, 2026-10-19): Home's mobile Performance at 90+ is enough

- The owner: "Keep same as now. I checked the performance score is 90+. Leave the audit for home page and continue next build." Decision 1 now reads: Home aims for 100 in Accessibility, Best Practices, SEO and Agentic Browsing, 100 in desktop Performance and **90 or more in mobile Performance**. The Home speed pass is parked; nothing in it was changed.
- PageSpeed Insights on production after 0035 (2026-10-19, mobile): 99 in one run (FCP 1.2 s, LCP 1.7 s, TBT 50 ms, CLS 0, Speed Index 2.5 s) and 91 in the next (FCP 2.0 s, LCP 3.0 s, Speed Index 4.2 s).
- What makes the score swing, for a later pass:
  - The 91 run loaded by 0.49 s but drew its first frame at 2.3 s. Headless Chrome then gives the page a frame about once a second when the page can't draw just after it arrives; a late first frame pulls every script into Lighthouse's estimate.
  - Measured locally with live-like latency, two things each cost one such second: the render-blocking stylesheet request and the font preloads, which Chrome now holds rendering for. With both gone (CSS inline, no preloads) a page with Home's head and a plain body drew at 0.25 s; the hero still cost one more second, cause not found.
  - Neither is design-neutral: no font preloads means a font swap on first visits; Next's `inlineCss` adds the CSS to every page's HTML twice.

## Consequences

- 00 N1, 03 and 07 say performance is never a blocker. This record narrows that for the scores above; the rule-file wording is proposed to the owner, not edited unasked (00 §5).
- `CLAUDE.md`'s Build Mode cites this record.
