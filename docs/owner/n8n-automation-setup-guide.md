# Deepzeta AI · WhatsApp Agent Setup Guide (owner, step by step)

> **For:** the owner. Read it together with [`n8n-setup-guide.md`](n8n-setup-guide.md), the base guide (Google Workspace, Meta and WhatsApp, Cal.com, the n8n plan).
>
> **What this guide does:** it switches on the WhatsApp AI stack that is **already built** in your n8n and Supabase, with **Deepzeta AI as client #1**. Decision [0027](../decisions/0027-automation-pipeline.md); plan [`2026-10-07-automation-pipeline.md`](../plans/2026-10-07-automation-pipeline.md).
>
> **Rules:**
> - Do the parts in order.
> - If anything fails, stop and copy the exact error message to Claude.
> - **Never paste a key, token or password into the chat.** Secrets go only into your password manager, n8n Credentials and the Supabase SQL editor (Part C).

## What you're switching on (one look)

```mermaid
flowchart LR
    V[Visitor writes on WhatsApp] --> M[Meta]
    M --> G[Supabase gateway<br/>checks Meta's signature]
    G --> I[n8n · DZ · Inbound WhatsApp]
    I --> S{Safe?}
    S -->|abuse| R[Polite fixed reply]
    S -->|ok| A[DeepSeek agent<br/>+ Deepzeta knowledge]
    A --> B[DZ · Booking Tools]
    B --> C[(Google Calendar)]
    W[Website · Cal.com page] --> C
    A --> O[Reply in the visitor's language]
    B --> T[Team alert: email + WhatsApp]
```

**What's already built (you don't build these):**

| In n8n | In plain words |
|---|---|
| `DZ · Inbound WhatsApp` | Reads each message, waits a moment so 3 quick messages get one answer, turns voice notes into text in the language spoken, checks safety, lets the AI answer in the customer's language, and saves what it learned about the visitor |
| `DZ · Booking Tools` | Checks your calendar, offers free times, and books only the slot the visitor confirms. It can't double-book |
| `DZ · Send WhatsApp` | Sends every WhatsApp message and logs it |
| `DZ · Team Alert` | Emails and WhatsApps your team about bookings, hand-offs and urgent cases |
| `DZ · Scheduled Jobs` | Reminders about 24 hours before a booking, and visitor memory summaries |
| `DZ · Error Alerts` | Emails hello@deepzeta.ai if anything fails |
| `DZ · Knowledge Upload (form)` | A password-protected form to load what the agent knows |

In Supabase (project `deepzeta-automation`) live the database, the gateway that receives Meta's messages, and a safe (the Vault) for the WhatsApp token.

**Who does what:**

| You | Claude (through the n8n and Supabase connectors) |
|---|---|
| Create accounts and keys, and type every secret | Writes the agent's rules, its knowledge and Deepzeta's client settings |
| Share the calendar, and approve the WhatsApp templates | Changes the workflows (meeting type, Gmail, the Cal.com flow) |
| Publish the workflows, and run the test from your phone | Checks every run and every database row after your tests |

## Before you start (from the base guide)

- [ ] **Part 1** · Google Workspace: `hello@deepzeta.ai` works. **Not needed to start:** until Workspace is active, the calendar and the email steps use `deepzeta.office@gmail.com` (the owner, 2026-10-11). Moving to `hello@deepzeta.ai` later means sharing its calendar with the service account and changing the Calendar ID.
- [ ] **Part 2** · Meta Business + the WhatsApp app, and **Part 7** · the number registered (the short version for +971 54 547 6335 is Part 0 below). **Stop before any webhook step:** in this guide the webhook goes to the gateway (Part D below), never to n8n.
- [ ] **Part 3** · Cal.com account and the `free-ai-audit` event type.
- [ ] **Part 4** · the n8n Cloud plan.
- [ ] **Part 5** · credentials C1 (Google Sheets), C2 (Gmail), C3 (website secret) and C6 (Cal.com).
- [ ] **Skip** base guide **Part 6** (`DZ · Error Handler`): it is replaced by the existing `DZ · Error Alerts`.
- [ ] **Skip** base guide **Part 10** (`DZ · WhatsApp Inbound`): Meta allows one webhook per app, and it belongs to the gateway.

## Part 0 · Your number on WhatsApp: +971 54 547 6335

Start here, because Meta's checks can take days. The detailed clicks are in base guide **Part 2** (Meta Business and the app) and **Part 7** (registering the number). This is the short version for this number.

> ⚠️ **Decide this before step 1. It's hard to undo.** On 2026-09-30 you wanted to reply to customers from the **WhatsApp Business app on this same number** ("coexistence"). The steps below register the number on Meta's Cloud API only, as chosen on 2026-10-07: the app can't be used on it, and your team replies from personal WhatsApp.
> - **If you still want the app:** don't do step 3 yet. Tell Claude first. The coexistence route is different: WhatsApp Business app first, used normally for a while, then connected through a Meta partner, or with Deepzeta becoming a Meta Tech Provider. That would also let you offer the same setup to clients.
> - **If Cloud API only is fine:** continue.

**What changes for this number:**
- ✅ Phone calls and SMS keep working as normal. It stays your main contact number.
- ⚠️ **It can't be opened in the WhatsApp or WhatsApp Business app on a phone.** Every WhatsApp message goes to the agent. Meta allows the app and the automation on one number ("coexistence") only through its official partners.
- So when the agent hands a chat to your team, you reply from a **personal WhatsApp** through the link in the alert. The agent has already told the customer that a team member will contact them from their own number.
- ⚠️ The number must **not** be on WhatsApp when you add it. If anyone installs WhatsApp on that SIM first, it won't register.

**Where you are (2026-10-11, from your screenshots):**
- ✅ Business portfolio **Deepzeta Ai** (ID 1770981930839063), with Facebook, Instagram, Threads and WhatsApp connected. The portfolio's name is internal; customers see the WhatsApp display name.
- ✅ WhatsApp Business Account **Deepzeta Digital Solutions** (ID 1432051959064319). "Review in progress" is normal for a new account.
  - WhatsApp Manager's account switcher lists only the accounts you're assigned to. If it shows only Meta's **Test WhatsApp Business Account** (ID 2299220527520305, created with the app; leave it), open this account directly: `business.facebook.com/latest/whatsapp_manager/phone_numbers?business_id=1770981930839063&asset_id=1432051959064319`.
  - Or assign yourself to it: Settings → WhatsApp accounts → this account → **People** → **Assign people** → full control.
- ✅ App **Deepzeta Connect** (App ID 1573718627333039), WhatsApp use case only.
- ✅ **+971 54 547 6335** added, code-verified and **registered for the Cloud API** (2026-10-11, `success: true`). **Phone number ID 1460584370460068.** Its display name is **Deepzeta Digital Solutions**; it can be changed to "Deepzeta AI" later (⚙ → Profile, reviewed by Meta).
- ✅ **Payment method** on Deepzeta Digital Solutions: a Mastercard, billed in AED (2026-10-11).
- ✅ **System user** `deepzeta-automation` and its **permanent token**, saved in your password manager (2026-10-11).
- ⏳ Business verification started (documents step). It isn't needed to go on.

**Part 0 is done.** Next: Part A (the keys).

There's nothing called a "Cloud API" to create on its own. You get it by making one Meta app with the WhatsApp use case and registering your number to it (steps 1–5). You don't use the WhatsApp Business app on a phone at all.

**Steps (checked against Meta's documentation on 2026-10-10):**
1. **Business verification** (business.facebook.com → **Settings** → **Business info** → **Business verification**). It isn't needed to start: an unverified portfolio can still register 2 numbers. It lifts the limits later.
   - Upload the **trade licence**. The legal name and the address you type must match the document exactly. Watch for repeated text (for example "Office 202" twice).
   - If your full licence isn't issued yet, leave this step for later and continue.
2. **Create the app** (developers.facebook.com → **My Apps** → **Create App**). ✅ Done 2026-10-11: **Deepzeta Connect** (App ID 1573718627333039), WhatsApp use case only. An earlier app, "Business", has four use cases; leave it unused.
   - **Use cases:** **only** "Connect with customers through WhatsApp". Meta warns that some use cases can't share an app, and going Live means meeting every use case's requirements.
   - **Business:** **Deepzeta Ai**.
3. **Open the WhatsApp setup** (Meta's layout as of 2026-10-11):
   - App **Dashboard** → **Customize the Connect with customers through WhatsApp use case** → **Overview**.
   - Keep **Integrate with API** selected. "Become a Partner" is for managing other businesses' WhatsApp, which you don't need now.
   - **Step 1. Try it out** is optional: a test message from Meta's free test number to your own phone.
   - **Step 2. Production setup** is where the number, the payment method, the message templates and the system user are set up. Choose the **existing** WhatsApp account **Deepzeta Digital Solutions**; don't create a new one.
   - ⚠️ If Step 2 asks for a **webhook** or callback URL, **skip it**. It is set in Part D, and only to the gateway.
   - **Step 3. Business verification** is the same as step 1 above.
4. **Check the number is free:** +971 54 547 6335 must not be on WhatsApp or WhatsApp Business on any phone. Meta: "Numbers already in use with WhatsApp cannot be registered unless they are deleted first." ✅ Confirmed 2026-10-11: it has never been on WhatsApp. Keep the SIM in reach for the code.
5. **Add the number** (in **Step 2. Production setup**, or WhatsApp Manager → **Phone numbers** → **Add phone number**):
   - display name **Deepzeta AI**, and your business category (Meta reviews the display name; "Pending review" is normal)
   - number **+971 54 547 6335**, with the code by **SMS** or **voice call**, typed in
6. **Register it for the Cloud API.** Meta: adding a number in WhatsApp Manager does **not** register it. Registration is one call with a **6-digit PIN** you choose, made in Meta's **Graph API Explorer** in your browser. Tell Claude when you reach this step: you'll get the exact clicks then. Keep the PIN in your password manager, and never paste the PIN or a token into the chat.
7. **Payment method:** Settings → WhatsApp accounts → Deepzeta Digital Solutions → **Summary** → **Payment settings** → **Add payment method**. Meta charges for some message types. The currency usually can't be changed later.
8. **System user and permanent token** (business.facebook.com → **Settings** → **Users** → **System users** → **Add**):
   - **Name and role:** name `deepzeta-automation`, role **Employee**. Employee is safer than Admin: the token can only touch the two assets below. Switch to Admin only if Meta refuses to generate the token.
   - **Assign assets:** the app **Deepzeta Connect** (full control) and the WhatsApp account **Deepzeta Digital Solutions** (full control). Not the Test account.
   - **Generate token:** app Deepzeta Connect, expiration **Never**, permissions `whatsapp_business_messaging` and `whatsapp_business_management` only.
   - Meta shows the token once: copy it straight into your password manager as "WhatsApp permanent token (Deepzeta Connect)".
9. Send Claude the **Phone number ID**. It isn't a secret. The WhatsApp Business Account ID is already known: 1432051959064319. It shows in **Step 2. Production setup** once the number is added. If it doesn't:
   - Open **Tools** → **Graph API Explorer**, choose **Deepzeta Connect**, add the permission `whatsapp_business_management`, and click **Generate Access Token**.
   - Run **GET** `1432051959064319/phone_numbers`. Your number's `"id"` is the Phone number ID.
   - Meta allows 10 registration attempts per 72 hours (step 6), so register only once Claude has given you the exact clicks.

> **Later, at Part D:** to receive real messages the app must be switched to **Live**, and Meta may ask for a privacy policy web address. The site's `/privacy` page ships with the company & legal pages, which Claude builds before you reach Part D.

## Part A · Collect the keys (into your password manager only)

**A1 · DeepSeek API key** (writes every answer and the memory summaries; [decision 0030](../decisions/0030-ai-providers.md)) ✅ Done 2026-10-11
1. Go to `platform.deepseek.com`, sign in, and open **API keys** → **Create new API key**.
2. Name it `deepzeta-n8n`, then copy it into your password manager.
3. Check whether there is a spend limit or prepaid balance option, and keep the balance small.

**A2 · OpenAI API key** (listens and checks: voice notes in any language, the safety check, knowledge search; never writes an answer; decision 0030) ✅ Done 2026-10-11
1. Go to `platform.openai.com`, sign in, and open **API keys** → **Create new secret key**.
2. Name it `deepzeta-n8n`, with permissions **All**, then copy it into your password manager.
3. In **Settings** → **Limits** (or **Billing**), set a **monthly budget** you're comfortable with, and add a payment method if it asks.

**A3 · Supabase secret key** ✅ Done 2026-10-11
1. Go to `supabase.com`, then the project **deepzeta-automation** → **Project Settings** (gear) → **API Keys**.
2. Find the **secret** key (labelled `service_role` or "secret"), reveal it, and copy it into your password manager.
3. ⚠️ This key opens the whole database. It goes **only** into n8n (Part B).

**A4 · A Google "service account"** (a robot account that lets the agent read and write your calendar). Everything as **deepzeta.office@gmail.com** until Workspace is active. ✅ Done 2026-10-11: `deepzeta-calendar@spry-kingdom-511305-m8.iam.gserviceaccount.com` (project deepzeta-automation, ID spry-kingdom-511305-m8), calendar shared.

*A4.1 · The project*
1. Open `console.cloud.google.com` in Chrome. The round picture at the top right must be deepzeta.office@gmail.com; if not, click it and switch account.
2. First visit only: a welcome box asks for your **Country** (choose **United Arab Emirates**) and the **Terms of Service**. Tick, then **Agree and continue**. If Google offers a free trial that asks for a card, close it: no billing is needed.
3. Top left, next to "Google Cloud", click the **project picker** ("Select a project"). In the window, click **New project**.
4. **Project name** `deepzeta-automation`, **Location** "No organization". Click **Create**.
5. After about 10 seconds, open the project picker again and click **deepzeta-automation**. ✅ The top bar shows deepzeta-automation.

*A4.2 · The Calendar API*
6. Type `Google Calendar API` in the top search bar and open it.
7. Click **Enable**. ✅ The API's page opens and shows it's enabled.

*A4.3 · The robot account*
8. Type `Service accounts` in the top search bar and open **Service accounts** (IAM & Admin).
9. Click **+ Create service account**.
10. **Service account name** `deepzeta-calendar` (the ID fills in by itself). Click **Create and continue**.
11. **Permissions (optional):** choose nothing, click **Continue**. **Principals with access (optional):** leave empty, click **Done**. ✅ The list shows deepzeta-calendar with an email ending in `.iam.gserviceaccount.com`.

*A4.4 · Its key (a secret)*
12. Click the deepzeta-calendar **email** in the list, then the **Keys** tab.
13. Click **Add key** → **Create new key** → **JSON** → **Create**. A `.json` file downloads; click **Close**. If Google says key creation is disabled, stop and tell Claude.
14. Save the file in your password manager as "Google service account key (deepzeta-calendar)": attach it, or open it with Notepad (right-click → **Open with** → **Notepad**, then Ctrl+A, Ctrl+C) and paste the whole text into a secure note. Google never shows this key again. **Never send it to Claude or by email.** Delete it from Downloads (and the Recycle Bin) after Part B.

*A4.5 · The robot's email (not a secret)*
15. Copy the deepzeta-calendar email from the Service accounts list and send it to Claude.

*A4.6 · Share your calendar with the robot* (the same step as Part E1)
16. Open `calendar.google.com`, then the **gear** (top right) → **Settings**.
17. In the left column, under **Settings for my calendars**, click your main calendar.
18. Find **Share with specific people or groups** → **+ Add people and groups**. Paste the robot's email, set **Make changes to events**, then click **Send** (if Google warns about sharing, send anyway). Don't tick "Make available to public". ✅ The robot's email is listed with "Make changes to events".
19. The Calendar ID is already set (`deepzeta.office@gmail.com`). Tell Claude **"A4 done"** with the robot's email.

**A5 · Meta values** (Part 0 step 8, and the app's **App settings → Basic**) ✅ Done 2026-10-11
- **Secret:** the **permanent access token** (the System User token), and the **App Secret** (App Dashboard → **App settings** → **Basic** → **App secret** → **Show**).
- **Not secret, so send them to Claude:** the **Phone number ID** and the **WhatsApp Business Account ID**.

**A6 · Two random secrets you make yourself** ✅ Done 2026-10-11
- Use your password manager's generator: 48 characters, letters and digits only.
- Save them as **"Gateway forward secret"** and **"Meta verify token"**.

## Part B · Credentials in n8n

✅ Done 2026-10-11: all seven saved (with n8n's default names, which is fine: each type appears once). Claude linked them to every workflow (51 nodes), moved the email steps to Gmail and checked that nothing is missing.

**How to add a credential:**
1. In n8n, open the left sidebar → **Overview** → the **Credentials** tab.
2. Top right, click **Create** ▾ → **Credential** (or the arrow next to **Create workflow** → **Create credential**).
3. Search the type, choose it, and click **Continue**.
4. Optional: rename it (click its default name at the top left, e.g. "Supabase account"). Claude finds credentials by type, so the default names work.
5. Fill in the fields and click **Save**. ✅ It saves with no red error; most types also say "Connection tested successfully".

**Credential 4, the private key:** open the A4 JSON file with Notepad, press Ctrl+F and search `BEGIN PRIVATE KEY`. Select from the first `-----BEGIN PRIVATE KEY-----` to the end of `-----END PRIVATE KEY-----` (the dashes included), copy and paste. The `\n` marks inside are fine. After it saves, delete the JSON file from Downloads and the Recycle Bin (your password manager keeps the copy).

| # | Name (type it exactly) | Type to search | What goes in |
|---|---|---|---|
| 1 | `Supabase · deepzeta-automation` | **Supabase API** | **Host** `https://pqeyzigrltisuusbvxsl.supabase.co` · **Service Role Secret** = A3 |
| 2 | `DeepSeek · deepzeta` | **DeepSeek** | **API Key** = A1 |
| 3 | `OpenAI · deepzeta` | **OpenAI** | **API Key** = A2 |
| 4 | `Google Calendar · service account` | **Google Service Account API** | **Service Account Email** `deepzeta-calendar@spry-kingdom-511305-m8.iam.gserviceaccount.com` (A4.5) · **Impersonate a User** off · **Private Key** = the `private_key` value from the JSON file (the long text, including the `BEGIN` and `END` lines) · turn on **Set up for use in HTTP Request node** · **Scopes** `https://www.googleapis.com/auth/calendar` |
| 5 | `Gateway → n8n secret` | **Header Auth** | **Name** `x-deepzeta-secret` · **Value** = A6 "Gateway forward secret" |
| 6 | `Knowledge form login` | **Basic Auth** | A username and a strong password you choose. It protects the knowledge upload form |

**Email:** until Workspace is active, add a 7th credential: type **Gmail OAuth2 API**, name `Gmail · deepzeta.office`, click **Sign in with Google** and choose deepzeta.office@gmail.com. Claude switches the stack's email steps to it. Later it becomes `Gmail · hello@deepzeta.ai` (base guide C2).

When all seven are saved, tell Claude **"credentials done"**. Claude links them to the workflows: it sees only the names, never the secrets. If a node still shows a red warning, open it and pick the credential from its dropdown.

## Part C · Two secrets into Supabase (the SQL editor)

The settings and the Deepzeta client row are in (plan step S3, 2026-10-11). Deepzeta's Client ID is **`DZ-0000`** (the stack's agency row, created when the stack was built).

1. Go to `supabase.com`, open the project **deepzeta-automation**, then **SQL Editor** in the left sidebar → **+ New query**.
2. Paste a block, replace each `PASTE_…` with the value from your password manager (keep the single quotes around it), then click **Run** (or Ctrl+Enter).
3. Afterwards, clear the editor (Ctrl+A, Delete). If the query stays in the left list (e.g. "Untitled query"), open its **⋯** menu → **Delete**.

**C1 · The gateway's secrets**
```sql
update public.settings
set value = value
  || jsonb_build_object('forward_secret', 'PASTE_GATEWAY_FORWARD_SECRET')
  || jsonb_build_object('verify_token', 'PASTE_META_VERIFY_TOKEN')
where key = 'meta'
returning key;
```
✅ One row: `meta`. The forward secret must be **identical** to credential 5 in Part B.

**C2 · Deepzeta's WhatsApp token and app secret** (they go into the Vault, encrypted)
```sql
select public.set_client_secrets('DZ-0000', 'PASTE_WHATSAPP_PERMANENT_TOKEN', 'PASTE_META_APP_SECRET');
```
✅ It returns `saved`.

**Then tell Claude "Part C done".** Claude checks it without seeing anything secret: only the values' lengths (yours are 48 characters; the stack's old verify token was 36) and that the Vault entries exist.

## Part D · Point Meta's webhook at the gateway

✅ Done 2026-10-12: the app is Published (Live), the callback verified (the gateway answered Meta's check with 200), `messages` subscribed on v26.0. Other subscribed fields are harmless: the gateway processes `messages` only. In the current dashboard the webhook sits in **Use cases → Customize → Basic setup → Step 2. Production setup**, and going Live is **Publish** in the left menu (button in the lower right).

1. Go to `developers.facebook.com` → **My Apps** → your app → **WhatsApp** → **Configuration**.
2. Under **Webhook**, click **Edit**:
   - **Callback URL:** `https://pqeyzigrltisuusbvxsl.supabase.co/functions/v1/whatsapp-gateway`
   - **Verify token:** your A6 "Meta verify token" (the same one as in C1)
3. Click **Verify and save**. ✅ It saves. If it fails, C1 isn't done or the token differs.
4. Under **Webhook fields**, click **Manage**, find `messages`, and click **Subscribe**.
5. The app must be **Live** (base guide 2.8). Meta doesn't deliver messages to apps in Development mode.

> ⚠️ Never add a **WhatsApp Trigger** node in n8n for this app: it would take the webhook away from the gateway.

## Part E · Google Calendar and Cal.com on one diary

**E1 · Share your calendar with the agent** (already done if you followed A4.6)
1. In Google Calendar (deepzeta.office@gmail.com until Workspace is active), click **Settings** (gear).
2. Under **Settings for my calendars**, click your main calendar. Your real meetings will then block slots too.
3. Open **Share with specific people or groups** → **Add people and groups**, and paste the service account email (A4.5).
4. Set the permission to **Make changes to events**, then click **Send**.

**E2 · The Calendar ID**
- On the same page, open **Integrate calendar** and find **Calendar ID**. For a main calendar it's the account's address: `deepzeta.office@gmail.com` for now.
- **Already set by Claude** (plan S3, 2026-10-11). Tell Claude only if you share a different calendar.

**E3 · Cal.com uses the same calendar**
1. In Cal.com, open **Settings** → **Calendars** and connect Google (the same account as E1).
2. Turn on **Check for conflicts** for that calendar, and choose it under **Add events to**.
3. Open the event type `free-ai-audit` and set:
   - **Duration:** 30 minutes
   - **Limits** → **After event buffer:** 30 minutes
   - **Availability:** Monday to Saturday, 10:00–17:00, timezone Asia/Dubai
   - **Locations:**
     - **Google Meet**
     - **In person**, with the office address
     - **Phone call (attendee's number)**: you call them at the booked time
4. Under **Booking questions**, add the two questions Claude gives you: a **WhatsApp number** (optional), and a tick box **"Send my booking confirmation on WhatsApp"**. The `DZ · Cal.com Bookings` workflow reads them.

## Part F · WhatsApp templates to approve

Open **WhatsApp Manager** → **Message templates** → **Create template** (as in base guide 2.7). Each template must reach **Approved**. The live workflows use these two (checked 2026-10-12), with the language codes `en` and `ar`: pick **English** and **Arabic**, never "English (US)" or "English (UK)".

| Name (exact) | Category | Language | Body (final) | Used for |
|---|---|---|---|---|
| `team_alert` | Utility | English | New alert from your Deepzeta AI assistant for {{1}}: {{2}}. Please check your email for the full details. | WhatsApp alerts to the team number (bookings, hand-offs, expert follow-ups, urgent cases), once you've given that number |
| `dz_booking_reminder` | Utility | English | Hi {{1}}, this is a reminder of your {{2}} on {{3}} with {{4}}. If you need to change it, just reply to this message. | The reminder about 24 hours before a WhatsApp booking |
| `dz_booking_reminder` | Utility | Arabic | مرحباً {{1}}، هذا تذكير بموعدك ({{2}}) يوم {{3}} مع {{4}}. إذا احتجت إلى تغيير الموعد، فقط رد على هذه الرسالة. | The same reminder, for customers who write in Arabic |

Sample values Meta asks for: `team_alert` {{1}} Deepzeta AI, {{2}} Customer needs the team: Ahmed asked to speak to a person · `dz_booking_reminder` {{1}} Ahmed, {{2}} Free AI Automation Audit, {{3}} Monday 13 Oct 2026 11:00, {{4}} Deepzeta AI (Arabic: {{1}} أحمد, and the rest the same).

- **Later, when their workflows exist:** `dz_booking_confirmed` (website bookings through Cal.com), `dz_lead_welcome`, the follow-up templates (follow-ups stay off at launch), and the billing templates `renewal_reminder` and `service_paused` (paying clients).
- **Not needed:** `dz_blocked_reply` (the visitor has just written, so a normal reply is allowed).
- If Meta re-categorises a template as Marketing, or rejects it, send Claude the reason.

## Part G · Load what the agent knows

Do this when Claude has generated `docs/facts/agent-knowledge.md` and **you've read and approved it**. Everything in it is what the agent will say.

1. Open `DZ · Knowledge Upload (form)` in n8n. It must be published (Part H).
2. Open its first node and copy the **Production URL**.
3. Open that URL and log in with `Knowledge form login`. Fill in the form:
   - **Client ID:** `DZ-0000`
   - **What to do:** **Replace ALL knowledge for this client**
   - **Files:** `agent-knowledge.md`
4. Click **Update knowledge**. ✅ An email "Knowledge updated: DZ-0000 Deepzeta AI" arrives at hello@.

Whenever services or facts change, Claude regenerates the file and you upload it again with **Replace ALL**.

## Part H · Switch on, in this order

For each workflow: open it, click **Publish** (top right), then open **⋯** → **Settings** → **Error workflow** = `DZ · Error Alerts` (Claude may have set it already).

0. `DZ · Error Alerts` **first**: n8n only accepts a published workflow as the error workflow. It runs only when another workflow fails. Tell Claude when it's published, and Claude sets it as the error workflow on the others.
1. `DZ · Send WhatsApp`
2. `DZ · Team Alert`
3. `DZ · Booking Tools`
4. `DZ · Knowledge Upload (form)`, then do Part G
5. `DZ · Scheduled Jobs`
6. `DZ · Cal.com Bookings`
7. `DZ · Inbound WhatsApp`: **last**. From this moment, real messages get answers.

**Leave off:** `DZ · Renew Client (form)` (billing: its email steps still use the old SMTP sender) and the Showcase flow.

## Part I · The end-to-end test (13 checks, from your personal phone)

The agent goes live for real customers only after **every check passes** and you've confirmed it works as you expect.

| # | Send | ✅ Expected |
|---|---|---|
| 1 | "What services do you offer?" | An English reply. Service names match the site, it introduces itself as the **Deepzeta AI Agent (an AI)**, and it ends with a next step |
| 2 | The same question in Arabic | The reply is in Arabic |
| 3 | Three quick messages: "hi" · "I run a clinic" · "can you help with WhatsApp?" | **One** combined reply |
| 4 | A voice note asking about the free audit (try one in Arabic and one in another language you speak) | A text reply that answers it, in the language you spoke. If it says it couldn't hear the note, tell Claude: the voice-note format needs a conversion step (decision 0030) |
| 5 | "What's the weather in Tokyo?" | One polite line back to Deepzeta's services |
| 6 | "How much does it cost?" | No invented price. It offers the free audit |
| 7 | "I want to book an audit" | It asks **phone call / Google Meet / office visit** first, then the day. It offers 2–3 times between 10:00 and 16:30, asks your name and email (email optional), and **asks you to confirm one exact slot and type**. It books only after your "yes" |
| 8 | (after 7) | The event is in Google Calendar as 30 minutes, with a free 30 minutes after it, and with the Meet link, the office address or your number. You got the confirmation in the chat **and by email**. deepzeta.office@gmail.com got the team email (the team WhatsApp alert starts once you've given the team number). If you booked about a day ahead, the reminder arrives 20–28 hours before |
| 9 | Book on the website's Cal.com page (WhatsApp number + tick box) | Cal.com's email, `dz_booking_confirmed` on WhatsApp and a team alert. Then ask the WhatsApp agent for that same time: **it isn't offered** |
| 10 | An abusive message (**from a second phone**: strikes can mute a number) | The fixed polite refusal, with no AI answer |
| 11 | Next day: "Hi again" | The reply shows it remembers you |
| 12 | "I want to speak to a person" | It says one of our experts will contact you shortly, by a call from +971 54 547 6335 or on WhatsApp from their own number. deepzeta.office@gmail.com gets a hand-off alert with a link that opens the chat on your phone |
| 13 | "STOP" | The opt-out message |

After each check, open n8n → **Executions**: the run is green. Send Claude the 13 results. Claude checks the runs and the database rows, and records them in the plan.

Before these 13 checks, Claude runs the **sales test set** (stage 3). It covers timelines, doubts and objections, the expert follow-up with its 🔥 Hot / Warm / Cold alert, prices and promised results held back, the blocked words, and other languages.

## Part J · Go-live checklist

- [ ] Every Part H workflow is published, with the Error workflow set on each.
- [ ] No node shows a red credential warning.
- [ ] Templates **Approved**: `team_alert` and `dz_booking_reminder` (English + Arabic). The others in Part F wait for their workflows.
- [ ] Spend limits are set: OpenAI monthly budget, and DeepSeek's balance kept small.
- [ ] Keys are only in your password manager, n8n and the Supabase Vault (Part C). The Google JSON file is deleted from Downloads.
- [ ] Privacy: the privacy policy names DeepSeek (China), OpenAI (US), Supabase (India) and n8n (EU), and you've done your legal check (decisions 0027 and 0030).
- [ ] All 13 checks in Part I passed, and you've confirmed the agent works as you expect. This is the go-live condition.
- [ ] The team WhatsApp number sent to Claude. Until then, team alerts are email only.
- [ ] Backups: n8n → each workflow → **⋯** → **Download**, then send the files to Claude. They are kept **out of the public repo** while it's public, because they contain the agent's internal rules.

## Weekly check

- n8n → **Executions** → filter **Failed**: none, or any failure sent to Claude.
- Supabase → **Table Editor** → `contacts`, sorted by `strikes`: check that no real customer was blocked by mistake.
- `contacts`, sorted by `expert_followup_at`: every expert follow-up was answered (`lead_priority` shows 🔥 hot, warm or cold).
- `safety_events`: what the safety steps did (a blocked word, a muted contact, a reply held back, the safety check unavailable). It holds no message text, and rows older than 90 days are deleted automatically. A reply held back often means a missing answer: send Claude the alert.
- `delivery_failures`: empty, or explained.
- `bookings` matches your Google Calendar.
- DeepSeek and OpenAI usage are within budget.
- Spot-read 3 conversations (`messages`): answers are correct and nothing sensitive is stored.

## Edit the blocked words

The agent refuses a message that contains a blocked word or phrase, in any language, and counts a strike: 3 strikes within 30 days mute the number for 24 hours, and the team gets an alert. The list is in Supabase → **Table Editor** → `settings` → the row `moderation` → `value` → `blocked_keywords`.

- Add whole words or short phrases, one per item, in any language. Capitals, Arabic hamza forms and short vowels don't matter.
- Don't add words that real customers use innocently: for example, "dog" alone would block a pet clinic.
- OpenAI's safety check still runs before the list, so most abuse is caught without it.

## Common problems

| Problem | Fix |
|---|---|
| No reply at all | Check, in order: the app is **Live** · Part D was verified · `DZ · Inbound WhatsApp` is published · the forward secret in Supabase (C1) **equals** credential 5 · tell Claude to check that the Deepzeta row is active |
| Meta's "Verify and save" fails | The verify token isn't set in Supabase (C1), or it's different |
| Every reply says "our team will reply shortly" | The AI step is failing: check the DeepSeek credential and balance, then tell Claude |
| "The calendar can't be reached" | The calendar isn't shared with the service account (E1), the Calendar ID is wrong (E2), or the Calendar API isn't enabled (A4.2). Or Google Workspace blocks sharing outside your domain: Admin console → **Apps** → **Google Workspace** → **Calendar** → **Sharing settings** |
| No Meet link on Meet bookings | A known limit of service accounts. Tell Claude, who switches to your fixed Meet room link |
| The team gets no WhatsApp alert | Expected until you send Claude the team number. After that: `team_alert` isn't Approved |
| No reminder | `dz_booking_reminder` isn't Approved, or the booking was made less than 20 hours ahead |
| Knowledge upload says "client not found" | The Client ID is wrong: ask Claude for the exact code |
| Wrong language, or a wrong answer | Send Claude the example. The rules or the knowledge get corrected and re-uploaded |
