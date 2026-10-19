// The service page's copy: Task & Approval Workflows (catalogue 1E.6, registry R043, a core service),
// from the pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine §3.1, the
// service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1E.6's list; 1B.3, manager approval for discounts or amounts above
// a limit, for the amount rule and the pairs; 1G.3, requests and approvals through WhatsApp or web,
// for the channels and the pairs; 1F.4 for the pairs; 1K.1, human review for decisions that affect
// people, retention and access rules, and a record of what each system uses; 1J.1, access by role;
// 6.1, the AI Ops Retainer, for the support answer; §8 platforms, Accounting & ERP, messaging and
// automation; §9 naming rules; 0.1, the audit's written summary and quote),
// docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, approval times or hours saved (10 §3; facts
// §3, §5; the amount limit reads "the limit you set", since no number is allowlisted); approvals made
// by the automation itself (1E.6 lists none, and 1K.1 keeps decisions that affect people with a
// person); HR systems by name (§8 names none); any labour-law or leave rule (no citation row is
// APPROVED). No bundle includes 1E.6, and 7.5 names no industry for it, so the fits describe
// situations. `tryIt` is left out: no demo shows an internal approval, and the ROI calculator already
// works on Home, so a stub calling it "still being built" would be untrue. The UAE section states only
// Deepzeta AI's own practice (1K.1, 1J.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (taskApprovalWorkflowsFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const taskApprovalWorkflows: ServicePageContent = {
  catalogueNumber: '1E.6',
  // 44 characters (the exact catalogue name, 25, plus the audience); rendered with " | Deepzeta AI",
  // 58 (08 §1: 50–60)
  title: 'Task & Approval Workflows for UAE Businesses',
  // 156 characters: the key point (requests sent to approvers) in the first 120 (ends at 95), one
  // concrete fact (the audit trail), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Task & Approval Workflows send leave, expense and purchase requests to approvers, with reminders and a full audit trail. Book a free AI audit.`,
  // 34 characters: catalogue 1E.6's "Reminders for pending approvals" as the outcome; clears the
  // European banner at 360 × 640 under the long breadcrumb
  heading: 'Approvals that no one has to chase',
  // 56 words: what it is, the outcome, who it's for
  answer: `Task & Approval Workflows by ${siteConfig.brandName} send internal requests, such as leave, expenses, purchases and discounts, through the approval chain you set. Approvers get reminders while a request waits, and every decision is kept in a full audit trail. It is for UAE businesses whose approvals still run on email, paper forms and WhatsApp chats.`,

  // The hero photo, P30 (src/lib/media/photos.ts; the media plan): 113 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'A finger taps the approve tick on a phone over receipts and a laptop, in a Dubai co-working space facing Downtown',

  // 2 · The problem it solves (before-after, 4 rows; catalogue 1E.6's three capabilities, the request
  // types and their chains as two rows). Lede: 39 words
  problem: {
    heading: 'Where approvals get stuck',
    lede: 'A request goes to a manager by email or WhatsApp, then waits. The person asking doesn’t know where it is, and the approver may never have seen it. Each row shows what changes when requests follow a set route.',
    rows: [
      {
        before: 'Leave, expense and purchase requests arrive by email, on paper and in chats, each in its own form.',
        after: 'Every request follows the same route, with the details its approver needs.',
      },
      {
        before: 'Who approves what depends on who happens to be in the office.',
        after: 'Each type of request follows its own approval chain, for example by amount or department.',
      },
      {
        before: 'A request sits unread while the person who asked keeps chasing.',
        after: 'Approvers get reminders for every request still pending.',
      },
      {
        before: 'Nobody can say later who approved a purchase, or when.',
        after: 'A full audit trail records each request, decision and approver, with the date and time.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1E.6's list as one example flow, labelled "Example"; a
  // purchase request (one of 1E.6's request types) with 1B.3's amount limit as the chain's rule. Lede:
  // 51 words. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a request moves to a decision',
    lede: 'Task & Approval Workflows give each type of request a route: who submits it, who approves it, and in what order. Reminders keep it moving, and the audit trail records every step. Here is one example for a purchase request at a trading company; your request types and approvers will differ.',
    steps: [
      {
        title: 'A purchase request is raised',
        text: 'An office manager requests new laptops for the sales team, attaching the supplier’s quote.',
      },
      {
        title: 'The chain is chosen',
        text: 'The amount is above the limit you set, so the request needs the department head, then finance.',
      },
      {
        title: 'The first approval',
        text: 'The department head approves from a phone, and the request moves on to finance.',
      },
      {
        title: 'A reminder goes out',
        text: 'Finance hasn’t responded yet, so a reminder goes out on the schedule you set.',
      },
      {
        title: 'Approved and confirmed',
        text: 'Finance approves, the office manager is told, and the purchase can go ahead.',
      },
      {
        title: 'Every step on record',
        text: 'The audit trail keeps each step, approver and time, so anyone reviewing it later sees who approved what.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (6; catalogue 1E.6's list, 1B.3 for the amount rule, 1J.1 and 1K.1 for access by
  // role)
  deliverables: {
    heading: 'What the workflows include',
    items: [
      'Request forms for leave, expenses, purchases, discounts and other internal requests',
      'An approval chain for each type of request, in the order you set',
      'Rules that add approvers when a request needs them, for example above an amount you set',
      'Reminders to approvers while a request is pending',
      'A full audit trail of every request, decision and approver',
      'Access by role, so people see only the requests they raise or approve',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 lists (Messaging, Accounting & ERP,
  // Automation); 1G.3 for approvals through WhatsApp or web. Lede: 48 words
  worksWith: {
    heading: 'Works with the tools your team uses',
    lede: 'Requests and approvals can run through email, WhatsApp or a simple web form, so approvers can decide from a phone. An approved expense or purchase can then be recorded in Zoho Books, QuickBooks, Xero, Odoo or SAP Business One. The workflows are built on n8n, Make or Zapier.',
    platforms: [
      'email',
      'WhatsApp Business API',
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

  // 6 · Is it right for you? 1E.6 has no "Best for" line and no 7.5 row, so the fits are situations
  // drawn from its list (its request types, several approvers, the audit trail), and a decision aid.
  // Lede: 44 words
  fit: {
    heading: 'Do you need approval workflows?',
    lede: 'Task & Approval Workflows suit any business where requests need a sign-off before they go ahead, and where that sign-off is chased by hand. They matter most once more than one manager approves, or approvals depend on the amount. These questions help you decide.',
    goodFit: [
      'Businesses where leave, expense and purchase requests still arrive by email, on paper or in chats',
      'Teams with several managers, branches or departments signing off on requests',
      'Finance teams that need to show who approved each expense or purchase, and when',
      'Sales teams whose discounts need a manager’s approval',
    ],
    decisionAid: [
      {
        question: 'Do people chase managers to find out whether a request was approved?',
        answer: 'Then reminders keep pending requests moving, and each decision goes back to whoever asked.',
      },
      {
        question: 'Does the right approver depend on the amount or the department?',
        answer: 'Then an approval chain for each request type sends it to the right people, in the right order.',
      },
      {
        question: 'Could you show, months later, who approved a purchase?',
        answer: 'Then a full audit trail keeps every request, decision and approver on record.',
      },
      {
        question: 'Do you approve every request yourself, face to face?',
        answer: 'Then a shared form may be all you need for now. The free AI audit shows what to automate first.',
      },
    ],
  },

  // 7 · Try it: left out (see the header): no demo shows an internal approval, so the hero shows the
  // audit CTA alone (types.ts)

  // 8 · UAE specifics: Deepzeta AI's own practice only (1G.3: WhatsApp or web; 1A.1: Arabic and
  // English; 1K.1: human review for decisions that affect people, retention and access rules; 1J.1:
  // access by role). No laws until their citation rows are APPROVED.
  uae: {
    heading: 'Approvals for UAE teams',
    points: [
      'WhatsApp or email: approvers receive and answer requests on the channel they already check.',
      'Arabic and English: request forms and reminders can be written in both, for teams that work in either language.',
      'People decide: the workflow routes and reminds, but every approval is made by a person.',
      'Access and retention rules: before launch, you decide who sees each request and how long the audit trail is kept.',
    ],
  },

  // 9 · Pairs well with: the Automated Quotation & Quote Tracking System (1B.3: its discount approvals,
  // the request type 1E.6 shares with sales), and two add-ons that extend its request types: Expense
  // & Receipt Automation (1F.4) and Attendance, Leave & HR Requests (1G.3). No bundle includes 1E.6.
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.3',
        line: 'Holds a quote with a discount, or above a limit you set, for a manager’s approval before it reaches the client.',
      },
      {
        catalogueNumber: '1F.4',
        line: 'Lets staff photograph receipts on WhatsApp or mobile, then categorises each expense for approval and exports it to accounting.',
      },
      {
        catalogueNumber: '1G.3',
        line: 'Adds leave balances, a team calendar and reminders before visas, Emirates IDs and licences expire.',
      },
    ],
  },

  faq: {
    heading: 'Questions about approval workflows',
    lede: 'What managers ask before automating approvals: cost, timing, WhatsApp, Arabic and the audit trail.',
  },
};
