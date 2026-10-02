# Privacy Policy: content and layout (DRAFT)

> **Status:** Final wording approved by the owner, 2026-09-29. **Changed 2026-09-30:** the AI provider is now DeepSeek, which stores data in China (decision 0016; §6, §7, §8, Q4–Q6), so the wording needs the owner's re-approval. Before `/privacy` ships, the P7 check of whether DeepSeek trains on API inputs (0016) must be done, and §6 and Q6 updated if it does. **Changed 2026-10-02 (P3, conflict C52):** consent by region: analytics and marketing wait for permission in the EEA, the UK and Switzerland and are on elsewhere until switched off (the hero, at a glance, §3, §4, §5, §9, Table E, §18, Q3 and Part 3 note 2); approved by the owner with the P3 plan (section N). **Changed 2026-10-02 (P3 part B's close):** four sentences that still said optional cookies wait for consent everywhere now name the region (§1's "In short", Table C's Google row and its ad networks row, FAQ Q4, which also gains a closing sentence to reach the 40-word floor); approved by the owner, 2026-10-02. No external legal review (the owner's decision). Values in `{braces}` are variables from the site config; build dependencies are listed in Part 3.
> **Moves to:** `src/content/en/legal/privacy.ts` (typed content) in P6. The page is `/privacy` (T2).
> **Adapted from:** the owner's other site's privacy page (`Planning Folder/For Ai/Other project references only/privacy-policy-content-and-layout.md`).

## How this draft differs from the reference (read first)

The owner asked to change only the brand and related topics. Several of the reference's promises would be **false for Deepzeta AI**, so they were rewritten to match how this site actually works. Publishing them unchanged would break N3 and the UAE PDPL.

| Reference said | Why it can't stay | Here |
|---|---|---|
| "100% in-house processing", "0 third parties", "we never share with any third party" | We use service providers: hosting, email, CRM, automation, AI, spam protection, booking, WhatsApp | "We never **sell** your data", plus an honest list of providers (§7) |
| "Data processed and stored within the UAE" | Several providers store or process data outside the UAE | §8 says so and explains the safeguards |
| "We do not share browsing data with advertising networks" | Our analytics plan (09 §1) includes Google Ads, Meta and LinkedIn measurement | Only with marketing consent in the EEA, the UK and Switzerland; on by default elsewhere, and stated plainly (§9) |
| "Legitimate interest" as a legal basis | The UAE PDPL has no general legitimate-interest basis like the GDPR | Consent, your request/contract, legal duty |
| Stats strip "0 / 100% / 24h" | Numbers we can't prove (N3) | Four plain promises, no numbers |
| Government authorities section; DED licence number; Dubai Chamber membership | Not our business; not our facts | Removed; our licence number is added when the owner provides it |
| "Data Protection Officer" | We haven't appointed one | "Privacy contact" |
| `PrivacyPolicy` schema type | Doesn't exist in schema.org | WebPage + BreadcrumbList + FAQPage (08 §3) |
| lucide icons, their colour classes | Banned and not our design system | Our tokens and Tier 1 icons (05, Icon Master Rules) |

**Kept from the reference, because it's good practice:**
- the hero with a quotable direct answer and a visible "Last updated"
- a sticky table of contents with real anchor links
- one `<section>` per topic with `aria-labelledby`
- tables for data categories, purposes and retention
- an FAQ that matches its schema word for word
- the contact block and related links
- logical CSS for RTL
- one structure, reused for the Arabic version in P11

**Tokens.** Values in `{braces}` are read from the site config (06 §3), never typed into the copy. When a value is `null`, the sentence or button that uses it is hidden. Current values:

| Token | Value |
|---|---|
| `{brandName}` | Deepzeta AI |
| `{legalName}` | Deepzeta Digital Solutions L.L.C. |
| `{licenceAuthority}` | Dubai Department of Economy and Tourism (DET) |
| `{licenceNumber}` | `null` (UNKNOWN) |
| `{address}` | Office #202, Al Hilal Bank Building, Al Qusais 2, Dubai, United Arab Emirates |
| `{email}` | hello@deepzeta.ai |
| `{phone}`, `{whatsapp}` | `null` (PENDING) |
| `{hours}` | Monday to Saturday, 8:00 AM to 5:00 PM (GST) |
| `{lastUpdated}` | the date the owner approves the final text |

---

# Part 1: Page layout (our design system)

**Route:** `/privacy` (EN), `/ar/privacy` in P11. **Tier:** T2. **Effects:** none beyond the global ones. A legal page stays calm: `scroll-reveal` off, `hover-underline` on links only.

| # | Block | Notes |
|---|---|---|
| 1 | Hero | Eyebrow "Privacy", H1, direct-answer paragraph, "Last updated {lastUpdated}". The H1 is the LCP element: visible at first paint, no entrance animation (13 §3). |
| 2 | At a glance | Four `glass-tint` cards with a Tier 1 icon each (lock, check, mail, shield). Real HTML text. |
| 3 | Contents + sections | A sticky table of contents on desktop (a `<nav aria-label="Privacy policy sections">` with real `#anchor` links and `aria-current` on the section in view). On mobile, a native `<details>` "On this page" list, not a sideways chip row. Sections use `scroll-margin-block-start` so headings clear the header. |
| 4 | FAQ | `<details>` items. The text matches the FAQPage JSON-LD word for word (08 §3 rule 7). |
| 5 | Contact | "Questions about your data?" with the Email button (primary style only if no other primary is in view), plus WhatsApp and Call when those values exist. |
| 6 | Related links | Contact, About, and Terms once `/terms` exists (never link to a missing page, 04 §1.4). |

- **Tables:** a `<table>` with `<caption>` and `scope="col"`, wrapped so it scrolls sideways inside its own box on small screens; the page itself never scrolls sideways.
- **Schema:** WebPage (`dateModified` = `{lastUpdated}`), BreadcrumbList (Home → Privacy policy, mirroring a visible trail), FAQPage. The sitewide nodes come from the root layout only.

---

# Part 2: Content

## 2.1 Metadata

| Field | Value |
|---|---|
| Title (rendered with the suffix) | Privacy Policy: How We Protect Your Data \| Deepzeta AI |
| Description | How Deepzeta AI collects, uses and protects your personal data under the UAE PDPL, who processes it for us, and how to use your rights. Read the policy. |
| Canonical | `{SITE_URL}/privacy` |
| Breadcrumb label | Privacy policy |

## 2.2 Hero

- **Eyebrow:** Privacy
- **H1:** Privacy Policy
- **Direct answer:**
  > {brandName} collects only the personal data it needs to answer your enquiry and deliver your project, and never sells it. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland; elsewhere they're on until you switch them off in Cookie settings. Email {email} to use your UAE PDPL rights.
- **Last updated:** {lastUpdated}

## 2.3 At a glance

| Title | Line |
|---|---|
| We never sell your data | Not to advertisers, not to data brokers, not to anyone. |
| Cookies you control | We ask first in the EEA, the UK and Switzerland. Anywhere, you can switch them off at any time. |
| Your rights, one email away | Ask to see, correct or delete your data at {email}. |
| Protected by UAE law | Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data. |

## 2.4 Sections

### 1 · `introduction` · Introduction

This Privacy Policy explains how {legalName}, trading as {brandName} ("{brandName}", "we", "us"), collects, uses, shares and protects your personal data when you visit this website, use our demos and tools, contact us or work with us.

We handle personal data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "PDPL") and the other UAE laws that apply to us.

In short: we collect what we need, we use it for the reason you gave it to us, we never sell it, and optional cookies wait for your permission if you visit from the EEA, the UK or Switzerland.

### 2 · `who-we-are` · Who we are

{brandName} is the trading name of {legalName}, a limited liability company licensed by the {licenceAuthority}[, trade licence number {licenceNumber}]. The bracketed part appears only once the number is set. Our office is at {address}.

We build custom-coded websites, AI automations and growth systems for businesses in the UAE and the GCC. For the personal data described here, we are the controller: we decide why and how it is used.

### 3 · `information-we-collect` · What we collect

We collect the smallest amount of personal data that does the job. We don't ask for sensitive data (such as health, religion or biometric data) and ask you not to send it to us.

**Table A: What we collect**

| Category | Examples | When |
|---|---|---|
| Contact details | Name, business name, email, phone or WhatsApp number | You book an audit, fill in a form, book a call or message us |
| Your request | The service you're interested in, your message, your website address, answers you give in our tools | You send a form or use a tool |
| Booking details | Meeting time, time zone, notes you add | You book a call |
| Conversations | Emails and WhatsApp messages with us | You contact us or we reply |
| Project and billing records | Scope, quotes, invoices, payment status | You become a client |
| How you found us | Campaign tags (UTM) and ad click IDs saved with your form | You arrive from a link or an ad and send a form |
| Technical data | IP address, browser, device, pages visited, approximate location (city level) | You visit the site. Analytics data: with your consent if you're in the EEA, the UK or Switzerland; elsewhere unless you switch it off. |
| AI demo and tool inputs | What you type into the AI agent demo or the Social Media Content Planner | You use them |

### 4 · `how-we-collect` · How we collect it

- **From you:** through our forms, booking page, email, WhatsApp and the tools on this site.
- **Automatically:** through essential cookies and, if you allow them, analytics and marketing cookies (§9). If you visit from outside the EEA, the UK and Switzerland, analytics and marketing are on until you switch them off.
- **From your public website:** when you ask the Website & AI Search Health Check to review a web address, we read that public page. We never log in or collect personal data from it.

### 5 · `how-we-use` · How we use it, and why we're allowed to

**Table B: Purposes and legal basis**

| Purpose | Data used | Basis |
|---|---|---|
| Reply to you, prepare and schedule your free AI audit | Contact details, your request, booking details | Your request (steps before a contract) |
| Deliver and support your project | Contact details, project records, conversations | Our contract with you |
| Invoicing, tax and accounting | Billing records | UAE legal obligations |
| Keep the site secure and stop spam and abuse | Technical data | Needed to run the site safely |
| Understand which pages help people | Analytics data | Your consent in the EEA, the UK and Switzerland; elsewhere, your choice: on unless you switch it off |
| Measure our ads | Marketing cookies; hashed email or phone | Your consent in the EEA, the UK and Switzerland; elsewhere, your choice: on unless you switch it off |
| Send you ideas and news by email | Email address | Your consent (opt-in; unsubscribe any time) |


We don't use your data for anything unrelated to these purposes without asking you first.

### 6 · `ai-features` · AI features and tools

- **AI agent demo:** a demonstration. What you type is sent to our AI provider (DeepSeek) to generate replies. Please don't share personal or sensitive information in it. We don't keep demo conversations in our records.
- **Social Media Content Planner:** your answers about your business are sent to our AI provider to write your plan. If you ask for the full plan, we also receive your email address.
- **Website & AI Search Health Check:** checks the public page at the address you give, using Google PageSpeed Insights and our own checks. If you ask for the full report, we receive your email address.
- **No automated decisions:** we don't make decisions about you, with legal or similarly significant effects, based only on automated processing.

### 7 · `sharing` · Who we share it with

**We never sell or rent your personal data, and we never give it to other companies for their own marketing.**

We use a small number of service providers to run this website and our services. They process data on our behalf, for the purposes in this policy only.

**Table C: Our service providers**

| Provider | What they do for us | Data involved |
|---|---|---|
| Vercel | Hosts this website | Technical data; forms as they pass through |
| Google | Email and our customer records (Google Workspace); tag management and analytics (Google Tag Manager, Google Analytics; with your consent in the EEA, the UK and Switzerland); speed checks (PageSpeed Insights) | Contact details, requests, conversations; analytics data; the web address you check |
| n8n | Runs our automations: passes your enquiry to our records and our email | Contact details, your request |
| DeepSeek | Powers the AI agent demo and the Content Planner | What you type into them |
| Cloudflare | Spam protection on forms (Turnstile) | Browser and device signals |
| Upstash | Short-term limits that stop form abuse | IP address, kept briefly |
| Cal.com | Call booking | Name, email, booking details |
| Meta (WhatsApp Business Platform) | WhatsApp messages with us | Phone number, profile name, messages |
| Google Ads, Meta, LinkedIn (with marketing consent in the EEA, the UK and Switzerland; on elsewhere until you switch them off) | Measure whether our ads work | Cookie identifiers; a hashed (scrambled) email or phone after you send a form |


We may also disclose personal data when UAE law, a court or a competent authority requires it, or to protect our rights, our clients or the public.

### 8 · `international-transfers` · Where your data is stored

Some of our providers store or process data outside the UAE, for example in the European Union, the United States or China. When that happens, we transfer it only as the PDPL allows, and we choose providers that commit to protecting it.

### 9 · `cookies` · Cookies and similar technologies

Cookies are small files your browser stores. We sort them into three groups. Essential ones always run. If you visit from the EEA, the UK or Switzerland, analytics and marketing wait for your choice; elsewhere they're on until you switch them off.

**Table D: Cookie groups**

| Group | What it does | Default |
|---|---|---|
| Essential | Keeps the site secure, stops spam on forms, and remembers your cookie choice and display settings (such as Reduce effects) | Always on |
| Analytics | Google Analytics shows us, in aggregate, which pages people visit and where they get stuck | Off until you allow it in the EEA, the UK and Switzerland; on elsewhere |
| Marketing | Google Ads, Meta and LinkedIn measure whether our ads bring people here, and can show our ads to people who've visited | Off until you allow it in the EEA, the UK and Switzerland; on elsewhere |

- **Changing your choice:** use "Cookie settings" at the bottom of every page. We remember your choice for 12 months.
- **Blocking cookies:** you can also block cookies in your browser. Essential ones are needed for forms to work.

The full list of cookies, with each one's name, provider and lifetime, is shown in "Cookie settings".

### 10 · `marketing` · Marketing emails

We send marketing emails only if you tick the box that asks for them. Every email has a one-click unsubscribe link, and you can also reply "unsubscribe" or email {email}.

### 11 · `data-security` · How we protect it

- Everything travels over encrypted connections (HTTPS).
- Access is limited to people who need it for your request or project.
- Our business accounts use two-step verification.
- Passwords and keys are kept in encrypted stores, never in code.

No system is perfectly secure. If a breach puts your data at risk, we will tell you and the authorities as the law requires.

### 12 · `data-retention` · How long we keep it

We keep personal data only as long as we need it for the purpose you gave it for, or as long as the law requires. Then we delete it or make it anonymous.

**Table E: Retention**

| Data | How long |
|---|---|
| Enquiries that don't become projects | 24 months after our last contact |
| Client project records | For the project, then as long as UAE law requires |
| Billing and accounting records | As long as UAE tax and accounting laws require |
| WhatsApp and email conversations | 24 months after the last message, or longer as part of a client project record |
| Booking records | 24 months |
| Tool results without a report request | Until your result is shown, and no longer than 30 days |
| Spam-protection and abuse limits | Up to 24 hours |
| Analytics data | 14 months |
| Your cookie choice | 12 months |
| How you found us (campaign tags and ad click IDs, in your browser) | 90 days |


### 13 · `your-rights` · Your rights under the UAE PDPL

You can ask us to:
- tell you what personal data we hold about you and how we use it
- give you a copy of it
- correct anything that's wrong or incomplete
- delete it, where the law allows
- restrict or stop certain uses of it
- send it to you or another company in a common format, where applicable

You can also withdraw your consent at any time (§18).

**How to ask:** email {email} from the address we know you by, or tell us how else we can confirm it's you. We acknowledge every request within 24 hours on business days (Monday to Saturday) and answer fully within the time the law allows.

If you're unhappy with our answer, you can complain to the UAE Data Office, the authority that supervises the PDPL.

**Official sources:**
- [Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data](https://uaelegislation.gov.ae/en/legislations/1972) (UAE Legislation portal)
- [Data protection laws](https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws) (the UAE Government portal)

### 14 · `childrens-privacy` · Children

Our services are for businesses. We don't knowingly collect personal data from anyone under 18. If you think a child has sent us personal data, contact us and we'll delete it.

### 15 · `third-party-links` · Links to other websites

This site links to other websites, such as our social profiles and official sources. They have their own privacy policies, and we're not responsible for them.

### 16 · `changes` · Changes to this policy

When we change how we handle personal data, we update this page and its "Last updated" date. If a change is significant, we'll also tell clients by email.

### 17 · `contact-us` · Contact us

For any privacy question or request:
- Email: {email}
- WhatsApp: {whatsapp} (shown once set)
- Phone: {phone} (shown once set)
- Office: {address}
- Hours: {hours}

### 18 · `consent` · Consent, and how to withdraw it

Where we rely on your consent or your choice (analytics and marketing cookies, marketing emails, WhatsApp follow-ups you opted into), you can withdraw it at any time:
- **Cookies:** change your choice in "Cookie settings" at the bottom of every page.
- **Emails:** use the unsubscribe link in any email.
- **Anything else:** email {email}.

Withdrawing consent doesn't affect what we did before you withdrew it. We may still need to keep some records that the law requires.

## 2.5 FAQ (the text must match the FAQPage schema word for word)

**Title:** Privacy questions, answered

**Q1. Does Deepzeta AI sell my personal data?**
No. We never sell or rent your personal data, and we never give it to other companies for their own marketing. Service providers such as our hosting and email companies process it only to run our services for you.

**Q2. What data do you collect when I book a free AI audit?**
Your name, business name, email, phone or WhatsApp number, the service you're interested in and your message. If you arrived from a link or an ad, we also save the campaign tag. We use this only to prepare and schedule your audit.

**Q3. Do you use cookies?**
Yes. Essential cookies keep the site secure and working. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland, and are on elsewhere. You can change your choice at any time from "Cookie settings" at the bottom of every page.

**Q4. Which companies process my data for you?**
Our main service providers are Vercel (hosting), Google (email, customer records and analytics), n8n (automation), DeepSeek (AI demos), Cloudflare (spam protection), Upstash (abuse limits), Cal.com (booking) and Meta (WhatsApp). Section 7 lists what each one does for us and which data it handles.

**Q5. Is my data stored in the UAE?**
Not always. Some of our providers store or process data outside the UAE, for example in the European Union, the United States or China. We transfer data only as the UAE PDPL allows and choose providers that commit to protecting it.

**Q6. What happens to what I type into the AI agent demo?**
It's sent to our AI provider, DeepSeek, to generate the replies you see. The demo is for trying our AI, so please don't share personal or sensitive information in it.

**Q7. How long do you keep my data?**
Only as long as we need it. For example, enquiries that don't become projects are kept for 24 months after our last contact, and billing records for as long as UAE tax and accounting laws require. Section 12 lists every period.

**Q8. How do I see, correct or delete my data?**
Email {email} and tell us what you need. We'll confirm it's you, then answer within the time the UAE PDPL allows. You can also withdraw consent or unsubscribe from marketing emails at any time.

(Q7 repeats a period from Table E. If the owner changes it, both change together.)

## 2.6 Contact block

- **Title:** Questions about your data?
- **Body:** Ask us anything about how we handle your data, or send a request to see, correct or delete it. A real person replies.
- **Buttons:** "Email us" (`mailto:{email}`) · "WhatsApp us" (shown once `{whatsapp}` exists) · "Contact page" (`/contact`)

## 2.7 Related links

| Card | href | Line |
|---|---|---|
| Contact Deepzeta AI | `/contact` | Talk to a person about your project or your data. |
| About us | `/about` | Who we are and how we work. |
| Terms of service | `/terms` | Shown only once the terms page exists (draft: `docs/content-drafts/legal/terms-of-service.md`). |

## 2.8 Note under the tables

> This policy describes how we handle personal data today. We update it when our practices or the law change.

---

# Part 3: Build notes (not page copy)

These keep the promises in this policy true. They are checked by the plans named here, not shown on the page.

1. **Cookie list (P3):** "Cookie settings" lists every cookie's name, provider and lifetime, generated from the live GTM container. Nothing loads that isn't listed.
2. **Consent (P3):** for visitors from the EEA, the UK and Switzerland, no analytics or marketing tag runs before consent; for others they run until switched off. Server-side conversion events (Meta, LinkedIn, Google offline import) with hashed contact details go only for leads whose consent state at sending includes Marketing (chosen, or the default outside Europe) (`consent-copy.md` §5).
3. **Providers:** Table C and FAQ Q4 list only providers that are active. Adding or removing a provider changes this page in the same pull request.
4. **AI demo (P7):** demo conversations are not written to our records (§6).
5. **Retention:** Table E is carried out as written. The GA4 data-retention setting is 14 months; spam and abuse limits expire within 24 hours; tool results expire within 30 days.
6. **Variables:** `{licenceNumber}`, `{phone}` and `{whatsapp}` stay hidden while they are `null` (facts file §2).
7. **Data requests:** requests to {email} are acknowledged within 24 hours on business days, as §13 promises.
