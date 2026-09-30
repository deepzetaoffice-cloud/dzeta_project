# 0012 · P0 toolchain versions and hosting facts

Status: ACCEPTED (owner, 2026-09-30, with the approval of `docs/plans/2026-09-30-p0-foundation.md`)

## Context

Decision [0004](0004-tech-stack.md) asked P0 to verify and record the versions, the security advisories and the Vercel function region. Decision [0006](0006-domain-deepzeta-ai.md) left open where DNS is managed. Rule 02 §2 bans version-sensitive code written from memory.

## Decision

**Versions** (exact pins in `package.json`, checked on the npm registry on 2026-09-30):

| Package | Version | Why this one |
|---|---|---|
| `next` | 16.3.7 | Latest stable (`latest` tag) |
| `react`, `react-dom` | 19.3.0 | Next peer `^19` |
| `typescript` | 6.0.3 | **Not 7.0.2**: `typescript-eslint` 8.71.0 (inside `eslint-config-next`) needs `typescript <6.1.0`. Next 16.3.7 type-checks with the project's own `tsc`. |
| `eslint` | 9.39.5 | **Not 10.x**: `eslint-plugin-react` 7.37.5, `eslint-plugin-import` 2.32.0 and `eslint-plugin-jsx-a11y` 6.10.2 (inside `eslint-config-next`) support ESLint up to 9 |
| `eslint-config-next` | 16.3.7 | Matches `next`; the full jsx-a11y recommended rules are added on top (Next turns on 6 of 34) |
| `eslint-config-prettier`, `prettier` | 10.1.8, 3.9.9 | |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | |
| `vitest`, `vite` | 5.0.2, 8.3.1 | Vitest 5 needs `vite` as a peer |
| `@playwright/test`, `@axe-core/playwright` | 1.63.0, 4.13.0 | |
| `@lhci/cli` | 0.15.1 | Latest; bundles Lighthouse 12.6.1 |
| `@types/node`, `@types/react`, `@types/react-dom` | 24.19.0, 19.3.0, 19.3.0 | Node v24.19.0 is installed |

**Next.js 16 behaviour this project relies on** (docs version 16.3.7):
- Multiple root layouts through route groups, with the experimental `global-not-found.tsx` (`experimental.globalNotFound`) for unmatched URLs.
- `next lint` is removed; linting runs `eslint .`.
- `next.config.ts` loads through Node 24's own TypeScript support, so the files it imports use explicit `.ts` extensions and erasable syntax only (`erasableSyntaxOnly`).
- A layout's `title.template` doesn't apply to the page in the layout's own segment. The home page therefore uses `title.absolute`, from the one format in `src/lib/seo/title.ts`.

**Security advisories** (`npm audit`, 2026-09-30):
- Runtime dependencies (`--omit=dev`): **0 vulnerabilities**.
- Dev tools: 10 findings (7 high, 1 moderate, 2 low), all inside `@lhci/cli`'s own tree: `tmp`, `uuid`, `inquirer`, and `lighthouse` → `puppeteer-core` → `@puppeteer/browsers` → `extract-zip`. `@lhci/cli` 0.15.1 is the latest release; npm's only "fix" is a downgrade to 0.1.0.
- These tools run only on our own machine and in CI, against our own local build, and never ship to visitors. **Accepted.** Re-checked in every plan that adds a dependency.

**Hosting facts:**
- **No Middle East compute region on Vercel.** The regions page (updated 2026-08-11) lists 19 regions; the nearest to the UAE is `bom1` (Mumbai), and the default is `iad1`. Hobby allows one function region.
- P0–P5 pages are static and served from Vercel's CDN, so **the function region is chosen in the P6 lead-form plan** from a measured form → n8n round trip.
- **Vercel project:** `deep-zeta/dzeta_project`, linked to the GitHub repo. `deepzeta.ai` and `www` are attached.
- **DNS** is managed at **Hostinger** (the registrar) and points to Vercel (owner, 2026-09-30). This answers 0006's open DNS question.

## Consequences

- Moving to TypeScript 7 or ESLint 10 is a later dependency plan, once `typescript-eslint` and Next's bundled ESLint plugins support them.
- `global-not-found` is experimental. The e2e tests assert the 404 status and `noindex`; the fallback is a catch-all route in `(en)` that calls `notFound()`.
- The P6 plan owns the function region. Until then Vercel's default region stays, and nothing runs there.
