// The FAQ question bank (engine §6.1; P5). Each question has a stable id (its anchor, #faq-<id>),
// one topic, one home URL — Home (R001) is the only page with a FAQ today; every later page's plan
// adds its own questions here (a question lives on exactly one page, engine §6.2 rule 1).
// The answer format (engine §6.3): the first sentence answers directly (≤ 25 words) and stands
// alone; the whole answer is 40–90 words; at most one contextual link; numbers only from the
// facts file (10 §3, facts §6). The FAQ module and the FAQPage schema read these same strings,
// byte for byte (visible parity, 08 §3 rule 7) — never retype them.
export type FaqTopic =
  'cost' | 'timeline' | 'data-privacy' | 'arabic' | 'integrations' | 'ownership' | 'results' | 'support';

export type FaqQuestion = {
  /** The stable id: the anchor is #faq-<id> */
  id: string;
  /** One of the engine's topics (§6.1); the chips filter by it */
  topic: FaqTopic;
  /** The question in the reader's words */
  question: string;
  /** The answer; the first sentence stands alone (≤ 25 words) */
  answer: string;
};

// The topic chips' labels (faq.md; only the topics the page uses, in the engine's §6.1 order)
export const FAQ_TOPIC_LABELS: Readonly<Record<FaqTopic, string>> = {
  cost: 'Cost',
  timeline: 'Timeline',
  'data-privacy': 'Data & privacy',
  arabic: 'Arabic',
  integrations: 'Integrations',
  ownership: 'Ownership',
  results: 'Results',
  support: 'Support',
};

// The questions on Home (R001), most-asked first; cost and timeline early (engine §6.2 rule 3)
export const homeFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-the-audit-cost',
    topic: 'cost',
    question: 'What does the free AI automation audit include?',
    answer:
      'The audit is free and comes with no obligation. In one session we map your sales, operations and admin processes, identify where customers or hours are being lost, and show which automations would pay back first. You get a clear picture of what to automate, in what order, and what each step involves — whether or not you build it with us.',
  },
  {
    id: 'how-long-until-live',
    topic: 'timeline',
    question: 'How long does an automation or website take to build?',
    answer:
      'It depends entirely on the scope, so we do not quote a standard timeframe before the audit. A single workflow, such as review requests or appointment reminders, is a smaller build than a full website with an AI agent behind it. After the audit you get a written scope with a delivery plan you can compare, and nothing starts without your sign-off on it.',
  },
  {
    id: 'is-my-business-data-safe',
    topic: 'data-privacy',
    question: 'Is my business and customer data safe with AI systems?',
    answer:
      'Yes — data handling is designed in, not added later. We follow the UAE Personal Data Protection Law, customer-facing automations include consent wording and a way to reach a human, and you choose which platforms hold which data. We never sell or share your data, and the audit itself only covers what you agree to show us.',
  },
  {
    id: 'does-it-work-in-arabic',
    topic: 'arabic',
    question: 'Do the AI agents work in Arabic as well as English?',
    answer:
      'Yes. AI agents that talk to customers are built bilingual, Arabic and English, because UAE customers message in both — often in the same conversation. AI models with strong Arabic support, including the UAE\u2019s own Jais and Falcon, are among the platforms we build with. Arabic-first flows are designed Arabic-first, never translated as an afterthought.',
  },
  {
    id: 'which-platforms-do-you-connect',
    topic: 'integrations',
    question: 'Which tools and platforms can you connect?',
    answer:
      'If a tool has an API, it can usually be connected. The automations connect the platforms UAE businesses already run: WhatsApp Business API, Instagram, Messenger, email and SMS for messaging; HubSpot, Zoho CRM, Pipedrive, Salesforce and Odoo for CRM; n8n, Make and Zapier as automation engines; and accounting systems such as Zoho Books, QuickBooks and Xero.',
  },
  {
    id: 'who-owns-the-system',
    topic: 'ownership',
    question: 'Who owns the automation or website once it is built?',
    answer:
      'You do — completely. The code, the workflows, the accounts and the data belong to your business, in your name, from day one. We build on your accounts, document everything and hand over full access at launch. If you later want another team to run or extend the system, nothing is locked and there is nothing to buy back from us.',
  },
  {
    id: 'do-you-guarantee-results',
    topic: 'results',
    question: 'Do you guarantee rankings, leads or results?',
    answer:
      'No — and we would question anyone who does. We build to measurable targets, like a reply within 60 seconds to every new lead, and we show you the numbers our own site achieves as the working example. What we guarantee is the engineering: custom code, performance budgets enforced in our pipeline, and AI-search-ready structure on every page we ship.',
  },
  {
    id: 'what-happens-after-launch',
    topic: 'support',
    question: 'What happens after launch — am I on my own?',
    answer:
      'No. Launch is a step, not the end. We watch the numbers with you, fix what surfaces in the first weeks, and there is an ongoing care retainer for businesses that want us to keep running and improving the systems. You can also run everything yourself: the handover includes documentation and training for your team.',
  },
];

// The questions on the services hub (/services, R010; the P6 part A plan, S10): 4, the hub's range
// (engine §3). Each asks what the hub is for (choosing a service), so none repeats Home's
// questions. Sources: catalogue priority tags (add-ons "sold with another service"), 0.1, 2.1,
// 2.3, 4A.3, 4C.2, 6.2 and 1A.1.
export const servicesHubFaq: readonly FaqQuestion[] = [
  {
    id: 'can-i-start-with-one-service',
    topic: 'cost',
    question: 'Can I start with one service instead of a package?',
    answer:
      'Yes: most services are sold on their own, so you can start with the one that matters most. Add-ons, such as AI training or priority support, are sold with another service. Solutions combine several services into one system when you are ready.',
  },
  {
    id: 'which-service-pays-back-first',
    topic: 'results',
    question: 'How do I know which service will pay back first?',
    answer:
      'A Free AI Automation Audit shows which automations pay back first, at no cost. It maps your sales, operations and admin processes, ranks the opportunities by return and estimates the hours and money saved. You also get a written summary with next steps and a quote.',
  },
  {
    id: 'do-websites-and-automations-connect',
    topic: 'integrations',
    question: 'Do your websites and automations work together?',
    answer:
      'Yes: Custom-Coded High-Performance Websites are built ready to connect to WhatsApp, a CRM, booking and AI automations, with analytics and conversion tracking included. A website enquiry can then get an instant reply, land in your CRM and reach the right salesperson, with nobody copying details across.',
  },
  {
    id: 'do-you-build-arabic-websites',
    topic: 'arabic',
    question: 'Do you build websites in Arabic?',
    answer:
      'Yes: websites can be built in Arabic and English, with a true right-to-left layout for Arabic. Online stores, Google Business Profile optimisation and copywriting come in both languages too. AI agents reply in Arabic and English, and AI training for teams can be delivered in either.',
  },
];

// The questions on the Speed-to-Lead System page (/services/speed-to-lead-system, R027; the P6 part
// A plan, S10): 7, the lead service range of 6–8 (engine §3); cost and timeline first (§6.2 rule 3).
// "60 seconds" is the facts §6 design target, never a measured result. Sources: catalogue 0.1
// (the written summary and quote), 1B.1, 1B.6, 1K.1 (data rules in every automation project), 6.1,
// §8 (CRMs, automation engines, Arabic and English voices) and §9 (consent and a human).
export const speedToLeadSystemFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-speed-to-lead-cost',
    topic: 'cost',
    question: 'How much does a Speed-to-Lead System cost?',
    answer:
      'The price depends on your setup, so we quote it after a free AI audit. The main drivers are how many lead sources you connect, whether you add the AI call-back, and how many salespeople the routing has to cover. Each portal, ad account and phone line is its own connection.',
  },
  {
    id: 'how-long-does-speed-to-lead-take',
    topic: 'timeline',
    question: 'How long does a Speed-to-Lead System take to set up?',
    answer:
      'We give a timeframe only after the free AI audit, once we know your lead sources. Answering website forms and WhatsApp is a smaller build than also covering the property portals, ads, phone calls and an AI call-back. After the audit you get a written summary with next steps and a quote.',
  },
  {
    id: 'is-the-speed-to-lead-reply-time-guaranteed',
    topic: 'results',
    question: 'Will every lead really get a reply within 60 seconds?',
    answer:
      'Not as a guarantee: 60 seconds is the design target the system is built to, not a measured result. The first reply is automatic, so it never waits for a person. It still depends on each lead source passing the enquiry on, and on the channel delivering the message. We will publish real reply times only after measuring them on live systems.',
  },
  {
    id: 'does-speed-to-lead-work-with-my-crm',
    topic: 'integrations',
    question: 'Does it work with the CRM we already use?',
    answer:
      'The Speed-to-Lead System works with your CRM if it is HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo. Each new lead and its first reply can be logged there, so your team works from one record. If you have no CRM yet, CRM Setup & Automation adds one, with pipelines, stages, tasks and reminders.',
  },
  {
    id: 'can-speed-to-lead-reply-in-arabic',
    topic: 'arabic',
    question: 'Can the first reply go out in Arabic?',
    answer:
      'Yes: first replies can be written in Arabic, English or both, and you choose which version each lead receives. The optional AI call-back uses AI voice platforms with Arabic and English voices. A lead who writes in Arabic can also be routed to a salesperson who speaks it.',
  },
  {
    id: 'how-is-speed-to-lead-data-handled',
    topic: 'data-privacy',
    question: 'How is the personal data in each lead handled?',
    answer:
      'Every automation project we build includes data rules: consent wording, retention and access rules, and a record of what each AI step uses. For the Speed-to-Lead System, that means consent wording in each message and call, an easy opt-out, and a way to reach a person. You decide who on your team can see each lead.',
  },
  {
    id: 'who-runs-speed-to-lead-after-launch',
    topic: 'support',
    question: 'Who looks after the system once it is live?',
    answer:
      'If you want us to keep it running, the AI Ops Retainer looks after your Speed-to-Lead System once it is live. It covers monitoring, fixes, updates and prompt improvements, plus a monthly report of hours saved and results. It also adds new small automations each month, such as connecting a new lead source.',
  },
];

// The questions on the Automated Quotation & Quote Tracking System page (R029): 8, the lead service
// range of 6–8 (engine §3); cost and timeline first (§6.2 rule 3). Each first sentence stands alone
// (≤ 25 words); each answer is 40–90 words and names at most one other service. Sources: catalogue
// 0.1 (the written summary and quote), 1B.3, 1K.1 (retention and access rules in every automation
// project), 6.1 (the AI Ops Retainer), §8 (CRMs, accounting) and §9 (no guaranteed results).
export const automatedQuotationTrackingFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-quote-tracking-cost',
    topic: 'cost',
    question: 'How much does an automated quotation system cost?',
    answer:
      'We price it after a free AI audit, because the cost depends on your setup. The main drivers are how many places quotes start from, how complex your price lists and rules are, and how many approval levels you need. E-signature, deposit payments and turning accepted quotes into jobs or invoices each add to the build.',
  },
  {
    id: 'how-long-does-quote-tracking-take',
    topic: 'timeline',
    question: 'How long does it take to automate our quoting?',
    answer:
      'We confirm a timeframe after the free AI audit, once we have seen your price lists and quote templates. Branded quotes sent by email, with view tracking, are a smaller build than adding approvals, e-signature, deposits and automatic jobs or invoices. The audit ends with a written summary of next steps and our price for the build.',
  },
  {
    id: 'can-quote-tracking-start-from-our-crm',
    topic: 'integrations',
    question: 'Can a quote start from a deal in our CRM?',
    answer:
      'Yes: a quote can start from a deal in HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo. It can also start from a form, a WhatsApp chat or an email. The client’s details come across from the deal, so nobody retypes them. When the client accepts, the quote can become an invoice in Zoho Books, QuickBooks, Xero or Odoo.',
  },
  {
    id: 'can-quote-tracking-send-arabic-quotes',
    topic: 'arabic',
    question: 'Can quotes go out in Arabic as well as English?',
    answer:
      'Yes: each quote can be produced in Arabic or English, with the same logo, terms and VAT details. Item names and terms are written once in both languages, in your templates, so nobody translates a quote under pressure. You choose the language for each client.',
  },
  {
    id: 'who-sets-quote-tracking-prices-and-limits',
    topic: 'ownership',
    question: 'Who controls the prices, discount limits and approvers?',
    answer:
      'You do: the price lists, discount limits and approvers are your settings, not ours. You decide which discount level or quote value needs approval, and who approves it. A quote over either limit stays in Draft until that person approves, edits or rejects it, and the salesperson sees the decision.',
  },
  {
    id: 'what-does-quote-tracking-record',
    topic: 'data-privacy',
    question: 'What does view tracking record about our clients?',
    answer:
      'View tracking records when a client opens the quote link, how many times, and for how long. It is there to show your team where each quote stands. Retention and access rules come with every automation project we build, so you decide who sees the tracking and how long it is kept.',
  },
  {
    id: 'will-quote-tracking-raise-our-win-rate',
    topic: 'results',
    question: 'Will automating our quotes raise our win rate?',
    answer:
      'We can’t promise a higher win rate: whether a client accepts depends on your price and your offer. What you get is visibility: the dashboard shows quote value, win rate, average time to close and lost reasons for each salesperson. You see what changes after launch, measured on your own quotes, not on someone else’s numbers.',
  },
  {
    id: 'what-if-quote-tracking-prices-change',
    topic: 'support',
    question: 'What happens when our prices or terms change?',
    answer:
      'You update the price list or the terms in one place, and new quotes use them from then on. Approval limits and reminder schedules can be adjusted as your process changes. For bigger changes, such as a new quote type or a new place quotes start from, the AI Ops Retainer covers updates and new small automations each month.',
  },
];

// The questions on the Sales Follow-Up & Nurture Sequences page (R031): 7, the core service range of
// 5–7 (engine §3); cost and timeline first (§6.2 rule 3). Each first sentence stands alone (≤ 25
// words); each answer is 40–90 words and names no other service. Sources: catalogue 1B.5, 1K.1
// (retention and access rules in every automation project), §8 (CRMs, booking tools) and §9 (consent
// and a human).
export const salesFollowUpNurtureFaq: readonly FaqQuestion[] = [
  {
    id: 'what-do-nurture-sequences-cost',
    topic: 'cost',
    question: 'How much do automated follow-up sequences cost?',
    answer:
      'The cost depends on your sequences, so we price them after a free AI audit. The drivers are how many sequences and paths you need, which channels each one uses, and where your leads come from. Writing messages in Arabic and English, and connecting your CRM and calendar, also shape the build.',
  },
  {
    id: 'how-soon-can-nurture-sequences-run',
    topic: 'timeline',
    question: 'How soon can our first sequence be running?',
    answer:
      'There is no standard timeframe: we set one after the free AI audit, when your sequences are mapped. A single WhatsApp sequence for one kind of enquiry is a smaller build than branching sequences across WhatsApp, email and SMS. You can start with one sequence and add more once you see how your leads respond.',
  },
  {
    id: 'will-nurture-sequences-annoy-leads',
    topic: 'results',
    question: 'Won’t automatic follow-ups annoy our leads?',
    answer:
      'Not if they stop at the right moment and are easy to leave. Every sequence ends as soon as the lead replies or books, so nobody is chased after answering. You set how many steps there are and how far apart they go out, and each message offers a simple way to opt out.',
  },
  {
    id: 'what-starts-and-stops-a-nurture-sequence',
    topic: 'integrations',
    question: 'What starts a sequence, and what stops it?',
    answer:
      'A sequence starts when a lead fills in a website form, reaches a stage in your CRM, or doesn’t answer a first reply. It stops when the lead replies, books or opts out, with bookings read from Cal.com, Google Calendar or Outlook. Sequences connect to HubSpot, Zoho CRM, Pipedrive, Salesforce and Odoo.',
  },
  {
    id: 'can-nurture-sequences-run-in-arabic',
    topic: 'arabic',
    question: 'Can a sequence message Arabic-speaking leads in Arabic?',
    answer:
      'Yes: each message can be written in Arabic and English, and the sequence sends the version that matches the lead. A lead who first wrote to you in Arabic keeps hearing from you in Arabic. Both versions are written for your business, not translated word for word.',
  },
  {
    id: 'how-do-nurture-sequences-handle-consent',
    topic: 'data-privacy',
    question: 'How are consent and opt-outs handled in a sequence?',
    answer:
      'Every sequence includes consent wording, and an opt-out removes the lead from every step that follows. Retention and access rules are agreed with you before launch, so you decide how long message history is kept and which of your staff can read it.',
  },
  {
    id: 'who-writes-nurture-sequence-messages',
    topic: 'ownership',
    question: 'Who writes the messages, and can we change them later?',
    answer:
      'We draft the messages with you, in your tone, and nothing goes out until you approve it. The sequences run in your own accounts, so they are yours to keep. Messages can be edited, or a sequence paused, whenever your offer changes.',
  },
];

// The questions on the CRM Setup & Automation page (R032): 6, within the core service range of 5–7
// (engine §3; the page's word count keeps it under 1,400); cost and timeline first (§6.2 rule 3).
// None repeats the pilot's "Does it work with the CRM we already use?". Each first sentence stands
// alone (≤ 25 words); each answer is 40–90 words and names no other service. Sources: catalogue
// 1B.6, 1K.1 (retention and access rules, a record of what each system uses), §8 (the CRMs; Odoo
// under both CRM and Accounting & ERP).
export const crmSetupAutomationFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-crm-setup-cost',
    topic: 'cost',
    question: 'How much does CRM setup and automation cost?',
    answer:
      'Each CRM project is priced after a free AI audit, once we know your CRM, channels and data. The main drivers are how many pipelines and channels you connect, and how much existing data needs cleaning first. Any CRM licence fees are separate from our work and stay in your company’s name.',
  },
  {
    id: 'how-long-does-crm-setup-take',
    topic: 'timeline',
    question: 'How long does it take to set up a CRM?',
    answer:
      'The timeframe depends on your data as much as the CRM, so we set it after the free AI audit. Setting up pipelines in a new CRM is a smaller job than moving years of spreadsheets, cleaning duplicates and connecting calls, email and WhatsApp. Switching over happens only after the new setup is checked with you.',
  },
  {
    id: 'which-crm-does-crm-setup-recommend',
    topic: 'integrations',
    question: 'Which CRM should we choose for our business?',
    answer:
      'The right CRM depends on how you sell and what else you run, so we recommend one after mapping your process. If you already use Odoo for accounting, its CRM keeps sales and finance in one system. If your team already knows a CRM, improving it may be the better first step. We set up and automate HubSpot, Zoho CRM, Pipedrive, Salesforce and Odoo.',
  },
  {
    id: 'who-owns-the-crm-after-crm-setup',
    topic: 'ownership',
    question: 'Who owns the CRM account and the data in it?',
    answer:
      'Your company does: the CRM account is opened in your name, and every contact, deal and note in it is yours. We work as invited users with the access you give us, and you can remove that access at any time. The automations that write to the CRM are documented, so another team could run them.',
  },
  {
    id: 'can-crm-setup-keep-arabic-records',
    topic: 'arabic',
    question: 'Can the CRM hold Arabic names and conversations?',
    answer:
      'Yes: names, notes and WhatsApp messages in Arabic are kept as written, alongside English records. A logged WhatsApp conversation stays in the language the client used, so whoever picks up the deal sees exactly what was said. Stage and task names can follow the language your team works in.',
  },
  {
    id: 'what-does-crm-setup-enrichment-add',
    topic: 'data-privacy',
    question: 'What does data enrichment add, and who controls it?',
    answer:
      'Enrichment fills gaps in your records, such as a missing company name or job title, from sources you approve. Like every automation we build, enrichment comes with retention and access rules and a record of what data each step uses. You decide which staff see which records.',
  },
];

// The questions on the Booking Automation System page (/services/booking-automation-system, R033): 7,
// the lead service range of 6–8 (engine §3); cost and timeline first (§6.2 rule 3). Each answer's
// first sentence stands alone (≤ 25 words); each answer is 40–90 words and names at most one other
// service. Sources: catalogue 0.1 (the written summary and quote), 1A.1 and 1A.2 (Arabic and
// English), 1B.6, 1C.1, 1C.2, 1K.1 (data rules in every automation project), 6.1, §8 (calendars),
// and facts §3 (the audit's meeting types: a phone call, Google Meet or an office visit).
export const bookingAutomationSystemFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-booking-automation-cost',
    topic: 'cost',
    question: 'What does a Booking Automation System cost?',
    answer:
      'We quote the Booking Automation System after a free AI audit, because the price depends on your setup. The main drivers are how many staff, rooms, vehicles or pieces of equipment the calendar covers, which channels customers book through, and whether you take deposits online. Syncing a practice-management system adds its own work. The audit ends with a written summary, next steps and a quote.',
  },
  {
    id: 'how-long-does-booking-automation-take',
    topic: 'timeline',
    question: 'How long does it take to set up online booking?',
    answer:
      'We confirm a timeframe after the free AI audit, once we know your channels and calendars. A booking page with confirmations and reminders is a smaller build than booking on WhatsApp and by phone, with deposits, a waitlist and a practice-management system to sync. The audit itself is a short phone call, a Google Meet or an office visit.',
  },
  {
    id: 'does-booking-automation-sync-with-my-calendar',
    topic: 'integrations',
    question: 'Will it sync with the calendar or clinic system we already use?',
    answer:
      'Bookings sync with Google Calendar, Outlook and practice-management systems, so your team keeps the calendar it already knows. Every booking, change and cancellation is written there automatically, and availability is read back in real time. We confirm the connection to your exact system during the free AI audit. If you also want each customer in a CRM, CRM Setup & Automation adds one.',
  },
  {
    id: 'does-booking-automation-work-in-arabic',
    topic: 'arabic',
    question: 'Can customers book in Arabic?',
    answer:
      'Yes: the booking page, confirmations and reminders can all be written in Arabic and English, and you choose which each customer receives. Booking on WhatsApp or by phone works in both languages too, because the AI agents behind them reply in Arabic and English. Whatever language a booking is made in, it lands in the same calendar for your team.',
  },
  {
    id: 'will-booking-automation-stop-no-shows',
    topic: 'results',
    question: 'Will online booking get rid of no-shows?',
    answer:
      'No booking system can stop every no-show, and we don’t promise to. Reminders by WhatsApp, SMS and email, easy self-service rescheduling and a waitlist are built to reduce no-shows and fill cancelled slots. We will share real figures only once we have measured them on live systems. For a fuller reminder series and automatic rebooking, add Appointment Reminder & No-Show Reduction.',
  },
  {
    id: 'where-does-booking-automation-keep-data',
    topic: 'data-privacy',
    question: 'Where are our customers’ booking details kept?',
    answer:
      'Booking details are kept in the calendar and systems you choose, such as Google Calendar, Outlook or your practice-management system. As in every automation project we build, the data rules are part of the job: consent wording, who can access what, how long data is kept, and a record of what each AI step uses. You decide which staff can see which bookings.',
  },
  {
    id: 'can-we-block-time-in-booking-automation',
    topic: 'support',
    question: 'Can our team block time or change hours after launch?',
    answer:
      'Yes: availability is read from your own calendar in real time, so blocking time there closes those slots to customers. Days off and holidays work the same way, with no call to us needed. For changes to the automation itself, the AI Ops Retainer covers monitoring, fixes, updates and new small automations each month.',
  },
];

// The questions on the Appointment Reminder & No-Show Reduction page
// (/services/appointment-reminders-no-show-reduction, R034): 6, the core service range of 5–7 (engine
// §3); cost and timeline first (§6.2 rule 3). Each answer's first sentence stands alone (≤ 25 words);
// each answer is 40–90 words and names at most one other service. No figure for the no-show change:
// none is measured (facts §5). Sources: catalogue 0.1 (the written summary and quote), 1A.3, 1C.1,
// 1C.2, 1K.1 (included with every automation project), §8 (calendars, messaging).
export const appointmentRemindersNoShowReductionFaq: readonly FaqQuestion[] = [
  {
    id: 'what-do-appointment-reminders-cost',
    topic: 'cost',
    question: 'How is the price of appointment reminders worked out?',
    answer:
      'We price Appointment Reminder & No-Show Reduction after a free AI audit, based on your setup. The main drivers are which calendar or practice-management system the reminders read from, which channels they use, and how rebooking should work for your services. Reminder calls by an AI voice are a separate service. You receive the quote with the written summary that follows the audit.',
  },
  {
    id: 'how-soon-can-appointment-reminders-start',
    topic: 'timeline',
    question: 'How quickly can reminders be running for our appointments?',
    answer:
      'We set a timeframe after the free AI audit, once we have seen where your appointments are kept. Reminders that read from Google Calendar or Outlook are a smaller build than ones connected to a practice-management system with rebooking follow-ups. The wording and timing of each reminder are agreed with you during the build.',
  },
  {
    id: 'how-much-do-appointment-reminders-reduce-no-shows',
    topic: 'results',
    question: 'How much will reminders reduce our no-shows?',
    answer:
      'We can’t predict your drop in no-shows in advance, and we won’t promise a figure. Reminders, one-tap rescheduling and rebooking follow-ups are built to turn silent no-shows into confirmations, new times or rebookings. The fairest measure is your own diary: compare missed appointments before and after the reminders start.',
  },
  {
    id: 'which-calendars-work-with-appointment-reminders',
    topic: 'integrations',
    question: 'Which calendars and booking systems can the reminders work with?',
    answer:
      'Reminders can read appointments from Google Calendar, Outlook, Cal.com and practice-management systems. They go out through the WhatsApp Business API, SMS or email, and each confirmation or new time is written back to the same calendar. Whether your particular system allows a connection is one of the things the free AI audit checks.',
  },
  {
    id: 'can-appointment-reminders-be-in-arabic',
    topic: 'arabic',
    question: 'Can patients get their reminders in Arabic?',
    answer:
      'Yes: every reminder can be written in Arabic, English or both, and you set the language for each customer. The one-tap confirm and reschedule options work the same way in either language. If a patient replies in Arabic with a question, the message is passed straight to your team.',
  },
  {
    id: 'what-data-do-appointment-reminders-use',
    topic: 'data-privacy',
    question: 'What customer information do the reminders use?',
    answer:
      'The reminders use only what they need: the customer’s name, phone number or email, and the appointment time. AI Compliance Setup (UAE PDPL), included with every automation project, adds consent wording, retention and access rules, and a record of the data the system uses. Customers can stop the reminders at any time.',
  },
];

// The questions on the Review & Reputation Automation page (/services/review-reputation-automation,
// R038): 7, the lead service range of 6–8 (engine §3); cost and timeline first (§6.2 rule 3). Each
// answer's first sentence stands alone (≤ 25 words); each answer is 40–90 words and names at most
// one other service. No rating or ranking promise (catalogue §9). Sources: catalogue 1D.3, 1H.2
// (Arabic and English drafts reviewed by a person), 1K.1 (data rules), §8 (CRMs, messaging).
export const reviewReputationAutomationFaq: readonly FaqQuestion[] = [
  {
    id: 'what-does-review-automation-cost',
    topic: 'cost',
    question: 'What does Review & Reputation Automation cost?',
    answer:
      'Review & Reputation Automation is priced after a free AI audit, because the cost depends on how your business runs. The drivers are what triggers each request, such as your calendar, CRM or job system, how many locations you have, and which channels the requests use. After the audit, you get the quote in writing with clear next steps.',
  },
  {
    id: 'how-soon-can-review-automation-start',
    topic: 'timeline',
    question: 'How soon can review requests start going out?',
    answer:
      'We give a timeframe after the free AI audit, once we know what should trigger each request. Sending requests from a booking calendar is a smaller build than connecting a job system, adding manager alerts and drafting replies to Google reviews. You choose the wording of each request and how soon after a service it goes out.',
  },
  {
    id: 'will-review-automation-raise-our-rating',
    topic: 'results',
    question: 'Will this raise our Google rating?',
    answer:
      'Nobody can promise a higher Google rating, because your customers write the reviews. What the system changes is the routine: requests go out after a service, complaints reach your manager quickly, and each new Google review gets a drafted reply. The monthly report lets you follow reviews, ratings and replies over time and judge the change yourself.',
  },
  {
    id: 'what-does-review-automation-connect-to',
    topic: 'integrations',
    question: 'Which review sites and business systems does it connect to?',
    answer:
      'Review & Reputation Automation drafts replies to Google reviews and takes its trigger from your calendar, CRM or job system. Requests go out through the WhatsApp Business API, SMS or email, and the CRMs we connect include HubSpot, Zoho CRM, Pipedrive, Salesforce and Odoo. If another review site matters to you, raise it in the free AI audit and we will check what it allows.',
  },
  {
    id: 'can-review-automation-reply-in-arabic',
    topic: 'arabic',
    question: 'Can the AI reply to reviews written in Arabic?',
    answer:
      'Yes: the AI drafts replies in Arabic or English, so each reply can match the language of the review. Your manager reads every draft before it is posted and can adjust the tone. Review requests themselves can go out in Arabic, English or both, set for each customer.',
  },
  {
    id: 'what-data-does-review-automation-use',
    topic: 'data-privacy',
    question: 'What customer data does review automation use?',
    answer:
      'Review requests use the contact details your calendar, CRM or job system already holds, plus the date of the service. Every project we build also carries our data rules: consent wording, limits on who sees what and for how long, and a log of what each AI step does. Because your manager approves every reply, a person checks for private details before anything goes public.',
  },
  {
    id: 'what-does-review-automation-do-with-complaints',
    topic: 'support',
    question: 'What happens when a customer replies that they are unhappy?',
    answer:
      'An unhappy reply triggers an alert to your manager straight away, with the customer’s message, so they can call and put things right. Draft replies to public reviews still wait for approval, so nothing goes out in a hurry or in anger.',
  },
];
