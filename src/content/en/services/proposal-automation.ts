// The service page's copy: Proposal Automation (catalogue 1B.4, registry R030, a core service), from the
// pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine §3.1, the service
// order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.4's list: tailored proposals from templates and CRM data,
// AI-written client-specific sections for staff to review, open tracking and follow-ups; 7.5's fit
// for construction and interior fit-out, "Proposal Automation", beside "Automated Quotation &
// Tracking"; 1B.3 for Arabic and English documents and 1H.2 for AI-drafted Arabic and English text
// reviewed by a person; 1B.3, 1B.6 and 1F.6 for the pairs; §8 platforms, including the AI models;
// §9 naming rules and consent; 1K.1, retention and access rules and a record of what each AI step
// uses), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, win rates or time saved (10 §3; facts §3,
// §5); e-signature, payments and the document format (1B.4 lists none; signing is 1F.6's job, named
// as a pair); the channel proposals and follow-ups go out on (1B.4 names none, so the copy says
// "sent" and no messaging platform is listed); any rule on AI-written documents (no citation row is
// APPROVED). No blueprint demo matches proposals, so the page has no try-it band and the hero shows
// the audit CTA alone. No bundle includes 1B.4, so none is named. The UAE section states only
// Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (proposalAutomationFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const proposalAutomation: ServicePageContent = {
  catalogueNumber: '1B.4',
  // 38 characters (the exact catalogue name, 19, plus the audience); rendered with " | Deepzeta AI",
  // 52 (08 §1: 50–60)
  title: 'Proposal Automation for UAE Businesses',
  // 158 characters: the key point (proposals from templates and CRM data) in the first 120 (ends at
  // 93), one concrete fact (staff review the AI-written sections), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Proposal Automation builds tailored proposals from your templates and CRM data, with AI-written sections for staff review. Book a free AI audit.`,
  // 35 characters: catalogue 1B.4's templates, CRM data and AI drafts as the outcome; two lines at
  // 360 px, so it clears the European banner at 360 × 640 under the long breadcrumb
  heading: 'Tailored proposals, drafted for you',
  // 58 words: what it is, the outcome, who it's for (catalogue 7.5: Construction & Interior Fit-Out)
  answer: `Proposal Automation by ${siteConfig.brandName} builds each proposal from your templates and the client’s details in your CRM. AI writes the client-specific sections, your staff review them, and the proposal goes out with open tracking and follow-ups. It is for UAE construction and interior fit-out firms, and any business whose proposals are rebuilt by hand for every client.`,

  // The hero photo, P23 (src/lib/media/photos.ts; the media plan): 113 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'Hands turning the pages of a printed proposal beside a laptop, a pen and a glass of water, in a DIFC meeting room',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1B.4's three capabilities, templates
  // and CRM data as two rows, opens and follow-ups as two). Lede: 36 words
  problem: {
    heading: 'Where proposal time goes',
    lede: 'A proposal often starts as a copy of the last one: details copied from the CRM, sections rewritten for the client, then sent and forgotten. Each step waits for someone’s free time. Here is what changes.',
    rows: [
      {
        before: 'Each proposal starts as a copy of an old one, edited by hand.',
        after: 'Each proposal is built from your approved templates for that kind of work.',
      },
      {
        before: 'Client names, contacts and project details are retyped from the CRM.',
        after: 'The client’s details come straight from the CRM deal, so nothing is retyped.',
      },
      {
        before: 'The sections written for each client start from scratch every time.',
        after: 'AI drafts the client-specific sections, ready for your staff to review.',
      },
      {
        before: 'A sent proposal disappears, with no sign of whether the client read it.',
        after: 'Opens are tracked, so you know when the client has looked at it.',
      },
      {
        before: 'Chasing a quiet client depends on someone remembering to.',
        after: 'Follow-ups go out automatically, on the schedule you set.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.4's list as one example flow, labelled "Example"; a
  // restaurant fit-out (catalogue 7.5: Construction & Interior Fit-Out). The lede (58 words) names
  // the review step before anything is sent. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a proposal is built and sent',
    lede: 'Proposal Automation joins three things you already have: your proposal templates, your CRM and your team’s judgement. The system assembles the draft, AI writes the parts that change for each client, and a person approves it before it goes out. Here is one example flow for an interior fit-out firm; yours follows your own templates and review steps.',
    steps: [
      {
        title: 'The deal reaches proposal stage',
        text: 'A restaurant owner wants a fit-out, and the deal in your CRM moves to the proposal stage.',
      },
      {
        title: 'The draft is assembled',
        text: 'The fit-out template fills in the client’s name, site details and scope from the CRM deal.',
      },
      {
        title: 'AI writes the tailored sections',
        text: 'AI drafts the sections that change for this client, such as their brief and your proposed approach.',
      },
      {
        title: 'Your team reviews it',
        text: 'A project manager checks and edits the AI-written sections, then approves the proposal for sending.',
      },
      {
        title: 'The client opens it',
        text: 'The proposal goes to the client, and you can see when they open it.',
      },
      {
        title: 'A follow-up goes out',
        text: 'The client opened it but went quiet, so a follow-up goes out on the schedule you set.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1B.4's list, or §9 for the consent and human line)
  deliverables: {
    heading: 'What you get',
    items: [
      'Your proposal templates, set up for each kind of work you bid for',
      'Proposals generated from your templates and CRM data, with the client’s details filled in',
      'AI-written client-specific sections, drafted for your staff to review',
      'A review step, so no proposal reaches a client before a person approves it',
      'Open tracking on every proposal you send',
      'Automatic follow-ups on a schedule you set',
      'Consent wording in every follow-up, and replies routed to the person who owns the deal',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.4 (CRM data) and §8 name (CRM, AI models,
  // automation); no messaging platform, since 1B.4 names no channel. Lede: 45 words
  worksWith: {
    heading: 'Works with the CRM your deals live in',
    lede: 'Each proposal draws on the client’s details in your CRM: HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo. The tailored sections are drafted with AI models such as OpenAI, Anthropic, Jais or Falcon. The automation runs on n8n, Make or Zapier, and your templates stay yours.',
    platforms: [
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'OpenAI',
      'Anthropic',
      'Jais',
      'Falcon',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5 (Construction & Interior Fit-Out: "Proposal Automation"
  // beside "Automated Quotation & Tracking"), and a decision aid that separates a written proposal
  // from a priced quote (1B.3). Lede: 43 words
  fit: {
    heading: 'Is Proposal Automation right for you?',
    lede: 'Proposal Automation suits any business that wins work with written proposals, where each one is tailored to the client. It is a best-fit automation for construction and interior fit-out. These questions show when a proposal system fits, and when a quote is enough.',
    goodFit: [
      'Construction firms bidding for projects with detailed written proposals',
      'Interior fit-out companies proposing a design approach to each client',
      'Teams whose proposals are rebuilt from old ones, with details copied by hand',
    ],
    decisionAid: [
      {
        question: 'Do your proposals reuse the same sections with a few changes?',
        answer: 'Then templates and CRM data build most of each proposal, and AI drafts the parts that change.',
      },
      {
        question: 'Does a senior person write each client’s sections themselves?',
        answer: 'Then AI drafts give them a starting point to review and edit, instead of writing from scratch.',
      },
      {
        question: 'Do you send priced quotes rather than written proposals?',
        answer:
          'Then the Automated Quotation & Quote Tracking System may fit better, with price lists and approvals built in.',
      },
      {
        question: 'Do you send only a handful of proposals a year?',
        answer: 'Then writing them by hand may serve you well for now. A free AI audit shows what to automate first.',
      },
    ],
  },

  // 7 · Try it: left out. No blueprint demo shows a proposal (demo 3, the workflow explorer, runs a lead
  // to a booked appointment), so nothing here points to one.

  // 8 · UAE specifics: Deepzeta AI's own practice only (1B.3 and 1H.2: Arabic and English documents,
  // AI drafts reviewed by a person; 1B.4: staff review; catalogue §9 and 1H.1: consent wording, opt-out
  // and a way to reach a human; 1K.1: a record of what each AI step uses, access rules). No laws or
  // platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Proposals for UAE clients',
    points: [
      'Arabic and English: templates in either language, and AI drafts your staff check before sending.',
      'A person reviews every AI-written section before a client sees it.',
      'Consent wording in every follow-up, and any reply reaches the person who owns the deal.',
      'Data rules from day one: what each AI step reads, and who can see each proposal, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: the Automated Quotation & Quote Tracking System (1B.3; 7.5 pairs it with
  // Proposal Automation for construction and fit-out), CRM Setup & Automation (1B.6, the CRM data the
  // proposals draw on) and the add-on Contract Generation & E-Signature (1F.6, the step after an
  // accepted proposal; not live, so its card is unlinked). No bundle includes 1B.4
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.3',
        line: 'Builds priced quotes from your price lists, with approvals and view tracking, when a job needs a quote rather than a proposal.',
      },
      {
        catalogueNumber: '1B.6',
        line: 'Keeps the client and deal details your proposals draw on in one CRM, with pipelines, stages and reminders.',
      },
      {
        catalogueNumber: '1F.6',
        line: 'Generates the contract from your templates and deal data once a proposal is accepted, with online signing and automatic filing.',
      },
    ],
  },

  faq: {
    heading: 'Questions about Proposal Automation',
    lede: 'What firms ask before automating proposals: cost, timing, AI review, results, CRM data and Arabic.',
  },
};
