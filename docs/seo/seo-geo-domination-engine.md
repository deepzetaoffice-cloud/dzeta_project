# SEO / GEO Domination Engine

> **Applies to:** every page's content, every URL, internal links, FAQs, E-E-A-T, robots/llms content and pSEO · **Precedence:** a rule file at 00 §3 level 3, beside `docs/ai/01–13`. [08](../ai/08-seo-geo-aeo-schema.md) owns technical SEO and schema; this file owns content architecture. Where they touch, both say the same thing, and a difference goes to the conflict register · **Last reviewed:** 2026-09-30

> **⏰ Reminder, pSEO:** programmatic SEO starts **only after V1 is complete**: every V1 row in the [URL registry](url-registry.md) is live, and Search Console shows stable indexing. At that point, remind the owner and write the pSEO plan from §10. The same reminder is in `CLAUDE.md` and [04](../ai/04-build-sequence.md) P12.

**Goal served:** *"A fast, custom-coded, **AI-search-ready** site that turns UAE business owners into **booked AI audits**, and **proves every claim it makes**."*

**Owner direction (2026-09-29/30):** this is not an article website. Pages stay visually stunning and choreographed. Content is deep but short-form, skimmable and structured. SEO and GEO are never traded for design, and design is never traded for SEO.

---

## 0. What this file owns, and what it doesn't

| Topic | Home |
|---|---|
| Content system, page-type blueprints, keyword/intent mapping, internal links, FAQ content, E-E-A-T, sources, images for GEO, robots/llms **content**, pSEO, measurement | **This file** |
| Every URL, planned or live | [url-registry.md](url-registry.md) (APPEND-ONLY) |
| Metadata, canonical, hreflang, schema graph, robots/llms/sitemap **mechanics** | [08](../ai/08-seo-geo-aeo-schema.md) |
| Voice, banned words, claims, showcase labels | [10](../ai/10-content-voice.md) |
| Effects, motion, the story arc | [13](../ai/13-experience-design.md) |
| How each surface looks (including the FAQ module) | [docs/design/](../design/README.md) |
| Business facts / external facts | [company-facts.md](../facts/company-facts.md) / [external-sources.md](../facts/external-sources.md) |

---

## 1. Principles: design and SEO are one system

1. **Every section is a designed answer.** One section answers one question:
   - an H2 in the reader's own words
   - a 40–75-word answer (08 §2.3)
   - a **visual module** whose final state is real HTML: steps, a table, a flow, cards or a proof instrument

   The visual is how the answer *feels*; the HTML is how it's *read* by people, crawlers and AI engines.
2. **Motion carries meaning; text carries facts.** Animation never replaces text, hides it or delays it (13 §2.7, 08 §2.11). The LCP heading is visible at first paint.
3. **Depth on demand (two layers, both indexable):**
   - **Skim:** the H1, the direct answer, each section's answer and the visuals. A reader who only skims still gets the full story.
   - **Depth:** details panels, tables, step lists and examples, server-rendered in the HTML (a closed `<details>` is still in the page).
4. **No article walls.**
   - Paragraphs are at most 3 sentences and about 60 words.
   - Every 250 words of running text has at least one structural element (list, table, steps, cards, figure).
   - Pages read like a well-designed product tour, not a blog post.
5. **Non-commodity content wins.** Google's guidance for AI features rewards "unique expert or experienced takes that go beyond common knowledge" ([Google, 2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). Every money page carries **at least two** of:
   - our real build workflow and the named tools we use
   - a UAE-specific detail with an official source (PDPL, e-invoicing, platform policy)
   - a live proof element (demo, Deepzeta Sync tool, or this site's own measurements)
   - a decision aid ("Is this right for you?", a comparison table)
   - a labelled example ("Example conversation", "Demo · sample data")
   - first-party data (our measurements, our aggregates)
6. **Written for people, not chunked for machines.**
   - No keyword stuffing.
   - No text written "for the AI".
   - No splitting content into fragments to game retrieval.

   Google says no special writing is needed for AI features. Clear, structured, entity-first writing serves both.
7. **Entity-first and answer-first** (08 §2.2–2.4). Name the service, the platform and the place. The first sentence of every answer stands alone when quoted.
8. **Honesty is the ranking strategy.** N3 applies to every word.
   - no invented numbers, clients, reviews or guarantees
   - examples are labelled
   - numbers come from the facts file or the [citation register](../facts/external-sources.md)
9. **Every page sells, politely.** Each page has one next step on the conversion ladder (§5.2), ending at **Book a free AI audit**.
10. **One page, one intent.** Two URLs never compete for the same search intent (§4).

---

## 2. Content modules (the designed-content library)

Content lives as typed data in `src/content/en/` (06 §3.2). Each block has a module type. Components render modules with effects **by ID only** (13 §4); this table never invents effects.

| Module | HTML | Text limits | Visual (effect IDs) | Schema tie-in |
|---|---|---|---|---|
| `hero-answer` | H1 + `<p>` direct answer + CTAs | H1 ≤ 70 characters; direct answer 40–60 words | Statement type; CTA `hover-charge` | WebPage `description` source |
| `answer-section` | `<section aria-labelledby>` + H2 + lede `<p>` | lede 40–75 words | `scroll-reveal` | — |
| `fact-strip` | `<dl>` of 2–4 facts | each ≤ 12 words + source | `glass-frost` cards | — |
| `steps` | `<ol>` with a title + text per step | 3–7 steps, each ≤ 30 words | `story-flow` (visible list stays) | HowTo (when visible) |
| `compare-table` | `<table>` + `<caption>` + `scope` | ≤ 7 columns | glass table styling | ItemList (comparisons) |
| `before-after` | two labelled lists or `<figure>` | ≤ 5 rows | `story-before-after` | — |
| `definition` | `<dfn>` + `<p>` | 1-sentence definition ≤ 25 words | calm | DefinedTerm (glossary) |
| `who-its-for` | cards or list | ≤ 6 items, each ≤ 30 words | `hover-card` | `audience` (when used) |
| `deliverables` | `<ul>` | ≤ 8 items, each ≤ 20 words | `scroll-reveal` | — |
| `integrations` | list of platform names as text | names only | `scroll-drift` | `mentions` (optional) |
| `proof` | measured result, live demo or tool embed | real only | the matching demo/instrument | — |
| `depth-drawer` | `<details>` + `<summary>` | ≤ 250 words inside | calm | — |
| `faq` | see §6 and `docs/design/faq.md` | §6.3 | the FAQ module | FAQPage |
| `next-step` | CTA band | ≤ 30 words | `hover-charge`, `pointer-magnet` | — |
| `related` | `<nav aria-label>` with 3–6 cards | card ≤ 30 words | `hover-card` | — |
| `sources` | `<ol>` of citations | title, publisher, date checked | calm | `citation` (articles) |
| `byline` | author, "Last updated", "Reviewed" | — | calm | `author`, `dateModified`, `lastReviewed` |
| `toc` | `<nav aria-label="On this page">` with anchor links | — | sticky on desktop | — |
| `key-takeaways` | `<ul>` of 3–5 points | each ≤ 25 words | `glass-tint` box | — |

**Global text limits:**
- list item ≤ 20 words
- card ≤ 30 words
- body sentences ≤ 20 words on average (10 §1)
- one statement headline per page (05, 13)

---

## 3. Page-type blueprints

**Word ranges are editorial guardrails, not ranking factors:** enough to answer fully, never padding. The counts cover visible main-content text (no nav or footer). Schema per type: 08 §3. Tier per type: the registry (decision 0011: content pages are T2).

| Page type | Intent | Visible words | FAQ | Contextual links | Must include |
|---|---|---|---|---|---|
| Home | brand + category | 900–1,400 | 8 | 8–12 | the four pillars, the lead services, the audit, one proof |
| Hub (services, solutions, industries, resources, tools) | navigational | 500–1,000 | 4–6 | every child + cross-hub | a directory with one line per child, a chooser |
| Pillar | category chooser | 1,200–2,000 | 6–8 | 8–12 | "Which one do you need?" decision aid, services directory by sub-group, add-ons listed |
| Service, lead 🔥 | commercial | 1,200–1,800 | 6–8 | 5–8 | ≥ 2 non-commodity items (§1.5), steps, deliverables, proof or demo |
| Service, core ⭐ | commercial | 900–1,400 | 5–7 | 4–6 | ≥ 2 non-commodity items, steps, deliverables |
| Solution (bundle) | problem → system | 1,000–1,600 | 5–7 | 5–8 | a link to every component service, the system map, day-to-day flow |
| Industry group | vertical | 1,000–1,600 | 5–7 | 6–10 | each industry named, best-fit automations table (catalogue 7.5), compliance notes (7.6, sourced) |
| Free AI audit | transactional | 500–900 | 5–6 | 2–4 | what you get, steps, what to prepare, the form |
| Deepzeta Sync tool | transactional / informational | 500–900 + the result | 4–6 | 3–5 | method and data sources, privacy note (`docs/design/tools.md` anatomy) |
| Guide | informational | 1,500–2,500 | 4–6 | 6–10 | byline, key takeaways, table of contents, sources, next-step card |
| Comparison | investigation | 1,200–2,000 | 4–6 | 5–8 | verdict first, a dated comparison table, "choose X when…", disclosure |
| Glossary (one hub, anchored terms) | definitions | 150–300 per term | — | 1–2 per term | alphabetical index, `definition` module per term |
| About | trust | 700–1,200 | 3–5 | 4–6 | entity statement, founder, office, how we work |
| Founder profile | E-E-A-T | 400–800 | — | 3–5 | role, companies founded (facts §4.1), articles written, profiles |
| Contact | navigational | 200–400 | 3–4 | 2–3 | NAP, hours, channels |
| Editorial policy | trust | 500–900 | — | 3–4 | who writes, how AI is used, sources, corrections |
| Legal (privacy, terms) | trust | as drafted | as drafted | 2–4 | `docs/content-drafts/legal/` |

### 3.1 Section order per type (the text layer of the story arc, 13 §2)

The design specs own the look; these orders own what each section says. Story arc: Hook → Pain → System → Show → Proof → Plan → Action.

- **Home** (`docs/design/home.md` sections):
  1. Hero: H1 + direct answer naming Deepzeta AI, what we build (custom-coded websites with SEO/GEO built in, AI automation) and where (UAE first, GCC)
  2. Proof strip: platform names as text (catalogue §8)
  3. Problem → outcome: three pains in the owner's words, each with a 40–75-word answer
  4. Four pillars: name, promise (catalogue), one line, link
  5. Workflow explorer: visible steps
  6. Proof: this page's real measurements
  7. How we work: Audit → Build → Launch → Improve
  8. ROI calculator: formula shown
  9. Industries: 4 group tiles
  10. FAQ: 8
  11. Final CTA
- **Pillar:**
  1. Hero answer
  2. "Which one do you need?" (a problem → service table)
  3. Services directory by sub-group (cards with one outcome line; ➕ add-ons as unlinked one-liners)
  4. How we build (steps)
  5. Proof or demo
  6. Industries that use it
  7. FAQ
  8. Next step

  AI Automation keeps its Control Room sections (`automation.md`), with this content inside them.
- **Service:**
  1. Hero answer (what it is, who it's for, the outcome)
  2. The problem it solves (`before-after`)
  3. How it works (`steps` with `story-flow` or `story-chat`)
  4. What you get (`deliverables`)
  5. Works with (`integrations`)
  6. Is it right for you? (`who-its-for`, decision aid)
  7. Proof or try it (demo/tool)
  8. UAE specifics with sources (consent, Arabic support, platform policy)
  9. Pairs well with (➕ add-ons, the bundle that includes it)
  10. FAQ
  11. Next step
  12. Related
- **Solution (bundle):**
  1. Hero answer
  2. The problem (pain)
  3. The system: every component service, linked, in a `story-system-map`
  4. How it runs day to day (`steps`)
  5. What's included (a table linking each service)
  6. Who it's for (industries, catalogue 7.5)
  7. Proof
  8. FAQ
  9. Next step
- **Industry group:**
  1. Hero answer listing every industry in the group by name
  2. The pains these businesses share
  3. Best-fit automations per industry (a table; each automation links to its service)
  4. Compliance notes (catalogue 7.6, with official sources)
  5. A labelled example workflow
  6. FAQ
  7. Next step
- **Guide:**
  1. H1 as the question or "How to…"
  2. Byline
  3. Direct answer
  4. Key takeaways
  5. Table of contents
  6. Answer-first sections with tables and steps
  7. Sources
  8. Next-step card (service + tool)
  9. FAQ
  10. Related
- **Comparison:**
  1. Verdict first: who each option suits, in 40–60 words
  2. The comparison table (every fact sourced and dated "as of")
  3. "Choose X when…"
  4. Our honest position, disclosing which tools we build with
  5. FAQ
  6. Next step

  No disparaging language. Vendor facts come from vendor documentation, with the check date.
- **Glossary:**
  - an alphabetical index
  - per term: an H2 term, a one-sentence definition (≤ 25 words), 1–2 short paragraphs with a real example, and a link to the service or guide
  - a term earns its own URL only when it can carry 500+ words of non-commodity content (then it's a guide)
- **About:**
  1. Entity statement (who, legal name, where, founded)
  2. Founder (links his profile)
  3. How we work
  4. What we prove on this site (live proof, not claims)
  5. Office, hours, licence (variable)
  6. FAQ
- **Founder profile:**
  - name and role
  - bio (UNKNOWN until the owner provides it)
  - companies founded (facts §4.1, exact URLs)
  - areas of expertise (CONFIRMED only)
  - articles by him
  - profile links
- **Editorial policy:**
  - who writes and reviews: Jamsheed Khalid is the named author and reviewer
  - how AI tools are used: they help draft and check; a person reviews every page before it's published
  - where facts come from (the facts file, the citation register)
  - how corrections work ({email})
  - the review cadence (§7.4)
  - no paid placements

---

## 4. Keyword, intent and cannibalisation

1. **Every registry row has one primary intent**, written as a plain sentence, such as "a UAE business owner wants WhatsApp replies answered automatically, in Arabic and English".
2. **Research sources, recorded in the page plan:**
   - Google autocomplete and People Also Ask
   - Bing
   - the AI engines' follow-up questions
   - Search Console queries (after launch)
   - the owner's real sales questions

   **Never invent search volumes.** If a tool's numbers are used, name the tool and the date.
3. **Cannibalisation guard:** a new row must say how its intent differs from its nearest sibling. Examples:
   - pillar vs flagship: `/services/websites` is "which website service do I need?", while `/services/custom-coded-websites` is "build me a fast, custom site"
   - tool vs service: `/tools/website-ai-search-health-check` is the only page for catalogue 0.3
4. **Language:** UAE English. The keyword research and the copy use the words buyers use (for example "WhatsApp automation", "AI receptionist"). Catalogue names stay exact in headings and schema (10 §2).
5. **Local signals:** Dubai, UAE and the GCC appear where they're true (the office, the market, the regulators). Never lists of neighbourhoods as keyword stuffing; location depth belongs to pSEO with real local data (§10).

---

## 5. Internal linking: spider-web + sales-driven

### 5.1 Link layers

| Layer | Where | Rule |
|---|---|---|
| Global | header, mega menu, footer | Only shipped pages (04 §1.4); hrefs equal canonicals (08) |
| Structural | breadcrumbs, hub directories | Every inner page has a visible breadcrumb trail; every hub lists all its children |
| **Contextual** | inside the prose | The budget per type in §3; the rules in §5.3 |
| Related rail | end of page | 3–6 cards, generated from the catalogue relationship graph (08 §3), never hand-listed |
| Next step | the CTA band | One rung up the conversion ladder (§5.2) |

### 5.2 The conversion ladder (sales-driven linking)

**Learn** (guide, glossary) → **Compare** (comparison, solution) → **Try** (Deepzeta Sync tool, live demo) → **Talk** (Book a free AI audit).

- Every page links **at least one rung up**.
- **Informational pages** link contextually to at least one money page (service or solution) and to the audit.
- **Money pages** (service, solution, pillar, industry) link to proof: a guide, a tool or a demo. Proof lowers the risk of booking.
- **FAQ answers** may carry one contextual link, usually to a service or the audit.

### 5.3 Contextual link rules

1. **Link roles per page:**
   - up: the hub or pillar
   - sideways: siblings
   - down: children
   - cross-type: service ↔ solution ↔ industry ↔ guide ↔ glossary
   - commercial: service or audit

   A money page covers at least 3 roles; an informational page at least 3, one of them commercial.
2. **Anchors:**
   - descriptive, 2–8 words, naming the target's topic (entity names welcome)
   - varied across the site: the same exact anchor to the same target at most 3 times sitewide
   - never "click here", "learn more", "read more", "this page", or a bare URL
3. **Placement:**
   - spread over at least 3 sections
   - at most 2 links per paragraph, never adjacent
   - at most one link in the direct answer; none in the H1
4. **No duplicate targets** in the prose of one page. The first mention wins.
5. **Registry-only targets.** Every href comes from a typed route helper fed by the registry. There are no hand-typed internal URLs and no links to unshipped pages.
6. **Glossary auto-link:** the first mention of a glossary term links to its definition, at most 3 per page, never inside headings, FAQ questions or CTAs.
7. **Orphans and depth:**
   - every indexable page has at least 3 inbound contextual links
   - click depth from Home is at most 3
8. **Arabic (P11):** Arabic pages link to Arabic pages (11 §2).

### 5.4 Checks (`check:links`, extended in P4)

- the link budget per page type
- banned anchors
- duplicate targets
- anchor over-reuse
- orphans (fewer than 3 inbound links)
- click depth greater than 3
- links outside the registry, or to unshipped pages

External citation links go in a weekly link-rot report, which warns but doesn't block.

---

## 6. FAQ system

### 6.1 Where the questions come from (the question bank)

- **Real buyer questions:**
  - sales calls and WhatsApp conversations (the owner logs them)
  - Search Console queries (after launch)
  - Google People Also Ask
  - the AI engines' follow-up questions
- **The bank** lives in `src/content/en/faq-bank.ts` (P4). Each question has a stable id, a single home URL and a topic.
- **Topic coverage per money page:**
  - cost (what drives it; prices only when real)
  - timeline (only confirmed timeframes)
  - data safety and PDPL
  - Arabic support
  - integrations
  - ownership
  - results (no guarantees)
  - support after launch

### 6.2 Rules

1. **Unique per URL:** a question lives on exactly one page. Other pages link to it (`#faq-<id>`) instead of repeating it. `check:content` enforces sitewide uniqueness.
2. **Count per page type:** the table in §3.
3. **Order:** the most-asked question first; cost and timeline early; the "Still have a question?" card last.
4. **Parity:** the visible text equals the FAQPage JSON-LD word for word (08 §3.7).

### 6.3 Answer format

- The first sentence answers directly (≤ 25 words) and stands alone.
- The whole answer is 40–90 words, entity-first, with no hedging filler.
- At most one contextual link (§5.2), and numbers only from the facts file or the citation register.

### 6.4 Design

The FAQ is a signature module, not a plain accordion wall: see [`docs/design/faq.md`](../design/faq.md) (status LAB until validated in the Design Lab).

---

## 7. E-E-A-T and sources

### 7.1 Experience

- **The site is the case study:**
  - the speed chip and Page Nutrition Label (real measurements of this visit)
  - AI View (the page's real schema)
  - "Watch this page build itself"
  - real build and Lighthouse logs (`story-terminal`)
- **Guides** include "how we did it" notes from real builds.
- **Client work** appears only with written permission and real numbers (facts §5). The founder's Wasleen companies appear as case studies only if the owner confirms them with publishable results (facts §4.1).

### 7.2 Expertise

- **The author:** Jamsheed Khalid (facts §4) is the byline author of guides and comparisons. His profile page is `/about/jamsheed-khalid` (ProfilePage + Person, 08 §3).
- **His bio, photo and credentials** appear only once CONFIRMED. They're needed before the W3 resources ship.
- **Every guide shows a byline:**
  - author name linking to the profile
  - "Last updated" = `dateModified`, changed only when the content really changes (02 §1.5)
  - "Reviewed by … · date", only after a recorded review (`lastReviewed` / `reviewedBy`)

### 7.3 Authority and trust

- **One consistent entity:**
  - the same name, NAP and `sameAs` everywhere (facts file; 08 §3)
  - the Google Business Profile when it exists
  - the LinkedIn company page
- **Citations to official sources:** Google, Meta, WhatsApp, UAE government portals, and the laws by their official names.
- **Trust pages:** privacy, terms, `/editorial-policy`, the licence line (a variable), a visible office address and hours.
- **Never:** fake reviews, invented stats strips, partner badges without proof, authority or client logos without permission.

### 7.4 Review cadence

| Content | Review every | Trigger for an early review |
|---|---|---|
| Money pages (service, solution, pillar, industry) | 6 months | A price, scope or process change |
| Guides and comparisons | 6–12 months | A platform or vendor change |
| Volatile topics (platform policies, UAE regulation, e-invoicing dates) | 3 months | An official announcement |
| Legal pages | 12 months | A provider or law change |

A review that changes nothing updates only `lastReviewed`, never "Last updated".

### 7.5 Sources and citations

1. **External facts** (numbers, dates, laws, platform rules) come only from the [citation register](../facts/external-sources.md). Agents propose entries; the owner approves them. Approved numbers join the `check:facts` allowlist.
2. **Citation format:**
   - a `sources` module: title, publisher, and the date the page was last checked
   - inline links to the official page
   - outbound citation links are followed (no `nofollow`) and open with `rel="noopener"`
3. **Density:** 08 §2.5 asks for one quotable fact every ~150–200 words **where a relevant real fact exists**. Never pad with weak facts to hit a count.
4. **No competitors' sales pages as sources** (08 §2.8). Comparisons cite vendors' own documentation, with the check date.

---

## 8. Images and video for GEO

- **Imagery:** the three families in 13 (brand renders, real or labelled product screens, UAE context photography). Never stock clichés.
- **Filenames:** `{subject}-{context}.avif`, lowercase kebab-case, descriptive (for example `whatsapp-ai-agent-booking-flow.avif`).
- **Alt text** describes what the image shows, for someone who can't see it. It is never keyword-stuffed, and it's written or reviewed by a person. Decorative images use `alt=""` (10 §6).
- **Captions:** meaningful images sit in a `<figure>` with a `<figcaption>` when the caption adds information.
- **Image registry:** an image registry (`src/content/images.ts`, P4) maps each file to its alt text, caption and topic, so pages never hand-type alt text.
- **Schema:** each page's main image is `primaryImageOfPage` (ImageObject, 08 §3). Each page type has an OG image template, and `check:seo` confirms it returns 200.
- **Video:** only real videos (the YouTube channel exists). Each gets a transcript on the page and `VideoObject` only when the video is embedded and visible.

---

## 9. robots.txt, llms.txt, llms-full.txt, sitemap, IndexNow

The mechanics (route handlers, headers, static generation, tests) live in 08 §4–6. This section owns what the files say.

### 9.1 robots.txt (decision 0010: every crawler has full access)

```
# Deepzeta AI · robots.txt · generated · bot list verified <date> against vendor docs
User-agent: *
Allow: /
Disallow: /api/

# AI search, AI assistants and AI training crawlers: the same access, listed by name
# so the owner can change one bot in one line later.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Bytespider
User-agent: Meta-ExternalAgent
Allow: /
Disallow: /api/

Sitemap: {SITE_URL}/sitemap.xml
```

- **Verify every name in P9** against each vendor's documentation, and record the check date in the header comment (08 §5). Candidates to check: Applebot, Amazonbot, DuckAssistBot, MistralAI-User, Google-CloudVertexBot, meta-externalfetcher, cohere-ai.
- **Never block `/_next/` or OG image routes.** Utility pages use `noindex`, not robots blocks, so crawlers can see the `noindex`.
- **Non-production deployments** serve `User-agent: *` / `Disallow: /` (08 §1).

### 9.2 llms.txt: a curated index ([llmstxt.org](https://llmstxt.org) format)

```
# Deepzeta AI

> Deepzeta AI (Deepzeta Digital Solutions L.L.C.) is a Dubai-based agency, founded in 2026,
> that builds custom-coded, high-performance websites with SEO and AI-search optimisation
> built in, and AI automation systems for businesses in the UAE and the GCC.

Office: {address}. Hours: {hours}. Email: {email}. Languages: English (Arabic after launch).
Founder: Jamsheed Khalid.

## AI Automation
- [WhatsApp AI Agent]({SITE_URL}/services/whatsapp-ai-agent): one factual sentence.
…
## Websites
## Software
## Growth & Ranking
## Solutions
## Industries
## Deepzeta Sync (free tools)
## Resources
## Company
- [About], [Contact], [Book a free AI audit], [Editorial policy], [Privacy], [Terms]
## Optional
- lower-priority links
```

**Rules:**
- **Generated from the same content data**, never hand-edited.
- **The blockquote** holds only facts from the facts file, with no marketing words.
- **Each entry** is one self-contained factual sentence.
- **pSEO pages** appear only through their hubs.
- **Excluded:** noindex routes and Studio concepts.

### 9.3 llms-full.txt: the knowledge base

One block per indexable page, in registry order, **knowledge fields only**:

```
---
## {Page title}
URL: {absolute URL} · Last updated: {dateModified}

### Direct answer
{direct answer}

### Key facts
| Fact | Value |
|---|---|

### {Section heading}
{section answer, then its list, table or steps as Markdown}

### FAQ
Q: {question}
A: {answer}
```

**Rules:**
- **Include:** direct answers, section answers, steps, deliverables, tables and FAQs.
- **Exclude:** CTAs, nav, footer, hero slogans, marketing strings, demo UI text, and the consent banner and Cookie settings (interface copy in `src/content/en/legal/consent.ts`; pages come from registry rows, never from walking a content folder; the owner, 2026-10-02).
- **Built** by one formatter per content type (a registry pattern, so new types plug in without edits).
- **If the file passes 500 KB,** split it by pillar (`/llms/ai-automation.txt` and so on) and list the parts in llms.txt.

### 9.4 The honest note

**Google Search doesn't use llms.txt** ([Google, 2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). These files serve AI assistants and agents (ChatGPT, Claude, Perplexity and others) that read them. They cost almost nothing, so we keep them, but they are **not** a Google ranking lever. Google visibility comes from §1–§8.

### 9.5 Sitemap and IndexNow

- **Sitemap** rules are in 08 §6. It becomes a sitemap index when pSEO starts (`/sitemaps/core.xml`, `/sitemaps/<dimension>.xml`).
- **RSS:** `/resources/rss.xml` for guides and comparisons (P8).
- **IndexNow (proposed for P10):** on each production deploy, changed URLs are pinged to IndexNow (Bing, which powers Microsoft Copilot answers, plus other participating engines). The key is published as a file at the site root. Its env var name is set in the P10 plan.

---

## 10. pSEO (after V1: see the reminder at the top)

**Status: LATER.** This section is the brief for the pSEO plan, written once V1 is complete.

### 10.1 Why the gates are strict

Google's [scaled content abuse policy](https://developers.google.com/search/docs/essentials/spam-policies) treats many pages made mainly to rank, "no matter how it's created", as spam. So every pSEO page must carry real, specific value that its siblings don't.

### 10.2 Candidate dimensions (reserved URL patterns in the registry)

- **The 27 individual industries** (catalogue §7): `/industries/<industry>`
- **Industry × emirate**, for the catalogue 7.5 best-fit services: `/industries/<industry>/<emirate>`. Only where local facts really differ (regulators, platforms, customer habits).
- **Platform integrations** (catalogue §8), for example WhatsApp + HubSpot or n8n + Zoho: `/integrations/<slug>`
- **Tool-vs-tool comparisons:** `/resources/<a>-vs-<b>`
- **Glossary terms** promoted to guides
- **Later:** GCC countries, and Arabic partners (P11)

### 10.3 Quality gates (a page that fails is held, never published)

1. **Fact pack per dimension:** real, verified facts with official sources (the citation register). A number that isn't in the pack holds the page.
2. **Similarity:** no more than 30% similar to sibling pages (a paragraph-level diff or embedding check).
3. **Content:** word ranges per §3; at least 4 unique FAQs; link rules per §5; one image with reviewed alt text; a unique title, description and H1.
4. **Human review:** the whole pilot, then 1 in 5 pages of every batch.
5. **Through pull requests only:** never a direct push to `main` (12 §1).

### 10.4 Velocity and pruning

- **Velocity:** a pilot of 10 pages, then a 2–4-week index check, then batches of up to 10 a week.
- **Scaling up** only while at least 70% of published pages are indexed within 30 days and there are no manual actions.
- **Pruning:** after 90 days, pages with no impressions and no unique value get `noindex` or are merged into their hub.

### 10.5 The engine

- **The queue** lives in git.
- **Drafting** uses DeepSeek through the project's AI stack (decision 0016); the model is chosen in the pSEO plan.
- **Output** is typed content files, checked by the same gates as hand-written pages.
- **Arabic** pSEO follows 11 §3 (native writing, human sign-off), never machine translation.

---

## 11. Measurement

| Signal | Tool | Cadence |
|---|---|---|
| Rankings, clicks, queries per cluster | Google Search Console (Performance) | Weekly |
| Visibility in AI Overviews / AI Mode | Search Console **Generative AI performance report** ([Google, 2026](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)) | Weekly |
| Bing and Copilot visibility | Bing Webmaster Tools | Weekly |
| Indexed ÷ built pages | Search Console indexing report vs the registry | Weekly |
| AI citations | A monthly panel: about 20 real buyer questions asked in ChatGPT, Perplexity, Gemini, Copilot and Claude; log whether Deepzeta AI is cited and which URL | Monthly |
| AI-assistant traffic | A GA4 custom channel group, "AI assistants" (referrers such as chatgpt.com and perplexity.ai), set up from the owner checklist in P3 | Monthly |
| Audits booked per cluster and landing page | GA4 (`generate_lead`) + the CRM | Monthly |
| Content decay | Pages losing more than 30% of clicks over 90 days → review (§7.4) | Quarterly |

**After launch:** 30-day and 90-day reviews (crawl errors, indexing, AI citations, content gaps), each ending in a short plan.

---

## 12. Gates and governance

- **`check:content`** (planned in [03](../ai/03-verification-gates.md), built in P4):
  - word ranges per page type
  - paragraph length
  - direct answer 40–60 words
  - section ledes 40–75 words
  - FAQ count per type and **sitewide question uniqueness**
  - FAQ answer length
  - heading order
  - banned words (10 §4)
  - required modules per type (§3)
- **`check:links`** (extended): §5.4.
- **`check:seo`** and **`check:schema`**: 08 and 03, unchanged.
- **The reviewer** checks every page plan and diff against §3 (the blueprint), §5 (links) and §6 (FAQ).
- **The SEO/GEO Auditor** audits against this file and 08.
- **New pages** follow the registry process ([url-registry.md](url-registry.md) §2).

---

## 13. The owner's reference plans: adopt, improve, leave

These were read in full on 2026-09-30:
- `pseo-domination-engine-plan.md`
- `pseo-manual-internal-linking-plan.md`
- `geo-phase-13-plan.md`
- `geo-seo-spiderweb-linking-plan.md`

**Adopt:**
- fact sheets as the only source of numbers (our citation register)
- the page-kind taxonomy with a schema stack per kind
- the quality gate: word counts, similarity to siblings ≤ 30%, FAQ ≥ 4, links, an image with alt text
- 4–6 contextual links with the anchor and placement rules
- automatic sitemap and llms inclusion
- the llms.txt / llms-full.txt structure
- GEO writing rules: objectivity, tables, entity-first, answer-first, explicit steps
- cross-type and cross-hub linking, with backlinks computed from parent relations
- post-launch reviews at 30 and 90 days
- an image registry and naming convention

**Improve:**
- pages with unverified numbers are **held**, not published with a "pending" badge
- batches go through pull requests, never automatic pushes to `main`
- velocity follows the share of pages indexed, not a fixed 9 pages a day
- Arabic follows the native-writer rule, not machine output; drafting keeps DeepSeek as the provider (decision 0016), with the model chosen in the pSEO plan
- link rules are checked by machine, not by hand
- entity-first writing is done by the author, not by regex rewriting (08 §4)
- llms-full carries knowledge fields only, no sales copy

**Leave:**
- QAPage schema on our own content (08 §3.8)
- sitemap `priority` and `changefreq`, and sitemap entries for the `.txt` files
- hardcoded hero copy and hardcoded news cards
- stats strips without real data ("52+ / 500+")
- lists of neighbourhood names as keyword stuffing
- "Read more →" anchors
- government-authority logos
- alt text written by AI without review
- "allow all" robots without an AI bot inventory

---

## Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-30 | Created: content system, page blueprints, linking, FAQ, E-E-A-T, robots/llms content, pSEO brief, measurement | Owner (plan approval, 2026-09-30) |
