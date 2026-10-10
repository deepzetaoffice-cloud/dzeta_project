// The service page's copy: Automated Quotation & Quote Tracking System (catalogue 1B.3, registry R029,
// a lead service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 1;
// engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.3's list and "Best for" line; bundle 5.2, the Quote-to-Cash
// System; 7.5's fits for construction and interior fit-out, logistics and freight, and technical
// services and facility management; §8 platforms; §9 naming rules; 0.1, the audit's written summary
// and quote; 1K.1, data rules in every automation project; 1E.1, 1F.1, 1B.4 and 6.1 for the pairs
// and the support answer), the blueprint (demo 3, the workflow explorer), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, results, win rates or any measured figure
// (10 §3; facts §3, §5); the UAE VAT rate and any e-invoicing rule (no citation row is APPROVED, and
// 1F.2's dates are external facts); e-signature and payment vendors (the catalogue names none). The
// UAE section states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (automatedQuotationTrackingFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const automatedQuotationTracking: ServicePageContent = {
  catalogueNumber: '1B.3',
  // 43 characters (the exact catalogue name); rendered with " | Deepzeta AI", 57 (08 §1: 50–60)
  title: 'Automated Quotation & Quote Tracking System',
  // 156 characters: the key point in the first 120 (ends at 110), one concrete fact (open tracking),
  // ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Automated Quotation & Quote Tracking System builds branded quotes, tracks when clients open them and follows up for you. Book a free AI audit.`,
  // 36 characters, catalogue 1B.3's quote, follow-up and tracking; short enough to clear the
  // European banner at 360 × 640 under the long breadcrumb
  heading: 'Every quote sent, chased and tracked',
  // 60 words: what it is, the outcome, who it's for (1B.3's "Best for" line)
  answer: `The Automated Quotation & Quote Tracking System by ${siteConfig.brandName} turns an enquiry into a branded quote, sends it by email or WhatsApp and shows you when the client opens it. Reminders follow up until the quote is accepted, rejected or expires. It is for UAE businesses in technical services, fit-out, construction and maintenance, and for B2B suppliers and agencies.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1B.3's list). Lede: 40 words
  problem: {
    heading: 'Where quotes stall',
    lede: 'A quote takes time to build, waits for a manager’s sign-off, then disappears into an inbox. Nobody knows if the client read it, and follow-ups depend on memory. Each row shows one step that stops depending on someone’s free time.',
    rows: [
      {
        before: 'Each quote is typed up by hand from a price list or an old quote.',
        after: 'Quotes are built from a form, WhatsApp chat, email or CRM deal, using your price lists and rules.',
      },
      {
        before: 'Discounts go out before anyone senior has seen them.',
        after: 'Discounts and amounts above your limit wait for a manager’s approval.',
      },
      {
        before: 'Once a quote is sent, you can’t tell whether the client opened it.',
        after: 'You see when the client opens the quote, how many times and for how long.',
      },
      {
        before: 'Follow-ups happen when someone remembers, or not at all.',
        after: 'Reminders go out on a schedule you set until the client decides or the quote expires.',
      },
      {
        before: 'An accepted quote is retyped as a job, an order or an invoice.',
        after: 'An accepted quote becomes a job, project, order or invoice automatically.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.3's list as one example flow, labelled "Example".
  // The lede (55 words) names the status pipeline exactly as the catalogue does. Each title ≤ 5
  // words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a quote moves through the system',
    lede: 'The Automated Quotation & Quote Tracking System links where enquiries arrive, your price lists and the way your managers approve. Every quote moves through one status pipeline: Draft, Sent, Viewed, then Accepted, Rejected or Expired. Here is one example flow for an interior fit-out company; yours follows your own price lists, documents and approval limits.',
    steps: [
      {
        title: 'A quote request arrives',
        text: 'A client asks for an office fit-out quote through your website form or a WhatsApp chat.',
      },
      {
        title: 'The draft is built',
        text: 'Your price lists and rules fill in the items, terms and VAT, under your logo, in English or Arabic.',
      },
      {
        title: 'A manager approves',
        text: 'The quote carries a discount, so it waits in Draft until a manager approves it.',
      },
      {
        title: 'Sent with a secure link',
        text: 'The client receives the quote by email and WhatsApp, with a secure link to view it online.',
      },
      {
        title: 'You see it opened',
        text: 'The status moves to Viewed, and you see how many times the client opened it, and for how long.',
      },
      {
        title: 'Reminders follow up',
        text: 'While the client hasn’t decided, reminders go out on the schedule you set.',
      },
      {
        title: 'Signed, then a project',
        text: 'The client signs online, pays a deposit if you ask for one, and the quote becomes a project automatically.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (8, the maximum; each from catalogue 1B.3's list, each ≤ 20 words)
  deliverables: {
    heading: 'What the system includes',
    items: [
      'Quotes created from a form, a WhatsApp chat, an email or a CRM deal, using your price lists and rules',
      'Branded PDF or online quotes in English and Arabic, with your logo, terms and VAT',
      'Manager approval for discounts, or for amounts above a limit you set',
      'Sending by email and WhatsApp, each quote behind a secure link',
      'View tracking: when the client opens a quote, how many times and for how long',
      'A status pipeline from Draft to Sent, Viewed, Accepted, Rejected or Expired, with scheduled follow-up reminders',
      'Online acceptance or e-signature, with an optional deposit payment, and accepted quotes turned into jobs, projects, orders or invoices',
      'A dashboard of quote value, win rate, average time to close and lost reasons, per salesperson',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.3 and §8 name (messaging, CRM, accounting
  // and ERP for the accepted quote's invoice, automation). Lede: 50 words
  worksWith: {
    heading: 'Works with your sales and finance tools',
    lede: 'Quote requests come in through website forms, WhatsApp and email, or start from a deal in your CRM. Quotes go out by email and through the WhatsApp Business API, and an accepted quote can become an invoice in your accounting system. The automation runs on n8n, Make or Zapier.',
    platforms: [
      'WhatsApp Business API',
      'email',
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'Zoho Books',
      'QuickBooks',
      'Xero',
      'SAP Business One',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 1B.3's "Best for" line, 7.5's fits (Construction & Interior
  // Fit-Out and Logistics & Freight: Automated Quotation; Technical Services & Facility Management:
  // the Quote-to-Cash System, bundle 5.2, which includes 1B.3), and a decision aid. Lede: 54 words
  fit: {
    heading: 'Is it right for your business?',
    lede: 'The Automated Quotation & Quote Tracking System suits any business that wins work by quoting, where each price is built job by job. It is a best-fit automation for construction and interior fit-out, and for logistics and freight. Technical services and facility management are a best fit for the Quote-to-Cash System, which includes it.',
    goodFit: [
      'Technical services and maintenance companies that price every job before they start',
      'Construction and interior fit-out firms sending detailed quotes with many line items',
      'B2B suppliers that quote from price lists, with discounts that need approval',
      'Agencies that quote each client’s project separately',
      'Logistics and freight companies quoting shipments on request',
    ],
    decisionAid: [
      {
        question: 'Do you lose track of quotes once they are sent?',
        answer: 'Then view tracking and the status pipeline show where every quote stands, without asking anyone.',
      },
      {
        question: 'Do discounts or large quotes need a manager’s sign-off?',
        answer: 'Then approval rules hold those quotes in Draft until the right person approves them.',
      },
      {
        question: 'Does someone retype accepted quotes as jobs or invoices?',
        answer: 'Then each accepted quote can become a job, order or invoice automatically, with no copying.',
      },
      {
        question: 'Do you send only a few quotes, each written from scratch?',
        answer: 'Then a good template may be enough for now. The free AI audit ranks which automations pay back first.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3; P7 builds it, so nothing here says it
  // works today, and nothing promises it will show a quote flow)
  tryIt: {
    heading: 'Watch a workflow, step by step',
    line: 'The workflow explorer will let you pick an industry and watch an automation run, one step at a time. It is still being built and arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1B.3: Arabic and English quotes with VAT,
  // sent by email and WhatsApp; catalogue §9: consent wording and a way to reach a human; 1K.1:
  // retention and access rules). No VAT rate, laws or platform rules until their citation rows are
  // APPROVED.
  uae: {
    heading: 'Quotes built for UAE clients',
    points: [
      'Arabic and English: every quote can go out in either language, with the same logo, terms and VAT details.',
      'WhatsApp alongside email: the quote link reaches the client on the channel they already use with your team.',
      'Consent wording in every reminder, and a client who asks to stop the reminders is taken off them.',
      'Replies go to a person: when a client answers a reminder, it reaches the salesperson who owns the quote.',
      'Data rules from day one: retention and access rules for quotes and view tracking, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: the Quote-to-Cash System's other components (bundle 5.2: 1E.1 and 1F.1; the
  // bundle is named in prose on 1E.1's line, since the type takes service numbers only) and Proposal
  // Automation (1B.4; 7.5 pairs it with Automated Quotation for construction and fit-out)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1E.1',
        line: 'Turns each accepted quote into a job and assigns a technician by skill, area and availability. Both are part of the Quote-to-Cash System.',
      },
      {
        catalogueNumber: '1F.1',
        line: 'Creates the invoice from the accepted quote or finished job, then sends payment links and reminders by WhatsApp and email.',
      },
      {
        catalogueNumber: '1B.4',
        line: 'Builds tailored proposals from templates and CRM data when a bid needs more than a priced quote, with AI-drafted sections for staff to review.',
      },
    ],
  },

  faq: {
    heading: 'Questions about automated quotes',
    lede: 'What owners ask before automating their quotes: price, timing, Arabic, approvals and tracking.',
  },
};
