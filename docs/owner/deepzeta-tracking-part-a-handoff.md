# Tracking Part A: results and owner decisions (for Claude Code)

> **From:** the owner, Jamsheed Khalid · **Date:** 2026-10-02 (Asia/Dubai)
> **What this is:** the results of the tracking guide's Part A (`docs/owner/p3-tracking-setup-guide.md`) and the owner's decisions, for P3 part C and the pre-launch register.
> **This message is the owner's explicit request for a tracking change** (docs/ai/09, protected files). Follow the plan-first workflow (decision 0003): read this, check it against the repo, write the plan, and ask before anything protected is changed.
> **Every value below is a public ID.** No secret, password or token is in this file, and none may be added to the repo.

---

## 1. IDs to enter

| What | Value | Where it goes | Status |
|---|---|---|---|
| GTM container ID | `GTM-5MR4S8R2` | `NEXT_PUBLIC_GTM_ID` (env: the owner enters it in Vercel → Production; it differs per environment) | Ready |
| GA4 Measurement ID | `G-RTLSJW7Q9W` | `accounts.ts` → `ga4MeasurementId` | Ready |
| Meta dataset (pixel) ID | `2290203821825563` | `accounts.ts` → `metaDatasetId` | Ready |
| Microsoft Advertising UET tag ID | `187278109` | **New:** `accounts.ts` → `microsoftUetTagId` (see §3) | Ready |
| LinkedIn Insight Tag Partner ID | — | `accounts.ts` → `linkedinPartnerId` stays `null` | **Postponed** until after launch (§4) |
| LinkedIn conversion IDs | — | `accounts.ts` → `linkedinConversionIds` stay `null` | **Postponed** with LinkedIn |
| Google Ads customer ID | — | `accounts.ts` → `googleAdsCustomerId` stays `null` | **Postponed** until after launch (§4) |

**Never use** Meta pixel `922302900669468` or ad account `1035461495944942`. They sit outside the business portfolio and are retired. If either ID ever appears anywhere, it's a mistake.

## 2. The owner's decisions (2026-10-02)

Record these where the project records owner answers (the guide's §1 answers, the P3 plan's open questions, the conflict register if a rule changes):

1. **Ad platforms (guide §1 item 3):**
   - Meta: **yes**.
   - Microsoft Ads: **yes**.
   - LinkedIn: **later**, after launch.
   - Google Ads: **later**, after launch.
2. **Consent (question 8): option (b)**, as already written in 09 §2.7 (C52) and built in `consent.ts`:
   - Outside the EEA, the UK and Switzerland, analytics and advertising are granted by default, with no banner.
   - Inside them, the banner shows and nothing runs before Accept.
   - The owner has decided this stands without a legal review and **must not be re-asked at each update**. No change to the rule or the code is needed.
3. **Conversions (question 9), changed from "as proposed":**

   | Event | Before | Now |
   |---|---|---|
   | `generate_lead` | key event, primary | **key event, primary** (unchanged) |
   | `contact_click` | key event, secondary | **key event, primary**: counts for ads bidding on every platform (Meta `Contact`, Microsoft, and Google Ads when it starts) |
   | `book_call_click` | key event, secondary | **Dropped by the owner.** The taxonomy is append-only, so keep the name reserved but make sure it is never fired, is not a key event, and is not in the GTM container, the GA4 tables or P7's booking flow. Apply this the way the project's rules require (conflict register entry if needed) |
   | Confirmed Cal.com booking (server, through n8n) | later | **later** (P6–P7), unchanged |

4. **Office IP (guide §1 item 7): "it changes".**
   - The office line is Etisalat, and a static IP isn't confirmed.
   - So: no Internal Traffic rule, and guide steps A3.11 and B7 are **Not needed**.
   - Revisit only if the owner later confirms a static IP.
5. **Google Ads method (Q6):** unchanged. GA4 key events will be imported into Google Ads, with no Ads tag in the container. Because of that, postponing Google Ads needs no code work. When it starts, both `generate_lead` and `contact_click` are imported as **primary**.

## 3. New vendor: Microsoft Advertising (UET)

The P3 plan says Microsoft Ads "can be added to the taxonomy's vendors when you say yes". The owner says yes. Add it the same way as Meta:

- **Account ID:** `accounts.ts` gets `microsoftUetTagId: '187278109'`. Add its format to `ACCOUNT_FORMATS` (digits) and a test.
- **Vendor:** a `microsoft` entry in `vendors.ts` with:
  - group **marketing**;
  - its CSP hosts and withdraw-cookie list, **taken from Microsoft's official documentation and recorded in `docs/facts/external-sources.md`**. Don't assume the hosts or cookie names;
  - in use only when its ID is set, like the others.
- **Taxonomy:** a mapping for Microsoft, like `meta` and `linkedin`. `generate_lead` and `contact_click` become UET conversion events, with event names identical to the taxonomy (the tracking-parity rule).
- **Consent:** UET must follow the same consent state as the other marketing tags (Microsoft's own consent mode for UET, per its official docs). It must never fire before Accept in Europe, and it must follow the default grant elsewhere.
- **GTM container:** the generator adds the UET base tag and its conversion events. Use the official tag template or method Microsoft documents for GTM.
- **Click IDs:** `msclkid` is already captured (09 §2.8), so nothing changes there.
- **Owner steps:** add Microsoft to the guide's Part B (B2 test script, B8 conversions: create UET conversion goals from the generated table, named exactly as the events).

Account details (for the docs, not the code): Microsoft Advertising account "Deepzeta Ai Digital Solutions" (J107006873). UET tag "deepzeta.ai" shows **Unverified** until the site sends to it, which is expected. No payment method is added yet; it's only needed before ads run.

## 4. Postponed: must not be forgotten

Add each as a row in `docs/owner/pre-launch-register.md` (or a post-launch section, if the register gets one). Never delete a row.

| Item | Why it waits | What happens when it's ready |
|---|---|---|
| **LinkedIn** Insight Tag and conversions | Campaign Manager asked for card details before showing the Insight Tag; ad account `559882377` exists ("personal" business, new advertiser) | Owner sends the Partner ID (Insight Tag → "I will use a tag manager"), then the conversion IDs; Claude Code fills `accounts.ts`, and the owner does one small GTM import. Don't use the GTM "Conversions API / Generate token" page: that's server-side and not part of this setup |
| **Google Ads** account and conversions | Sign-up can't finish without creating a first campaign | Owner creates the account with its first campaign, sends the customer ID, links GA4 → Ads, and imports `generate_lead` and `contact_click` as primary (Q6) |
| **Microsoft Ads** payment method | Ads can't run without it | Owner adds it before the first campaign |
| **Confirmed Cal.com booking** conversion | Server-side, through n8n | With the lead flow (P6–P7) |
| **Server-side events** (Meta Conversions API, later LinkedIn) | With the lead flow | Secrets live in n8n Credentials (decision 0004); the owner enters any website secret in Vercel only |

## 5. Owner-side fixes and tidy-ups (register rows)

| Item | Detail |
|---|---|
| GA4 stream URL | The stream "Deepzeta Ai Website" (ID `15862580930`) shows `https://www.deepzeta.ai`. It's a label only and doesn't affect collection, but it should read `https://deepzeta.ai` to match decision 0006. The owner edits it with the stream's pencil icon |
| Admin accounts | The second GTM admin is the owner's own personal Gmail (`jamsheedkhalid.v@gmail.com`), a backup login rather than a second person. Microsoft Ads is signed in with `deepzeta.office@gmail.com`. Once Google Workspace is active, add an `@deepzeta.ai` account as admin on GTM, GA4, Meta, Microsoft Ads and the Business Profile |
| Google Business Profile | Created with the business account. When its website link is set, use the tagged link Claude Code generates from the attribution rules (09 §2.8), never a hand-typed UTM |
| Tracking guide Part A row | Mark ☑ done 2026-10-02, with the notes in §6 below |

## 6. Account register (non-secret, for the docs)

| Platform | Details |
|---|---|
| Google Tag Manager | Account "Deepzeta Ai GTM" (6379445439), container "www.deepzeta.ai" (265485032), `GTM-5MR4S8R2`. Empty: 0 workspace changes, never published, no snippet pasted anywhere. Consent overview on; 2-step for certain operations on |
| GA4 | Account "DeepZeta Ai Digital solutions" (409881280), property "Deepzeta ai website" (556395976), web stream 15862580930, `G-RTLSJW7Q9W`. UAE (Dubai) time zone, AED, retention 14 months, Blended reporting identity, Google signals off, email redaction on, no data received yet |
| GA4 enhanced measurement | Page views on (the "browser history events" option unticked), scrolls on, file downloads on; outbound clicks, site search, form interactions and video engagement off |
| Meta | Business portfolio "Deepzeta Ai" (1770981930839063); ad account "Deepzeta Meta AdsAC" (1127796166261885), owned by the portfolio; dataset `2290203821825563`, connected to that ad account. No partner integration chosen; no code pasted anywhere |
| Microsoft Advertising | Account J107006873; UET tag "deepzeta.ai" `187278109` (unverified until the site sends) |
| LinkedIn | Ad account 559882377 (postponed) |
| Google Ads | Not created yet (postponed) |

## 7. Environment variables and fixed values (owner's rule)

The owner's rule: **every variable must be listed, and nothing may be lost.** The project's existing rule already matches: env holds secrets and values that differ per environment; fixed business facts live once in `src/lib/site-config.ts`; public account IDs live once in `src/lib/tracking/accounts.ts`.

Do this:
1. Keep `.env.example` listing **every** env variable, as now. Each new env variable added in any phase gets its entry there, in the same commit.
2. Add a short block at the end of `.env.example`: **"Not env variables: where the other settings live"**. It should list, by name, every field of `accounts.ts` (including the pending `null` ones and the new `microsoftUetTagId`) and every fact in `site-config.ts` (email, phone and WhatsApp still pending, address, hours, social links), each with the file it lives in. That way, one file indexes every setting in the project.
3. Use fixed values (email, phone, WhatsApp, addresses, links) **only through `siteConfig`**. Never retype them in components, content or scripts. If a check for retyped facts doesn't exist yet, propose one.
4. Add a test that fails if an env variable read in `src/` isn't listed in `.env.example`, unless one already does this.

## 8. What the owner expects back

- A plan for P3 part C covering §1–§7, for approval before protected files change.
- After building: the generated container file, the counts for guide B1, the updated Part B tables (now with `contact_click` primary, Microsoft added, LinkedIn and Google Ads marked postponed), and the updated pre-launch register.
