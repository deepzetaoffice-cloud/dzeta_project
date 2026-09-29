# Consent wording (DRAFT)

> **Status:** Final wording approved by the owner, 2026-09-29 (no external legal review, the owner's decision).
> **Moves to:** `src/content/en/legal/consent.ts` in P3 (cookie banner and settings) and P6/P7 (form and tool notices). Strings are keyed by stable IDs so the Arabic partner can be written natively in P11 (11 §1.4).
> **Tokens:** `{brandName}` and `{email}` come from the site config (06 §3). "Privacy policy" always links to `/privacy`.

## Principles (why the wording reads this way)

1. **Nothing optional runs before a choice.** Analytics and marketing default to off (Consent Mode v2 defaults set before GTM, 09 §2).
2. **Equal choice.** "Accept all" and "Reject all" are the same size and weight. No pre-ticked boxes, no guilt copy ("No, I don't want a better experience"), and no walls that block the page.
3. **Plain words.** Say what happens and why, in one breath. Short sentences, "you" and "we", no legal jargon (10 §1).
4. **Always reversible.** "Cookie settings" sits in every footer, and the choice is remembered for 12 months.
5. **Separate from the offer.** Booking an audit never depends on accepting marketing, so marketing consent is always its own unticked box.

---

## 1. Cookie banner (first layer)

A calm `glass-live` panel at the bottom, placed per `docs/design/conversion-path.md` (the consent banner comes first in the 360 px stacking order). It never covers the H1 or the primary CTA at first paint.

| ID | Text |
|---|---|
| `banner.title` | Your data, your choice |
| `banner.body` | We use essential cookies to keep this site secure and working. With your permission, we'd also like to use analytics to learn which pages help you most, and marketing cookies to measure our ads. Nothing optional runs until you choose, and we never sell your data. |
| `banner.acceptAll` | Accept all |
| `banner.rejectAll` | Reject all |
| `banner.choose` | Choose settings |
| `banner.policyLink` | Read our privacy policy |

## 2. Settings panel (second layer)

| ID | Text |
|---|---|
| `settings.title` | Privacy settings |
| `settings.intro` | Choose what you're comfortable with. You can change this at any time from "Cookie settings" at the bottom of every page. |
| `settings.essential.name` | Essential |
| `settings.essential.state` | Always on |
| `settings.essential.body` | Keep the site secure, stop spam on our forms, and remember your choices here. The site can't work without them. |
| `settings.analytics.name` | Analytics |
| `settings.analytics.body` | Show us, in aggregate, which pages people visit and where they get stuck, so we can make the site faster and clearer. Uses Google Analytics. |
| `settings.marketing.name` | Marketing |
| `settings.marketing.body` | Measure whether our ads on Google, Meta and LinkedIn bring people here, and show our ads to people who've visited us. |
| `settings.toggleOn` | On |
| `settings.toggleOff` | Off |
| `settings.save` | Save my choices |
| `settings.acceptAll` | Accept all |
| `settings.rejectAll` | Reject all |
| `settings.saved` | Saved. You can change this at any time in Cookie settings. |
| `footer.cookieSettings` | Cookie settings |

The switches are real `<button role="switch" aria-checked>` controls with visible labels (a11y). "Essential" is shown as a locked state, not a disabled-looking switch.

## 3. Forms

### Book a free AI audit
| ID | Text | Type |
|---|---|---|
| `audit.notice` | We'll use these details only to prepare and schedule your free AI audit. Read our privacy policy. | Notice under the submit button (no checkbox: this is your request) |
| `audit.whatsappOptIn` | You can contact me about this request on WhatsApp. | Optional checkbox, unticked |
| `audit.marketingOptIn` | Send me occasional AI and growth ideas by email. Unsubscribe any time. | Optional checkbox, unticked |

### 60-second speed-to-lead test
| ID | Text | Type |
|---|---|---|
| `speedTest.consent` | Send the test reply to my WhatsApp. I agree to receive this message from {brandName}. | Required checkbox; the button stays disabled until it's ticked |
| `speedTest.notice` | We'll use your number only for this test and to follow up on it. | Notice |

### Deepzeta Sync tools: get the full report
| ID | Text | Type |
|---|---|---|
| `toolReport.consent` | Email my full report to this address. {brandName} may follow up about the results. | Required checkbox |
| `toolReport.marketingOptIn` | Send me occasional AI and growth ideas by email. Unsubscribe any time. | Optional checkbox, unticked |

### Automation builder: "Send this to our team"
| ID | Text | Type |
|---|---|---|
| `builder.consent` | Share my automation idea and contact details with the {brandName} team so they can reply. | Required checkbox |

## 4. Notices on AI features and tools

| ID | Text |
|---|---|
| `agentDemo.title` | Demo AI agent |
| `agentDemo.notice` | You're chatting with a demo AI agent. Messages are sent to our AI provider to generate replies, so please don't share personal or sensitive information. |
| `planner.notice` | Your answers are sent to our AI provider to write your plan. Leave out anything personal or confidential. |
| `healthCheck.notice` | We check the public page at this address with Google PageSpeed Insights and our own AI-readiness checks. We never log in or collect personal data from it. |

## 5. Mapping to Consent Mode v2 (for the P3 plan)

| Group | Consent Mode types | Default |
|---|---|---|
| Essential | `security_storage`, `functionality_storage` | granted |
| Analytics | `analytics_storage` | denied |
| Marketing | `ad_storage`, `ad_user_data`, `ad_personalization` | denied |

- **Where it applies:** the defaults apply to every region (UAE PDPL is consent-based for these uses), and are set in `dataLayer[0]` before GTM loads (09 §2.2).
- **Server-side conversions:** conversion events sent from n8n (Meta, LinkedIn, Google offline import) go only for leads whose saved choice includes marketing (`ad_user_data` granted). The lead payload therefore carries the visitor's consent state (`docs/owner/n8n-setup-guide.md` §8.1 gains a `consent` field in P3).
- **Stored choice:** a first-party record of the choice, with the wording version and a timestamp. It contains no personal data. When the groups or this wording change, the version number increases and the banner asks again.
- **Names not decided here:** the exact storage key, cookie name and the `trackEvent` names for consent changes are set in the P3 plan and registered in the taxonomy first (09 §2.4).
