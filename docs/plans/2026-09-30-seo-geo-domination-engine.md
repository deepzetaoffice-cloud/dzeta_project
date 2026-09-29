# Plan: SEO / GEO Domination Engine — designed content, URL registry, linking, FAQ, E-E-A-T, robots & llms, pSEO

Status: APPROVED (owner, 2026-09-30) · DONE (same day) · Phase: P-1 (docs and rules only, no application code) · Branch: `docs/seo-geo-domination-engine` (from `docs/seo-schema-legal`, since that PR isn't merged yet)

**Goal served:** *"A fast, custom-coded, **AI-search-ready** site that turns UAE business owners into **booked AI audits**, and **proves every claim it makes**."*

## Context

**The request.** The owner wants a content system that ranks in Google and AI engines without turning the site into an article site. The design stays choreographed and visual. The content is deep but compact and skimmable, and follows E-E-A-T. The system also needs:
- every URL listed up front, as a living registry with rules for adding pages
- internal links that drive sales
- a beautifully designed FAQ
- robots, llms and llms-full done brilliantly
- pSEO after V1, with a reminder set

Four reference plans from the owner's other site were examined in full (adopt / improve / leave in §7).

**Owner decisions (2026-09-29):**
- **V1 service pages:** the four pillars, plus a page for every 🔥 lead and ⭐ core service and every bundle. ➕ add-ons live inside other pages.
- **Industries:** the catalogue's 4 groups.
- **Author:** Jamsheed Khalid is the byline author.
- **AI training crawlers:** full access.

**What I checked:**
- **Google's current guidance** ([AI optimisation guide, May 2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)):
  - no special optimisation is needed for AI Overviews or AI Mode
  - "non-commodity" first-hand content wins
  - don't "chunk" content for AI
  - **Google Search doesn't use llms.txt**
- **Google's [scaled content abuse policy](https://developers.google.com/search/docs/essentials/spam-policies):** mass pages made to rank, "no matter how it's created", are spam. This is what sets the pSEO gates.
- **Search Console now has a [Generative AI performance report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)**, which we use for measurement.
- **The catalogue:** 82 numbered services (13 🔥 lead, 46 ⭐ core, 23 ➕ add-on), plus 6 bundles and 4 care items.
- **The blueprint:** its page map ("about 42 pages") predates these decisions. C32 records the differences.

## 1. The core idea: every section is a "designed answer"

Design and SEO are one system:
- **One section = one question.** An H2 in the reader's words, then a 40–75-word answer, then a **visual module** whose final state is real HTML: steps, a comparison table, a flow, cards or a proof instrument.
- **Motion carries the meaning; text carries the facts.** Animation never replaces text (13 §2.7, 08 §2.11).
- **Depth on demand.** Each page has two layers:
  - **Skim:** the H1 and direct answer, section answers, and the visuals.
  - **Depth:** details panels, tables and steps.
  - Both layers are server-rendered HTML, so they're indexable and quotable.
- **No article walls.** Paragraphs are at most 3 sentences (about 60 words), with a structural element at least every 250 words.

**Content modules** (a typed library, each mapped to existing effect IDs, never new effects):
- `hero-answer`, `answer-section`, `fact-strip` (real or sourced numbers only), `steps` (HowTo-able), `compare-table`, `before-after`
- `definition`, `who-its-for`, `deliverables`, `integrations`, `proof`, `depth-drawer`, `faq`
- `next-step` (sales), `related` rail, `sources`, `byline`

**Non-commodity rule (information gain).** Every money page carries at least two of:
- our real build workflow and tools
- a UAE-specific detail with an official source
- a live proof element (demo, tool or this site's own measurements)
- a decision aid ("is this right for you", or a comparison)
- a labelled example
- first-party data

## 2. Page-type blueprints (engine §3)

Word ranges are editorial guardrails, not ranking factors: long enough to answer fully, short enough to avoid walls. The schema per type stays in 08 §3.

| Page type | Search intent | Visible words | FAQ | Contextual links |
|---|---|---|---|---|
| Home | brand + category | 900–1,400 | 8 | 8–12 |
| Pillar (4) | category chooser | 1,200–2,000 | 6–8 | 8–12 |
| Service, lead 🔥 | commercial | 1,200–1,800 | 6–8 | 5–8 |
| Service, core ⭐ | commercial | 900–1,400 | 5–7 | 4–6 |
| Solution (bundle) | problem → system | 1,000–1,600 | 5–7 | 5–8 (every component service) |
| Industry group | vertical | 1,000–1,600 | 5–7 | 6–10 (catalogue 7.5 fits) |
| Free AI audit / tool page | transactional | 500–900 | 4–6 | 2–5 |
| Guide (bylined) | informational | 1,500–2,500 + key takeaways box | 4–6 | 6–10 |
| Comparison | investigation | 1,200–2,000 + a real table | 4–6 | 5–8 |
| Glossary (one hub, anchored terms) | definitions | 150–300 per term | — | 1–2 per term |
| About / founder profile | trust | 700–1,200 / 400–800 | 3–5 / — | 4–6 / 3–5 |

Each blueprint also maps sections to the story arc (Hook → Pain → System → Show → Proof → Plan → Action, 13 §2).

**Text limits:**
- direct answer: 40–60 words
- FAQ answer: 40–90 words, with the first sentence (≤ 25 words) answering directly
- card: ≤ 30 words
- list item: ≤ 20 words

## 3. V1 URL registry (`docs/seo/url-registry.md`, APPEND-ONLY)

**Slug rules:**
- lowercase kebab-case, derived from the exact catalogue name
- no `&`/`and` where it still reads well; ≤ 5 words
- no trailing slash; stable forever (a change needs a 301 in the same plan)
- **one primary intent per URL:** a new row must say how it differs from its nearest sibling (cannibalisation guard)

**Registry columns:** URL · type · pillar/cluster · catalogue ref · intent · tier · phase · wave · status · index · owner inputs needed.

**Adding a page:**
1. The owner has an idea.
2. A row goes in with status `proposed`.
3. The owner approves it.
4. It gets a page plan.

Nothing is built or linked without a row (04 §1.4).

**The V1 list** (about 101 indexable English pages):

**Core and company (T1/T2)**
- `/`
- `/free-ai-audit` (0.1, the primary conversion page)
- `/about`
- `/about/jamsheed-khalid` (founder ProfilePage)
- `/contact`
- `/privacy`, `/terms`
- `/editorial-policy` (a new trust page: how we write, review, and use AI)

**Services hub and pillars:** `/services`, `/services/ai-automation` (the Control Room), `/services/websites`, `/services/software`, `/services/growth-ranking`

**AI Automation, 33 pages:**

| Group | URLs |
|---|---|
| AI agents | `/services/whatsapp-ai-agent`, `ai-voice-receptionist`, `ai-outbound-calling-agent`, `website-ai-chat-agent`, `omnichannel-inbox-ai`, `internal-knowledge-assistant`, `custom-ai-agents` |
| Sales and leads | `speed-to-lead-system`, `ai-lead-qualification-scoring`, `automated-quotation-tracking`, `proposal-automation`, `sales-follow-up-nurture`, `crm-setup-automation` |
| Booking | `booking-automation-system`, `appointment-reminders-no-show-reduction`, `viewing-site-visit-scheduling` |
| Customer service and retention | `ai-customer-support-automation`, `ticketing-complaint-tracking`, `review-reputation-automation`, `loyalty-renewal-win-back-automation` |
| Operations | `job-work-order-management`, `preventive-maintenance-scheduling`, `inventory-stock-automation`, `task-approval-workflows` |
| Finance | `invoicing-payment-collection`, `uae-e-invoicing`, `ai-document-data-extraction` |
| HR, marketing, e-commerce, data | `recruitment-automation`, `email-whatsapp-marketing-automation`, `ai-content-engine`, `store-operations-automation`, `ai-shopping-visibility`, `automated-business-dashboards` |

**Websites, 4 pages:** `custom-coded-websites` (flagship), `landing-pages-cro`, `ecommerce-websites`, `website-redesign-migration`

**Software, 4 pages:** `web-application-development`, `client-customer-portals`, `internal-tools-admin-dashboards`, `custom-software-development`

**Growth & Ranking, 15 pages:**

| Group | URLs |
|---|---|
| Search and AI visibility | `ai-citation-aeo-geo`, `programmatic-seo`, `local-ai-dominance`, `performance-seo-retainer` |
| Paid ads | `google-ads`, `meta-ads`, `tiktok-snapchat-ads`, `linkedin-ads`, `ai-ad-creative` |
| Content and brand | `social-media-management`, `content-creation`, `graphic-design`, `influencer-marketing`, `branding-positioning`, `growth-strategy` |

**Other service pages:** `ai-readiness-assessment` (0.2) and `ai-ops-retainer` (6.1)

**Solutions: the 6 bundles** (the catalogue's "packaged solutions", the header's "6 Systems")
- `/solutions` (hub)
- `/solutions/ai-front-desk`, `quote-to-cash-system`, `get-found-by-ai`, `ecommerce-growth-engine`, `launch-pack`, `e-invoicing-ready`

**Industries: the catalogue's 4 groups**
- `/industries` (hub)
- `/industries/b2b-corporate-tech`, `ecommerce-consumer-brands`, `real-estate-construction-professional`, `local-medical-field-services`

**Deepzeta Sync (P7, shown once built)**
- `/tools` (hub)
- `/tools/website-ai-search-health-check`: this is also the page for catalogue 0.3, so there's only one URL for that intent
- `/tools/social-media-content-planner`
- `/tools/ai-automation-roi-calculator`

**Resources (P8, V1 set)**
- `/resources` (hub)
- `/resources/glossary`
- **Comparisons:** `n8n-vs-make-vs-zapier`, `ai-agent-vs-rpa`, `custom-coded-website-vs-wordpress`
- **Guides:** `what-is-an-ai-agent`, `what-is-geo-generative-engine-optimisation`, `whatsapp-business-automation-guide`, `core-web-vitals-explained` (using this site's live data), `uae-e-invoicing-guide` (official sources), `ai-automation-for-small-business-uae`

**Design pages:** `/studio` (index); `/studio/<slug>` concepts are LATER and noindex

**Blocked until the owner has facts**
- `/work` and `/work/<slug>`: need a real case study
- `/pricing`: needs prices
- App demo: URL decided in its session

**Never indexed:** `/thank-you` and the 404 page. `/api/` is disallowed.

**Build waves** (within V1, set in the registry):
- **W1:** core pages, hubs, pillars, the 13 lead services, bundles, company and legal pages
- **W2:** the core ⭐ services and industries
- **W3:** Deepzeta Sync and resources

The P6 pilot service page is reviewed before the rest (04 §1.6).

## 4. Internal linking: spider-web + sales-driven (engine §5)

**Layers:**
- global: header, mega menu, footer
- structural: breadcrumbs and hub directories
- **contextual:** in the prose, budget per type from §2
- `related` rail: 3–6 cards, generated from the catalogue relationship graph
- `next-step`: sales

**Conversion ladder:** Learn (guide, glossary) → Compare (comparison, solution) → Try (Deepzeta Sync tool, demo) → Talk (free AI audit).
- Every page links at least one rung up.
- Every informational page links contextually to at least one money page and the audit.
- Every money page links to proof: a guide, the tool or a demo.

**Link roles per page:** up (hub/pillar) · sideways (siblings) · down (children) · cross-type (service ↔ solution ↔ industry ↔ guide ↔ glossary) · commercial.

**Rules** (adopted from the owner's linking plans):
- **Anchors:** descriptive, 2–8 words, varied. Never "click here", "learn more" or "read more".
- **Placement:** spread across at least 3 sections; at most 2 per paragraph, never adjacent. One link may sit in the direct answer; none in the H1.
- **Targets:** no duplicate target in the prose of one page. Every href comes from the registry via a typed route helper.
- **Glossary terms:** the first mention on a page links to its definition, at most 3 per page.

**Machine checks** (`check:links`, extended in P4):
- the link budget per type
- banned anchors and duplicate targets
- **orphans:** every indexable page has at least 3 inbound contextual links
- **click depth:** at most 3 from Home
- links only to shipped pages

## 5. FAQ system + module design

**Content:**
- **The question bank:** real buyer questions from sales calls, WhatsApp, Search Console queries, People Also Ask, and AI-engine prompts.
- **Coverage per page:** cost, timeline, data safety, Arabic support, integrations, ownership, results.
- **Unique per URL:** a question lives on one page only; other pages link to it.
- **Answers:** the text matches the schema word for word (08). At most one contextual link per answer. Numbers only when sourced.

**Design** (a new spec, `docs/design/faq.md`, status LAB until validated in the Design Lab):
- **Desktop:** two columns. A sticky left column holds the heading, intro, topic chips (a no-JS fallback shows every question) and an "Ask us" card linking to the AI agent demo, WhatsApp and the audit. The right column is a list of native `<details>`.
- **The open question** is marked by the Zeta Pixel ("the current place").
- **Motion:** `hover-guide-line` and `touch-press`; the open/close transition runs only where the browser supports it, and is instant under reduced motion.
- **Links and tracking:** each question has a shareable `#faq-<id>` link that opens it; the `faq_expand` event is already in 09.
- **Mobile:** stacked, with chips that wrap (never a sideways scroll).

## 6. E-E-A-T system (engine §6)

- **Experience:**
  - The site itself is the case study: the speed chip, the Nutrition Label, AI View, real build logs, and "how we built this page" notes.
  - Real client work only with written permission. Wasleen appears only if the owner confirms it with publishable results.
- **Expertise:**
  - Guides are bylined **Jamsheed Khalid**, linking to `/about/jamsheed-khalid` (ProfilePage + Person).
  - Credentials only once CONFIRMED. His bio and photo are needed before W3.
- **Authority:**
  - one consistent entity (the facts `sameAs`)
  - citations to official sources (Google, Meta, UAE government)
  - the Google Business Profile once it exists
- **Trust:**
  - NAP, the licence variable, the legal pages and `/editorial-policy`
  - honest labels and no fake reviews
  - visible "Last updated", changed only when the content really changes
- **Review cadence:**
  - money pages every 6 months
  - guides every 6–12 months
  - volatile topics (platform rules, regulations) every 3 months

## 7. robots.txt, llms.txt, llms-full.txt (engine §7; 08 §4–5 updated)

- **robots (decision 0010):**
  - All crawlers, AI search and **AI training bots alike**, get `Allow: /` and `Disallow: /api/`, plus the sitemap line. Named groups stay, so the owner can later change one bot in one line.
  - Utility pages use `noindex`, not robots blocks, so crawlers can see the `noindex`.
  - Non-production: `Disallow: /`.
  - The bot list is verified against each vendor's docs in P9, with the check date recorded.
- **llms.txt** (the llmstxt.org format), a curated index:
  - an H1 "Deepzeta AI" and a factual blockquote (who, what, where, founded)
  - an About paragraph
  - H2 sections: Services by pillar, Solutions, Industries, Deepzeta Sync, Resources, Company, Optional
  - each entry `- [Name](url): one factual sentence`
  - pSEO pages appear as their hubs only
- **llms-full.txt:** the "knowledge fields" of every indexable page. Each page is separated by `---`:
  - `## Title`, then the URL and last updated
  - `### Direct answer`, a key-facts table, sections as `###` with lists and tables, steps, and FAQ Q/A
  - no CTAs, nav, footer or marketing strings
  - built by one formatter per content type (a registry pattern)
  - if it passes 500 KB, it splits by pillar, with the index in llms.txt
- **Honest note in the engine:** these files serve ChatGPT, Claude, Perplexity and agents, not Google Search. They're cheap, so we keep them, but they're not a Google ranking lever.
- **Also:**
  - a sitemap index once pSEO starts
  - **IndexNow** for Bing (which powers Copilot), proposed for P10

**The owner's four reference plans:**
- **Adopt:**
  - fact sheets as the only source of numbers
  - the page-kind taxonomy with schema per kind
  - the quality gate (word counts, ≤ 30% similarity to sibling pages, FAQ ≥ 4, links, an image with alt text)
  - the 4–6 inline links and anchor rules
  - automatic sitemap and llms inclusion
  - the llms.txt / llms-full.txt structure
  - GEO writing rules: objectivity, tables, entity-first, answer-first
  - cross-type and cross-hub linking
  - post-launch monitoring at 30 and 90 days
- **Improve:**
  - pages with unverified numbers are held, not published with a "pending" badge
  - batches go through pull requests, never direct pushes to `main`
  - velocity is set by the share of pages Google indexes, not 9 pages a day
  - Claude replaces DeepSeek, and Arabic follows the native-writer rule (11 §3)
  - link checks are automated
  - entity writing is done by the author, not by regex
  - llms-full excludes sales copy
- **Leave:**
  - QAPage schema on our own content
  - sitemap priority and changefreq
  - hardcoded hero copy and news cards
  - fake stats strips ("52+/500+")
  - lists of neighbourhood names used as keyword stuffing
  - "Read more →" anchors
  - authority logos
  - AI-written alt text without review

## 8. pSEO: after V1 (reminder set)

- **Starts only when every V1 registry row is live** and Search Console shows stable indexing.
- **The reminder is kept in four places:**
  - a banner at the top of the engine
  - a `CLAUDE.md` "Current state" line
  - the 04 P12 row
  - a new memory file, `pseo-after-v1`
- **Candidate dimensions:**
  - the 27 individual industries
  - industry × emirate for the catalogue 7.5 best-fit services
  - platform integrations (such as WhatsApp + HubSpot, n8n + Zoho)
  - tool-vs-tool comparisons
  - glossary terms promoted to their own pages
  - later, GCC countries and Arabic (P11)
- **Gates:**
  - a real fact pack per dimension (official sources)
  - ≤ 30% similarity to sibling pages
  - word ranges and ≥ 4 unique FAQs
  - link rules
  - unverified numbers mean the page is held
  - a human reviews the whole pilot, then 1 in 5 pages per batch
- **Velocity:** a pilot of 10, then batches of up to 10 a week, through pull requests. Scale up only while at least 70% of pages are indexed within 30 days.
- **Pruning:** after 90 days, pages that add no value get `noindex` or are merged.

## 8b. Gaps and tensions this plan closes (found in today's rules)

1. **Sourced facts vs allowed sources.**
   - **The tension:** 08 wants a sourced fact every ~150–200 words, but the writer may only use the catalogue, blueprint and facts file, and `check:facts` blocks any number outside the owner's 3-entry allowlist.
   - **The fix:** a new **citation register**, `docs/facts/external-sources.md`. Each external fact comes with its official URL and the date it was checked. Agents propose entries; the owner approves them. Approved numbers join the allowlist, and the writer and auditor may use them.
   - **08 §2.5 reworded** to "where a relevant real fact exists; never pad".
2. **"Last updated" vs "last reviewed."**
   - The visible "Last updated" date equals `dateModified` (the content changed).
   - "Reviewed by Jamsheed Khalid · date" appears only after a recorded review. It maps to `lastReviewed` / `reviewedBy` on the WebPage node.
3. **Content pages had the lowest speed floor.** Decision 0005 put resources, about and case studies in T3 (≥ 70), yet these are the pages AI engines cite most. **Decision 0011 moves them to T2 (≥ 90).** T3 stays only for real experience pages: Studio concepts and the App demo.
4. **Hub pages had no schema row.** 08 gains rows for `/solutions`, `/industries`, `/resources`, `/tools` and `/work` (CollectionPage + ItemList).
5. **Guides and comparisons share `/resources/<slug>`.** A content-type field tells them apart. The URL stays flat and never changes if a guide becomes a comparison.
6. **The owner guide promised things the rules lacked** (IndexNow, author pages). Both are now in this plan.

**Also added to the engine:**
- **Keyword and intent mapping for English:** research sources; no invented search volumes; a cannibalisation check.
- **Citation format:** outbound citation links are followed and open safely; a weekly external link-rot report.
- **Images for GEO:** descriptive filenames and alt text, `<figure>` + caption, `primaryImageOfPage`, an OG image per page type. `VideoObject` only for real videos (the YouTube channel exists).
- **Tables of contents** on guides and pillars (anchored, with a sticky layout on desktop).
- **An RSS feed** for resources.
- **A redirect map** (a registry column).
- **GA4 "AI assistants" channel group** for traffic from chatgpt.com, perplexity.ai and similar (an owner checklist item, no new event).
- **Candidate AI bots to verify in P9:** Applebot, Amazonbot, DuckAssistBot, MistralAI-User and others.

## 9. Measurement (engine §9)

- **Search:**
  - Search Console Performance plus the Generative AI performance report
  - Bing Webmaster Tools
  - GA4: landing page → audit booking, the sales-driven KPI
- **Monthly AI citation panel:** about 20 buyer questions asked in ChatGPT, Perplexity, Gemini, Copilot and Claude, logging whether and how Deepzeta AI is cited (from the blueprint).
- **KPIs:**
  - indexed ÷ built
  - impressions and clicks per cluster
  - AI citations
  - audits per cluster
  - content decay

## Files (branch `docs/seo-geo-domination-engine`)

Protected edits are approved by approving this plan.

| Path | Action | Purpose |
|---|---|---|
| `docs/seo/seo-geo-domination-engine.md` | CREATE | The engine: §1–9 above in full, rule text for AI builders |
| `docs/seo/url-registry.md` | CREATE (APPEND-ONLY) | Every V1 URL with its columns, the waves, the add-page process |
| `docs/design/faq.md` | CREATE | FAQ module spec (LAB) |
| `docs/decisions/0010-ai-training-crawlers-allowed.md`, `0011-content-pages-t2.md` + `README.md` | CREATE / MODIFY | Owner decisions: training bots; content pages at T2 (§8b.3) |
| `docs/facts/external-sources.md` | CREATE | Citation register (§8b.1); only the owner approves entries |
| `docs/ai/07`, `.claude/agents/content-writer-en.md` sources line | MODIFY | Tier table (0011); the writer may use the citation register |
| `docs/ai/08` | MODIFY | §5 training tier → full access · §4 honest llms note + pointer · §2 pointer to the engine; §2.5 "never pad" · §3 matrix rows: solutions = bundles, hub pages (CollectionPage), founder ProfilePage, `/editorial-policy`; `lastReviewed`/`reviewedBy` only after a recorded review |
| `docs/ai/03` | MODIFY | Planned `check:content` (words, paragraph length, direct-answer length, FAQ count and sitewide uniqueness, banned words, heading order) + the `check:links` extensions |
| `docs/ai/04` | MODIFY | P6/P8 follow the registry; P12 = pSEO after V1 (engine §8) |
| `docs/ai/10` | MODIFY | §5 points to the engine's page-type blueprints |
| `docs/ai/00` | MODIFY | §4 sources, §5 protect `docs/seo/*.md`, §6 file map |
| `docs/ai/conflict-register.md` | APPEND | C32 (blueprint page map → registry: solutions = bundles, 4 industry groups, ~101 pages, audit URL, ROI calculator in `/tools`) · C33 (blueprint "training bots limited" → 0010) · C17's status note updated (C6 resolved) |
| `docs/design/home.md`, `service-page.md`, `README.md` | MODIFY | FAQ rows point to `faq.md`; Home §09 shows 4 industry tiles; index + change log |
| `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json` | MODIFY | "Read before" rows for the engine and registry; the pSEO reminder; `docs/seo` protected (ask on edit) |
| `.claude/agents/content-writer-en.md`, `seo-geo-auditor.md`, `.claude/skills/new-page/SKILL.md` | MODIFY | 1–2 lines each: follow the engine and the registry |
| memory `pseo-after-v1.md`, project memory, `MEMORY.md` | CREATE / MODIFY | The reminder and the decisions |

Nothing in `Planning Folder/**`, the logo, `.env*`, lockfiles or application code is touched. The facts file is unchanged.

## Verification

- `node scripts/check-rules.mjs` passes. Every new `docs/seo` file has the standard header.
- **Registry check:** a node script (in the scratchpad) confirms:
  - every catalogue 🔥/⭐ service and every bundle has exactly one row
  - no duplicate slugs, all lowercase kebab-case, no trailing slashes
  - every lead URL mentioned in the engine exists in the registry
- **Consistency search:** 0 hits for "training-only bots are limited" outside history; 08's matrix, the engine and the registry agree on page types.
- **Scope:** `git diff --stat` matches the files table.
- **Commits** on the new branch, pushed, with a PR link for the owner (the 12 §1 flow). Report in the 02 §5 format.
