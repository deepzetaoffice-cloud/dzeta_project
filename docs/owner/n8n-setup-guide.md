# deepzeta · n8n Setup Guide (owner, click by click)

> **For:** the owner, starting from zero.
>
> **What this is:** step-by-step instructions to set up n8n Cloud and every automation the website needs.
>
> **Checked against:** the official documentation of n8n, Meta (WhatsApp, Conversions API), Google (Workspace, Ads), LinkedIn, Cal.com and Cloudflare, on **2026-09-29**. Sources are listed at the end.
>
> **Stack decision:** 0004. n8n is the automation backbone and Google Sheets is CRM v0.

---

## How to use this guide

- Do the parts **in order**. Each part ends with a ✅ **Checkpoint**. Don't move on until the checkpoint passes.
- **If a button label differs slightly** from what's written here, look for the closest match. These apps change their screens often. Labels marked *(may differ)* could not be confirmed in the official docs.
- **If anything fails**, stop. Copy the exact error message and send it to Claude. Don't guess or improvise: a wrong fix can lose leads silently.
- **Never paste a secret** (password, token, API key) into chat, a document, a screenshot or a workflow note. Secrets go in exactly two places:
  - your password manager
  - n8n's **Credentials** screen

### Words you'll meet

| Word | What it means |
|---|---|
| **Workflow** | One automation, drawn as boxes connected by lines. Example: "when a lead arrives, save it and email me". |
| **Node** | One box in a workflow. It does one job: receive data, save a row, send an email. |
| **Trigger** | The first node. It starts the workflow when something happens: a form is sent, a message arrives, a time is reached. |
| **Credential** | A saved, encrypted login that lets n8n use another service (Google, WhatsApp…). Stored once, reused by many nodes. |
| **Execution** | One run of a workflow, however many nodes it has. Your plan limits executions per month. |
| **Webhook** | A private web address. When another system (our website, Cal.com) sends data to it, the workflow starts. |
| **Publish** | Makes a workflow live. Your edits save automatically as a **draft**. The live version only changes when you click **Publish** again. |
| **Expression** | Text inside `{{ }}` that n8n fills in with data, e.g. `{{ $json.email }}`. |

---

## Part 0 · Before you start

### 0.1 What you'll need

- A **password manager** with two-factor authentication (2FA) switched on.
- Access to where **deepzeta.ai** is registered, so you can add DNS records.
- A **phone number for WhatsApp** that is **not** used on WhatsApp or WhatsApp Business today, and can receive an SMS or a voice call.
  - Meta says a number already on WhatsApp can't be registered for the API unless it's deleted from WhatsApp first.
  - A new SIM is the safest choice.
- **Your business documents** (e.g. trade licence) for Meta business verification. See 2.2. Decision D2 (the company entity) is still open, so this step may have to wait.
- A **payment card** for n8n, Google Workspace and WhatsApp messages.
- The website's **privacy policy and terms pages online**. Meta needs both URLs before your WhatsApp app can go "Live". Until then, you can do everything except receive WhatsApp messages in n8n.

### 0.2 The order, and why

| Order | What | Why it goes here |
|---|---|---|
| 1 | Google Workspace (Part 1) | Every other account should be owned by an `@deepzeta.ai` address. Its email checks (DKIM) take up to 3 days, so start first. |
| 2 | Meta Business + WhatsApp (Part 2) | Verification and templates take days. |
| 3 | Cal.com (Part 3) | Quick. |
| 4 | **n8n Cloud last** (Part 4) | The free trial lasts **14 days**. If you don't upgrade, n8n **deletes the workspace**; you get 90 days to download your workflows. Start the trial only when Parts 1–3 are done. |

### 0.3 One owner address

Create `hello@deepzeta.ai` in Part 1. Use it as the login for n8n, Meta, Cal.com and ad accounts. Never use a personal Gmail.

---

## Part 1 · Google Workspace on deepzeta.ai

This gives you the business email, Gmail sending for n8n, and the Google Sheet CRM.

### 1.1 Sign up

1. Go to **workspace.google.com** → start the Business sign-up ("Try Google Workspace").
2. When asked for a domain, choose **the one you already own** and type `deepzeta.ai`.
3. Create your admin user, e.g. `yourname@deepzeta.ai`.
4. A trial account can send only 500 emails a day, and some limits stay low until you pay. Add billing when you're ready to go live.

### 1.2 Verify the domain (TXT record)

1. In the setup tool: **Verify domain** → **Get started** → choose your registrar. If it isn't listed, pick **My domain uses a different host**. Then **Continue**.
2. Copy the verification code Google shows.
3. At your registrar's DNS page, add a **TXT** record:
   - **Host:** `@` (or blank)
   - **Value:** the code
4. Back in Google, click verify. It's usually confirmed within an hour; if not, wait up to 72 hours and try again.

### 1.3 Turn on email (MX record)

1. At the registrar, **delete every existing MX record**. Google warns that old MX records break email.
2. Add one **MX** record:
   - **Host:** `@` (or blank)
   - **Priority:** `1`
   - **Value:** `smtp.google.com`
   - Some registrars need a dot at the end: `smtp.google.com.`
3. In Google's setup tool click **Activate Gmail**. It can take up to 72 hours to work everywhere.

### 1.4 Stop your emails landing in spam (SPF, DKIM, DMARC)

**SPF**
- At the registrar, add a **TXT** record:
  - **Host:** `@`
  - **Value:** `v=spf1 include:_spf.google.com ~all`
- A domain may have **only one** SPF record. If one already exists, merge it; ask Claude how.

**DKIM**

Start this **24–72 hours after** Gmail was turned on.
1. Admin console (admin.google.com): **Menu → Apps → Google Workspace → Gmail → Authenticate email**.
2. **Selected domain:** `deepzeta.ai` → **Generate New Record** → key length **2048**, prefix `google` → **Generate**.
3. At the registrar, add a **TXT** record:
   - **Host:** `google._domainkey`
   - **Value:** the long value Google shows
4. **Wait up to 48 hours.** Then come back to the same screen and click **Start authentication**. The status should read "Authenticating email with DKIM".

**DMARC**

Start this **48 hours after** SPF and DKIM are working.
- Add a **TXT** record:
  - **Host:** `_dmarc`
  - **Value:** `v=DMARC1; p=none; rua=mailto:dmarc@deepzeta.ai`
- Create `dmarc@` as an alias first (1.5).
- Start with `p=none`. After a few weeks of clean reports, Google recommends moving to `quarantine`, then `reject`. Ask Claude before changing it.

### 1.5 Create hello@ and dmarc@

1. Admin console → your user → **Add alternate email (alias)** → `hello`. Repeat for `dmarc`. An alias is free, and you can have up to 30.
2. Once you have a team, turn `hello@` into a Google Group so several people can read and reply.

### 1.6 Create the CRM spreadsheet

1. While signed in as `hello@deepzeta.ai`, create a Google Sheet named **`deepzeta CRM v0`**.
2. Create these **tabs** with these **headers in row 1**, exactly as written: lowercase, underscores, no spaces. n8n matches columns by these names.

**Tab `Leads`**
```
lead_id | received_at | source_page | form_id | name | business | email | whatsapp | industry | message | service_interest | consent_contact | consent_whatsapp | consent_ads | utm_source | utm_medium | utm_campaign | gclid | gbraid | wbraid | fbclid | li_fat_id | msclkid | status | owner_notified_at | auto_reply_sent_at | whatsapp_sent_at | notes
```

**Tab `Bookings`**
```
booking_uid | event | received_at | start_time | end_time | attendee_name | attendee_email | title | status
```

**Tab `WhatsApp`**
```
received_at | from_number | profile_name | message_type | text | message_id
```

**Tab `Ads_Conversions`** (used only in Part 11)
```
Email | Phone Number | GCLID | Conversion Action | Conversion Time | Conversion Value | Currency | Order ID
```

3. **Sharing:**
   - Share the Sheet **only with named people**.
   - **Never** use "Anyone with the link". It holds personal data covered by the UAE PDPL (decision 0004).
4. **Retention:** decide how long you keep leads that never become clients. Add it to the facts file. Until you decide, don't delete anything automatically.

✅ **Checkpoint 1**
- [ ] `hello@deepzeta.ai` sends and receives mail.
- [ ] Send a test email to a personal Gmail account. Open the message, choose **Show original**, and check it shows `SPF: PASS` and `DKIM: PASS`.
- [ ] The Sheet exists with all 4 tabs and headers.

---

## Part 2 · Meta Business + WhatsApp Business Cloud API

### 2.1 Business portfolio

1. Log in to Facebook with the account that will own the business. Go to **business.facebook.com** and create a **business portfolio**: business name, your name, and business email `hello@deepzeta.ai`.
2. Turn on 2FA for that Facebook account.

### 2.2 Business verification

Verification is not needed to start, but it raises your limits.

- **Before verification:**
  - up to 250 people per 24 hours can receive business-started messages
  - maximum 2 phone numbers
- **After verification:** 2,000 people per 24 hours, rising automatically later.
- **How:** Meta asks for official documents "such as a business license or articles of incorporation". Self-made documents are refused. Review can take up to 14 business days.
- **Which UAE documents Meta accepts is not confirmed.** Check the list shown in Meta's own screen.
- **Start it from:** App Dashboard → **Settings → Basic → Verification** → **Start Verification**. You can do this after 2.3.

### 2.3 Developer account and app

1. Go to **developers.facebook.com** → register as a developer. You'll accept the terms and verify a phone.
2. **App Dashboard → Create App** → name `deepzeta WhatsApp`, contact email `hello@deepzeta.ai`.
3. Use case: **"Connect with customers through WhatsApp"** → pick your business portfolio → **Create app**.
4. Click **Start using the API**. This opens **API Setup**. Create a WhatsApp Business account if asked.
5. **Write down** these two values in your password manager. They are IDs, not secrets:
   - **WhatsApp Business account ID**
   - the **Phone Number ID** of the sender number (shown next to the "From" number) *(may differ)*
6. **Test it:** click **Generate access token** (a temporary token), choose your own mobile as the **To** number, then **Send message**. You should receive "Hello World" on WhatsApp.

### 2.4 Add a payment method

To message real customers without a partner company, you must add a payment method to the WhatsApp Business account (in WhatsApp Manager). WhatsApp charges **per message**.

⚠️ Meta has announced that from **1 October 2026** it will also charge for "service" replies (inside the 24-hour window) that used to be free. Check the current prices on Meta's pricing page before go-live.

### 2.5 Add your real number

1. **App Dashboard → WhatsApp → API Setup** → add phone number. Enter the display name `deepzeta`, then verify the number by SMS or voice call.
2. **Register the number.** This is a one-time API call that Meta doesn't offer as a button. You'll do it in n8n in Part 7.1. Until then the number can't send messages.
3. The display name is reviewed by Meta; check its status in **WhatsApp Manager → Account tools → Phone numbers → Profile**.

### 2.6 A permanent token (System User)

The token from 2.3 expires. Make a permanent one:
1. Go to **business.facebook.com/settings** → **System Users** → **+Add**. Name: `n8n`, role: **Admin**.
2. Click `n8n` → **Assign assets**:
   - the app `deepzeta WhatsApp` → **Manage app**
   - your WhatsApp account → **Full control**
   - Reload the page; it can take a few minutes to show.
3. **Generate token** → choose the app → expiry **Never** → tick these three permissions:
   - `business_management`
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
4. Click **Generate token**. **Copy it straight into your password manager** as "Meta WhatsApp permanent token". You won't see it again.

### 2.7 Message templates (needed for the 60-second reply)

WhatsApp only lets a business send the **first** message, or any message after 24 hours of silence, as a **pre-approved template**.

1. **WhatsApp Manager → Message templates → Create template** *(labels may differ)*.
2. **Template 1:**
   - **Name:** `dz_lead_welcome` (lowercase, numbers and underscores only)
   - **Category:** **Utility**
   - **Language:** English (`en`)
   - **Body:** your own wording, with **one** variable for the person's first name. For example: `Hi {{1}}, thanks for contacting deepzeta. We've received your request and a specialist will reply here shortly.` Claude or the content writer can polish it; no invented promises.
   - Submit it.
3. Approval can take up to 24 hours. The status must be **Approved** before n8n can send it.

**Opt-in rule (Meta):** you may message someone only if they gave you their number **and** agreed to receive WhatsApp messages from deepzeta. The website form will have a separate WhatsApp consent tick box. n8n will only send when it's ticked.

### 2.8 Going "Live" (later, when the website is online)

To *receive* messages in n8n (Part 8):
1. In the app, add the **Privacy Policy URL** and **Terms of Service URL**. These are the website's pages.
2. Switch the app mode to **Live**.

Meta says some webhooks are not sent while the app is in Dev mode.

✅ **Checkpoint 2**
- [ ] The test message arrived on your phone.
- [ ] The permanent token is saved in your password manager.
- [ ] The Business account ID and Phone Number ID are saved.
- [ ] Template `dz_lead_welcome` shows **Approved**.

---

## Part 3 · Cal.com (booking the free audit)

1. Sign up at **cal.com** with `hello@deepzeta.ai`. Connect your Google Workspace calendar.
2. **Event types → New event type:**
   - **Title:** "Free AI Automation Audit"
   - **URL:** `free-ai-audit`
   - **Length:** use the length stated in the Services Catalogue for 0.1 (a 30–45 minute call). Pick one.
3. Get an **API key** for n8n *(menu path not confirmed; look under Settings → Developer → API keys)*. Copy it into your password manager.
4. Cal.com's help pages list webhooks as a free-plan feature, but the pricing page doesn't. If webhooks or API keys are missing on your plan, tell Claude.

✅ **Checkpoint 3**
- [ ] Book a test slot on your own event page and see it appear in Google Calendar.
- [ ] Cancel the test booking.

---

## Part 4 · n8n Cloud: account, plan, settings

### 4.1 Plan

| | Starter | Pro |
|---|---|---|
| Executions per month | 2,500 | 10,000 |
| Run history kept | 7 days | 30 days |
| Version history | 24 hours | 5 days + named versions |

- **Start on the free trial.** It gives Pro features for 14 days, limited to 1,000 executions.
- Choose **Starter** if volume is small. Every lead, booking and incoming WhatsApp message uses one execution; busy WhatsApp chats use them fastest.
- Choose **Pro** if you want 30 days of history to investigate problems.
- Prices: **n8n.io/pricing**.

**Where your data lives:** n8n Cloud stores data in the EU, in Frankfurt, Germany, on Microsoft Azure. The UAE PDPL has rules on sending personal data abroad. n8n offers a Data Processing Agreement with Standard Contractual Clauses (n8n.io/legal). ⚠️ **Confirm with a legal adviser** that this is acceptable for your leads before go-live. This is a legal question, not a technical one.

### 4.2 Sign up and secure the account

1. **n8n.io/pricing** → **Start free trial** (no card needed). Sign up with `hello@deepzeta.ai`.
2. **Turn on 2FA:** **Settings → Personal → Enable 2FA** → scan the QR code with your authenticator app → enter the code → **Continue**. Save the recovery codes in your password manager.
3. **Set the timezone:** open the **Admin Dashboard** → **Manage** → **Timezone** = **Asia/Dubai**.

### 4.3 Naming rules (keeps things findable)

| Kind | Pattern | Example |
|---|---|---|
| Workflows | `DZ · <what it does>` | `DZ · Lead Intake` |
| Credentials | `<service> · <account>` | `Google · hello@deepzeta.ai` |

In every node, write a one-line note in the node's **Notes** field (Settings tab) saying what it does.

✅ **Checkpoint 4**
- [ ] You can log in with 2FA.
- [ ] The timezone shows Asia/Dubai.

---

## Part 5 · Credentials (enter every secret once)

In n8n: **Overview** → **Credentials** → **Create credential** *(may differ)*. Create these:

| # | Credential type | Name it | How |
|---|---|---|---|
| C1 | **Google Sheets OAuth2 API** | `Google Sheets · hello@deepzeta.ai` | Click **Sign in with Google**, choose `hello@deepzeta.ai`, allow access. n8n Cloud handles the Google setup for you. |
| C2 | **Gmail OAuth2 API** | `Gmail · hello@deepzeta.ai` | Same: **Sign in with Google**. |
| C3 | **Header Auth** | `Website → n8n secret` | **Name:** `X-DZ-Secret`. **Value:** a new random secret (see below). |
| C4 | **WhatsApp API** (API Key type) | `WhatsApp · deepzeta` | **Access Token** = the permanent token (2.6). **Business Account ID** = from 2.3. |
| C5 | **Header Auth** | `Meta Graph · bearer` | **Name:** `Authorization`. **Value:** `Bearer ` + the permanent token (one space after "Bearer"). Used only for the one-time number registration. |
| C6 | **Cal.com API** | `Cal.com · deepzeta` | **API Key** from Part 3, **Host** `https://api.cal.com`. |

**How to make the random secret for C3.** On your Windows computer, open **PowerShell** and paste:

```powershell
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

It prints 48 random letters and digits. Save it in your password manager as "n8n website webhook secret". The website will need the same value later: it goes into Vercel as an environment variable, which Claude sets up in the website plan.

✅ **Checkpoint 5**
- [ ] All six credentials show as saved, with no red error.
- [ ] No secret appears anywhere except the password manager and n8n.

---

## Part 6 · Workflow "DZ · Error Handler" (build this first)

If any live workflow fails, you get an email. This protects every lead.

1. **Create workflow** → name it `DZ · Error Handler`.
2. Add node **Error Trigger**.
3. Add node **Gmail → Send a message**. Credential: C2.
   - **To:** `hello@deepzeta.ai`
   - **Subject:** `⚠ n8n failed: {{ $json.workflow.name }}`
   - **Email Type:** Text
   - **Message:**
     ```
     Workflow: {{ $json.workflow.name }}
     Failed at node: {{ $json.execution.lastNodeExecuted }}
     Error: {{ $json.execution.error.message }}
     Open the run: {{ $json.execution.url }}
     ```
   - **Options → Add option → Append n8n attribution → off.**
4. Save it. This workflow **doesn't need publishing**.
5. In **every** workflow you build below, open **⋯ (top right) → Settings**, then:
   - **Error workflow** = `DZ · Error Handler`
   - **Save failed production executions** = save *(the exact option text may differ)*

⚠️ The Error Trigger fires only for **live (production) runs**, never for manual test runs. You'll test it in Part 12.

---

## Part 7 · One-time: register your WhatsApp number

1. Create a temporary workflow `DZ · TEMP register number`.
2. Add node **HTTP Request**:
   - **Method:** POST
   - **URL:** `https://graph.facebook.com/v26.0/PHONE_NUMBER_ID/register`. Replace `PHONE_NUMBER_ID` with your real Phone Number ID from 2.3. v26.0 was Meta's current version on 2026-09-29.
   - **Authentication:** Generic Credential Type → **Header Auth** → C5
   - **Send Body:** on → **Body Content Type:** JSON → **Specify Body:** Using JSON:
     ```json
     { "messaging_product": "whatsapp", "pin": "YOUR-6-DIGIT-PIN" }
     ```
     Choose a new 6-digit PIN. This becomes the number's **two-step verification PIN**, so save it in your password manager.
3. Click **Execute workflow** *(older versions: "Test workflow")*. A success answer looks like `{"success": true}`.
4. Meta allows only 10 attempts per 72 hours. If it fails, **stop and send Claude the error** instead of retrying.
5. **Before you delete the workflow, remove the PIN from the node.**

✅ **Checkpoint 7**
- [ ] `{"success": true}`.
- [ ] The temporary workflow is deleted.

---

## Part 8 · Workflow "DZ · Lead Intake" (the core)

**What it does:** the website form sends a lead. n8n then:
1. checks it
2. saves it to the `Leads` tab
3. answers the website within seconds
4. emails you
5. emails the visitor
6. sends the WhatsApp welcome template, only if the visitor ticked WhatsApp consent

### 8.1 What the website will send

The website sends this JSON. Claude builds that side later; this guide lets you test before the website exists.

```json
{
  "lead_id": "a unique id made by the website",
  "source_page": "/",
  "form_id": "audit_form",
  "name": "Test Person",
  "business": "Test Clinic",
  "email": "you@example.com",
  "whatsapp": "9715XXXXXXXX",
  "industry": "healthcare",
  "message": "We miss calls after 6pm",
  "service_interest": "ai-front-desk",
  "consent_contact": true,
  "consent_whatsapp": true,
  "consent_ads": false,
  "utm_source": "", "utm_medium": "", "utm_campaign": "",
  "gclid": "", "gbraid": "", "wbraid": "", "fbclid": "", "li_fat_id": "", "msclkid": ""
}
```

- **WhatsApp format:** country code + number, digits only, no `+`, no spaces, no leading 0 (a UAE mobile looks like `9715…`).
- **`consent_ads`** is `true` when the visitor's consent state at sending includes Marketing: chosen in the cookie banner or Cookie settings, or the default for visitors outside the EEA, the UK and Switzerland (P3). n8n sends server-side conversions (Meta, LinkedIn, Google offline import) only then. No workflow step changes.
- The website checks the spam shield (Cloudflare Turnstile) itself, **before** calling n8n.

### 8.2 Build it

**Create workflow** `DZ · Lead Intake`, then add these nodes in order.

**Node 1 · Webhook** (rename it `Lead in`)
- **HTTP Method:** POST
- **Path:** `lead`
- **Authentication:** Header Auth → C3
- **Respond:** Using 'Respond to Webhook' Node

**Node 2 · Edit Fields (Set)** (rename it `Clean`), Mode **Manual Mapping**. Add each field below. The values are expressions:

| Field | Value |
|---|---|
| `lead_id` | `{{ $json.body.lead_id }}` |
| `received_at` | `{{ $now.toFormat('yyyy-MM-dd HH:mm:ss') }}` |
| `name` | `{{ ($json.body.name ?? '').trim() }}` |
| `email` | `{{ ($json.body.email ?? '').trim().toLowerCase() }}` |
| `whatsapp` | `{{ ($json.body.whatsapp ?? '').replace(/\D/g, '') }}` |
| every other field from 8.1 | `{{ $json.body.<field> }}`, e.g. `{{ $json.body.business }}` |

- Set `consent_contact`, `consent_whatsapp` and `consent_ads` as **Boolean** type.
- Option **Keep Only Set Fields: on**.

**Node 3 · IF** (rename it `Valid?`)
- **Conditions (AND):**
  - `{{ $json.lead_id }}` → String → **is not empty**
  - `{{ $json.name }}` → String → **is not empty**
  - `{{ $json.email }}` → String → **is not empty**
  - `{{ $json.consent_contact }}` → Boolean → **is true**

**On the false branch · Respond to Webhook** (rename it `Reject`)
- **Respond With:** JSON → `{ "ok": false, "error": "invalid_lead" }`
- **Options → Response Code:** `400`

**On the true branch · Google Sheets** (rename it `Save lead`)
- Credential C1
- **Operation:** Append or Update Row
- **Document:** From list → `deepzeta CRM v0`
- **Sheet:** `Leads`
- **Mapping Column Mode:** Map Automatically
- **Column to Match On:** `lead_id`. If the website retries the same lead, it updates the row instead of making a duplicate.
- **Settings tab:** **Retry On Fail: on**

**Node · Respond to Webhook** (rename it `OK`), after `Save lead`
- **Respond With:** JSON → `{ "ok": true, "lead_id": "{{ $('Clean').item.json.lead_id }}" }`
- Response Code 200 is the default.

The website gets its answer here, fast. n8n Cloud cuts requests that run longer than 100 seconds, so everything slow happens **after** this node.

**Node · Gmail** (rename it `Tell owner`), after `OK`
- Credential C2
- **To:** `hello@deepzeta.ai`
- **Subject:** `New lead: {{ $('Clean').item.json.name }} ({{ $('Clean').item.json.business }})`
- **Message:** list name, business, email, WhatsApp, industry, message and source page, using `{{ $('Clean').item.json.<field> }}`.
- **Options:** Append n8n attribution **off**.
- **Settings:** **Retry On Fail: on**

**Node · Gmail** (rename it `Auto-reply`), after `Tell owner`
- **To:** `{{ $('Clean').item.json.email }}`
- **Subject:** `We received your request, deepzeta`
- **Message:** short, honest wording. Claude/the content writer will give you the final text. No promises that aren't in the facts file.
- **Options:**
  - **Sender Name:** `deepzeta`
  - **Send Replies To:** `hello@deepzeta.ai`
  - Append n8n attribution **off**

**Node · IF** (rename it `WhatsApp consent?`)
- `{{ $('Clean').item.json.consent_whatsapp }}` → Boolean → **is true**
- **AND** `{{ $('Clean').item.json.whatsapp }}` → String → **is not empty**

**On the true branch · WhatsApp Business Cloud** (rename it `WhatsApp welcome`)
- Credential C4
- **Operation:** Send Template
- **Sender:** your Phone Number ID
- **Recipient:** `{{ $('Clean').item.json.whatsapp }}`
- **Template:** `dz_lead_welcome`, language `en`
- **Body variable 1:** `{{ $('Clean').item.json.name.split(' ')[0] }}`
- *(Field labels may differ.)* If n8n says "Bad request – please check your parameters", the variable count or order doesn't match the template.
- **Settings tab:**
  - **Retry On Fail: on**
  - **On Error: Continue**. A WhatsApp problem must never lose the lead; the lead is already saved.

**Node · Google Sheets** (rename it `Mark done`), at the end of each branch
- **Operation:** Update Row
- **Column to Match On:** `lead_id`
- Set `owner_notified_at` and `auto_reply_sent_at` to `{{ $now.toFormat('yyyy-MM-dd HH:mm:ss') }}`.
- On the WhatsApp branch, also set `whatsapp_sent_at`.
- Set `status` to `new`.

Finally: **⋯ → Settings** → Error workflow = `DZ · Error Handler`.

### 8.3 Test before the website exists

1. Open `Lead in` → **Listen for Test Event**. n8n listens for 120 seconds. Copy the **Test URL**.
2. In **PowerShell** (replace the URL and the secret; use **your own** email and WhatsApp number):

   ```powershell
   $body = @{ lead_id = [guid]::NewGuid().ToString(); source_page = "/test"; form_id = "audit_form"; name = "Test Person"; business = "Test Co"; email = "YOUR-EMAIL"; whatsapp = "9715XXXXXXXX"; industry = "test"; message = "test lead"; service_interest = "test"; consent_contact = $true; consent_whatsapp = $true; consent_ads = $false } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri "PASTE-TEST-URL" -Headers @{ "X-DZ-Secret" = "PASTE-SECRET" } -ContentType "application/json" -Body $body
   ```

3. **Expected results:**
   - PowerShell prints `ok : True`
   - a new row appears in `Leads`
   - you receive the owner email and the auto-reply
   - the WhatsApp template arrives on your phone
4. **Negative test:** run it again with `name = ""`. It should return a **400** error, with no new row.
5. **Security test:** run it with a wrong secret. It must be refused (**403** or similar).
6. Delete the test rows from the Sheet.

### 8.4 Publish

Click **Publish** (top of the canvas), and give the version a name, e.g. `v1 lead intake`.

- The **Production URL** (in the `Lead in` node) now works. It is different from the Test URL.
- Save the Production URL in your password manager as "n8n lead webhook URL". The website will use it.
- ⚠️ **Every time you change a published workflow, click Publish again.** Live runs use the last published version, not your draft.

✅ **Checkpoint 8**
- [ ] The positive, negative and security tests all behave as expected.
- [ ] The workflow is published.

---

## Part 9 · Workflow "DZ · Cal.com Bookings"

1. **Create workflow** `DZ · Cal.com Bookings`.
2. Add node **Cal Trigger**:
   - Credential C6
   - **Events:** Booking created, Booking cancelled, Booking rescheduled
3. Add **Google Sheets** → **Append or Update Row** → sheet `Bookings` → **Column to Match On:** `booking_uid`. Map:

   | Column | Value |
   |---|---|
   | `booking_uid` | `{{ $json.payload.uid }}` |
   | `event` | `{{ $json.triggerEvent }}` |
   | `received_at` | `{{ $now.toFormat('yyyy-MM-dd HH:mm:ss') }}` |
   | `start_time` | `{{ $json.payload.startTime }}` |
   | `end_time` | `{{ $json.payload.endTime }}` |
   | `attendee_name` | `{{ $json.payload.attendees[0].name }}` |
   | `attendee_email` | `{{ $json.payload.attendees[0].email }}` |
   | `title` | `{{ $json.payload.title }}` |

   *(If the incoming data looks different, check its shape in the node's output panel and tell Claude.)*
4. Add **Gmail** → to `hello@deepzeta.ai`. Subject: `Booking {{ $json.triggerEvent }}: {{ $json.payload.attendees[0].name }}`.
5. Settings → Error workflow = `DZ · Error Handler`. Then **Publish**.
6. **Test:** make a test booking on your Cal.com page. A row should appear and you should get the email. Then cancel it; the row's `event` should change.

✅ **Checkpoint 9**
- [ ] Created, cancelled and rescheduled bookings all reach the Sheet.

---

## Part 10 · Workflow "DZ · WhatsApp Inbound" (after the website is live)

This saves every WhatsApp message people send you and alerts you, so a human can reply. The AI agent that answers automatically is a later project (phase P7).

**Before you start:** Meta app mode **Live** (2.8).

1. Create credential **C7 · WhatsApp OAuth2**:
   - **Client ID** = the App ID
   - **Client Secret** = the App Secret
   - Both are in the Meta App Dashboard → **App settings → Basic**. The App Secret is a secret: password manager only.
2. **Create workflow** `DZ · WhatsApp Inbound`.
3. Add node **WhatsApp Trigger** → credential C7 → **Updates:** Messages.
4. Add **Google Sheets** → **Append Row** → sheet `WhatsApp`. Map the sender, text and id from the trigger output. Run a test first to see the field names.
5. Add **Gmail** alert to `hello@deepzeta.ai`.
6. Settings → Error workflow. Then **Publish**.

⚠️ **Meta allows only ONE webhook per app.** Testing with the Test URL replaces the live one. After any test: **unpublish → test → publish again**.

⚠️ **Execution count:** every incoming message uses one execution. Watch your monthly usage on Starter.

✅ **Checkpoint 10**
- [ ] A message sent from your personal phone appears in the `WhatsApp` tab and in your email.

---

## Part 11 · Ad conversion tracking (only when ads start)

Do this part only when you run ads **and** the website's consent banner and tracking are built (phase P3).

- It sends conversions **only** when the visitor accepted ads cookies (`consent_ads = true`).
- Personal data is **hashed** (SHA-256) before it leaves n8n.
- Every event carries the same `lead_id` as its event id, so Meta counts the browser and server event once (deduplication).

### 11.1 Google Ads: easiest route (no n8n node needed)

Google now recommends **Enhanced conversions for leads**.
1. The website's Google tag captures the hashed email at form submit. This is a website task.
2. In Google Ads: **Goals → Summary → + New conversion action → Import → CRMs, files, or other data sources → Google Sheets → Direct connection** → select the `Ads_Conversions` tab → map the fields.
3. Google reads **only the first sheet** and needs row 1 as headers. Put `Ads_Conversions` **first**, or make a separate spreadsheet for it (safer).
4. Imports run at most **daily**.
5. When a lead becomes a real client, add a row in this format:
   - `Conversion Time` like `2026-09-29T10:05:00Z` (UTC)
   - `Phone Number` like `+9715XXXXXXXX`
   - `Currency` = `AED`
   - `Conversion Value` = the real value, only if known

### 11.2 Meta Conversions API

1. In **Events Manager** → your Pixel → **Settings** → **Conversions API** → **Generate access token**. Save it.
2. Create credential **C8 · Query Auth** `Meta CAPI`: **Name** `access_token`, **Value** = that token.
3. In `DZ · Lead Intake`, after `OK`, add a branch **IF** `consent_ads` is true, then:
   - **Crypto → Hash, SHA256, HEX.** Value: `{{ $('Clean').item.json.email }}`. It's already lowercased and trimmed. Property name: `em_hash`.
   - **HTTP Request:**
     - **Method:** POST
     - **URL:** `https://graph.facebook.com/v26.0/YOUR_PIXEL_ID/events`
     - **Authentication:** C8
     - **JSON body:**

     ```json
     { "data": [ {
       "event_name": "Lead",
       "event_time": {{ Math.floor(Date.now()/1000) }},
       "event_id": "{{ $('Clean').item.json.lead_id }}",
       "action_source": "website",
       "event_source_url": "https://deepzeta.ai{{ $('Clean').item.json.source_page }}",
       "user_data": { "em": ["{{ $json.em_hash }}"] }
     } ] }
     ```

     Meta also wants the visitor's IP address and browser user-agent for website events. The website must send `client_ip` and `user_agent` for this branch only, and they are **not** saved in the Sheet. Claude will add them in the website plan.
4. **Test:** in Events Manager → **Test Events**, copy the test code and add `"test_event_code": "TESTxxxx"` inside the JSON (next to `"data"`). Check the event appears, then **remove** the test code and publish.

### 11.3 LinkedIn Conversions API (medium difficulty: do it with Claude)

Token: Campaign Manager → **Data → Signals Manager → Direct API → Generate access token**. The token doesn't expire and LinkedIn won't show it again, so copy it straight into your password manager.

It also needs:
- a conversion rule set to "Conversions API"
- a monthly version header
- timestamps in milliseconds

Ask Claude to build this node with you when LinkedIn ads start.

---

## Part 12 · Go-live checklist

- [ ] All workflows have **Error workflow = DZ · Error Handler**.
- [ ] **Error test:** temporarily break `Save lead` (choose a wrong sheet), **publish**, send a test lead to the **Production URL**. You should get the ⚠ email. Fix it and **publish** again.
- [ ] Every workflow shows as published. Its latest changes are published, not just drafts.
- [ ] No secret is typed inside a node (only in Credentials). Check the HTTP Request nodes especially.
- [ ] The Sheet is shared only with named people.
- [ ] The Gmail auto-reply shows "deepzeta" and no n8n attribution.
- [ ] The WhatsApp template is approved; the WhatsApp message price is checked for the current month.
- [ ] You've had the legal check on EU data hosting (4.1).
- [ ] **Backups:** each workflow → **⋯ → Download**. Send the JSON files to Claude to store in the repo. Exports contain credential **names**, not the secrets. Repeat after every change.

## Part 13 · Weekly 5-minute check

1. n8n **Overview → Executions** → filter **Failed**. There should be none. If there are any, open them and send the error to Claude.
2. Admin Dashboard: this month's executions vs your plan's limit.
3. The Sheet: new leads all have `owner_notified_at` filled in.
4. Gmail: check that no auto-replies came back as undelivered.

## Part 14 · Common problems

| Problem | Cause → fix |
|---|---|
| The website gets an error, but the test worked | You tested with the **Test URL**, or didn't **Publish**. Use the Production URL and publish. |
| Changes don't take effect | Live runs use the **published** version. Click **Publish** again. |
| 403 / unauthorized on the webhook | The secret header differs. Check `X-DZ-Secret` on both sides, with no extra spaces. |
| "Bad request – please check your parameters" (WhatsApp) | The template variables don't match the template, or it isn't approved yet. |
| WhatsApp messages stopped arriving in n8n | You tested with the Test URL (one webhook per app). Unpublish, then publish again. Or the Meta app is not Live. |
| Emails go to spam | SPF/DKIM not finished (Part 1.4). Check **Show original** in Gmail. |
| Sheets error 429 | Too many writes per minute (limit 60 per user). Retry On Fail handles short bursts. Tell Claude if it repeats. |
| No ⚠ email on failure | The Error Trigger only fires on **live** runs, not manual tests. |
| Trial ended | n8n deletes the workspace; you have 90 days to download workflows. Upgrade before day 14. |

---

## Sources (checked 2026-09-29)

**n8n**
- docs.n8n.io:
  - Webhook, Respond to Webhook, Crypto, IF, Edit Fields, Google Sheets, Gmail, WhatsApp Business Cloud, WhatsApp Trigger, Cal Trigger and HTTP Request nodes
  - Google OAuth ("Sign in with Google" on Cloud)
  - Error Trigger, workflow settings, save and publish
  - Cloud timezone, data retention, export and import
- n8n.io/pricing and n8n.io/legal (hosting in Frankfurt, DPA)

**Meta / WhatsApp**
- developers.facebook.com, WhatsApp Business Platform: get started, phone numbers, registration, access tokens, templates, messaging limits, pricing (including the 1 Oct 2026 change), webhooks, opt-in, business verification
- Conversions API: parameters and deduplication; Graph API changelog (v26.0)

**Google**
- knowledge.workspace.google.com: verify domain, MX, SPF, DKIM, DMARC, sending limits, aliases
- developers.google.com: Sheets API limits
- support.google.com (Google Ads): enhanced conversions for leads, offline conversion import

**Others**
- LinkedIn: learn.microsoft.com/linkedin/marketing (Conversions API)
- Cal.com: cal.com/help, cal.com/docs (webhooks, event types)
- Cloudflare: developers.cloudflare.com (Turnstile server-side validation)

**Not confirmed in the official docs** (marked *may differ* above):
- some n8n field labels (WhatsApp send fields, workflow-settings option text)
- where the Meta Phone Number ID is shown
- WhatsApp Manager template button labels
- Cal.com's API-key menu path
- which UAE documents Meta accepts for verification
