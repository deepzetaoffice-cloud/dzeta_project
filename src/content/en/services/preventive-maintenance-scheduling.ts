// The service page's copy: Maintenance Contract & Preventive Maintenance Scheduling (catalogue 1E.2,
// registry R041, a core service), from the pilot template (the service pages' standing plan,
// 2026-10-08, batch 2; engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1E.2's list: AMC visits scheduled automatically, reminders to the
// client and team, contract renewal alerts; 7.5's fit for technical services and facility
// management, "AMC Scheduling"; 7.4's building maintenance; §8 platforms; §9 naming rules and
// consent; 0.1, the audit's written summary and quote; 1K.1, data rules in every automation project;
// 1E.1, 1D.4, 1F.1 and 6.1 for the pairs and the support answer), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, results, visit frequencies or any measured
// figure (10 §3; facts §3, §5); a "Best for" line (1E.2 has none, so the fit comes from 7.5 and 7.4);
// any claim that each AMC visit becomes a job in 1E.1 (the catalogue doesn't link the two); who the
// renewal alert reaches beyond your team, and renewal messages to clients (1D.4's job, named in Pairs
// well with); any civil-defence, municipality or equipment-inspection rule (no citation row is
// APPROVED). No bundle includes 1E.2, so none is named. No demo matches contract scheduling (the
// workflow explorer follows a lead to a booking), so the page has no try-it band. The UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (preventiveMaintenanceSchedulingFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const preventiveMaintenanceScheduling: ServicePageContent = {
  catalogueNumber: '1E.2',
  // 39 characters: the exact catalogue name (56) is longer than the title allows, so the title keeps
  // "Preventive Maintenance" and the catalogue's own "AMC" (1E.2, 7.5's "AMC Scheduling"); rendered
  // with " | Deepzeta AI", 53 (08 §1: 50–60). The answer and the prose use the exact name
  title: 'Preventive Maintenance & AMC Scheduling',
  // 159 characters: the key point in the first 120, one concrete fact (renewal alerts), ends with the
  // action (08 §1)
  description: `${siteConfig.brandName} schedules every maintenance contract visit automatically, reminds clients and your team, and flags contracts due for renewal. Book a free AI audit.`,
  // 35 characters: catalogue 1E.2's "AMC visits scheduled automatically" as the outcome; clears the
  // European banner at 360 × 640 under the long breadcrumb
  heading: 'AMC visits that schedule themselves',
  // 54 words: what it is, the outcome, who it's for (7.5: Technical Services & Facility Management,
  // "AMC Scheduling"; 7.4: Building Maintenance)
  answer: `Maintenance Contract & Preventive Maintenance Scheduling by ${siteConfig.brandName} schedules the visits in every annual maintenance contract (AMC) automatically, sends reminders to your client and your team before each one, and alerts you when a contract is due for renewal. It is for UAE technical services, facility management and maintenance companies that run AMCs.`,

  // The hero photo, P28 (src/lib/media/photos.ts; the media plan): 119 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'One hand checking a pressure gauge on pipework in a Dubai plant room, the other holding a phone with a monthly calendar',

  // 2 · The problem it solves (before-after, 4 rows; catalogue 1E.2's three capabilities, the
  // reminders as two rows: the client's and the team's). Lede: 39 words
  problem: {
    heading: 'Where maintenance visits slip',
    lede: 'An AMC promises visits through the year, but the schedule often lives in a spreadsheet or someone’s memory. Visits get missed, clients aren’t told, and renewals come round unnoticed. Here is what changes when the contract runs the calendar.',
    rows: [
      {
        before: 'Each AMC visit is planned by hand, from a spreadsheet or the paper contract.',
        after: 'Every visit in each annual maintenance contract is scheduled automatically.',
      },
      {
        before: 'Clients learn about a visit when the technician calls on the day.',
        after: 'Clients get a reminder before each visit, in good time to arrange access.',
      },
      {
        before: 'Technicians hear about the week’s visits at the last minute.',
        after: 'Your team is reminded of upcoming visits, each one already in the schedule.',
      },
      {
        before: 'A contract ends before anyone notices it is due for renewal.',
        after: 'A renewal alert reaches you before each contract ends, with time to renew.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1E.2's list as one example flow, labelled "Example"; a
  // plant-room AMC for an office building (7.5: facility management). The lede (54 words) says where
  // the schedule comes from: the contract. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a maintenance contract runs itself',
    lede: 'Maintenance Contract & Preventive Maintenance Scheduling starts from the contract: its visits, its dates and its end. From there, visits are scheduled, reminders go out and renewal alerts follow on their own. Here is one example flow for an AMC covering an office building’s plant room; yours follows your own contracts and visit plans.',
    steps: [
      {
        title: 'The contract is signed',
        text: 'An office building’s facility manager signs an annual maintenance contract for its plant room.',
      },
      {
        title: 'Visits are scheduled',
        text: 'Every visit in the contract goes into your team’s schedule automatically, for the whole contract year.',
      },
      {
        title: 'The client is reminded',
        text: 'Before each visit, the facility manager gets a WhatsApp reminder with the date, so access can be arranged.',
      },
      {
        title: 'Your team is reminded',
        text: 'The technicians on the visit are reminded too, so it is already planned into their day.',
      },
      {
        title: 'A renewal alert',
        text: 'As the contract nears its end, your team gets an alert to offer the client a renewal.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (5; each from catalogue 1E.2's list, or §9 for the consent and human line)
  deliverables: {
    heading: 'What the scheduling includes',
    items: [
      'Annual maintenance contract (AMC) visits scheduled automatically, for every contract',
      'Visit reminders to the client before each visit',
      'Visit reminders to your team, so each visit is planned into their day',
      'Contract renewal alerts before each contract ends',
      'Consent wording in every client reminder, and a person on your team one reply away',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 names (Booking's calendars, Messaging, CRM
  // for where contract details may already sit, Automation). Lede: 49 words
  worksWith: {
    heading: 'Works with your calendar and contracts',
    lede: 'Visits are scheduled into Google Calendar or Outlook, and reminders go out through the WhatsApp Business API, SMS or email. Contract details can come from your CRM, such as HubSpot, Zoho CRM or Odoo, or from the spreadsheet you keep today. The automation runs on n8n, Make or Zapier.',
    platforms: [
      'Google Calendar',
      'Outlook',
      'WhatsApp Business API',
      'SMS',
      'email',
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5 (Technical Services & Facility Management: "AMC
  // Scheduling"), 7.4 (Building Maintenance), and a decision aid. Lede: 36 words
  fit: {
    heading: 'Is AMC scheduling right for you?',
    lede: 'Maintenance Contract & Preventive Maintenance Scheduling suits any business that sells maintenance contracts with planned visits. AMC scheduling is a best-fit automation for technical services and facility management. These questions help you decide where it fits.',
    goodFit: [
      'Technical services and AC companies that sell annual maintenance contracts',
      'Facility management firms looking after plant rooms and equipment in several buildings',
      'Building maintenance companies with planned visits for many clients',
    ],
    decisionAid: [
      {
        question: 'Do you plan AMC visits in a spreadsheet?',
        answer: 'Then automatic scheduling puts every visit in the calendar as soon as the contract is entered.',
      },
      {
        question: 'Do clients say nobody told them a visit was coming?',
        answer: 'Then reminders before each visit tell them in good time, and remind your team too.',
      },
      {
        question: 'Have contracts lapsed because nobody noticed the end date?',
        answer: 'Then renewal alerts flag each contract before it ends, while there is still time to renew.',
      },
      {
        question: 'Do you hold only a few contracts, each one managed personally?',
        answer:
          'Then your own calendar may serve you for now. The free AI audit shows which automations pay back first.',
      },
    ],
  },

  // 7 · Try it: left out (types.ts): no demo matches contract scheduling, so the hero shows the audit
  // CTA alone

  // 8 · UAE specifics: Deepzeta AI's own practice only (1E.2: reminders to the client and team;
  // catalogue §9: consent wording and a way to reach a human; 1K.1: retention and access rules). No
  // laws, inspection rules or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for UAE maintenance contracts',
    points: [
      'WhatsApp first: clients get visit reminders on WhatsApp, with SMS and email as back-ups.',
      'Arabic and English: every reminder can be written in either language, set for each client.',
      'Your working days and days off decide when visits are scheduled.',
      'Consent wording in every reminder, and a client who replies reaches a person on your team.',
      'Data rules from day one: retention and access rules for contracts and client details, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: Job & Work-Order Management Automation (1E.1; 7.5 pairs it with "AMC
  // Scheduling"), Loyalty, Renewal & Win-Back Automation (1D.4: the customer-facing renewal and
  // service-due reminders) and Invoicing & Payment Collection Automation (1F.1). 1E.2 is in no
  // bundle (§5)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1E.1',
        line: 'Assigns each job to a technician by skill, area and availability, then captures photos, checklists and signatures on mobile.',
      },
      {
        catalogueNumber: '1D.4',
        line: 'Reminds customers themselves when a renewal or a service is due, and runs win-back campaigns for inactive customers.',
      },
      {
        catalogueNumber: '1F.1',
        line: 'Creates invoices from completed jobs, sends payment links by WhatsApp and email, and follows up with reminders on a schedule.',
      },
    ],
  },

  faq: {
    heading: 'Questions about AMC scheduling',
    lede: 'What maintenance companies ask first: cost, timing, calendars, Arabic and missed visits.',
  },
};
