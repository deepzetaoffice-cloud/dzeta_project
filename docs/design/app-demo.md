# App demo

Status: LATER (frame proposed; details in an owner session) · Page tier: T3 · Decision 0008 · Effects: [13](../ai/13-experience-design.md)

## What exists

The owner is rebuilding the app in `D:\Deepzeta Sync App`.

- **What the folder holds:** **Forge Growth** (MIT licence, by Forgemind), a WhatsApp CRM.
- **Features that exist in the code:**
  - ad → chat → lead → payment attribution
  - an inbox with bot/human take-over
  - an AI agent test chat with a tool-call trace
  - an automation builder
  - a funnel board
  - a KPI dashboard
- **Market fit:** India-first (₹, Razorpay), with no Arabic or RTL.
- **Licence note:** its README asks distributed forks to rename and not use the Forgemind name or logo.

## Proposed frame

1. **A light intro:** a statement headline and a device-frame poster, for a fast first view.
2. **"Launch the live demo":** loads an app shell that runs in the browser on fictional UAE sample data (AED). Nothing is sent anywhere.
3. **A guided tour of one story:**
   1. an ad click
   2. the WhatsApp chat
   3. the AI replies
   4. a human takes over
   5. the lead moves on the board
   6. the payment link is paid
   7. the dashboard shows ad → revenue
4. **Free explore** after the tour, with an audit CTA at the end.

- **Label:** "Demo · sample data · nothing is sent".
- **Mobile:** the demo runs inside a phone frame (`depth-css`).

## Decisions needed first (LATER)

- product name and branding
- honest wording about where the product comes from
- only features that exist in the rebuild
- the product's own design language
- AED, local payments and Arabic
- its place in the nav
- the URL
