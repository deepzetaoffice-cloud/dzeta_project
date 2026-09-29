# Terms of Service: content and layout

> **Status:** Final wording approved by the owner, 2026-09-29. Written to best practice for a UAE B2B agency website. No external legal review (the owner's decision).
> **Moves to:** `src/content/en/legal/terms.ts` (typed content) in P6. The page is `/terms` (T2).
> **Scope:** these terms cover the website, the free AI audit, Deepzeta Sync tools and the demos. Paid projects run on their own signed proposal or agreement, which wins where the two differ.
> **Tokens:** values in `{braces}` come from the site config (06 §3) and are hidden while `null`. `{licenceNumber}` is PENDING until the full licence is issued.

---

# Part 1: Page layout

Same calm pattern as the privacy policy (`privacy-policy.md` Part 1): hero with a direct answer and "Last updated", four "at a glance" cards, a sticky table of contents with real `#anchor` links (a native `<details>` list on mobile), one `<section aria-labelledby>` per topic, an FAQ, a contact block and related links. No effects beyond the global ones. The H1 is visible at first paint.

**Schema:** WebPage (`dateModified` = `{lastUpdated}`), BreadcrumbList (Home → Terms of service, mirroring a visible trail), FAQPage (08 §3).

---

# Part 2: Content

## 2.1 Metadata

| Field | Value |
|---|---|
| Title (rendered with the suffix) | Terms of Service: Using Our Website and Tools \| Deepzeta AI |
| Description | The terms for using the Deepzeta AI website, the free AI audit and Deepzeta Sync tools: fair use, AI output, no guarantees and UAE law. Read them here. |
| Canonical | `{SITE_URL}/terms` |
| Breadcrumb label | Terms of service |

## 2.2 Hero

- **Eyebrow:** Legal
- **H1:** Terms of Service
- **Direct answer:**
  > These terms explain how you can use the {brandName} website, the free AI audit, our Deepzeta Sync tools and our demos. The free services come with no obligation and no guarantees of rankings or revenue. Paid projects follow the proposal or agreement you sign with us, and UAE law applies.
- **Last updated:** {lastUpdated}

## 2.3 At a glance

| Title | Line |
|---|---|
| The audit is free | No payment, no obligation, no pressure. |
| No guaranteed results | We never promise rankings, AI-search visibility or revenue. |
| Your inputs stay yours | You keep the rights to what you give us and what our tools create for you. |
| Paid work is in writing | Every project runs on a proposal or agreement you sign. |

## 2.4 Sections

### 1 · `about-these-terms` · About these terms

These Terms of Service ("terms") apply when you visit this website or use anything on it, including the free AI audit, the Deepzeta Sync tools and our demos. By using the website, you agree to them. If you don't agree, please don't use the website.

If you use the website on behalf of a business, you confirm that you're allowed to accept these terms for it.

Nothing in these terms limits any right you have under UAE law that can't legally be limited.

### 2 · `who-we-are` · Who we are

The website is run by {legalName}, trading as {brandName} ("we", "us"), a limited liability company licensed by the {licenceAuthority}[, trade licence number {licenceNumber}]. The bracketed part appears only once the number is set. Our office is at {address}.

### 3 · `using-this-website` · Using this website

You may use this website to learn about our services, try our demos and tools, and contact us. Please don't:
- break the law, or use the website to harm anyone
- try to get around its security, overload it, or reach parts of it you aren't meant to
- copy or scrape it in bulk, or use automated tools that put a load on it
- send false information, spam or harmful files through our forms
- try to make our AI demos produce harmful content or reveal how they're set up

We may limit or stop access for anyone who misuses the website.

### 4 · `free-ai-audit` · The free AI automation audit

- The audit is free. It carries no obligation to buy anything.
- It's a conversation and a review. We look at how your business handles work such as leads, bookings and follow-ups, and suggest where automation could help.
- Our suggestions are our professional opinion based on what you share with us. They aren't a guarantee of results.
- We may decline or reschedule an audit, for example when we can't reach you or the request isn't a business enquiry.

### 5 · `deepzeta-sync-and-demos` · Deepzeta Sync tools and demos

Deepzeta Sync is our set of free tools, such as the Website & AI Search Health Check and the Social Media Content Planner.
- **Only check websites you own or have permission to check.** Don't submit pages that need a login.
- **Results are a snapshot.** Speed, search and AI-readiness results reflect the moment of the check and can change the next day.
- **Fair use.** We limit how often the tools can be used, to keep them fast and fair for everyone.
- **Full reports.** Some parts of a report are shared after you ask for them and give us your contact details. That exchange is optional.
- **Demos** use sample data and are labelled "Demo · sample data" or "Example". Designer Studio concepts are fictional businesses, labelled as such.

We may change, pause or retire any tool or demo at any time.

### 6 · `ai-output` · AI-generated content

Some tools and demos use AI to write text or answer questions.
- AI output can be wrong, incomplete or out of date. Check it before you use or publish it.
- You're responsible for what you publish, and for making sure it's accurate and lawful.
- You keep the rights to what you type in, and you may use the output our tools create for you in your business. Similar output may be created for other people.
- Please don't enter personal, sensitive or confidential information into AI tools or demos.

### 7 · `quotes-projects-payments` · Quotes, projects and payments

- Paid work starts only when you accept a written proposal or sign an agreement with us. That document sets the scope, timeline, price, payment terms and ownership, and it wins over these terms where they differ.
- A quote is valid for the period it states.
- Prices are in UAE dirhams (AED). VAT is added where it applies.
- Website content about our services is a general description, not an offer. The proposal is the offer.

### 8 · `intellectual-property` · Intellectual property

- The website's content, code, design, graphics, the {brandName} name and logo, Designer Studio concepts and the Deepzeta Sync tools belong to {legalName} or its licensors.
- You may share links to our pages and quote short parts with a link back. You may not copy, reuse or resell the website or its parts without our written permission.
- Ownership of the work we build for clients is set in each project's signed agreement.

### 9 · `your-content` · Your content and feedback

When you send us information, files or a website address, you confirm you're allowed to share them. We use them only to answer you and deliver what you asked for (see our Privacy Policy). If you send us ideas or feedback about our services, we may use them to improve our work, without any obligation to you.

### 10 · `third-party-services` · Third-party services and links

Some features use other companies' services, such as WhatsApp, Cal.com, Google and our AI provider. Their own terms and privacy policies apply to how you use them. Links to other websites are for your convenience; we don't control those websites and aren't responsible for them.

### 11 · `no-guarantees` · No guarantees

We work hard to keep the website accurate and available, but we provide it, the free audit, the tools and the demos "as they are".
- We don't guarantee search rankings, visibility in AI search engines, traffic, leads or revenue. Search engines and AI engines make their own decisions.
- We don't guarantee that the website or the tools will always be available or free of errors.

### 12 · `liability` · Limitation of liability

- To the extent UAE law allows, we aren't liable for indirect or consequential losses, such as lost profit, lost data or lost business, that come from using the website, the free audit, the tools or the demos, or from decisions made based on their results.
- For paid work, liability is set in the project's signed agreement.
- Nothing in these terms excludes liability that UAE law doesn't allow to be excluded.

### 13 · `your-responsibility` · Your responsibility

If you misuse the website or break these terms, you're responsible for the harm that causes, including reasonable costs we face as a result.

### 14 · `privacy` · Privacy

Our [Privacy Policy](/privacy) explains how we collect, use and protect personal data, including through cookies.

### 15 · `changes` · Changes to these terms

We may update these terms when our services or the law change. The "Last updated" date at the top shows the current version, which applies from the day it's published. Using the website after a change means you accept the updated terms.

### 16 · `governing-law` · Governing law and disputes

These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai. If a dispute comes up, please contact us first; most things are solved in a conversation. If it can't be solved that way, the courts of Dubai have jurisdiction.

If any part of these terms can't be enforced, the rest still applies.

### 17 · `contact-us` · Contact us

Questions about these terms:
- Email: {email}
- WhatsApp: {whatsapp} (shown once set)
- Phone: {phone} (shown once set)
- Office: {address}
- Hours: {hours}

## 2.5 FAQ (the text must match the FAQPage schema word for word)

**Title:** Terms questions, answered

**Q1. Is the free AI audit really free?**
Yes. The audit costs nothing and carries no obligation to buy. We review how your business handles work such as leads, bookings and follow-ups, and suggest where automation could help. Paid work starts only if you accept a written proposal.

**Q2. Do you guarantee search rankings or results?**
No. Nobody can honestly guarantee rankings, AI-search visibility or revenue, because search engines and AI engines make their own decisions. We build websites and systems to best practice and measure the results with you.

**Q3. Who owns the website you build for me?**
Ownership is set in your project's signed agreement, before any work starts. These website terms don't change what that agreement says.

**Q4. Can I use the content your AI tools create?**
Yes. You keep the rights to what you type in, and you may use the output in your business. AI output can be wrong, so check it before you publish, and don't enter personal or confidential information.

**Q5. Which law applies to these terms?**
The laws of the United Arab Emirates as applied in the Emirate of Dubai. If a dispute can't be solved by talking to us first, the courts of Dubai have jurisdiction.

## 2.6 Contact block

- **Title:** Questions about these terms?
- **Body:** Ask us before you start. A real person replies.
- **Buttons:** "Email us" (`mailto:{email}`) · "WhatsApp us" (shown once `{whatsapp}` exists) · "Contact page" (`/contact`)

## 2.7 Related links

| Card | href | Line |
|---|---|---|
| Privacy policy | `/privacy` | How we collect, use and protect personal data. |
| Contact Deepzeta AI | `/contact` | Talk to a person about your project. |
| Book a free AI audit | the book-audit page (its slug is set in its page plan) | Find out where automation could save you time. |

---

# Part 3: Build notes (not page copy)

1. **Consistency with the privacy policy:** tools, providers and AI features named here match `privacy-policy.md`. A change to one updates the other in the same pull request.
2. **Labels:** the "Example", "Demo · sample data" and "Concept by Deepzeta AI · fictional business" labels promised in §5 are the ones in 10 §3.6.
3. **Fair use:** the limits promised in §5 are the Turnstile and rate-limit guards in 06 §4.
4. **Signed agreements:** client proposals and agreements should say that they take precedence over the website terms, matching §7.
