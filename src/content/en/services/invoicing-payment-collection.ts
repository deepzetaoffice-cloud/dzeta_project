// The service page's copy: Invoicing & Payment Collection Automation (catalogue 1F.1, registry R044, a
// core service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2;
// engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1F.1's list; bundle 5.2, the Quote-to-Cash System, which includes
// it, and its "Best for" line; 7.5's fit for technical services and facility management, the
// Quote-to-Cash System; 1E.1, "Job completion triggers invoice", and 1B.3, accepted quotes becoming
// invoices, for the flow and the pairs; 1A.1, payment links on WhatsApp; 1F.2's name and its own
// bullets only, for one pair and one answer: a readiness review of invoicing data and systems, an
// integration with an accredited provider, "deepzeta is not itself an ASP"; §8 platforms, Accounting &
// ERP, messaging and automation; §9 naming rules, consent and a way to reach a human; 0.1, the audit's
// written summary and quote; 1K.1, retention and access rules and a record of what each system uses),
// docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, days-to-pay or collection figures (10 §3;
// facts §3, §5; the reminder schedule reads "the schedule you set", since no number is allowlisted);
// payment gateways by name (the catalogue names none); the UAE VAT rate, what an invoice must show,
// late-payment rules and every e-invoicing rule, phase or date (external facts: no citation row is
// APPROVED, and 1F.2's dates wait for theirs); card-data handling claims (no source). The UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1). No demo matches an invoice flow, so
// `tryIt` is left out.
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (invoicingPaymentCollectionFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const invoicingPaymentCollection: ServicePageContent = {
  catalogueNumber: '1F.1',
  // 41 characters, the exact catalogue name; rendered with " | Deepzeta AI", 55 (08 §1: 50–60)
  title: 'Invoicing & Payment Collection Automation',
  // 157 characters: the key point (jobs and orders into invoices) in the first 120 (ends at 92), one
  // concrete fact (WhatsApp and email), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Invoicing & Payment Collection Automation turns jobs and orders into invoices, then chases payment on WhatsApp and email. Book a free AI audit.`,
  // 38 characters: catalogue 1F.1's sending, reminders and payment matching, in the pattern of its
  // 31 characters: catalogue 1F.1's name as the outcome; two lines at 360 px, so it clears the European
  // banner at 360 × 640 under the long breadcrumb
  heading: 'Send invoices, collect payments',
  // 57 words: what it is, the outcome, who it's for (bundle 5.2's "Best for" line)
  answer: `Invoicing & Payment Collection Automation by ${siteConfig.brandName} creates invoices automatically from jobs, orders or accepted quotes, and sends payment links by WhatsApp and email. Reminders go out on a schedule until the invoice is paid, payments are matched in your ledger, and managers get an overdue report. It is for UAE service companies, contractors and suppliers.`,

  // The hero photo, P31 (src/lib/media/photos.ts; the media plan): 119 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'Hands holding a phone showing a payment-received tick beside a stack of invoices, in an office overlooking Dubai Marina',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1F.1's five capabilities). Lede: 35
  // words
  problem: {
    heading: 'Where payments slow down',
    lede: 'Work is finished, but the invoice waits until someone types it up. Then it is sent once, and chasing it depends on who has time. Here is what changes when invoicing and collection run themselves.',
    rows: [
      {
        before: 'An invoice is typed up by hand, days after the job is done.',
        after: 'Invoices are created automatically from completed jobs, orders and accepted quotes.',
      },
      {
        before: 'The client receives an invoice by email, with no quick way to pay.',
        after: 'Each invoice goes out with a payment link, by WhatsApp and email.',
      },
      {
        before: 'Reminders depend on someone noticing that an invoice is late.',
        after: 'Payment reminders go out automatically, on the schedule you set.',
      },
      {
        before: 'Someone checks payments and marks invoices as paid by hand.',
        after: 'Each payment is matched to its invoice, and your ledger is updated.',
      },
      {
        before: 'Nobody can see at a glance who owes what, or for how long.',
        after: 'An overdue report shows management every unpaid invoice and how late it is.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1F.1's list as one example flow, labelled "Example"; a
  // cleaning company (1E.1's "Best for": cleaning; 1E.1's completed job triggers the invoice). Lede:
  // 54 words. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How an invoice moves from job to payment',
    lede: 'Invoicing & Payment Collection Automation connects where your work is recorded, your accounting system and the channels your clients use. The invoice is created where your accounts already live, and every reminder and payment is tracked against it. Here is one example flow for a cleaning company; yours follows your own terms and schedule.',
    steps: [
      {
        title: 'The job is finished',
        text: 'Your team completes a villa deep clean and marks the job done in your job system.',
      },
      {
        title: 'The invoice is created',
        text: 'An invoice is created in your accounting system from the job’s details, with your numbering and terms.',
      },
      {
        title: 'A payment link goes out',
        text: 'The client receives the invoice by WhatsApp and email, with a link to pay online.',
      },
      {
        title: 'The reminder schedule runs',
        text: 'The invoice is still unpaid near its due date, so a polite reminder goes out on your schedule.',
      },
      {
        title: 'Paid and matched',
        text: 'The client pays through the link, the payment is matched to the invoice and your ledger updates.',
      },
      {
        title: 'The overdue report',
        text: 'Any invoice still unpaid after the reminders appears in the overdue report for management.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1F.1's list, §8 for the accounting systems, §9 for
  // consent and a person to reach)
  deliverables: {
    heading: 'What the automation includes',
    items: [
      'Invoices created automatically from completed jobs, orders or accepted quotes',
      'Invoices issued in your accounting system, with your numbering, layout and terms',
      'Payment links sent by WhatsApp and email',
      'Automatic payment reminders on a schedule you set',
      'Payment matching, with each payment recorded against its invoice and the ledger updated',
      'An overdue report for management: who owes what, and for how long',
      'Consent wording in every message, with replies reaching your accounts team',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 lists (Accounting & ERP, Messaging,
  // Automation). Lede: 45 words
  worksWith: {
    heading: 'Works with your accounting system',
    lede: 'Invoices are created in Zoho Books, QuickBooks, Xero, Odoo or SAP Business One, from jobs and orders in your job system or CRM. Payment links and reminders go out through the WhatsApp Business API and email, and the automation runs on n8n, Make or Zapier.',
    platforms: [
      'Zoho Books',
      'QuickBooks',
      'Xero',
      'Odoo',
      'SAP Business One',
      'WhatsApp Business API',
      'email',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Bundle 5.2's "Best for" (technical services, facility management, fit-out,
  // construction, maintenance) and 7.5 (Technical Services & Facility Management: the Quote-to-Cash
  // System, which includes 1F.1), 1B.3's B2B suppliers, and a decision aid. Lede: 44 words
  fit: {
    heading: 'Is invoicing automation right for you?',
    lede: 'Invoicing & Payment Collection Automation suits businesses that invoice after each job or order and spend time chasing payment. It is part of the Quote-to-Cash System, a best fit for technical services, facility management, fit-out, construction and maintenance companies. These questions help you decide.',
    goodFit: [
      'Technical services and maintenance companies that invoice every completed job',
      'Facility management firms that bill many clients and sites',
      'Fit-out and construction companies invoicing from accepted quotes',
      'Suppliers that invoice each order and wait on payment terms',
    ],
    decisionAid: [
      {
        question: 'Do invoices go out days after the work is done?',
        answer: 'Then invoices created from each completed job or order go out as soon as the work is recorded.',
      },
      {
        question: 'Does someone spend hours each week chasing payments?',
        answer:
          'Then scheduled reminders with a payment link do the routine chasing, and the overdue report shows who to call.',
      },
      {
        question: 'Do you match payments to invoices by hand?',
        answer: 'Then payment matching records each payment against its invoice and updates your ledger.',
      },
      {
        question: 'Do you send only a few invoices each month?',
        answer: 'Then doing it by hand may still be quicker. The free AI audit shows which automations pay back first.',
      },
    ],
  },

  // 7 · Try it: left out. None of the blueprint's demos shows an invoice or a payment, so the hero
  // shows the audit CTA alone (types.ts)

  // 8 · UAE specifics: Deepzeta AI's own practice only (1F.1 and 1A.1: payment links by WhatsApp and
  // email; §8 and 1A.1: Arabic and English; catalogue §9: consent wording and a way to reach a
  // human). No VAT rate, invoicing laws or e-invoicing rules until their citation rows are APPROVED.
  uae: {
    heading: 'Collection built for UAE clients',
    points: [
      'WhatsApp and email: each invoice and reminder can go out on both, or on the one each client prefers.',
      'Arabic and English: reminders can be written in either language, set for each client.',
      'Your terms, your tone: you set the reminder schedule and wording, so long-standing clients aren’t chased like strangers.',
      'Consent wording in every message, and any reply reaches a person in your accounts team.',
    ],
  },

  // 9 · Pairs well with: the Quote-to-Cash System's other components that feed the invoice (bundle
  // 5.2: 1B.3 and 1E.1; the bundle is named in prose on 1B.3's line, since the type takes service
  // numbers only) and UAE E-Invoicing Readiness & Integration (1F.2, its line from 1F.2's own bullets,
  // with no rule or date)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.3',
        line: 'Builds, sends and tracks the quote, and an accepted quote can become the invoice. Both are part of the Quote-to-Cash System.',
      },
      {
        catalogueNumber: '1E.1',
        line: 'Runs each job from request to completion, and a completed job triggers the invoice automatically.',
      },
      {
        catalogueNumber: '1F.2',
        line: 'Reviews your invoicing data and systems for e-invoicing, and connects your accounting or ERP system to an accredited provider.',
      },
    ],
  },

  faq: {
    heading: 'Questions about invoicing and collection',
    lede: 'What finance teams ask before automating invoices: cost, timing, accounting systems, e-invoicing and Arabic.',
  },
};
