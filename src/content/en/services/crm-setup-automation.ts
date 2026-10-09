// The service page's copy: CRM Setup & Automation (catalogue 1B.6, registry R032, a core service), from
// the pilot template (the service pages' standing plan, 2026-10-08, batch 1; engine §3.1, the
// service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.6's list; bundle 5.1, the AI Front Desk, which includes it;
// 7.5's fits for real estate and for recruitment and staffing, "CRM Automation"; §8 platforms, where
// Odoo is listed under both CRM and Accounting & ERP; §9 naming rules and consent; 1K.1, retention
// and access rules and a record of what each system uses; 1H.1, opt-out management; 1B.1, 1B.2 and
// 1J.1 for the pairs), the blueprint (demo 3, the workflow explorer: "lead arrives → AI replies →
// CRM updated → appointment booked"), docs/facts/company-facts.md.
// Left out, with no source: prices, licence costs, timeframes, clients, adoption or revenue figures
// (10 §3; facts §3, §5); any comparison of the CRM vendors' features or prices (vendor facts need
// APPROVED citation rows); named enrichment data providers (the catalogue names none); any law on
// personal data (no citation row is APPROVED). The UAE section states only Deepzeta AI's own
// practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are at the end of this file,
// for the integrator to move into faq-bank.ts.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const crmSetupAutomation: ServicePageContent = {
  catalogueNumber: '1B.6',
  // 42 characters (the exact catalogue name, 22, plus the audience); rendered with " | Deepzeta AI",
  // 56 (08 §1: 50–60)
  title: 'CRM Setup & Automation for UAE Sales Teams',
  // 155 characters: the key point in the first 120, one concrete fact (the five CRMs 1B.6 names),
  // ends with the action (08 §1)
  description: `${siteConfig.brandName} sets up your CRM in HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo, and fills it from forms, calls, email and WhatsApp. Book a free AI audit.`,
  // 54 characters: 1B.6's "Automatic data entry from forms, calls, email and WhatsApp" as the outcome
  heading: 'A CRM that fills itself from calls, email and WhatsApp',
  // 58 words: what it is, the outcome, who it's for
  answer: `CRM Setup & Automation by ${siteConfig.brandName} sets up HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo around how you sell, with pipelines, stages, tasks and reminders. Leads from forms, calls, email and WhatsApp are entered automatically, duplicates are cleaned up, and dashboards show the pipeline. It is for UAE sales teams who keep leads in spreadsheets and inboxes.`,

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1B.6's five capabilities). Lede: 38
  // words
  problem: {
    heading: 'Where sales data goes missing',
    lede: 'Leads arrive by form, call, email and WhatsApp, and each one has to be typed in by someone. When that slips, the pipeline stops matching reality. This is what changes once the CRM is set up and automated.',
    rows: [
      {
        before: 'Leads are scattered across spreadsheets, inboxes and personal phones.',
        after: 'Every deal sits in one pipeline, with stages that match how you sell.',
      },
      {
        before: 'Someone types each new enquiry into the system, when they find time.',
        after: 'Leads from forms, calls, email and WhatsApp are entered automatically.',
      },
      {
        before: 'Next steps live in people’s heads, so some are missed.',
        after: 'Tasks and reminders tell each salesperson what to do next, and when.',
      },
      {
        before: 'The same client appears more than once, with different details.',
        after: 'Duplicates are cleaned up and records enriched, so each client has one complete record.',
      },
      {
        before: 'Pipeline reports are built by hand in a spreadsheet.',
        after: 'Sales dashboards show the pipeline without anyone building a report.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.6's list as one example flow, labelled "Example"
  // (7.5: CRM automation fits real estate). The lede (49 words) gives the order of the work: the
  // sales process first, then the pipeline, then the lead sources. Each title ≤ 5 words, each text
  // ≤ 20 words (types.ts)
  how: {
    heading: 'How your CRM is set up and automated',
    lede: 'CRM Setup & Automation starts with your sales process, not the software. We map how a lead becomes a client, build that as pipelines and stages, then connect the places leads come from. Here is one example for a real estate agency; your stages and lead sources will differ.',
    steps: [
      {
        title: 'Your pipeline is mapped',
        text: 'Stages such as New enquiry, Viewing booked, Offer made and Closed are set up in your chosen CRM.',
      },
      {
        title: 'A WhatsApp enquiry arrives',
        text: 'A buyer asks about a villa on WhatsApp, and a contact and a deal are created automatically.',
      },
      {
        title: 'A duplicate is caught',
        text: 'The buyer called last month, so the enquiry joins their existing record instead of creating a copy.',
      },
      {
        title: 'The agent gets a task',
        text: 'The agent assigned to the buyer gets a call-back task, with a reminder if it isn’t done.',
      },
      {
        title: 'The deal moves stage',
        text: 'Once a viewing is booked, the deal moves to Viewing booked and the next task appears.',
      },
      {
        title: 'The manager sees the pipeline',
        text: 'A sales dashboard shows deals by stage and by agent, without anyone building a report.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (6; each from catalogue 1B.6's list)
  deliverables: {
    heading: 'What the setup includes',
    items: [
      'CRM setup in HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo',
      'Pipelines and stages that match how your team sells',
      'Tasks and reminders, so each next step has an owner and a due date',
      'Automatic data entry from forms, calls, email and WhatsApp',
      'Duplicate cleanup and data enrichment for the records you already have',
      'Sales dashboards that show the pipeline by stage and by salesperson',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.6 and §8 name (CRM, messaging, voice's
  // cloud telephony for calls, automation). Lede: 50 words
  worksWith: {
    heading: 'Works with the CRM you choose',
    lede: 'We set up and automate HubSpot, Zoho CRM, Pipedrive, Salesforce and Odoo. Data comes in from website forms, phone calls through cloud telephony, email and the WhatsApp Business API, connected on n8n, Make or Zapier. If you already use one of these CRMs, the work starts from your existing records.',
    platforms: [
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'WhatsApp Business API',
      'email',
      'cloud telephony',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5 (Real Estate and Recruitment & Staffing: "CRM
  // Automation"), bundle 5.1 (the AI Front Desk includes 1B.6), and a decision aid. Lede: 45 words
  fit: {
    heading: 'Is CRM Setup & Automation right for you?',
    lede: 'CRM Setup & Automation suits any team that sells through more than one person or channel. It is a best-fit automation for real estate and for recruitment and staffing, and part of the AI Front Desk solution. These questions help you decide where to start.',
    goodFit: [
      'Real estate agencies tracking buyers, viewings and offers across several agents',
      'Recruitment and staffing firms keeping candidates and clients in one place',
      'Teams whose leads live in spreadsheets, inboxes and personal phones',
    ],
    decisionAid: [
      {
        question: 'Do you already pay for a CRM that nobody updates?',
        answer:
          'Then the work starts from your records: stages rebuilt around your process, duplicates cleaned up, entry automated.',
      },
      {
        question: 'Do leads reach you by phone and WhatsApp as well as forms?',
        answer: 'Then automatic data entry from each channel keeps one record per client, with nobody retyping.',
      },
      {
        question: 'Does more than one person work the same deals?',
        answer: 'Then pipelines, tasks and access by role show who owns each deal and what happens next.',
      },
      {
        question: 'Is your team small, with a few leads you know by name?',
        answer: 'Then a simple pipeline may be all you need for now, and the free AI audit will say so.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3 shows the CRM updating; P7 builds it,
  // so nothing here says it works today)
  tryIt: {
    heading: 'See a CRM record update itself',
    line: 'The workflow explorer will show a lead arriving, an AI reply going out and the CRM record updating, one step at a time. It is still in development and goes live in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1B.6: WhatsApp into the CRM; 1K.1: access
  // rules and a record of what each system uses; catalogue §9 and 1H.1: consent and opt-out). No
  // laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Set up for UAE sales teams',
    points: [
      'Arabic and English records: names, notes and WhatsApp messages are kept as written, next to English ones.',
      'Access by role: you decide which staff can see which contacts, deals and conversations.',
      'Consent kept on the contact: any automation that messages a client checks their consent and opt-out status first.',
      'A record of each automation: what it writes to the CRM and which data it uses.',
    ],
  },

  // 9 · Pairs well with: the Speed-to-Lead System (1B.1, its fellow component of the AI Front Desk,
  // bundle 5.1, named in prose on its line; "60 seconds" is the facts §6 design target, written as
  // one), AI Lead Qualification & Scoring (1B.2) and Automated Business Dashboards (1J.1)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.1',
        line: 'Is built to answer each new lead within 60 seconds, then logs it in your CRM. Both are part of the AI Front Desk solution.',
      },
      {
        catalogueNumber: '1B.2',
        line: 'Asks qualifying questions and scores each lead, so the pipeline shows which deals to work first.',
      },
      {
        catalogueNumber: '1J.1',
        line: 'Puts CRM data next to ads, accounting and store data in one live dashboard, with access by role.',
      },
    ],
  },

  faq: {
    heading: 'Questions about CRM setup',
    lede: 'What sales teams ask before a CRM project: cost, timing, which CRM, ownership, data and Arabic.',
  },
};
