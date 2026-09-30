# 0013 · Pre-launch indexing lock

Status: ACCEPTED (owner, 2026-09-30): the lock stays on until launch; `robots.txt` option 2

## Context

[08](../ai/08-seo-geo-aeo-schema.md) §1 makes every **non-production** deployment `noindex` and gives it a disallow-all `robots.txt`. It says nothing about production **before launch**.

`deepzeta.ai` is already attached to Vercel and its DNS points there, so the first successful production deploy (the P0 placeholder) is public at once. Search engines and AI crawlers find sites through links anywhere on the web (social profiles, directories, other sites), not only through Google Search Console. A half-built site that gets indexed early can keep placeholder titles in search results for weeks.

**Found in the P0 SEO review.** Google's documentation, [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) (updated 2025-12-10), says:

> "For the `noindex` rule to be effective, the page or resource **must not** be blocked by a robots.txt file … If the page is blocked by a robots.txt file or the crawler can't access the page, the crawler will never see the `noindex` rule, and the page can still appear in search results, for example if other pages link to it."

So `Disallow: /` together with `noindex`, which P0 serves today whenever a deployment isn't indexable, can still let a linked URL appear in Google as a bare link.

## Decision

- **One switch, `SITE_INDEXING`** (`on` or `off`; unset means `off`), read by `src/lib/env.ts`.
- **The rule** (`src/lib/seo/indexing.ts`): a deployment is indexable only when `SITE_INDEXING=on` and it isn't a Vercel preview or development build.
- **When not indexable:** every response sends `X-Robots-Tag: noindex`.
- **`robots.txt` while the lock is on: option 2** (owner, 2026-09-30; the owner set this record to approved and asked to continue as planned; 2 is the recommended option).

  | Option | Previews | Production before launch | Effect |
  |---|---|---|---|
  | **1 · As built in P0** | `Disallow: /` | `Disallow: /` | Crawlers never fetch pages, so they never see the `noindex`. A linked URL can still appear in Google as a bare link. AI training crawlers stay off the placeholder. |
  | **2 · Recommended** | `Disallow: /` (08 §1, unchanged) | `Allow: /`, `Disallow: /api/` (the same file as after launch) | Crawlers read the `noindex` header and keep every page out of results, as Google's documentation says. AI crawlers may read the placeholder, whose copy is approved and harmless. |

- **At launch (P10):** the owner sets `SITE_INDEXING=on` in Vercel → Project → Settings → Environment Variables → **Production only**, then redeploys. No code changes.

| Deployment | Indexable |
|---|---|
| Vercel preview | never |
| Vercel production, before launch (`SITE_INDEXING` unset) | no: the lock |
| Vercel production, from launch (`SITE_INDEXING=on`) | yes |
| The owner's machine and CI (`SITE_INDEXING=on`) | yes, so Lighthouse's SEO audit sees a real page |

## Consequences

- **Turning the lock off** needs no code change: set `SITE_INDEXING=on` in Vercel Production.
- **Option 2** changed one function, `robotsRules()` in `src/lib/seo/indexing.ts`. It now reads the deployment type, not whether the deployment is indexable:
  - Vercel previews and development builds get `Disallow: /`.
  - Everywhere else (production locked or launched, the owner's machine, CI) gets the launch file, and `noindex` comes from the header.
  - Its unit tests cover each deployment type and the locked production case.
- **Rule edits, applied on 2026-09-30:**
  - 08 §1 notes that production stays `noindex` until `SITE_INDEXING=on`, with the chosen `robots.txt` behaviour
  - the P10 row in 04 lists "set `SITE_INDEXING=on` in Vercel Production"
- **A reminder in every build:** production builds print "Pre-launch lock ON" while the lock is on (`next.config.ts`).
- **Tests:** unit tests cover every row of the tables above. The e2e test asserts that the header and `robots.txt` match the mode of the build under test.
