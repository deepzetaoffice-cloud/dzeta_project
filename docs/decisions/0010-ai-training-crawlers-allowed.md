# 0010 · AI training crawlers get full access

Status: ACCEPTED (owner, 2026-09-30)

## Context

[08](../ai/08-seo-geo-aeo-schema.md) §5 gave AI **training** crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Bytespider, Meta-ExternalAgent) access only to `llms.txt` and `llms-full.txt`. AI search and user-fetch bots already had full access. 08 said the owner could change this tiering by decision record.

The blueprint (SEO section) said "training-only bots are limited". The owner's goal is maximum visibility in AI answers. The site is public marketing content with nothing proprietary in it.

## Decision

- **Full access for AI training crawlers:** they get the same access as every other crawler, `Allow: /` and `Disallow: /api/`, so future AI models learn Deepzeta AI and its services from the real pages.
- **Named groups stay** in `robots.txt` (engine §9.1), so the owner can change any one bot in one line later.
- **Private and utility areas** stay out of reach as before: `/api/` is disallowed, and utility and concept pages carry `noindex`.
- **Non-production deployments** still disallow everything (08 §1).

## Consequences

- **Rule changes:** 08 §5's tier table changes, and the engine's robots section follows it. Conflict C33 records the change from the blueprint.
- **Tests:** the robots unit test (08 §5) asserts the new table.
- **Reversible:** a later decision can restrict any bot again. Content already crawled can't be un-crawled.
