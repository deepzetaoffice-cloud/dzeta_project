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
