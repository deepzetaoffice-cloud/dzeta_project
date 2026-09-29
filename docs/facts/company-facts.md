# Company Facts (single source of truth)

> **Applies to:** every page, schema node, footer, contact detail and piece of copy · **Precedence:** the only allowed source of business facts · **Last reviewed:** 2026-09-29

**Rules for agents**
- Use only values marked **CONFIRMED**. A value marked **UNKNOWN** must never be guessed, approximated or filled with something plausible.
- In content, an unknown value is written as `[[TODO: <what is needed>]]` (the `check:facts` gate blocks it from shipping). In schema, the property is **omitted**.
- Only the owner changes this file.

---

## 1. Identity

| Fact | Value | Status | Source |
|---|---|---|---|
| Brand name | deepzeta | CONFIRMED | Logo, catalogue |
| Brand descriptor | AI Digital Solutions | CONFIRMED | Logo tagline |
| Positioning line | deepzeta builds online growth for every business. | CONFIRMED | Services Catalogue v1.1 |
| Legal company name | — | UNKNOWN | Decision D2 pending |
| Legal entity type / relationship to other companies | — | UNKNOWN | Decision D2 pending |
| Trade licence number / issuing authority | — | UNKNOWN | Owner to provide |
| Founding date | — | UNKNOWN | Owner to provide |
| Domain / canonical site URL | — | UNKNOWN | Decision D1 pending |

## 2. Contact (NAP must be byte-for-byte identical everywhere)

| Fact | Value | Status |
|---|---|---|
| Street address | — | UNKNOWN |
| City / emirate / country | — | UNKNOWN (market: UAE) |
| Phone (international format) | — | UNKNOWN |
| WhatsApp number | — | UNKNOWN |
| Public contact email | — | UNKNOWN (do not assume the owner's working email is public) |
| Opening hours | — | UNKNOWN |
| Google Business Profile URL | — | UNKNOWN |
| Social profiles (`sameAs`) | See §2.1 | CONFIRMED |

### 2.1 Social profiles (official, public)

Source: owner, 2026-09-29 (`Planning Folder/Components references/#Deepzeta ai Social urls and details.txt`).

| Platform | URL | Handle | Status |
|---|---|---|---|
| LinkedIn (company page) | https://www.linkedin.com/company/deepzeta-ai-digital-solutions-dubai/ | deepzeta-ai-digital-solutions-dubai | CONFIRMED |
| Instagram | https://www.instagram.com/deepzeta.ai/ | @deepzeta.ai | CONFIRMED |
| Facebook Page | https://www.facebook.com/DeepzetaAi/ | DeepzetaAi | CONFIRMED |
| YouTube | https://www.youtube.com/@DeepzetaAiAgency | @DeepzetaAiAgency | CONFIRMED |
| TikTok | https://www.tiktok.com/@deepzeta.ai | @deepzeta.ai | CONFIRMED |
| X | https://x.com/Deep_Zeta | @Deep_Zeta | CONFIRMED |
| Threads | https://www.threads.com/@deepzeta.ai | @deepzeta.ai | CONFIRMED |
| Snapchat | https://www.snapchat.com/@deepzeta.ai | @deepzeta.ai | CONFIRMED |
| Pinterest (business) | https://www.pinterest.com/deepzeta_ai/ | deepzeta_ai | CONFIRMED |

**Rules for agents**
- Copy URLs **exactly** as written here (same protocol, `www`, casing and trailing slash). Never rebuild a URL from the handle, and never add a platform that isn't in this table.
- Code reads these from one typed config (planned: `src/lib/site-config.ts` or similar, named in the plan that builds it). The footer, the contact page and the schema `sameAs` array all use that one source. URLs are never hardcoded in components.
- Schema: all nine URLs go into the `#organization` node's `sameAs` array. Nothing else goes there, not even the internal links in §2.2.
- Links open in a new tab with `rel="noopener noreferrer"` and an accessible name that includes the platform (e.g. "deepzeta on LinkedIn").
- Icons are official monochrome platform marks, never redrawn in deepzeta style (Icon Master Rules §14.3, still listed there as an open decision).
- If a profile is renamed or removed, only the owner updates this table.

### 2.2 Internal accounts (never shown on the public site)

| Service | URL | Use |
|---|---|---|
| GitHub repository | https://github.com/deepzetaoffice-cloud/dzeta_project | Source code (`origin` remote) |
| Vercel team | https://vercel.com/deep-zeta | Hosting and deployments |

These are for building and deploying only. They never appear in page content, the footer, `sameAs`, `llms.txt` or the sitemap.

## 3. Market and offer

| Fact | Value | Status | Source |
|---|---|---|---|
| Primary market | UAE first, then GCC | CONFIRMED | Blueprint D3 |
| Primary conversion | Book a free AI automation audit | CONFIRMED | Blueprint D5 |
| Secondary contact | WhatsApp (floating button) | CONFIRMED | Blueprint D5 |
| Business model | Hybrid: custom projects + fixed-scope packages with "starting from" prices | PROPOSED | Blueprint D4 (awaiting final confirmation) |
| Services | See `Planning Folder/For Ai/DeepZeta Services Catalogue.md` (names used exactly) | CONFIRMED | Catalogue v1.1 |
| Prices | — | UNKNOWN | Owner to provide before a pricing page |
| Launch language | English; Arabic after launch | CONFIRMED | Owner, 2026-09-26 |

## 4. People (authors, E-E-A-T)

| Name | Role | Credentials | Profile links | Photo | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | UNKNOWN (owner to provide bios and photos) |

## 5. Proof

| Item | Value | Status |
|---|---|---|
| Case studies (min. 3 at launch) | — | UNKNOWN (need real, publishable numbers + client permission) |
| Client logos | — | UNKNOWN (need written permission) |
| Partner / certification statuses (Google Partner, Meta Partner, n8n, etc.) | — | UNKNOWN (need proof they are current) |
| Testimonials / reviews | — | UNKNOWN |

## 6. Numbers allowlist (for the `check:facts` gate)

Numbers that may appear in content. Each needs a source. Examples of allowed **generic** numbers (not claims): performance thresholds from Google's public Core Web Vitals definitions (2.5 s, 200 ms, 0.1), "24/7", "60 seconds" as a *service design target* (not a measured result).

| Number / phrase | Meaning | Source | Status |
|---|---|---|---|
| 60 seconds | Speed-to-Lead reply target (service design) | Catalogue 1B.1 | CONFIRMED as a target, not a measured result |
| 24/7 | Availability of AI agents (service design) | Catalogue 1A.1 | CONFIRMED as a capability |
| 2.5 s / 200 ms / 0.1 | Google "good" Core Web Vitals thresholds | Google web.dev | CONFIRMED (public definition) |
