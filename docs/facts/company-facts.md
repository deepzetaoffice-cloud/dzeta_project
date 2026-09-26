# Company Facts (single source of truth)

> **Applies to:** every page, schema node, footer, contact detail and piece of copy · **Precedence:** the only allowed source of business facts · **Last reviewed:** 2026-09-26

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
| Social profiles (`sameAs`) | — | UNKNOWN |

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
