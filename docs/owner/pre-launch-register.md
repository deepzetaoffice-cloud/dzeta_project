# deepzeta · Pre-launch register (manual work before the site goes public)

> **What this is:** the one list of everything that has to be done by hand, by you, before launch (Phase 10), so nothing is forgotten between phases.
> **How it works:** Claude adds a row whenever a phase leaves manual work behind, and you tick a row when it's done. At P10 Claude checks every row before the launch sign-off. A row is never deleted; a dropped one is marked "Not needed" with the reason.
> **Related:** the accounts checklist `docs/owner/deepzeta-owner-checklist.html` (accounts to open), the tracking guide `docs/owner/p3-tracking-setup-guide.md`, the visibility guide `docs/owner/visibility-setup-guide.md`.
> **Started:** 2026-10-01, at the end of P2.

---

## 1. Tracking and consent

| ✓ | What | Why | When | How |
|---|---|---|---|---|
| ☐ | Tracking guide **Part A**: GTM container, GA4 property and its settings, and the IDs sent to Claude | P3 can't start without the IDs, and the GA4 settings stop events being counted twice | Now, before P3 | Tracking guide, Part A |
| ☑ | Answer the guide's **questions 8 and 9** (the consent banner; what counts as a conversion) | They decide how P3 is built | Before P3 | **Answered 2026-10-02:** analytics on by default for every visitor, no banner; conversions as proposed |
| ☐ | Tracking guide **Part B**: import the container, test in Preview and DebugView, custom dimensions, key events, publish | The code's event names and the dashboards must match exactly | After P3 is built | Tracking guide, Part B |
| ☐ | Turn the GA4 **Internal Traffic** filter to Active | Keeps your own visits out of the numbers | A day after Part B | Tracking guide B7 |
| ☐ | Meta, LinkedIn and Google Ads conversions (only the platforms you use) | Ads need conversions to optimise; one method each, so nothing is counted twice | After Part B | Tracking guide B8 |
| ☐ | The **privacy and cookie policy names exactly the tools in the GTM container** | A policy that lists different tools from the ones that run is misleading (UAE PDPL) | Before launch, and after any tracking change | Claude compares the two and sends you the list |
| ☐ | Test the consent setup in Tag Assistant's Consent tab: it must match what P3 builds for your 2026-10-02 answer (analytics on by default for everyone) | The site's consent signals and the tags must agree | Before launch | Tracking guide B2 (P3 updates the step) |
| ☐ | Secret server keys (Meta and LinkedIn Conversions API tokens) go into Vercel's environment variables, entered by you | Secrets never pass through chat or the repo | When the lead flow ships (P6–P7) | Claude sends the variable names |

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

## 6. Sessions still parked (Claude reminds you)

- Designer Studio: the 15+ concept site designs, planned one by one.
- Deepzeta Sync (`/tools`): the sales "mega automation" flow.
- The App demo (DeepZAuto): naming, branding and provenance.
- pSEO: starts only when every V1 page in the URL registry is live.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-01 | Created at the end of P2 (decision 0019): tracking, devices (C51, the iPhone), domain and hosting, visibility, contact details, parked sessions |
| 2026-10-02 | The opening hours: decided (show them in the footer) |
| 2026-10-02 | Questions 8 and 9 answered; the consent test row follows P3's design |
