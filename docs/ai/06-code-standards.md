# 06 · Code Standards

> **Applies to:** all source code · **Precedence:** below 00 · **Last reviewed:** 2026-09-26

---

## 1. Stack (versions verified and recorded in Phase 0)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js, latest stable, **App Router only** | Server-rendered so search engines and AI see full content |
| Language | TypeScript, `strict: true` | No `any`; use `unknown` and narrow |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens | No `tailwind.config.js`, no CSS-in-JS, no Sass |
| i18n | English at launch; Arabic routing added in P11 (library chosen by decision record then) | Architecture RTL-ready now |
| Content | Typed data/MDX in `src/content/` | Copy never hardcoded in components |
| Hosting | Vercel (owner already connected); region set by decision | |
| Tests | Vitest (unit), Playwright + axe (e2e/a11y), Lighthouse CI | |

**Version-sensitive APIs:** before writing code for Next.js, React, Tailwind or any library, read the installed version and use its docs (see [02](02-anti-hallucination-and-edit-safety.md) §2).

---

## 2. Next.js rules

1. **Server Components by default.** Add `'use client'` only for state, effects, event handlers or browser APIs, and push it as far down the tree as possible. Never on a layout or page without a stated reason.
2. **Metadata API** (`metadata` / `generateMetadata`) for every page: title, description, canonical, Open Graph, robots. No hand-written `<head>` tags.
3. **`next/image`** for every raster image with explicit `width`/`height` (or `fill` + sized parent); `priority` only for the above-the-fold LCP image.
4. **`next/link`** for internal links. Links must be real `<a href>` (server-rendered, crawlable). No JavaScript-only navigation.
5. **`next/font`** for fonts (see [05](05-design-system.md) §3).
6. **Third-party scripts** via `@next/third-parties` or `next/script` with a deliberate strategy (see [09](09-analytics-tracking.md)). Nothing render-blocking in the head.
7. **Heavy or interactive widgets** (chat agent, booking, WebGL) load **on interaction or when visible**, with a lightweight placeholder that reserves space (no layout shift).
8. **Sitewide output only in the root layout** (schema org/website nodes, analytics init, consent, page-view tracker, floating widgets).
9. **No data fetching in `useEffect`** for content; fetch on the server.
10. **Route handlers** for `llms.txt`, `llms-full.txt`, `robots`, `sitemap` use static generation where possible.

---

## 3. Components

1. **Reuse → extend → create.** Before building, search for an existing component and say so in the plan. Extend with a prop/variant if it's ~80% right. Create new only if nothing close exists.
2. **Props-driven, zero hardcoded copy.** Content comes from `src/content/` as typed props.
3. **Naming:** PascalCase by role (`HeroSignal`, `PillarCards`, `RoiCalculator`), never `Section2` or `NewHero`. One component per file; export its `Props` type.
4. **Folders:** `ui/` (atoms), `sections/` (page sections), `layout/` (header, footer, shell), `icons/`, `demos/`.
5. **Accessibility:** semantic elements first (`header`, `nav`, `main`, `section`, `article`, `footer`, `button`, `a`); `aria-*` only when semantics can't express it; icon-only buttons have `aria-label`; never `role="menu"` for site navigation.
6. **Forms:** labels, validation on client and server, clear errors, success state, consent wording, spam protection, rate limiting.

---

## 4. Code quality

- Functions and components do one thing; no dead code, no commented-out code.
- Comments explain **why**, not what. Fragile or non-obvious code gets a short "why" comment and, where relevant, a pointer to the rule (`// see docs/ai/09 §2`).
- `cn()` (clsx + tailwind-merge) for conditional classes.
- Errors are handled explicitly: API calls check `response.ok`, forms show failure states, and nothing fails silently.
- **Security:**
  - Secrets only in environment variables; `NEXT_PUBLIC_` only for values safe in the browser.
  - Validate env at startup.
  - Security headers: CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` or CSP `frame-ancestors`, `Permissions-Policy`.
  - `dangerouslySetInnerHTML` only for JSON-LD produced by our schema builders, with `<` escaped (see [08](08-seo-geo-aeo-schema.md)).
  - Rate-limit form endpoints with a store that works on serverless (not in-memory).

---

## 5. Dependencies

1. **Native first.** Prefer platform features (`<dialog>`, `:has()`, container queries, `Intl`, CSS animations) when they cover the need.
2. Every new package needs, in an approved plan: the package, the **verified** version, and one sentence on why native or hand-rolled code is worse.
3. **Banned by default:** jQuery, CSS frameworks other than Tailwind, UI kits/templates, page builders, styled-components/Emotion/Sass, Lodash/Moment, GSAP, Framer Motion on the critical path, Lottie, state libraries where React state suffices, `next-seo`.
4. Never edit `package-lock.json` by hand; only via npm commands in an approved plan.
