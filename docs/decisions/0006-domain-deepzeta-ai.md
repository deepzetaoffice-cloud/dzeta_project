# 0006 · Domain: deepzeta.ai

Status: ACCEPTED (owner, 2026-09-27)

## Context
Decision D1 from the blueprint asked for a domain of deepzeta's own, separate from any other business the owner runs. The owner confirmed on 2026-09-27 that **deepzeta.ai** is already registered in the owner's name, and that the address without `www` is the main one.

## Decision
- The site's canonical address is **https://deepzeta.ai** (no `www`).
- **https://www.deepzeta.ai** redirects permanently (301) to **https://deepzeta.ai**, keeping the path.
- All URLs in metadata, canonical tags, schema `@id` values, the sitemap, `robots.txt` and `llms.txt` are built from one site-URL setting whose production value is `https://deepzeta.ai`. No URL is hardcoded.

## Consequences
- The schema entity ids use this base, for example `https://deepzeta.ai/#organization` and `https://deepzeta.ai/#website`. They must not change after launch.
- Business email (Google Workspace), Search Console (Domain property), GA4 data stream, Turnstile hostname and booking branding all use `deepzeta.ai`.
- Marketing material shows the address as **deepzeta.ai**.
- Where DNS is managed (registrar or Cloudflare) is still open and is decided in Phase 0.
- `docs/facts/company-facts.md` needs the domain row updated by the owner.
