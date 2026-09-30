# URL Registry

> **Applies to:** every URL on deepzeta.ai, planned, live, reserved or retired · **Precedence:** with the [SEO/GEO Domination Engine](seo-geo-domination-engine.md) (00 §3 level 3); the source of truth for which pages exist · **Status:** APPEND-ONLY. Rows are added, never deleted; a row's status changes only through the process in §2 · **Last reviewed:** 2026-09-30

**Why this file exists:**
- Nothing is built, linked, put in the sitemap or listed in `llms.txt` without a row here (04 §1.4).
- Routes, the typed route helper, `check:links` and sitemap parity all compare against this registry once code exists (P4).

---

## 1. Rules

### 1.1 Slug rules

- **Format:** lowercase kebab-case, derived from the **exact** catalogue name (10 §2). Drop `&`/`and` when the slug still reads well. At most about 5 words.
- **No trailing slash**, no query parameters for content, no file extensions (08 §2.10).
- **Stable forever.** A slug change needs a 301 in the same plan, recorded in §5 (redirect map).
- **One primary intent per URL.** The "Intent" column states it. A new row says how it differs from its nearest sibling (engine §4.3).
- **Arabic (P11):** every indexable row later gets its `/ar` partner. That's recorded then, not now.

### 1.2 Columns

| Column | Meaning |
|---|---|
| ID | Stable row id (`R###`), never reused |
| URL | Path on `{SITE_URL}` |
| Type | Page type from engine §3 |
| Cluster | Pillar or hub the page belongs to |
| Cat. | Services Catalogue number, if any |
| Intent | The one search intent the page owns |
| Tier | Page tier (decisions 0005 and 0011) |
| Phase | Build phase (04 §2) |
| Wave | Build order inside V1: W1, W2 or W3 (engine §3) |
| Status | `proposed` → `planned` → `building` → `live` → `retired`, or `blocked` / `reserved` |
| Index | `index` or `noindex` |
| Needs | Owner inputs required before it can ship |

### 1.3 V1 and the waves

**V1** = every row with status `planned`. It is complete when all of them are `live`. **pSEO starts only after that** (engine §10).

| Wave | Contents |
|---|---|
| W1 | Core, hubs, pillars, lead 🔥 services, bundles, company and legal pages |
| W2 | Core ⭐ services, industry groups |
| W3 | Deepzeta Sync, resources, the founder profile |

The P6 pilot service page is reviewed before the rest (04 §1.6).

---

## 2. Adding, changing or retiring a page

1. **Idea.** The owner or an agent suggests a page. An agent adds a row with status `proposed`, with an intent that doesn't overlap an existing row.
2. **Approval.** The owner approves it. The status becomes `planned` and a wave is set.
3. **Build.** A page plan (04 §4) names the row ID. The status becomes `building`, then `live` when the page ships.
4. **Retire.** The status becomes `retired`, a 301 target is added in §5, and the page leaves nav, the sitemap and llms in the same plan.

A row is never deleted, and an ID is never reused.

---

## 3. V1 registry

### 3.1 Core, company and legal

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R001 | `/` | Home | — | — | Who Deepzeta AI is, what it builds (custom-coded websites, AI automation) and why to book an audit | T1 | P5 | W1 | planned | index | — |
| R002 | `/free-ai-audit` | Audit | — | 0.1 | "Book a free AI automation audit": what you get and how to book | T2 | P6 | W1 | planned | index | — |
| R003 | `/about` | About | Company | — | Who runs Deepzeta AI, where it is, how it works | T2 | P6 | W1 | planned | index | Founder bio |
| R004 | `/about/jamsheed-khalid` | Founder profile | Company | — | Who Jamsheed Khalid is (founder, author) | T2 | P6 | W3 | planned | index | Bio, photo, credentials |
| R005 | `/contact` | Contact | Company | — | How to reach Deepzeta AI (office, hours, channels) | T2 | P6 | W1 | planned | index | Phone, WhatsApp (variables) |
| R006 | `/privacy` | Legal | Company | — | How Deepzeta AI handles personal data (UAE PDPL) | T2 | P6 | W1 | planned | index | — |
| R007 | `/terms` | Legal | Company | — | Terms for using the site, the audit and the tools | T2 | P6 | W1 | planned | index | — |
| R008 | `/editorial-policy` | Editorial policy | Company | — | How Deepzeta AI writes, reviews and uses AI in its content | T2 | P6 | W1 | planned | index | Owner approval of the process description |

### 3.2 Services hub and pillars

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R010 | `/services` | Hub | Services | — | Every Deepzeta AI service, by pillar: find the right one | T2 | P6 | W1 | planned | index | — |
| R011 | `/services/ai-automation` | Pillar | AI Automation | 1 | Which AI automation does my business need? (the Control Room) | T2 | P6 | W1 | planned | index | — |
| R012 | `/services/websites` | Pillar | Websites | 2 | Which website service do I need? (new site, landing page, store, redesign, care) | T2 | P6 | W1 | planned | index | — |
| R013 | `/services/software` | Pillar | Software | 3 | Which custom software do I need? (app, portal, internal tool) | T2 | P6 | W1 | planned | index | — |
| R014 | `/services/growth-ranking` | Pillar | Growth & Ranking | 4 | How do I get found and chosen (search, AI search, ads, content, brand)? | T2 | P6 | W1 | planned | index | — |

### 3.3 AI Automation services

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R020 | `/services/whatsapp-ai-agent` | Service 🔥 | AI Automation | 1A.1 | An AI agent that answers WhatsApp messages 24/7, in Arabic and English | T2 | P6 | W1 | planned | index | — |
| R021 | `/services/ai-voice-receptionist` | Service 🔥 | AI Automation | 1A.2 | An AI receptionist that answers phone calls and books appointments | T2 | P6 | W1 | planned | index | — |
| R022 | `/services/ai-outbound-calling-agent` | Service ⭐ | AI Automation | 1A.3 | An AI agent that makes outbound calls (follow-ups, reminders, qualification) | T2 | P6 | W2 | planned | index | — |
| R023 | `/services/website-ai-chat-agent` | Service ⭐ | AI Automation | 1A.4 | An AI chat agent on the website that answers and captures leads | T2 | P6 | W2 | planned | index | — |
| R024 | `/services/omnichannel-inbox-ai` | Service ⭐ | AI Automation | 1A.5 | One AI-assisted inbox for WhatsApp, Instagram, Messenger and email | T2 | P6 | W2 | planned | index | — |
| R025 | `/services/internal-knowledge-assistant` | Service ⭐ | AI Automation | 1A.6 | An AI assistant that answers staff questions from company documents | T2 | P6 | W2 | planned | index | — |
| R026 | `/services/custom-ai-agents` | Service ⭐ | AI Automation | 1A.7 | A custom AI agent built for a specific business task | T2 | P6 | W2 | planned | index | — |
| R027 | `/services/speed-to-lead-system` | Service 🔥 | AI Automation | 1B.1 | Reply to every new lead within 60 seconds (a design target, facts §6) | T2 | P6 | W1 | planned | index | — |
| R028 | `/services/ai-lead-qualification-scoring` | Service ⭐ | AI Automation | 1B.2 | Qualify and score leads automatically so sales calls the best first | T2 | P6 | W2 | planned | index | — |
| R029 | `/services/automated-quotation-tracking` | Service 🔥 | AI Automation | 1B.3 | Send quotes fast and track every quote until it's won or lost | T2 | P6 | W1 | planned | index | — |
| R030 | `/services/proposal-automation` | Service ⭐ | AI Automation | 1B.4 | Generate proposals automatically from templates and CRM data | T2 | P6 | W2 | planned | index | — |
| R031 | `/services/sales-follow-up-nurture` | Service ⭐ | AI Automation | 1B.5 | Automatic follow-up and nurture sequences so no lead goes cold | T2 | P6 | W2 | planned | index | — |
| R032 | `/services/crm-setup-automation` | Service ⭐ | AI Automation | 1B.6 | Set up a CRM (HubSpot, Zoho and others) and automate it | T2 | P6 | W2 | planned | index | — |
| R033 | `/services/booking-automation-system` | Service 🔥 | AI Automation | 1C.1 | Let customers book appointments automatically, any time | T2 | P6 | W1 | planned | index | — |
| R034 | `/services/appointment-reminders-no-show-reduction` | Service ⭐ | AI Automation | 1C.2 | Automatic reminders that cut missed appointments | T2 | P6 | W2 | planned | index | — |
| R035 | `/services/viewing-site-visit-scheduling` | Service ⭐ | AI Automation | 1C.3 | Schedule property viewings and site visits automatically | T2 | P6 | W2 | planned | index | — |
| R036 | `/services/ai-customer-support-automation` | Service ⭐ | AI Automation | 1D.1 | Answer common customer support questions with AI, with human handover | T2 | P6 | W2 | planned | index | — |
| R037 | `/services/ticketing-complaint-tracking` | Service ⭐ | AI Automation | 1D.2 | Track every complaint and ticket until it's resolved | T2 | P6 | W2 | planned | index | — |
| R038 | `/services/review-reputation-automation` | Service 🔥 | AI Automation | 1D.3 | Ask happy customers for reviews automatically and respond to reviews | T2 | P6 | W1 | planned | index | — |
| R039 | `/services/loyalty-renewal-win-back-automation` | Service ⭐ | AI Automation | 1D.4 | Automate renewals, loyalty and win-back messages | T2 | P6 | W2 | planned | index | — |
| R040 | `/services/job-work-order-management` | Service ⭐ | AI Automation | 1E.1 | Automate jobs and work orders from request to completion | T2 | P6 | W2 | planned | index | — |
| R041 | `/services/preventive-maintenance-scheduling` | Service ⭐ | AI Automation | 1E.2 | Schedule maintenance contracts and preventive maintenance automatically | T2 | P6 | W2 | planned | index | — |
| R042 | `/services/inventory-stock-automation` | Service ⭐ | AI Automation | 1E.3 | Automate stock levels, alerts and reorders | T2 | P6 | W2 | planned | index | — |
| R043 | `/services/task-approval-workflows` | Service ⭐ | AI Automation | 1E.6 | Automate internal tasks and approvals | T2 | P6 | W2 | planned | index | — |
| R044 | `/services/invoicing-payment-collection` | Service ⭐ | AI Automation | 1F.1 | Send invoices and collect payments automatically | T2 | P6 | W2 | planned | index | — |
| R045 | `/services/uae-e-invoicing` | Service 🔥 | AI Automation | 1F.2 | Get ready for UAE e-invoicing and connect to an accredited provider | T2 | P6 | W1 | planned | index | Official dates in the citation register |
| R046 | `/services/ai-document-data-extraction` | Service ⭐ | AI Automation | 1F.3 | Extract data from invoices and documents with AI (OCR) | T2 | P6 | W2 | planned | index | — |
| R047 | `/services/recruitment-automation` | Service ⭐ | AI Automation | 1G.1 | Automate candidate screening, scheduling and updates | T2 | P6 | W2 | planned | index | — |
| R048 | `/services/email-whatsapp-marketing-automation` | Service ⭐ | AI Automation | 1H.1 | Automated email and WhatsApp marketing campaigns | T2 | P6 | W2 | planned | index | — |
| R049 | `/services/ai-content-engine` | Service ⭐ | AI Automation | 1H.2 | An AI engine that drafts on-brand content at scale, with human review | T2 | P6 | W2 | planned | index | — |
| R050 | `/services/store-operations-automation` | Service ⭐ | AI Automation | 1I.1 | Automate online store operations (orders, stock, customer updates) | T2 | P6 | W2 | planned | index | — |
| R051 | `/services/ai-shopping-visibility` | Service 🔥 | AI Automation | 1I.2 | Get products found by AI shopping assistants (agentic commerce readiness) | T2 | P6 | W1 | planned | index | — |
| R052 | `/services/automated-business-dashboards` | Service ⭐ | AI Automation | 1J.1 | Live dashboards that pull business numbers together automatically | T2 | P6 | W2 | planned | index | — |

### 3.4 Websites, Software, Growth & Ranking, other services

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R060 | `/services/custom-coded-websites` | Service 🔥 (flagship) | Websites | 2.1 | A fast, custom-coded website built to rank in search and AI search | T2 | P6 | W1 | planned | index | — |
| R061 | `/services/landing-pages-cro` | Service ⭐ | Websites | 2.2 | Landing pages and conversion-rate optimisation | T2 | P6 | W2 | planned | index | — |
| R062 | `/services/ecommerce-websites` | Service ⭐ | Websites | 2.3 | A custom e-commerce website | T2 | P6 | W2 | planned | index | — |
| R063 | `/services/website-redesign-migration` | Service ⭐ | Websites | 2.4 | Redesign or migrate an existing website without losing rankings | T2 | P6 | W2 | planned | index | — |
| R064 | `/services/web-application-development` | Service ⭐ | Software | 3.1 | Build a custom web application | T2 | P6 | W2 | planned | index | — |
| R065 | `/services/client-customer-portals` | Service ⭐ | Software | 3.2 | A secure portal for clients or customers | T2 | P6 | W2 | planned | index | — |
| R066 | `/services/internal-tools-admin-dashboards` | Service ⭐ | Software | 3.3 | Internal tools and admin dashboards for the team | T2 | P6 | W2 | planned | index | — |
| R067 | `/services/custom-software-development` | Service ⭐ | Software | 3.4 | Custom software built around how the business works | T2 | P6 | W2 | planned | index | — |
| R068 | `/services/ai-citation-aeo-geo` | Service 🔥 | Growth & Ranking | 4A.1 | Get cited by AI answer engines (AEO/GEO) | T2 | P6 | W1 | planned | index | — |
| R069 | `/services/programmatic-seo` | Service ⭐ | Growth & Ranking | 4A.2 | Programmatic SEO done safely, with real data per page | T2 | P6 | W2 | planned | index | — |
| R070 | `/services/local-ai-dominance` | Service 🔥 | Growth & Ranking | 4A.3 | Win local and AI search in English and Arabic, hyperlocally | T2 | P6 | W1 | planned | index | — |
| R071 | `/services/performance-seo-retainer` | Service ⭐ | Growth & Ranking | 4A.4 | An ongoing SEO retainer measured on performance | T2 | P6 | W2 | planned | index | — |
| R072 | `/services/google-ads` | Service ⭐ | Growth & Ranking | 4B.1 | Google Ads management | T2 | P6 | W2 | planned | index | — |
| R073 | `/services/meta-ads` | Service ⭐ | Growth & Ranking | 4B.2 | Meta Ads (Facebook and Instagram) management | T2 | P6 | W2 | planned | index | — |
| R074 | `/services/tiktok-snapchat-ads` | Service ⭐ | Growth & Ranking | 4B.3 | TikTok and Snapchat Ads management | T2 | P6 | W2 | planned | index | — |
| R075 | `/services/linkedin-ads` | Service ⭐ | Growth & Ranking | 4B.4 | LinkedIn Ads for B2B | T2 | P6 | W2 | planned | index | — |
| R076 | `/services/ai-ad-creative` | Service 🔥 | Growth & Ranking | 4B.6 | AI-assisted ad creative production | T2 | P6 | W1 | planned | index | — |
| R077 | `/services/social-media-management` | Service ⭐ | Growth & Ranking | 4C.1 | Social media management | T2 | P6 | W2 | planned | index | — |
| R078 | `/services/content-creation` | Service ⭐ | Growth & Ranking | 4C.2 | Content creation for social and web | T2 | P6 | W2 | planned | index | — |
| R079 | `/services/graphic-design` | Service ⭐ | Growth & Ranking | 4C.3 | Graphic design | T2 | P6 | W2 | planned | index | — |
| R080 | `/services/influencer-marketing` | Service ⭐ | Growth & Ranking | 4C.4 | Influencer marketing: planning and execution | T2 | P6 | W2 | planned | index | — |
| R081 | `/services/branding-positioning` | Service ⭐ | Growth & Ranking | 4D.1 | Branding and positioning | T2 | P6 | W2 | planned | index | — |
| R082 | `/services/growth-strategy` | Service ⭐ | Growth & Ranking | 4D.2 | Insights and growth strategy | T2 | P6 | W2 | planned | index | — |
| R083 | `/services/ai-readiness-assessment` | Service ⭐ | Starter offers | 0.2 | A paid, in-depth AI readiness assessment (vs the free audit) | T2 | P6 | W2 | planned | index | — |
| R084 | `/services/ai-ops-retainer` | Service ⭐ | Ongoing care | 6.1 | An ongoing retainer that runs and improves your automations | T2 | P6 | W2 | planned | index | — |

**Catalogue ➕ add-ons** don't get URLs in V1. They appear as one-liners in their pillar directory and in the "Pairs well with" section of their main service page (engine §3.1):
1B.7, 1C.4, 1C.5, 1D.5, 1E.4, 1E.5, 1F.4, 1F.5, 1F.6, 1G.2, 1G.3, 1H.3, 1H.4, 1I.3, 1J.2, 1J.3, 1K.1, 1K.2, 2.5, 3.5, 3.6, 4A.5, 4B.5, 6.2, 6.3, 6.4.

**4E, the Full-Funnel Growth System,** is a section of the Growth & Ranking pillar page.

### 3.5 Solutions (the catalogue's bundles) and industries

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R090 | `/solutions` | Hub | Solutions | 5 | Ready-made systems that solve a whole business problem | T2 | P6 | W1 | planned | index | — |
| R091 | `/solutions/ai-front-desk` | Solution | Solutions | 5.1 | Never miss a call, message or booking (WhatsApp, voice, booking, CRM) | T2 | P6 | W1 | planned | index | — |
| R092 | `/solutions/quote-to-cash-system` | Solution | Solutions | 5.2 | From quote to job to invoice to review, automated | T2 | P6 | W1 | planned | index | — |
| R093 | `/solutions/get-found-by-ai` | Solution | Solutions | 5.3 | Be found and cited by Google and AI engines | T2 | P6 | W1 | planned | index | — |
| R094 | `/solutions/ecommerce-growth-engine` | Solution | Solutions | 5.4 | Grow an online store with AI visibility, marketing and ads | T2 | P6 | W1 | planned | index | — |
| R095 | `/solutions/launch-pack` | Solution | Solutions | 5.5 | Everything a new business needs to launch online | T2 | P6 | W1 | planned | index | — |
| R096 | `/solutions/e-invoicing-ready` | Solution | Solutions | 5.6 | Be ready for UAE e-invoicing, end to end | T2 | P6 | W1 | planned | index | Official dates in the citation register |
| R100 | `/industries` | Hub | Industries | 7 | Automation and growth by industry | T2 | P6 | W2 | planned | index | — |
| R101 | `/industries/b2b-corporate-tech` | Industry group | Industries | 7.1 | AI automation for B2B, SaaS, cybersecurity, manufacturing, logistics, solar and recruitment firms | T2 | P6 | W2 | planned | index | — |
| R102 | `/industries/ecommerce-consumer-brands` | Industry group | Industries | 7.2 | AI automation for e-commerce, beauty, jewellery, travel, hospitality and events | T2 | P6 | W2 | planned | index | — |
| R103 | `/industries/real-estate-construction-professional` | Industry group | Industries | 7.3 | AI automation for real estate, construction, fit-out, law, education and fintech | T2 | P6 | W2 | planned | index | — |
| R104 | `/industries/local-medical-field-services` | Industry group | Industries | 7.4 | AI automation for clinics, dentists, technical and facility services, automotive, gyms and pet care | T2 | P6 | W2 | planned | index | — |

### 3.6 Deepzeta Sync, resources, Studio

| ID | URL | Type | Cluster | Cat. | Intent | Tier | Phase | Wave | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R110 | `/tools` | Hub (Deepzeta Sync) | Tools | — | Free tools to check a website and plan growth | T2 | P7 | W3 | planned | index | — |
| R111 | `/tools/website-ai-search-health-check` | Tool | Tools | 0.3 | Check a website's speed and AI-search readiness for free (the only page for catalogue 0.3) | T2 | P7 | W3 | planned | index | — |
| R112 | `/tools/social-media-content-planner` | Tool | Tools | — | Plan a week of social media content with AI, free | T2 | P7 | W3 | planned | index | — |
| R113 | `/tools/ai-automation-roi-calculator` | Tool | Tools | — | Calculate the return on automating a task (the visitor's own inputs) | T2 | P7 | W3 | planned | index | — |
| R120 | `/resources` | Hub | Resources | — | Guides, comparisons and a glossary on AI automation, websites and AI search | T2 | P8 | W3 | planned | index | — |
| R121 | `/resources/glossary` | Glossary | Resources | — | Plain definitions of AI automation, SEO and GEO terms | T2 | P8 | W3 | planned | index | — |
| R122 | `/resources/n8n-vs-make-vs-zapier` | Comparison | Resources | — | Which automation platform to choose: n8n, Make or Zapier | T2 | P8 | W3 | planned | index | Vendor facts in the citation register |
| R123 | `/resources/ai-agent-vs-rpa` | Comparison | Resources | — | AI agents vs RPA: which fits which job | T2 | P8 | W3 | planned | index | — |
| R124 | `/resources/custom-coded-website-vs-wordpress` | Comparison | Resources | — | Custom-coded website vs WordPress: speed, SEO, cost of ownership | T2 | P8 | W3 | planned | index | Sourced facts |
| R125 | `/resources/what-is-an-ai-agent` | Guide | Resources | — | What an AI agent is, and what it can do for a business | T2 | P8 | W3 | planned | index | Founder bio (byline) |
| R126 | `/resources/what-is-geo-generative-engine-optimisation` | Guide | Resources | — | What GEO is, and how businesses get cited by AI engines | T2 | P8 | W3 | planned | index | Founder bio (byline) |
| R127 | `/resources/whatsapp-business-automation-guide` | Guide | Resources | — | How to automate WhatsApp Business replies and bookings in the UAE | T2 | P8 | W3 | planned | index | Platform facts in the citation register |
| R128 | `/resources/core-web-vitals-explained` | Guide | Resources | — | What Core Web Vitals are, with this site's own live measurements | T2 | P8 | W3 | planned | index | — |
| R129 | `/resources/uae-e-invoicing-guide` | Guide | Resources | — | UAE e-invoicing: what businesses need to know and when | T2 | P8 | W3 | planned | index | Official dates in the citation register |
| R130 | `/resources/ai-automation-for-small-business-uae` | Guide | Resources | — | Where a small UAE business should start with AI automation | T2 | P8 | W3 | planned | index | — |
| R131 | `/resources/rss.xml` | Feed | Resources | — | RSS feed for guides and comparisons | — | P8 | W3 | planned | — | — |
| R140 | `/studio` | Studio index | Studio | — | Concept website designs by Deepzeta AI | T2 | P8 | W3 | planned | index | — |

### 3.7 Blocked (waiting for owner facts)

| ID | URL | Type | Intent | Tier | Phase | Status | Index | Needs |
|---|---|---|---|---|---|---|---|---|
| R150 | `/work` | Hub | Real client results | T2 | P8 | blocked | index | At least one real, publishable case study |
| R151 | `/work/<slug>` | Case study | One client's real result | T2 | P8 | blocked | index | Written client permission and real numbers |
| R152 | `/pricing` | Pricing | What services cost | T2 | P6 | blocked | index | Real prices |
| R153 | App demo (URL set in its session) | App demo | The app rebuild demo | T3 | — | blocked | — | Name, branding, provenance (memory: App demo) |

### 3.8 Never indexed, and system files

| ID | URL | Type | Index | Notes |
|---|---|---|---|---|
| R160 | `/studio/<slug>` | Studio concept | noindex | LATER; not in the sitemap or llms (08) |
| R161 | `/tools/<tool>/report/<id>` (pattern set in P7) | Tool result view | noindex | Never in the sitemap or llms |
| R162 | `/thank-you` | Utility | noindex | After a form |
| R163 | `/404` | Utility | noindex | Not-found page |
| R164 | `/api/*` | API | disallowed | robots `Disallow` |
| R170 | `/robots.txt` | System | — | Engine §9.1 |
| R171 | `/sitemap.xml` | System | — | 08 §6 |
| R172 | `/llms.txt` | System | — | Engine §9.2 |
| R173 | `/llms-full.txt` | System | — | Engine §9.3 |
| R174 | `/favicon.ico` | System | — | ICO favicon (16, 32, 48 px), P1 |
| R175 | `/icon.png` | System | — | PNG icon (192 px), P1 |
| R176 | `/apple-icon.png` | System | — | iOS home-screen icon (180 px), P1 |
| R177 | `/manifest.webmanifest` | System | — | Web app manifest, P1 |
| R178 | `/brand/*` | System | — | Brand files: the byte-identical logo, the manifest's 512 px icons, the square logo PNG (the schema `#logo`, P4) |
| R165 | `/shell-review` | Utility | noindex | The complete shell (header, mega menu, mobile sheet, footer) for review and tests, P2. Local, CI and preview builds only; 404 in production. Never linked, never in the sitemap or `llms` files |

---

## 4. Reserved patterns (pSEO after V1, engine §10)

| ID | Pattern | Dimension | Status |
|---|---|---|---|
| R200 | `/industries/<industry>` | The 27 individual industries (catalogue §7) | reserved |
| R201 | `/industries/<industry>/<emirate>` | Industry × emirate, best-fit services only | reserved |
| R202 | `/integrations` and `/integrations/<slug>` | Platform integrations (catalogue §8) | reserved |
| R203 | `/resources/<a>-vs-<b>` | Tool-vs-tool comparisons | reserved |

Industry-group slugs (R101–R104) are compound, so they can't collide with single-industry slugs.

---

## 5. Redirect map

| From | To | Type | Since |
|---|---|---|---|
| `https://www.deepzeta.ai/*` | `https://deepzeta.ai/*` | 301 | Decision 0006 |

The blueprint's draft slugs (for example `web-development`, `ai-chatbots`, `/audit`) were never published, so no redirects are needed for them (C32).

---

## Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-30 | Created with the V1 list (99 indexable pages), waves, blocked and reserved rows | Owner (plan approval, 2026-09-30) |
| 2026-09-30 | R174–R178, system files (P1): favicon, PNG icon, apple icon, manifest, `/brand/*` | Owner (P1 plan approval) |
| 2026-09-30 | R165, `/shell-review` (P2): the shell review page, never built in production | Owner (P2 plan approval) |
