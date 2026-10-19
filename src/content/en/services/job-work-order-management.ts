// The service page's copy: Job & Work-Order Management Automation (catalogue 1E.1, registry R040, a
// core service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2;
// engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1E.1's list and "Best for" line; bundle 5.2, the Quote-to-Cash
// System, which includes it; 7.5's fit for technical services and facility management, "Job &
// Work-Order Management"; §8 platforms; §9 naming rules and consent; 0.1, the audit's written summary
// and quote; 1K.1, data rules in every automation project; 1B.3, 1E.2, 1F.1, 1D.3 and 6.1 for the
// pairs, the flow's review request and the support answer), the blueprint (demo 3, the workflow
// explorer), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, results, arrival or response times, or any
// measured figure (10 §3; facts §3, §5); named field-service, mapping or calendar tools (the catalogue
// names none for 1E.1), and a field-staff app ("captured on mobile" stays device-neutral; Mobile Apps,
// 3.5, is its own service); any civil-defence, municipality or safety rule for site work (no citation
// row is APPROVED). The UAE section states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (jobWorkOrderManagementFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const jobWorkOrderManagement: ServicePageContent = {
  catalogueNumber: '1E.1',
  // 38 characters (the exact catalogue name); rendered with " | Deepzeta AI", 52 (08 §1: 50–60)
  title: 'Job & Work-Order Management Automation',
  // 155 characters: the key point in the first 120 (ends at 107), one concrete fact (technician
  // assignment), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Job & Work-Order Management Automation creates jobs from accepted quotes, calls and WhatsApp, then assigns technicians. Book a free AI audit.`,
  // 38 characters: catalogue 1E.1's assignment, status updates and job completion; short enough to
  // clear the European banner at 360 × 640 under the long breadcrumb
  heading: 'Every job assigned, tracked and closed',
  // 58 words: what it is, the outcome, who it's for (1E.1's "Best for" line)
  answer: `Job & Work-Order Management Automation by ${siteConfig.brandName} turns each accepted quote, call or WhatsApp request into a job and assigns a technician by skill, area and availability. Customers get status updates, and a finished job triggers the invoice and a review request. It is for UAE technical services, facility management, maintenance, AC, cleaning and pest control companies.`,

  // The hero photo, P27 (src/lib/media/photos.ts; the media plan): 115 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'A technician’s gloved hands holding a tablet checklist beside an AC unit on a Dubai villa rooftop, a toolbox nearby',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1E.1's five capabilities). Lede: 37
  // words
  problem: {
    heading: 'Where field jobs lose time',
    lede: 'Field jobs pass through many hands: the call, the coordinator, the technician, the office that bills it. Each handover depends on someone typing, phoning or remembering. Here is what changes when the job moves on its own.',
    rows: [
      {
        before: 'Each job is typed up by hand from a phone call, a WhatsApp message or a signed quote.',
        after: 'Jobs are created automatically from accepted quotes, calls and WhatsApp requests.',
      },
      {
        before: 'A coordinator rings round to find out which technician is free and nearby.',
        after: 'Each job is assigned to a technician by skill, area and availability.',
      },
      {
        before: 'Customers call the office to ask when the technician will arrive.',
        after: 'Customers get status updates, such as “technician on the way”, without calling.',
      },
      {
        before: 'Job sheets come back on paper, and photos sit on technicians’ phones.',
        after: 'Photos, checklists and the customer’s signature are captured on mobile, on the job itself.',
      },
      {
        before: 'A finished job waits for someone to raise the invoice and ask for a review.',
        after: 'Completing the job triggers the invoice and a review request automatically.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1E.1's list as one example flow, labelled "Example"; an
  // AC repair visit (1E.1's "Best for": AC; the review request is 1D.3's, triggered by 1E.1's job
  // completion). The lede (44 words) gives the path every job follows. Each title ≤ 5 words, each
  // text ≤ 20 words (types.ts)
  how: {
    heading: 'How a job moves from request to invoice',
    lede: 'Job & Work-Order Management Automation connects where requests arrive, your technicians’ schedules and your invoicing. Every job follows the same path, from creation to sign-off. Here is one example flow for an AC service company; yours follows your own job types, checklists and areas.',
    steps: [
      {
        title: 'A WhatsApp request arrives',
        text: 'A villa owner messages your business on WhatsApp: the AC isn’t cooling and needs a visit.',
      },
      {
        title: 'The job is created',
        text: 'A job is created automatically, with the customer’s details, area and the problem they described.',
      },
      {
        title: 'A technician is assigned',
        text: 'The job goes to a technician with the right skills, working in that area and free that day.',
      },
      {
        title: 'The customer is updated',
        text: 'The customer gets a WhatsApp update when the technician is on the way.',
      },
      {
        title: 'Work captured on mobile',
        text: 'The technician ticks off the checklist, photographs the work and collects the customer’s signature on mobile.',
      },
      {
        title: 'Invoice and review request',
        text: 'Marking the job complete triggers the invoice and a review request to the customer.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (6; each from catalogue 1E.1's list, or §9 for the consent and human line)
  deliverables: {
    heading: 'What the automation includes',
    items: [
      'Jobs created automatically from accepted quotes, phone calls and WhatsApp requests',
      'Assignment to technicians by skill, area and availability',
      'Job status updates to the customer, such as “technician on the way”',
      'Photos, checklists and customer signatures captured on mobile',
      'A completed job that triggers the invoice and a review request',
      'Consent wording in every customer message, and a person on your team one reply away',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1E.1 and §8 name (messaging, voice's cloud
  // telephony for calls, accounting and ERP for the invoice, automation). Lede: 46 words
  worksWith: {
    heading: 'Works with your channels and accounting',
    lede: 'Requests come in by phone through cloud telephony, through the WhatsApp Business API, or as accepted quotes. Customer updates go out on WhatsApp, SMS or email, and a completed job can trigger an invoice in your accounting system. The automation runs on n8n, Make or Zapier.',
    platforms: [
      'WhatsApp Business API',
      'SMS',
      'email',
      'cloud telephony',
      'Zoho Books',
      'QuickBooks',
      'Xero',
      'Odoo',
      'SAP Business One',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 1E.1's "Best for" line, 7.5 (Technical Services & Facility
  // Management: "Job & Work-Order Management" and the Quote-to-Cash System, bundle 5.2, which includes
  // 1E.1), and a decision aid. Lede: 40 words
  fit: {
    heading: 'Is job automation right for you?',
    lede: 'Job & Work-Order Management Automation suits any business that sends people out to do jobs at customers’ sites. It is a best-fit automation for technical services and facility management, and part of the Quote-to-Cash System. These questions help you decide.',
    goodFit: [
      'Technical services and maintenance companies with technicians on site every day',
      'Facility management firms handling work orders across several buildings',
      'AC, cleaning and pest control companies sending teams to homes and offices',
    ],
    decisionAid: [
      {
        question: 'Do jobs start from phone calls and WhatsApp messages?',
        answer: 'Then each request can become a job automatically, with nobody retyping the details.',
      },
      {
        question: 'Does someone spend the day deciding who goes where?',
        answer: 'Then assignment by skill, area and availability gives each job to a suitable technician.',
      },
      {
        question: 'Do invoices wait until the paperwork comes back from site?',
        answer: 'Then marking a job complete triggers the invoice, so billing no longer waits for paper.',
      },
      {
        question: 'Do you run only a few jobs a week, all handled by one person?',
        answer: 'Then a shared calendar may do for now, and the free AI audit will show where automation helps first.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3: pick an industry and watch an
  // automation run step by step, starting from an incoming message; P7 builds it, so nothing here says
  // it works today, and nothing promises it will show a job or a technician)
  tryIt: {
    heading: 'Follow an automation one step at a time',
    line: 'The workflow explorer will let you pick an industry and follow an automation as it runs, from the first message onwards. It is still being built and arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1E.1: WhatsApp requests, status updates, the
  // assignment by area; catalogue §9: consent wording and a way to reach a human; 1K.1: retention and
  // access rules). No civil-defence, municipality or platform rules until their citation rows are
  // APPROVED.
  uae: {
    heading: 'Built for UAE field teams',
    points: [
      'WhatsApp first: customers send requests and receive job updates on the channel they already use, with SMS and email as back-ups.',
      'Arabic and English: customer updates can go out in either language, set for each customer.',
      'Your own areas: you define the areas each technician covers, and assignment follows them.',
      'Consent wording in every customer message, and a customer who replies reaches a person on your team.',
      'Data rules from day one: who can see job photos, signatures and customer details, and how long they are kept, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: the Quote-to-Cash System's other components that feed or follow a job
  // (bundle 5.2: 1B.3 upstream, 1F.1 downstream; the bundle is named in prose on 1B.3's line, since
  // the type takes service numbers only), and Maintenance Contract & Preventive Maintenance
  // Scheduling (1E.2; 7.5 pairs "AMC Scheduling" with 1E.1 for technical services and facility
  // management). The review request (1D.3) appears in the flow instead.
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.3',
        line: 'Builds, sends and tracks each quote; once the client accepts, the job is created here. Both are part of the Quote-to-Cash System.',
      },
      {
        catalogueNumber: '1E.2',
        line: 'Schedules the visits in each annual maintenance contract automatically, with reminders to the client and your team, and renewal alerts.',
      },
      {
        catalogueNumber: '1F.1',
        line: 'Creates the invoice when a job is completed, then sends payment links and automatic reminders by WhatsApp and email.',
      },
    ],
  },

  faq: {
    heading: 'Questions about job automation',
    lede: 'What field service owners ask first: cost, timing, quotes and invoices, Arabic and data.',
  },
};
