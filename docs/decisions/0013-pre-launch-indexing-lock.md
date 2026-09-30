# 0013 · Pre-launch indexing lock

Status: PROPOSED (built in P0 as the plan designed it; the owner confirms it or turns it off)

## Context

[08](../ai/08-seo-geo-aeo-schema.md) §1 makes every **non-production** deployment `noindex`. It says nothing about production **before launch**.

`deepzeta.ai` is already attached to Vercel and its DNS points there, so the first successful production deploy (the P0 placeholder) is public at once. Search engines and AI crawlers find sites through links anywhere on the web (social profiles, directories, other sites), not only through Google Search Console. A half-built site that gets indexed early can keep placeholder titles in search results for weeks.

## Decision

- **One switch, `SITE_INDEXING`** (`on` or `off`; unset means `off`), read by `src/lib/env.ts`.
- **The rule** (`src/lib/seo/indexing.ts`): a deployment is indexable only when `SITE_INDEXING=on` and it isn't a Vercel preview or development build.

  | Deployment | Indexable |
  |---|---|
  | Vercel preview | never |
  | Vercel production, before launch (`SITE_INDEXING` unset) | no: the lock |
  | Vercel production, from launch (`SITE_INDEXING=on`) | yes |
  | The owner's machine and CI (`SITE_INDEXING=on`) | yes, so Lighthouse's SEO audit sees a real page |

- **When not indexable:** every response sends `X-Robots-Tag: noindex`, and `robots.txt` is `Disallow: /`.
- **At launch (P10):** the owner sets `SITE_INDEXING=on` in Vercel → Project → Settings → Environment Variables → **Production only**, then redeploys. No code changes.

## Consequences

- **Turning the lock off** needs no code change: set `SITE_INDEXING=on` in Vercel Production.
- **Rule edits** (owner-approved with the P0 plan):
  - 08 §1 notes that production stays `noindex` until `SITE_INDEXING=on`
  - the P10 row in 04 lists "set `SITE_INDEXING=on` in Vercel Production"
- **Tests:** unit tests cover every row of the table. The e2e test asserts that the header and `robots.txt` match the mode of the build under test.
