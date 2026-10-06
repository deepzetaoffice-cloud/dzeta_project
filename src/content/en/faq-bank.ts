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
