# deepzeta · Tracking setup guide (GTM, GA4, Meta, LinkedIn, Google Ads)

> **For:** the owner, who does every dashboard step by hand (rule 09 §2.10). Claude never logs in to these accounts.
> **When:** Part A now, before Phase 3 (P3) starts (A8, the reference export, at P3's step C1). Part B after P3 is built, before launch.
> **Checked against:** Google's, Meta's and LinkedIn's official help pages, read on 2026-10-01 (sources at the end). Menus move: if a label differs, look for the nearest match and tell Claude, who updates this guide.

---

## 0. The golden rule: one list of names, used everywhere

Tracking breaks silently. If the website sends `generate_lead` and GA4 expects `Generate_Lead`, nothing errors: the number just stays at zero, and nobody notices for weeks. So:

1. **There is one list of events**, in the website's code (rule 09 §3, finalised in P3). Every name (event, parameter, trigger, conversion) comes from it.
2. **Claude generates your GTM setup from that list** as a file you import. You don't build tags by hand, so you can't mistype a name.
3. **GA4's settings that can't be imported** (custom dimensions, key events) come as a table in Part B, generated from the same list. Copy each name exactly, letter for letter.
4. **Never invent or rename an event in a dashboard.** In particular, never use GA4's **Create event** or **Modify event**, and never add a tag in GTM that didn't come from Claude's file. Those changes live outside the code, so code and dashboard drift apart.
5. **A change is always made in the code first** (a plan, a new import file, an updated table), then in the dashboards, never the other way round.

What must match, and where it lives:

| Item | Website code | GTM | GA4 | Meta / LinkedIn / Google Ads |
|---|---|---|---|---|
| Event names (`generate_lead`…) | The list (source) | Custom Event triggers (imported) | Event names (arrive by themselves) | Mapped to their standard events (imported) |
| Parameter names (`cta_id`…) | The list (source) | Data Layer Variables (imported) | Custom dimensions (you create from the table) | — |
| Key events / conversions | The list marks them | — | Key events (you mark from the table) | Conversion actions (you create from the table) |
| Consent types | The site's consent code (source) | Each tag's consent settings (imported) | — | — |
| Account IDs (GTM-…, G-…, pixel, partner) | Site settings (Claude enters what you send) | Inside the imported tags | — | Where you copy them from |

---

## 1. What Claude needs from you before P3 starts

Reply in chat with this list filled in. Send **only public IDs**. Never a password, never a secret key or token (rule: secrets go only into Vercel's settings, by you).

| # | What | Where to find it | Public? | **Your answer (2026-10-02, handoff §1–§2)** |
|---|---|---|---|---|
| 1 | **GTM container ID** (starts `GTM-`) | Part A2, last step | Yes | `GTM-5MR4S8R2` — entered in Vercel → Production by you, at step C5 |
| 2 | **GA4 Measurement ID** (starts `G-`) | Part A3, step 6 | Yes | `G-RTLSJW7Q9W` — in the code (`accounts.ts`) |
| 3 | **Which ad platforms you'll use in the first months:** Google Ads, Meta (Facebook/Instagram), LinkedIn, Microsoft (Bing) Ads. Yes, no or later for each | Your marketing plan | — | **Meta: yes. Microsoft Ads: yes. LinkedIn: later, after launch. Google Ads: later, after launch.** |
| 4 | **Meta dataset (pixel) ID**, if Meta = yes | Part A6 | Yes | `2290203821825563` — in the code (`accounts.ts`) |
| 5 | **LinkedIn Insight Tag Partner ID**, if LinkedIn = yes | Part A7 | Yes | Postponed (stays `null` until you send it) |
| 6 | **Google Ads customer ID** (123-456-7890), if Google Ads = yes | Top right in Google Ads | Yes | Postponed (stays `null` until you send it) |
| 7 | **Your office's internet address (IP)**, if it never changes; otherwise say "it changes" | Search "what is my IP" from the office network | Yes | "It changes" (Etisalat, no static IP confirmed). See A3.11 |
| 8 | **The consent choice** (below): (a) or (b) | — | — | (b), already answered and built (below) |
| 9 | **What counts as a conversion** (below): confirm or change | — | — | Changed: see the table below |

**Question 8, the consent banner** (rule 09 §2.7, UAE PDPL):
- **(a) Recommended: one banner for every visitor; nothing that measures or advertises runs until they press Accept.** This is what the rules already say. The cost: GA4 sees only visitors who accept, so its numbers are lower than real traffic. Google fills some of the gap with modelling only once a site has about 1,000 events a day from visitors who declined and 1,000 daily visitors who accepted, so expect no modelling at first.
- **(b) Analytics on by default in the UAE, banner only for Europe.** More data, but it goes against rule 09 as written and needs a legal view of the UAE PDPL first. Google's own consent rules only require consent mode for visitors from the EEA, the UK and Switzerland.

> **Your answer (2026-10-02, final): a banner for Europe only.** Visitors from the EEA, the UK and Switzerland see the banner, and nothing that measures or advertises runs until they press Accept. Every other visitor (the UAE, the GCC and the rest of the world) gets analytics and ad tracking on by default, with no banner. (It replaces a first answer the same day: no banner for anyone.) It differs from rule 09 §2.7, so the P3 plan records it as an exception for your approval, and updates this guide's steps that mention the banner (B2 step 4).

**Question 9, conversions.** The site's one goal is booked audits. Proposed, then **changed by your answer (2026-10-02, handoff §2.3)**:

| Conversion | When it fires | Counts for ads bidding? |
|---|---|---|
| `generate_lead` | The audit form is sent successfully | **Yes, primary** (unchanged) |
| `contact_click` | WhatsApp, phone or email is clicked | **Yes, primary** (was secondary; in Meta you choose the optimisation event per ad set, so both `Lead` and `Contact` stay available) |
| `book_call_click` | ~~The booking calendar is opened~~ | **Dropped by you.** The name stays reserved in the taxonomy (append-only) but is marked `retired`: never fired, no key event, not in the container, the GA4 tables or the booking flow (C59) |
| A confirmed booking | Cal.com confirms a booked slot | Later: sent from the server through n8n, because the booking happens on Cal.com's side, which the site's tags can't see reliably |

> **Note (finding 5 of the P3 part C plan):** until the audit page (R002) ships, the header's "Book a free AI audit" is an email link, so every click on it is a `contact_click` and counts as a primary conversion. B8's tables say so beside the goal settings.

---

## Part A · Do now (about 45 minutes)

### A1. Before anything
- [ ] Use the **business Google account** (the Workspace account on deepzeta.ai), never a personal one.
- [ ] Turn on **2-Step Verification** on that Google account, and on Meta and LinkedIn.
- [ ] Keep every password in a password manager.

### A2. Google Tag Manager: the container (if not done yet; owner checklist 4.2)
1. Go to **tagmanager.google.com** → **Create Account**.
2. Account name `deepzeta`, country United Arab Emirates.
3. Container name `deepzeta.ai`, target platform **Web**. Click **Create** and accept the terms.
4. **Close the "Install Google Tag Manager" box without copying anything.** The website loads GTM itself; a pasted snippet would count every visit twice.
5. **Don't add any tag and don't publish.** Claude's file fills the container in Part B.
6. Turn on the consent overview: **Admin → Container Settings → Additional Settings → Enable consent overview** → Save.
7. Protect the account: **Admin → Account Settings →** tick **"Require 2-step login verification for certain operations"** → Save.
8. Add a second administrator you trust (Google advises two): **Admin → User Management → + → Add users**, give **Administrator** on the account and **Publish** on the container. Never give an outside agency full control.
9. Copy the **container ID** (`GTM-…`, shown at the top of the workspace) for Claude.

### A3. Google Analytics 4: the property (if not done yet; owner checklist 4.2)
1. **analytics.google.com → Admin → Create → Property.**
2. Property name `deepzeta.ai`. **Reporting time zone: United Arab Emirates (Dubai). Currency: UAE Dirham (AED).**
3. Business details and objectives: choose what fits (they only change which reports GA4 shows first).
4. Platform **Web**. Website URL `https://deepzeta.ai`, stream name `deepzeta.ai web`.
5. **Enhanced measurement:** leave it on for now, then fix its settings in step 7.
6. Click **Create stream**. Copy the **Measurement ID** (`G-…`) from **Stream details** for Claude.
7. **Enhanced measurement settings**, so GA4's automatic events don't double what the site sends: **Admin → Data collection and modification → Data streams →** your stream **→ Enhanced measurement** (the gear) → set:

   | Setting | Set to | Why |
   |---|---|---|
   | Page views | Stays on (it can't be turned off). Open its **advanced settings** and **untick "Page changes based on browser history events"** | The site reports each page itself; leaving this ticked counts page changes twice |
   | Scrolls | On | No event of ours does the same |
   | Outbound clicks | **Off** | The site sends `outbound_click`; this would send a second event (`click`) for the same click |
   | Site search | **Off** | The site has no search |
   | Form interactions | **Off** | The site sends `audit_start` and `generate_lead`; this would send `form_start` and `form_submit` for the same forms |
   | Video engagement | **Off** | No YouTube videos at launch (turn on if they're added, after asking Claude) |
   | File downloads | On | No event of ours does the same |

8. **Data retention:** **Admin → Data collection and modification → Data retention →** Event data retention **14 months** → Save. (It affects explorations, not the standard reports.)
9. **Google signals: leave it off for now** (**Admin → Data collection and modification → Data collection**). It's for ad remarketing; on a new, small site it hides small numbers in reports. Turn it on later with Claude, when ads start.
10. **Reporting identity:** **Admin → Data display → Reporting identity →** keep **Blended** (needed for consent modelling later).
11. **Your own visits.** **Your answer: "it changes" (2026-10-02), so the IP rule is Not needed** (the handoff marked it so; the office line is Etisalat, no static IP confirmed). Revisit only if you later confirm a static IP.
    - **What Part C kept, and why (plan Q2):** the IP rule itself is dropped, but the container still marks every host except `deepzeta.ai` and `www.deepzeta.ai` with `traffic_type = internal` (Vercel previews, CI's Lighthouse runs once CI has the GTM ID, local tests). GA4 drops those events only while the **Internal Traffic** filter is **Active** — which is B7's step.
12. **Don't create custom dimensions or key events yet**, and never use **Create event** or **Modify event**. Part B gives you the exact list.

### A4. Google Ads (if Google Ads = yes)
- [ ] Create the account (no campaign needed yet). Copy the **customer ID** for Claude.
- [ ] Don't link it to GA4 yet and don't create conversion actions yet: Part B does both, in one way only, so a lead is never counted twice.

### A5. Search Console (at launch, owner checklist 4.2)
Nothing now. At launch: a **Domain** property for `deepzeta.ai`, verified by DNS, then linked in GA4 (**Admin → Product links → Search Console links**).

### A6. Meta (if Meta = yes; owner checklist 4.3)
1. **Events Manager → Data sources →** your dataset (Meta now calls the pixel a "dataset"). If none exists: **Connect data → Web**, name it `deepzeta.ai`.
2. Copy the **dataset ID** (the number under the name) for Claude.
3. **Stop there.** Don't choose "Add events with a partner integration", and don't let Meta install anything into GTM: the tags come from Claude's file, so they match the site's names and its consent rules.

### A7. LinkedIn (if LinkedIn = yes; owner checklist 4.4)
1. **Campaign Manager → Measure → Signals manager → Sources → Insight Tag →** choose **"I will use a tag manager"**.
2. Copy the **Partner ID** for Claude. Don't create conversions yet.

### A8. The reference export (P3 step C1, about 20 minutes)

**Why:** Google doesn't publish the format of a GTM container file. So before Claude writes one for you, you build one small example by hand in a **throwaway container**, export it, and send it. Claude's generator copies its exact shape, and a test checks every file against it. It holds **test IDs only**, never your real ones.

**Names matter less than shapes here:** use the names below, so Claude can find each item in the file. If a label in GTM differs, pick the nearest one and tell Claude.

1. **The throwaway container.** In Tag Manager, go to the **Accounts** tab, click **⋮** next to your `deepzeta` account → **Create Container**. Name `dz-reference`, type **Web** → **Create**. Close the "Install Google Tag Manager" box. Make sure the container name at the top says `dz-reference` from now on, **never `deepzeta.ai`**.
2. **Five variables.** **Variables → User-Defined Variables → New → Variable Configuration**, then:

   | Variable name (top left) | Type | Fill in |
   |---|---|---|
   | `DLV - cta_id` | **Data Layer Variable** | The data layer variable's name: `cta_id` |
   | `DLV - consent_granted_now` | **Data Layer Variable** | The name: `consent_granted_now` |
   | `Const - test id` | **Constant** | Value: `TEST` |
   | `Lookup - traffic_type` | **Lookup Table** | Input variable: `{{Page Hostname}}`; one row: `deepzeta.ai` → `public`; tick the default value and enter `internal` |

   Save each one. (That's four; the fifth is GTM's own **Page Hostname**: under **Variables → Built-In Variables → Configure**, make sure it's ticked.)
3. **Three triggers.** **Triggers → New → Trigger Configuration**, then:

   | Trigger name | Type | Fill in |
   |---|---|---|
   | `CE - cta_click` | **Custom Event** | Event name `cta_click`; **This trigger fires on: All Custom Events** |
   | `CE - consent_update - analytics` | **Custom Event** | Event name `consent_update`; **Some Custom Events**: `DLV - consent_granted_now` · **contains** · `analytics` |
   | `WL - production` | **Window Loaded** | **Some Window Loaded Events**: `Page Hostname` · **equals** · `deepzeta.ai` |

4. **Five tags** (four if LinkedIn = no). **Tags → New → Tag Configuration**, then for **every** tag also open **Advanced Settings → Consent Settings** and set what the last column says:

   | Tag name | Type | Fill in | Triggering | Consent Settings |
   |---|---|---|---|---|
   | `Google tag` | **Google Tag** | Tag ID `G-TEST123456`. Under **Configuration settings**, add two parameters: `send_page_view` = `false`, and `traffic_type` = `{{Lookup - traffic_type}}` | **Initialization - All Pages**, and also `CE - consent_update - analytics` | **Require additional consent for tag to fire** → **+ Add required consent** → `analytics_storage` |
   | `Google tag - update` | **Google Tag** | Tag ID `G-TEST123456`. **Configuration settings**: `update` = `true`, and `page_title` = `{{Const - test id}}` | `CE - cta_click` | The same: `analytics_storage` |
   | `GA4 - cta_click` | **Google Analytics: GA4 Event** | Measurement ID `G-TEST123456`; Event Name `cta_click`; under **Event Parameters**, one row: `cta_id` → `{{DLV - cta_id}}`. In **Advanced Settings → Tag Sequencing**, tick the option to fire a tag **before** this one, and choose `Google tag - update` | `CE - cta_click` | The same: `analytics_storage` |
   | `HTML - test` | **Custom HTML** | In the HTML box: `<script>window.dzReference = true;</script>` | `WL - production` | **Require additional consent for tag to fire** → `ad_storage` |
   | `LinkedIn - test` (only if LinkedIn = yes) | **Discover more tag types in the Community Template Gallery** → search **LinkedIn InsightTag 2.0** → **Add to workspace** | Partner ID `1234567` | `WL - production` | The same: `ad_storage` |
   | `UET - test` (**added 2026-10-02**: Microsoft is a launch platform now) | **Discover more tag types in the Community Template Gallery** → search **Microsoft Advertising Universal Event Tracking** → **Add to workspace** | Tag ID `1234567` (a test value). Choose **UET config/page view (required)**, with **Enable automatic tracking for page view events** ticked. If the template shows **Inherit initial consent**, tick it (this site's tags fire only after consent); leave **Enable consent updates** on (its default) | `WL - production` | **Require additional consent for tag to fire** → `ad_storage` |
   | `UET - test event` (**added 2026-10-02**) | The same **Microsoft Advertising Universal Event Tracking** template | Tag ID `1234567`; Event Type **Custom**; Action `cta_click`; leave Category, Label and Value empty (the taxonomy name is the only identifier, by the tracking-parity rule). In **Advanced Settings → Tag Sequencing**, tick the option to fire a tag **before** this one, and choose `UET - test` | `CE - cta_click` | The same: `ad_storage` |

   Save each one. **Don't click Submit or Publish.** Nothing in this container ever goes live.
5. **Export it.** **Admin → Export Container → Choose a version or workspace →** choose **Default Workspace** → **Download**. The file's name starts with the throwaway container's `GTM-` ID.
6. **Send it:** leave the file in your **Downloads** folder and tell Claude its name. Claude checks it holds only the test values above, then commits it as the reference. **Keep the `dz-reference` container** for now: step B0 (Part B) uses a second throwaway container, and both are deleted after it.

---

## Part B · After P3 is built (Claude sends the file and the filled-in tables)

You'll receive: the container file (`deepzeta-gtm-container.json`), and in this guide's Part B tables, every custom dimension, key event and conversion with its exact name. Each step below says what you should see.

### B0. The round-trip test (about 10 minutes; done once, at P3 step C3, before B1)

**Why:** before the real import (B1), Claude's generator is proven against GTM itself. Claude sends you a **test-ID container** (`--test` build: `G-TEST123456` and placeholder digits, never your real IDs). You import it into a **second throwaway container**, export it back, and Claude checks that GTM's own export equals what the generator wrote — the round trip. Both throwaway containers (`dz-reference` from A8 and this one) are deleted after it passes.

1. **Create the second throwaway container.** Tag Manager → **Accounts** tab → **⋮** next to your `deepzeta` account → **Create Container**. Name `dz-roundtrip`, type **Web** → **Create**. Close the "Install Google Tag Manager" box. The container name at the top must say `dz-roundtrip`, never `deepzeta.ai`.
2. **Import the test file.** **Admin → Import Container → Choose container file** → the `deepzeta-gtm-container.json` Claude sends you (the `--test` one).
3. **Choose workspace: New**, name it `roundtrip`.
4. **Import option: Overwrite.** The container is empty, so nothing of yours is lost.
5. **Click "View detailed changes".** The numbers must equal what Claude's message says (23 tags, 19 triggers, 23 variables, 5 built-in variables). If they differ, stop and send Claude a screenshot.
6. **Confirm.** Don't publish — nothing in this container ever goes live.
7. **Export it back.** **Admin → Export Container → Choose a version or workspace →** choose **Default Workspace** → **Download**. The file's name starts with this container's `GTM-` ID.
8. **Send it:** leave the file in your **Downloads** folder and tell Claude its name. Claude checks it against the generator's output (the round-trip test), then commits it as the round-trip fixture.
9. **Delete both throwaway containers** when Claude confirms the test passed: **Accounts** tab → **⋮** on each of `dz-reference` and `dz-roundtrip` → **Delete Container** (GTM asks you to type the container ID to confirm). Your real `deepzeta.ai` container stays untouched; B1 imports into it next.

### B1. Import the container into GTM
1. **Admin → Import Container → Choose container file** → the JSON file from Claude.
2. **Choose workspace: New**, name it `P3 tracking v1`.
3. **Import option: Overwrite.** The container is empty, so nothing of yours is lost, and the result matches the file exactly. (Later imports use the option Claude names in that update.)
4. Click **View detailed changes**. The numbers of tags, triggers and variables must equal the numbers Claude gives you. If they differ, stop and send Claude a screenshot.
5. **Confirm.** Don't publish yet.

### B2. Test in Preview (Tag Assistant)
1. In the workspace, click **Preview**. Enter `https://deepzeta.ai` (or the preview link Claude gives you) → **Connect**.
2. On the site that opens, follow Claude's **test script** (for example: accept the banner, click "Book a free AI audit", open a form, send a test).
3. In Tag Assistant, each step must show the expected event and the tags that fired, **once each**. Note anything that fired twice or didn't fire.
4. Also check the **Consent** tab: before you accept, the consent types show *denied*; after, *granted*.
5. **Microsoft's UET Tag Helper (added 2026-10-02):** install the browser extension, then on the same test run: **before you accept the banner (in Europe), no UET request is sent at all**; after Accept, the tag helper's `asc` value reads *granted*. If it reads *denied* after Accept, stop and send Claude a screenshot.
6. **Keep Microsoft's Clarity integration off** (added 2026-10-02). It would need its own consent wording and CSP hosts; if Microsoft offers it during setup, decline.

### B3. Check GA4's DebugView
1. **GA4 → Admin → Data display → DebugView**, while Preview is still connected.
2. Each event from the test script appears with its parameters. (Nothing appears while the banner isn't accepted: that's correct.)

### B4. Create the custom dimensions (from Claude's table)
**Admin → Data display → Custom definitions → Create custom dimension.** For each row: **Dimension name** as given, **Scope: Event** (it can't be changed later), **Event parameter** copied exactly. Data appears after 24–48 hours and isn't backdated, so do this before launch.

### B5. Mark the key events (from Claude's table)
**Admin → Data display → Events** → the star beside each event in the table. An event appears in that list only after it has been received once (the B2 test sends them).

### B6. Publish
**Submit → Publish and Create Version.** Version name `P3 tracking v1`, description: what Claude's update says. **Publish.** If anything goes wrong later: **Versions → Actions → Set as Latest Version** on the previous version, then publish it.

### B7. Turn on your filter
After a day of normal use: **Admin → Data filters → Internal Traffic → Active.** (Active filters can't be undone for past data, which is why it waited.)

**Why this step stays (2026-10-02):** your office IP changes, so there's no IP rule (A3.11), but the container marks every host except `deepzeta.ai` and `www.deepzeta.ai` as `traffic_type = internal` — Vercel previews, CI's Lighthouse runs and local tests. GA4 drops those events only while this filter is Active. Your own visits still count (there's no static IP to filter them by), until you ask for the "mark this browser as mine" option (postponed, plan Q6).

### B8. Meta, Microsoft, LinkedIn and Google Ads conversions (only the platforms you said yes to; **your answers: Meta and Microsoft now, LinkedIn and Google Ads postponed**, 2026-10-02)
- **Meta:** **Events Manager →** your dataset **→ Test events → Open website**, run the test script, and check that `PageView`, `Lead` and `Contact` arrive. (The browser helper is now called **Meta Ads Data Advisor**.) You choose the optimisation event per ad set, so both stay available.
- **Microsoft Advertising:** **Tools → Conversion goals → Create conversion goal →** type **Event**, one per row of Claude's generated table, **named exactly as the events** (`generate_lead`, `contact_click`). Both count as conversions; Microsoft's goal setting that makes one "primary" is quoted in the table when it's read (step C4). Beside `contact_click`, note the same caveat as GA4's table: until the audit page ships, every header CTA click is a `contact_click`.
- **LinkedIn (postponed):** when it starts: **Measure → Conversion tracking → Create conversion → Insight Tag conversion → event-specific**, one per row of Claude's table. Send Claude each **conversion ID**; Claude adds them in a small second import.
- **Google Ads (postponed):** when it starts, follow the single method already decided (your Q6): GA4 key events imported into Ads — both `generate_lead` and `contact_click` as **primary** — and no Ads tag in the container, so nothing is counted twice.

### B9. Tell Claude
Send: "B1–B8 done", the version number GTM shows, and any screenshot of something unexpected. Claude records it in the pre-launch register.

---

## 2. Mistakes that cause mismatches (and how this setup avoids them)

1. **Two page views per page.** Avoided by the site sending page views itself, GTM's Google tag set not to send its own (`send_page_view` = false, in the file), and the "browser history events" box unticked (A3.7).
2. **GA4's automatic events doubling ours** (outbound clicks, form interactions). Avoided by A3.7.
3. **A name typed by hand in a dashboard.** Avoided by importing names, and by never using Create/Modify event.
4. **Names are case-sensitive and short.** Event names are at most 40 characters, only letters, digits and `_`. GA4 reserves some names (`click`, `scroll`, `form_start`…); the site's list never uses them.
5. **A parameter that isn't registered is invisible in reports.** B4 registers every one; they aren't backdated.
6. **Consent set twice.** The site sets the consent defaults before GTM starts. **Never add a consent/cookie-banner template in GTM**: it would set them a second time.
7. **A tag pasted by hand next to GTM** (a gtag snippet, Meta's or LinkedIn's own code). It counts everything twice. Everything goes through GTM.
8. **One conversion counted twice in Google Ads** (an imported GA4 key event and an Ads tag both primary). B8 uses one method only.
9. **Server and browser events not paired.** When the server sends events later (Meta Conversions API, LinkedIn), each event carries the same event ID from both sides so the platform keeps one. Claude's code does this; nothing to set by hand.
10. **The privacy policy lists other tools than the container uses.** The pre-launch register checks that they match.

---

## 3. Words used here

| Word | Meaning |
|---|---|
| **GTM (Google Tag Manager)** | One box on the website that loads every tracking tool. Changes to it are published from its dashboard |
| **Container / workspace / version** | The box for one website / a draft of changes / a published snapshot you can return to |
| **Tag** | One piece of tracking (for example "send `generate_lead` to GA4") |
| **Trigger** | When a tag fires (for example "when the site says `generate_lead` happened") |
| **Variable / data layer** | A value a tag reads / the list of messages the website hands to GTM |
| **GA4 property / data stream** | Your analytics account for the site / the connection from the website into it |
| **Measurement ID** | The `G-…` code that names the GA4 stream |
| **Key event** | An event GA4 counts as a success (the old name was "conversion") |
| **Custom dimension** | Lets a GA4 report show an event's detail, such as which button was clicked |
| **Consent Mode** | Google's way of telling its tags whether the visitor accepted cookies |
| **Tag Assistant / DebugView** | Testing tools: one shows tags firing on the site, the other shows events arriving in GA4 |
| **Dataset (pixel) / Insight Tag** | Meta's and LinkedIn's tracking tags |
| **Conversions API (CAPI)** | Sending an event from the server instead of the browser, so it isn't lost to blockers |

---

## Sources (official, read 2026-10-01)

- GTM: create an account and container: https://support.google.com/tagmanager/answer/6103696 · import and export: https://support.google.com/tagmanager/answer/6106997 · Custom Event trigger: https://support.google.com/tagmanager/answer/7679219 · user-defined variables: https://support.google.com/tagmanager/answer/7683362 · Custom HTML tag: https://support.google.com/tagmanager/answer/6107167 · GA4 Event tag: https://support.google.com/tagmanager/answer/13034206 (A8's pages read 2026-10-02) · Google tag: https://support.google.com/tagmanager/answer/9442095 · consent settings: https://support.google.com/tagmanager/answer/10718549 · preview: https://support.google.com/tagmanager/answer/6107056 · publish and versions: https://support.google.com/tagmanager/answer/6107163 · users: https://support.google.com/tagmanager/answer/6107011 · 2-step for certain operations: https://support.google.com/tagmanager/answer/4525539
- GA4: create a property and stream: https://support.google.com/analytics/answer/9304153 · enhanced measurement: https://support.google.com/analytics/answer/9216061 · page views and `send_page_view`: https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtm · single-page sites with GTM: https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications?implementation=gtm · data retention: https://support.google.com/analytics/answer/7667196 · Google signals: https://support.google.com/analytics/answer/9445345 · reporting identity: https://support.google.com/analytics/answer/10976610 · internal traffic: https://support.google.com/analytics/answer/10104470 · data filters: https://support.google.com/analytics/answer/13296662 · custom dimensions: https://support.google.com/analytics/answer/14239696 · limits: https://support.google.com/analytics/answer/10075209 · key events: https://support.google.com/analytics/answer/13128484 · create/modify events: https://support.google.com/analytics/answer/10085872 · collection limits: https://support.google.com/analytics/answer/9267744 · reserved names: https://support.google.com/analytics/answer/13316687 · DebugView: https://support.google.com/analytics/answer/7201382 · Search Console link: https://support.google.com/analytics/answer/10737381 · Google Ads link: https://support.google.com/analytics/answer/9379420
- Consent Mode: https://developers.google.com/tag-platform/security/concepts/consent-mode · setup: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced · basic vs advanced: https://support.google.com/google-ads/answer/10000067 · modelling thresholds: https://support.google.com/analytics/answer/11161109 · Google's EU user consent policy: https://www.google.com/about/company/user-consent-policy/ · UAE data protection laws (u.ae): https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws
- Meta: Pixel with GTM: https://www.facebook.com/business/help/1021909254506499 · standard events: https://www.facebook.com/business/help/402791146561655 · test events: https://www.facebook.com/business/help/2040882565969969 · deduplication: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events · consent: https://developers.facebook.com/docs/meta-pixel/implementation/gdpr
- LinkedIn: Insight Tag with GTM: https://www.linkedin.com/help/lms/answer/65628 · Partner ID: https://www.linkedin.com/help/lms/answer/a415868 · conversions: https://www.linkedin.com/help/lms/answer/a425606 · event-specific with GTM: https://www.linkedin.com/help/lms/answer/a417886 · deduplication: https://learn.microsoft.com/en-us/linkedin/marketing/conversions/deduplication
- Google Ads: conversion tracking in GTM: https://support.google.com/tagmanager/answer/6105160 · Conversion Linker: https://support.google.com/tagmanager/answer/7549390 · primary and secondary conversions: https://support.google.com/google-ads/answer/11461796 · GA4 conversions in Ads: https://support.google.com/google-ads/answer/10632359 · enhanced conversions: https://support.google.com/google-ads/answer/13258081 · offline import: https://support.google.com/google-ads/answer/7012522
