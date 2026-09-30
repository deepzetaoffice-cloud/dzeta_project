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
| Brand name | Deepzeta AI | CONFIRMED | Owner, 2026-09-29 (replaces "deepzeta"; conflict C29) |
| Brand descriptor | AI Digital Solutions | CONFIRMED | Logo tagline |
| Positioning line | Deepzeta AI builds online growth for every business. | CONFIRMED | Services Catalogue v1.1 (brand spelling per C29) |
| Legal company name | Deepzeta Digital Solutions L.L.C. | CONFIRMED | Owner, 2026-09-29 (decision D2) |
| Legal entity type | Limited liability company (L.L.C.), its own legal company | CONFIRMED | Owner, 2026-09-29 (decision D2) |
| Trade licence issuing authority | Dubai Department of Economy and Tourism (DET) | CONFIRMED | Owner, 2026-09-29 |
| Trade licence number | — | PENDING (issued with the full licence) | Owner, 2026-09-29 |
| Founding date | 2026-08-02 | CONFIRMED | Owner, 2026-09-29 |
| Domain / canonical site URL | https://deepzeta.ai | CONFIRMED | Decision [0006](../decisions/0006-domain-deepzeta-ai.md) |

## 2. Contact (NAP must be byte-for-byte identical everywhere)

| Fact | Value | Status |
|---|---|---|
| Street address | Office #202, Al Hilal Bank Building, Al Qusais 2 | CONFIRMED (owner, 2026-09-29) |
| City / emirate / country | Dubai, Dubai, United Arab Emirates (ISO code `AE`) | CONFIRMED (owner, 2026-09-29) |
| Full address, one line (display) | Office #202, Al Hilal Bank Building, Al Qusais 2, Dubai, United Arab Emirates | CONFIRMED (owner, 2026-09-29) |
| Postal code / P.O. Box | — | UNKNOWN (UAE has no postal codes; a P.O. Box only if the owner has one) |
| Geo coordinates (office pin) | — | PENDING (created once the full licence is issued; copied from the Google Business Profile pin) |
| Phone (international format) | — | PENDING (registered number expected around 2026-10-09) |
| WhatsApp number | — | PENDING (with the phone number) |
| Public contact email | hello@deepzeta.ai | CONFIRMED (owner, 2026-09-29) |
| Opening hours | Monday to Saturday, 08:00–17:00 GST (UTC+4); closed Sunday | CONFIRMED (owner, 2026-09-29) |
| Google Business Profile URL | — | PENDING (created once the full licence is issued) |
| Social profiles (`sameAs`) | See §2.1 | CONFIRMED |

**Values that aren't confirmed yet are one variable each, never scattered.** They are the phone, WhatsApp, trade licence number, office pin and Google Business Profile (owner, 2026-09-29).
- Code reads every fact from one typed site config (`src/lib/site-config.ts`, built in P0/P4). A PENDING or UNKNOWN fact is `null` there.
- Everything that uses it hides itself while it's `null`:
  - schema `telephone`, `contactPoint`, `geo` and `hasCredential`
  - the Google Business Profile in `sameAs` (added to §2.1 when it exists)
  - the licence line in the legal pages
  - the footer, the contact page, `tel:` and `wa.me` links, and the WhatsApp button
- When a value arrives, it's updated in two places only: this table, then that one config field. Every page picks it up.

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
- Links open in a new tab with `rel="noopener noreferrer"` and an accessible name that includes the platform (e.g. "Deepzeta AI on LinkedIn").
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
| Service structure | The four pillars: AI Automation · Websites · Software · Growth & Ranking | CONFIRMED | Owner, 2026-09-29 (conflict C6) |
| Lead pillars | AI Automation and Websites (Custom-Coded High-Performance Websites, with SEO/GEO ranking built in) | CONFIRMED | Owner, 2026-09-29 |
| Industry focus at launch | None; all industries shown equally | CONFIRMED | Owner, 2026-09-29 |
| Prices | — | UNKNOWN | Owner to provide before a pricing page |
| Launch language | English; Arabic after launch | CONFIRMED | Owner, 2026-09-26 |

## 4. People (authors, E-E-A-T)

| Name | Role | Credentials | Profile links | Photo | Status |
|---|---|---|---|---|---|
| Jamsheed Khalid | Founder | UNKNOWN (owner to provide) | https://www.linkedin.com/in/jamsheed-khalid-343148b6/ · https://gravatar.com/maximumglitter2857dbbf77 | UNKNOWN (owner to confirm which photo) | CONFIRMED (name, role, profiles; owner, 2026-09-29) |

Bios for the founder and any team members are still UNKNOWN (owner to provide). Profile URLs are copied exactly as written here.

### 4.1 The founder's other companies

Source: owner, 2026-09-29.

| Company | Website | Physical office |
|---|---|---|
| Wasleen Interior Design | https://www.wasleen.com | Yes |
| Wasleen Pergolas | https://pergolas.wasleen.com | Yes |
| Wasleen Liminal Approvals | https://www.dubaiapprovalconsultants.com/ | Yes |
| Wasleen Digital Lab | https://www.wasleen.com/wasleen-digital | Not stated |

**Rules for agents**
- These are **separate businesses** from Deepzeta AI. Never share their name, address, phone or Google Business Profile with Deepzeta AI's NAP, and never add them to Deepzeta AI's `sameAs`.
- They appear only in the founder's visible bio (About page) and in his Person schema (08 §3), with the URLs exactly as written here.
- Wasleen is not a Deepzeta AI client or case study unless the owner confirms that, with publishable results (§5).

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
