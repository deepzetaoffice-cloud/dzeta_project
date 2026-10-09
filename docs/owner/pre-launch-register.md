# deepzeta · Pre-launch register (manual work before the site goes public)

> **What this is:** the one list of everything that has to be done by hand, by you, before launch (Phase 10), so nothing is forgotten between phases.
> **How it works:** Claude adds a row whenever a phase leaves manual work behind, and you tick a row when it's done. At P10 Claude checks every row before the launch sign-off. A row is never deleted; a dropped one is marked "Not needed" with the reason.
> **Related:** the accounts checklist `docs/owner/deepzeta-owner-checklist.html` (accounts to open), the tracking guide `docs/owner/p3-tracking-setup-guide.md`, the visibility guide `docs/owner/visibility-setup-guide.md`.
> **Started:** 2026-10-01, at the end of P2.

---

## 1. Tracking and consent

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☑ | Tracking guide **Part A**: GTM container, GA4 property and its settings, and the IDs sent to Claude | P3 can't start without the IDs, and the GA4 settings stop events being counted twice | Now, before P3 | **Done 2026-10-02.** GTM `GTM-5MR4S8R2`, GA4 `G-RTLSJW7Q9W`, Meta dataset `2290203821825563`, Microsoft UET `187278109`; LinkedIn and Google Ads postponed |
| ☑ | Answer the guide's **questions 8 and 9** (the consent banner; what counts as a conversion) | They decide how P3 is built | Before P3 | **Answered 2026-10-02:** a consent banner for Europe only (EEA, UK, Switzerland: nothing runs until Accept; everyone else: tracking on by default); conversions changed 2026-10-02: `generate_lead` and `contact_click` primary, `book_call_click` dropped (retired) |
| ☑ | Tracking guide **Part B**: import the container, test in Preview and DebugView, custom dimensions, key events, publish | The code's event names and the dashboards must match exactly | After P3 part C is built | **Done 2026-10-04** ("B1–B8 done"). The import needed one fix first: the generator's `ONCE_PER_PAGE` isn't a GTM enum value; the regenerated file (two `ONCE_PER_LOAD` entries) imported cleanly |
| ☑ | **Set `NEXT_PUBLIC_GTM_ID` in Vercel → Production and redeploy** | Production starts loading the container as soon as the variable is set; `NEXT_PUBLIC_` values are built into the pages, so a redeploy follows | At step C5, right before Part B's Preview test | **Done 2026-10-03.** Production's CSP verified carrying GTM's hosts after the redeploy |
| ☑ | Turn the GA4 **Internal Traffic** filter to Active | Keeps Vercel previews, CI's Lighthouse runs and local tests out of the numbers (your office IP changes, so your own visits still count) | A day after Part B | **Done 2026-10-04** (guide B7, with B1–B8) |
| ☑ | Meta and Microsoft conversions; LinkedIn and Google Ads when they start | Ads need conversions to optimise; one method each, so nothing is counted twice | After Part B | **Done 2026-10-04** (guide B8): Meta `Lead`/`Contact` tested; Microsoft's two goals named exactly as the events. Microsoft's "primary" goal setting still needs its help page read online (unreachable at C4/C5); both goals count as conversions meanwhile |
| ☐ | The **privacy and cookie policy names exactly the tools in the GTM container** | A policy that lists different tools from the ones that run is misleading (UAE PDPL) | Before launch, and after any tracking change | Claude compares the two and sends you the list |
| ☐ | Test the consent setup in Tag Assistant's Consent tab: it must match what P3 builds for your 2026-10-02 answer (a European visitor sees *denied* until Accept; any other visitor *granted*) | The site's consent signals and the tags must agree | Before launch | Tracking guide B2 (P3 updates the step) |
| ☐ | Secret server keys (Meta and LinkedIn Conversions API tokens) go into Vercel's environment variables, entered by you | Secrets never pass through chat or the repo | When the lead flow ships (P6–P7) | Claude sends the variable names |
| ☐ | **LinkedIn** Insight Tag and conversions (postponed) | Campaign Manager asked for card details before showing the Insight Tag; ad account `559882377` exists | After launch, when you say so | You send the Partner ID (Insight Tag → "I will use a tag manager"), then the conversion IDs; Claude fills `accounts.ts` and you do one small GTM import. Don't use the GTM "Conversions API / Generate token" page: that's server-side and not part of this setup |
| ☐ | **Google Ads** account and conversions (postponed) | Sign-up can't finish without creating a first campaign | After launch, when you say so | You create the account with its first campaign, send the customer ID, link GA4 → Ads, and import `generate_lead` and `contact_click` as primary (your Q6 method) |
| ☐ | **Microsoft Ads payment method** | Ads can't run without it | Before the first campaign | Microsoft Advertising → Billing |
| ☐ | **Microsoft UET tag shows "Verified"** | It shows "Unverified" until the site sends to it, which is expected | After Part B's B2 test | Check in Microsoft Advertising → Conversion goals → UET tags |
| ☐ | **Confirmed Cal.com booking** conversion (server-side, through n8n) | The booking happens on Cal.com's side; the site's tags can't see it reliably | With the lead flow (P6–P7) | Claude builds it; secrets go into n8n Credentials |
| ☐ | **GA4 stream URL label**: edit it to `https://deepzeta.ai` (it shows `https://www.deepzeta.ai`) | A label only, doesn't affect collection, but it should match decision 0006 | Any time | GA4 → Admin → Data streams → the stream's pencil icon |
| ☐ | **Add an `@deepzeta.ai` admin** on GTM, GA4, Meta, Microsoft Ads and the Business Profile | Once Google Workspace is active; today the backup admin is your personal Gmail and Microsoft Ads is signed in with `deepzeta.office@gmail.com` | After Workspace is active | Each platform's user management |
| ☐ | **Business Profile's website link**: use the tagged link Claude generates from the campaign-link rule (09 §2.8), never a hand-typed UTM | Keeps attribution working from local search | When you set the link | The link (from the rule, 2026-10-02): `https://deepzeta.ai/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` |

## 2. Devices (P2 decision 0019, C51)

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☐ | **A budget Android phone (3–4 GB memory):** open the menu, scroll to the footer, turn on Reduce effects and the light theme, and note any stutter while scrolling under the glass header. Tell Claude the model and its memory | The speed rules are set for this class of phone; the S23 Ultra used in P2 is a flagship. Its memory sets the level below which effects switch off by themselves (now 2 GB) | Before launch, and at P5 if a budget phone is available | Open `https://deepzeta.ai` (or a preview link from Claude) in Chrome |
| ☐ | **An iPhone (any; a friend's is fine):** the sticky "Book a free AI audit" bar sits clear of the home bar at the bottom; buttons react to a tap; in landscape, nothing hides under the notch (look at the footer's sides in the light theme, the thin line on the page's edge, and the menu sheet's bottom button); the frosted texture shows with Reduce effects on | Kept unverified at P2 (you chose to keep the iPhone screen-edge setting); no iPhone was available | Before launch | Safari on the iPhone |
| ☐ | **A slow connection on a phone:** reload Home and watch whether lines re-wrap when the font arrives | The fallback fonts were tuned so they shouldn't | Before launch | Mobile data with a weak signal, or ask Claude for a throttled test link |
| ☐ | **PageSpeed Insights (mobile)** on production for Home and one page of each type | The lab numbers must hold on the real host. PSI can't test protected previews (it measures Vercel's login page instead) | At launch | pagespeed.web.dev with `https://deepzeta.ai/…` |

## 3. Domain, hosting and the repository

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☐ | **Fix the redirect direction:** `www.deepzeta.ai` must send visitors to `deepzeta.ai`. Today it's the other way round | Decision 0006 and every canonical URL use `deepzeta.ai`; a reversed redirect splits search signals | Before launch | Vercel → project → Settings → Domains (Claude guides you) |
| ☐ | **Vercel Pro plan** | The free Hobby plan is for non-commercial sites | Before launch | Vercel → Settings → Billing |
| ☐ | **Lift the pre-launch lock:** set `SITE_INDEXING=on` in Vercel's Production environment and redeploy | Until then every page tells search engines "don't index" (decision 0013) | Launch day, last step | Claude guides you |
| ☐ | **Make the GitHub repository private** and check that Vercel still deploys | It's public only while the build is in progress (your decision) | When the complete build is finished | GitHub → repository → Settings |

## 4. Search and visibility

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☐ | **Google Rich Results Test on the deployed preview's Home** (check correctness, not rich-result eligibility) | The manual validator for the schema templates that ship with Home (03 §4); deferred by your decision on 2026-10-06 ("i am not doing" it as the P4 exit step) | Before launch, once a preview deploy of the full Home exists | search.google.com/test/rich-results with the preview URL |
| ☐ | **Schema Markup Validator (validator.schema.org) on the deployed preview's Home** | The second 03 §4 validator for the same JSON-LD graph (`@graph` blocks parse and every reference resolves in Google's tool too) | Before launch, same session as the Rich Results Test | validator.schema.org with the preview URL |
| ☐ | **Both validators on the two P6 templates: `/services` and `/services/speed-to-lead-system`** (one URL per template, 08 §3 rule 14) | The hub (CollectionPage, ItemList, OfferCatalog, BreadcrumbList, FAQPage) and the service page (Service, WebPage, BreadcrumbList, FAQPage) are new templates; every later service page uses the second | Before launch, same session as Home's | The same two tools with each preview URL |
| ☐ | **GTM Preview: `view_service` on the Speed-to-Lead System page** | The event is new in the code (P6 part A2): one per page view, with `service_slug` and `pillar`; the container has it since P3 | Before launch, with the other tracking checks | Tag Assistant → the preview URL → `/services/speed-to-lead-system` → `view_service` with `speed-to-lead-system` and `ai` |
| ☐ | **Home's real speed and weight on production** — PageSpeed Insights (mobile) on `https://deepzeta.ai/`, and the transfer size of Home's HTML + CSS + JS as served (Brotli). Claude can measure it | Home passes the lab only with two exceptions: LCP 2,750 ms (C63) and page weight 200 KB with gzip (C64). The real limits stand for visitors: LCP ≤ 2.5 s, and HTML + CSS + JS ≤ 190,868 B (measured on production: 198,396 B before P6 part A1 (C65), **188,926 B after its merge, 1,942 B under** (2026-10-07, `npm run measure:weight`); **190,661 B on P6 part A2's preview, 207 B under**, with the Services menu and the footer's Services column live (2026-10-08). Re-check after each part that changes the shell) | After the P5 merge's production deploy, and again at launch (field data once CrUX has it) | Ask Claude, or pagespeed.web.dev with the production URL |
| ☐ | Search Console (Domain property, sitemap), then link it in GA4 | Google's own reports and indexing | At launch | Visibility guide; tracking guide A5 |
| ☐ | Bing Webmaster Tools (import from Search Console, IndexNow) | ChatGPT search uses Bing's index | At launch | Visibility guide |
| ☐ | Google Business Profile, Bing Places, Apple Business Connect | Local search and maps | After the full licence | Visibility guide |
| ☐ | **Make the social profiles' display names match "Deepzeta AI".** The P2 SEO audit read: LinkedIn "Deepzeta Ai Digital Solutions Dubai", YouTube "Deepzeta Ai Agency", Facebook "DeepZeta Ai Automations Business Growth Services" | Search and AI engines connect profiles to the site by a consistent name; the brand is written "Deepzeta AI" (capital AI) | Before P4 (the schema lists these profiles) | Each platform's page settings |
| ☐ | Facebook: the facts file uses `facebook.com/DeepzetaAi/`; your notes file still has the numeric `profile.php?id=…` address. Both open the same page | Only if you prefer the numeric one; otherwise nothing to do | — | Tell Claude |

## 5. Contact details and automation

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☐ | Send Claude the **office / WhatsApp number** once it's active | The footer, the contact page and the schema show it only once confirmed | ~2026-10-09 | Chat |
| ☐ | **Before setting up WhatsApp:** ask Claude to revise the n8n guide first | The guide registers the number in a way that blocks replying from the WhatsApp Business phone app, which you plan to use | Before the number is connected | Chat |
| ☐ | Cal.com account and the "Free AI Automation Audit" event type | The booking flow (P7) | Before P7 | Accounts checklist 4.5 |
| ☐ | Trade licence number, map pin | Facts, the footer and the schema | After the full licence is issued | Chat |
| ☑ | **Decide whether the footer shows the opening hours** (Monday–Saturday 08:00–17:00, already confirmed) | The P2 SEO audit: P4's sitewide company markup may only include hours that are visible on the page | Before P4 | **Decided 2026-10-02: yes.** Claude builds it in P3's first step |
| ☐ | **Register +971 54 547 6335 on WhatsApp** (Meta's Cloud API) and send Claude the Phone number ID and the WhatsApp Business Account ID | The WhatsApp agent (decision 0027) can't receive messages until then. Meta's checks (business verification, display name) can take days | Now | Automation guide `docs/owner/n8n-automation-setup-guide.md` **Part 0** (the number then can't be used in the WhatsApp app; calls and SMS work as usual) |
| ☐ | **Send Claude the team WhatsApp number** for booking and hand-off alerts | Until then, team alerts go by email only (deepzeta.office@gmail.com) | Before the agent goes live, or soon after | Chat. **Claude reminds you** |
| ☐ | The WhatsApp agent's **13-check test passed and verified by you** | Your go-live condition (decision 0027): customers get the agent only after this | Before switching `DZ · Inbound WhatsApp` on for customers | Automation guide **Part I** |
| ☐ | The privacy policy names **DeepSeek (China), OpenAI (US), Supabase (India) and n8n (EU)**, and your legal check is done | Visitor messages are processed and stored by these four (UAE PDPL) | Before the agent goes live | Automation guide **Part J**; the privacy-policy draft (Track A updates it) |
| ☐ | **Spend limits:** an OpenAI usage limit, and a small DeepSeek balance | The agent's AI calls are metered | Before the agent goes live | Automation guide **Part A** |

## 6. Sessions still parked (Claude reminds you)

- Designer Studio: the 15+ concept site designs, planned one by one.
- Deepzeta Sync (`/tools`): the sales "mega automation" flow.
- The App demo (Deepzeta Sync App): naming, branding and provenance.
- pSEO: starts only when every V1 page in the URL registry is live.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-01 | Created at the end of P2 (decision 0019): tracking, devices (C51, the iPhone), domain and hosting, visibility, contact details, parked sessions |
| 2026-10-02 | The opening hours: decided (show them in the footer) |
| 2026-10-02 | Questions 8 and 9 answered; the consent test row follows P3's design |
| 2026-10-02 | P3 part C (step C1a): Part A ticked ☑ (GTM, GA4, Meta, Microsoft UET IDs received); conversions changed (`contact_click` primary, `book_call_click` dropped); rows added: the Vercel GTM variable (C5), LinkedIn and Google Ads postponed, the Microsoft payment method, the UET tag verification, the GA4 stream label, the `@deepzeta.ai` admins, the Business Profile link; B7's reason now names previews, CI and local tests (the office IP changes, so the owner's own visits still count) |
| 2026-10-02 | P3 part C (step C4): the campaign-link rule written into 09 §2.8, and the Business Profile's website link set to `https://deepzeta.ai/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` |
| 2026-10-04 | P3 part C (step C5): Part B ticked ☑ ("B1–B8 done" — the container imported after the `ONCE_PER_LOAD` fix, Preview and DebugView, dimensions, key events, published; B7's filter on; B8's Meta and Microsoft goals), the Vercel GTM variable row ticked ☑ (done 2026-10-03 with the redeploy). C5's measurement: the third-party caps set (Europe 1 request/160 KB — gtm.js only; UAE 4 requests/350 KB), CI gets the real ID, the `EVENT_DETAILS` browser leak C1b caused is fixed, and European Home's lab-LCP allowance is 2,550 ms (C61, the owner). Still open: Microsoft's "primary" goal setting (its help page unreachable offline — read online and quote into guide B8); PSI on production after launch (Meta and UET load on the production host only, so CI never measures them) |
| 2026-10-06 | P4 close-out: the manual schema validators (03 §4 — Rich Results Test and the Schema Markup Validator on the deployed preview's Home) deferred by the owner's decision on 2026-10-06 ("i am not doing" them now); two rows added above so they run on the deployed preview before launch. Recorded in the P4 plan's Progress notes and named in the P5 plan's allowed files |
| 2026-10-06 | P5 S7: Home's lab exceptions (C63: LCP 2,750 ms on both profiles; C64: page weight 204,800 B in the lab; the owner's decisions), with one row added in section 4 to check Home's real speed and Brotli weight on production |
| 2026-10-07 | After the P5 merge: Home's real weight on production is 198,396 B, not about 180 KB (C65 corrects C64). The production row's figure is updated, and P6 slims Home under 190,868 B |
| 2026-10-07 | Automation Track A (decision 0027, the plan `docs/plans/2026-10-07-automation-pipeline.md`): five rows added in section 5 (register the number, the team WhatsApp number, the 13-check test as the go-live condition, the privacy policy's four processors, spend limits). Section 5's first row: the owner gave the number (+971 54 547 6335) in chat today; it isn't active on WhatsApp yet. Its second row (keep replying from the WhatsApp Business phone app) is overtaken by the owner's choice today: on the Cloud API the number can't be used in the app, and the team replies from personal WhatsApp. Coexistence through a Meta partner stays a later option. Both rows await the owner's tick |
| 2026-10-08 | P6 part A2 (S12): the schema validators for the hub and the service template, GTM Preview for `view_service`, and Home's weight on A2's preview |
