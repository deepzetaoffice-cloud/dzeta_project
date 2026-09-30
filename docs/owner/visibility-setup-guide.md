# deepzeta · Visibility Setup Guide

> **For:** the owner · **Goal:** get deepzeta found on Google and named by AI engines (ChatGPT, Gemini, Perplexity, Google AI Overviews, Copilot) · **Prepared:** 2026-09-28
> Tick each box as you go. Accounts, passwords and verification are done by you, never by an AI agent.

---

## 0. Before you create anything (blocking)

Every profile must show **exactly the same** name, address, phone and website. Google and AI engines match these character by character to decide that all the profiles belong to one real business. Changing them later means editing every profile again.

Lock these first, then write them into `docs/facts/company-facts.md` (only you edit that file):

- [ ] **Business name, exactly as it will appear everywhere.** Decide the spelling and casing once (for example `deepzeta` or `Deepzeta`, with or without `AI Digital Solutions`). The facts file currently says `deepzeta`; the logo wordmark shows `Deepzeta`.
- [ ] **Website:** `https://deepzeta.ai` (decision 0006-domain). The facts file still lists the domain as UNKNOWN; update it.
- [ ] **Business address:** a real office where you work. **Not** a virtual office, P.O. box or mailbox rental, which Google suspends. If you work from home or visit clients, you'll create a *service-area* profile with the address hidden.
- [ ] **Phone** in international format (e.g. `+971 …`), and the **WhatsApp** number.
- [ ] **Public email on the domain**, e.g. `hello@deepzeta.ai`. Use it to own every account below, not a personal Gmail.
- [ ] **Opening hours.**
- [ ] **Trade licence** number and authority (Google may ask for it during verification).
- [ ] **One short description** (≈ 150 characters) and **one long description** (≈ 750 characters), written from the Services Catalogue. Reuse the same text everywhere, adjusted only for length limits.
- [ ] **Brand kit folder:** logo square (from the locked SVG, exported as PNG 1024×1024), cover images per platform, founder photo.
- [ ] **Password manager + two-factor authentication** on every account.

**Handle (username):** pick one and use it everywhere. Check availability on all platforms first. Options: `deepzeta`, `deepzeta.ai`, `deepzetaai`. Reserve it on every platform on the same day, even ones you won't use yet.

---

## 1. Tier 1: the foundation (week 1)

These carry the most weight for Google and AI engines. Do them all before launch.

### Google
- [ ] **Google Business Profile** (business.google.com)
  - Storefront profile if clients can visit your office; **service-area profile** (address hidden, up to 20 areas, e.g. Dubai, Sharjah, Abu Dhabi) if not.
  - Primary category: choose the closest match from Google's list (candidates to look for: *Internet marketing service*, *Website designer*, *Software company*, *Marketing agency*). Add the others as secondary categories.
  - Add every service, using the **exact names** from the Services Catalogue.
  - Upload logo, cover, real office and team photos (no stock photos).
  - Verification: Google often asks for a short video showing where you work and proof you run the business (e.g. trade licence). Follow what Google shows you.
- [ ] **Google Search Console** (at website launch): verify `deepzeta.ai` as a *Domain* property, submit the sitemap.
- [ ] **Google Analytics 4 + Google Tag Manager** (at launch; set up per `docs/ai/09-analytics-tracking.md`).

### Microsoft (feeds ChatGPT search and Copilot)
- [ ] **Bing Webmaster Tools** (at launch): import from Google Search Console, submit the sitemap, turn on **IndexNow**. ChatGPT search uses Bing's index, so a page missing from Bing can't appear in ChatGPT answers.
- [ ] **Bing Places for Business**: import directly from your Google Business Profile.

### Apple
- [ ] **Apple Business Connect** (businessconnect.apple.com): Apple Maps and Siri listing.

### Core social profiles
- [ ] **LinkedIn Company Page**: your most important B2B profile, heavily cited by AI engines. Full "About", services, website, location.
- [ ] **Founder's personal LinkedIn**: headline naming deepzeta, "Experience" linked to the Company Page. People buy from people, and AI engines use named experts for trust.
- [ ] **Instagram** (Business account): demos, reels, behind the scenes.
- [ ] **Facebook Page**: required for Meta ads, Meta Business Suite and the WhatsApp Business API.
- [ ] **YouTube channel**: short demos of each automation. YouTube is one of the most-cited sources in AI answers, and videos rank on Google quickly.
- [ ] **WhatsApp Business** app now; move to the WhatsApp Business API when the site's WhatsApp automations are built.
- [ ] **TikTok** (Business account).
- [ ] **X (Twitter)**: reserve the handle; post occasionally.

---

## 2. Tier 2: AI citation sources (weeks 2–4)

AI engines often name agencies from **directories and discussion sites**, not from the agencies' own websites. Being listed and reviewed on these is the fastest route into AI answers.

### Agency directories (highest value for "best AI automation agency in Dubai" type questions)
- [ ] **Clutch** (clutch.co): full profile, services, and **verified client reviews** (Clutch interviews your clients).
- [ ] **GoodFirms** (goodfirms.co)
- [ ] **DesignRush** (designrush.com)
- [ ] **The Manifest** (themanifest.com, same company as Clutch)
- [ ] **Sortlist** (sortlist.com)

### Company databases
- [ ] **Crunchbase**: company profile with founding date, founder, location, website.
- [ ] **Wikidata**: **later**, only once independent sources (press, directories) mention deepzeta. An entry without references gets deleted. **Wikipedia** only if independent press coverage exists; never write your own article.

### Community and discussion (be genuinely helpful, never advertise)
- [ ] **Reddit**: answer questions in communities such as r/dubai, r/UAE, r/n8n and r/automation. Reddit is among the most-cited sources across AI engines. Spam or self-promotion gets banned and hurts the brand.
- [ ] **Quora**: answer questions about AI automation, WhatsApp bots and websites in the UAE.
- [ ] **LinkedIn articles and posts**: weekly, from the founder's profile.

### Proof of expertise
- [ ] **GitHub organisation** `deepzeta`: publish useful n8n workflow templates or small open-source tools.
- [ ] **n8n Creator Hub**: submit public workflow templates with your name and link.
- [ ] **Partner directories** (Make, Zapier Experts, Google Partners, Meta Business Partners): **only** after you meet each program's requirements. Never show a partner badge you don't hold (rule N3).

---

## 3. Tier 3: UAE local citations (weeks 2–6)

Consistent listings on UAE directories confirm your location to Google. Use the **exact** name, address and phone from section 0 on every one.

- [ ] **Yellow Pages UAE**
- [ ] **Connect.ae**
- [ ] **Hello UAE**
- [ ] **Dubai Online**
- [ ] **Foursquare for Business**: its data feeds many apps and maps.
- [ ] **Dubai Chamber** member directory (if you become a member).
- [ ] Your **free zone or authority's** business directory, if it has one.

Add more slowly: 10 accurate, complete listings beat 100 half-empty ones. Skip any site that asks for payment to "guarantee rankings".

Keep a tracking sheet with one row per listing: platform · URL · login email · date created · NAP checked (yes/no).

---

## 4. Website-side setup (built in Phase 0+; not for you to do by hand)

These are already in the project rules and will be built with the site:

- Schema `Organization` / `LocalBusiness` with **`sameAs`** links to every profile above. This is how Google and AI engines connect the profiles to the website. Send the final profile URLs to be added to `docs/facts/company-facts.md`.
- `llms.txt` and `llms-full.txt`
- `robots.txt` allowing AI search bots
- Sitemap, IndexNow pings on publish
- Direct-answer content, FAQ schema, author pages for the founder

---

## 5. Keep it growing (every week after launch)

| Frequency | Task |
|---|---|
| Weekly | 1 Google Business Profile post · 2–3 LinkedIn posts · 1 short video (YouTube Shorts / Reels / TikTok) · answer 2–3 Reddit or Quora questions |
| After every project | Ask the client for a Google review **and** a Clutch review |
| Monthly | Ask ChatGPT, Gemini, Perplexity and Copilot "best AI automation agency in Dubai" style questions and record whether deepzeta appears (per `docs/ai/08`) · check Search Console and Bing Webmaster Tools |
| Quarterly | Re-check every listing: same name, address, phone, website, hours |

**Reviews rules:** ask every real client; reply to every review; **never** buy reviews, write your own, or offer discounts or gifts for them. Google treats incentivised and fake reviews as a policy violation.

---

## 6. What "fastest ranking" really means

There's no shortcut that is safe. A new domain usually takes months to rank for competitive searches. The fastest **legitimate** levers, in order:

1. **Google Business Profile**: can appear in Maps and local results within weeks of verification.
2. **Bing + IndexNow**: new pages indexed within days, which opens ChatGPT and Copilot.
3. **Directory profiles with reviews** (Clutch, GoodFirms): these pages already rank and are already cited by AI engines.
4. **YouTube and LinkedIn content**: these platforms rank their own pages quickly.
5. **The website's own speed, schema and answer-first content**: the long-term engine.

**Avoid (they cause penalties):** bought backlinks, link networks, fake reviews, virtual-office addresses on Google Business Profile, mass AI-generated pages, and "guaranteed #1" services.

---

## 7. Suggested order

| When | Do |
|---|---|
| Day 1 | Section 0: lock name, address, phone, email, descriptions; reserve the handle everywhere |
| Week 1 | Google Business Profile, Apple Business Connect, LinkedIn (company + founder), Facebook, Instagram, YouTube, WhatsApp Business, TikTok |
| Weeks 2–4 | Clutch, GoodFirms, DesignRush, The Manifest, Sortlist, Crunchbase, GitHub; start Reddit/Quora/LinkedIn routine |
| Weeks 2–6 | UAE directories (section 3) |
| Website launch | Search Console, Bing Webmaster Tools + IndexNow, Bing Places, schema `sameAs` |
| After launch | Section 5 routine; Wikidata once independent sources exist |
