# 06 · Code Standards

> **Applies to:** all source code · **Precedence:** below 00 · **Last reviewed:** 2026-10-02

---

## 1. Stack (versions verified and recorded in Phase 0)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js, latest stable, **App Router only** | Server-rendered so search engines and AI see full content |
| Language | TypeScript, `strict: true` | No `any`; use `unknown` and narrow |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens | No `tailwind.config.js`, no CSS-in-JS, no Sass |
| i18n | English at launch; Arabic routing added in P11 (library chosen by decision record then) | Architecture RTL-ready now |
| Content | Typed data/MDX in `src/content/` | Copy never hardcoded in components |
| Motion | Native CSS/SVG/View Transitions first; GSAP only on page tier T2/T3; WebGL/Rive only on T3, plus one post-LCP WebGL moment on Home | Page tiers in decision 0005 |
| Forms | Native `<form>` + Server Actions + `useActionState`; Zod on the server | No React Hook Form |
| Spam / rate limit | Cloudflare Turnstile (on form focus) + Upstash Redis rate limit | Serverless-safe store (§4) |
| Automation | n8n (hosting per decision 0004), called only from the server via signed webhook; workflow JSON in the repo | Decision 0004 |
| CRM / email | Google Sheets v0 + Gmail (Workspace) via n8n; HubSpot/Zoho later | Swap inside n8n only |
| AI agent | AI SDK + DeepSeek (`@ai-sdk/deepseek`, decision 0016) on a route handler, streaming; UI loaded on tap | Model chosen in P7 plan |
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
6. **Third-party scripts** via `next/script` with a deliberate strategy, or a small loader of our own where that costs less (GTM: `src/lib/tracking/gtm.ts`, [C56](conflict-register.md); see [09](09-analytics-tracking.md)). Nothing render-blocking in the head.
7. **Heavy or interactive widgets** (chat agent, booking, WebGL) load **on interaction or when visible**, with a lightweight placeholder that reserves space (no layout shift). "Wow on demand" experiences (concept sites, the app demo, the Device Stage, GSAP scenes) load only on an explicit visitor action (decision 0008). WebGL follows 05 §5 rule 5 and [13](13-experience-design.md) §4.6: T3 only, device-gated, started by the first real input.
8. **Sitewide output only in the root layout** (schema org/website nodes, analytics init, consent, page-view tracker, floating widgets).
9. **No data fetching in `useEffect`** for content; fetch on the server.
10. **Route handlers** for `llms.txt`, `llms-full.txt`, `robots`, `sitemap` use static generation where possible.

---

## 3. Components

1. **Reuse → extend → create.** Before building, search for an existing component and say so in the plan. Extend with a prop/variant if it's ~80% right. Create new only if nothing close exists.
2. **Props-driven, zero hardcoded copy.** Content comes from `src/content/` as typed props.
   - Business facts (brand and legal name, NAP, hours, social URLs, the Cal.com link) come from one typed site config, `src/lib/site-config.ts`, built from the facts file.
   - A fact that isn't CONFIRMED yet is `null` there, and every component that uses it hides itself while it's `null`.
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
  - **Security headers** are set once, centrally (`next.config` `headers()`), and asserted by e2e:
    - CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
    - `X-Frame-Options: SAMEORIGIN` plus CSP `frame-ancestors 'self'`. Not `DENY`: Designer Studio concepts load our own pages in a sandboxed iframe (`docs/design/studio.md`).
    - no deprecated `X-XSS-Protection`
    - The CSP is enforced from P3 ([C53](conflict-register.md)), built in `src/lib/security-headers.ts`: our own origin plus the hosts of the tracking vendors in use (`src/lib/tracking/vendors.ts`); `'unsafe-inline'` for scripts with no hash or nonce, because Next.js 16's static pages carry inline scripts of its own that change per page and per build, and a nonce forces dynamic rendering; never `'unsafe-eval'`; `upgrade-insecure-requests` where the site is served over https.
  - `images.dangerouslyAllowSVG` stays off.
  - **Absolute URLs** are built only with `siteUrl()` / `absoluteUrl(path, locale)` from `src/lib/url.ts`, fed by the validated `NEXT_PUBLIC_SITE_URL`. There are no hostname literals in code ([08](08-seo-geo-aeo-schema.md) §1, C27).
  - `dangerouslySetInnerHTML` only for JSON-LD produced by our schema builders, with `<` escaped (see [08](08-seo-geo-aeo-schema.md)). **Two named exceptions (C40):** the no-flash preferences script (`src/lib/fx/init-script.ts`) and, from P3, the consent init script (`src/lib/tracking/consent-init.ts`, C52): static strings built only from our own constants (never request or visitor data), mounted once per document by `SiteDocument`. The CSP allows them through `'unsafe-inline'` (C53); they stay static so a hash-based policy remains possible.
  - Rate-limit form endpoints with a store that works on serverless (not in-memory).
  - **Tools that fetch a visitor-supplied URL** guard against SSRF. They allow only public `http(s)` hosts, block private, link-local and metadata IP ranges after DNS resolution, and cap redirects, response size and time.
  - **AI-powered tools** cap tokens per request and per visitor, and treat visitor input and fetched page content as untrusted (prompt-injection handling).
  - **Masked report data** (Deepzeta Sync tools, `docs/design/tools.md`) is never serialised to the client. It never appears in HTML or in client-component props (the RSC payload), until the server sends the full report after the visitor asks for it.

---

## 5. Dependencies

1. **Native first.** Prefer platform features (`<dialog>`, `:has()`, container queries, `Intl`, CSS animations) when they cover the need.
2. Every new package needs, in an approved plan: the package, the **verified** version, and one sentence on why native or hand-rolled code is worse.
3. **Banned by default:** jQuery, CSS frameworks other than Tailwind, UI kits/templates, page builders, styled-components/Emotion/Sass, Lodash/Moment, `motion`/Framer Motion, Lottie, Lenis or any smooth-scroll/scroll-jacking library, React Hook Form, `lucide-react` and other icon libraries, state libraries where React state suffices, `next-seo`. **GSAP** is allowed only on page tier T2/T3, loaded when its section is visible, never on Home (decision 0005).
4. Never edit `package-lock.json` by hand; only via npm commands in an approved plan.
5. **Visual references are never copied.** Snippets collected as inspiration (e.g. `Planning Folder/Components references/`, which depend on `motion/react`, icon libraries and remote assets) are rebuilt natively from the effects library ([13](13-experience-design.md) §9; conflict C23).
