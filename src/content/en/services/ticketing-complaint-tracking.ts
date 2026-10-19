// The service page's copy: Ticketing & Complaint Tracking System (catalogue 1D.2, registry R037, a core
// service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine
// §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1D.2's list; 7.4's Building Maintenance for the example's
// business; §8 platforms, messaging, CRM and automation; §9 naming rules, consent and a way to reach
// a human; 0.1, the audit's written summary and quote; 1K.1, retention and access rules and a record
// of what each system uses; 1D.3, 1E.1 and 1E.6 for the pairs), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, response or resolution times as figures,
// satisfaction or complaint-volume results (10 §3; facts §3, §5; no number is allowlisted, so the
// timers read "the limit you set"); helpdesk vendors (catalogue §8 names none); AI sorting of
// complaints (1D.2 lists none); any consumer-protection or platform rule (no citation row is
// APPROVED). No bundle includes 1D.2, and 7.5 names no industry for it, so the fits describe
// situations, not sectors. No demo matches a ticket flow, so `tryIt` is left out. The UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (ticketingComplaintTrackingFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const ticketingComplaintTracking: ServicePageContent = {
  catalogueNumber: '1D.2',
  // 37 characters, the exact catalogue name; rendered with " | Deepzeta AI", 51 (08 §1: 50–60)
  title: 'Ticketing & Complaint Tracking System',
  // 158 characters: the key point (a ticket for each complaint) in the first 120 (ends at 84), one
  // concrete fact (overdue tickets escalate), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Ticketing & Complaint Tracking System logs each complaint as a ticket, escalates overdue ones and keeps customers updated. Book a free AI audit.`,
  // 35 characters: the registry row's intent (R037, "track every complaint … until it's resolved");
  // two lines at 360 px, so it clears the European banner at 360 × 640 under the long breadcrumb
  heading: 'Every complaint, tracked to the end',
  // 59 words: what it is, the outcome, who it's for
  answer: `The Ticketing & Complaint Tracking System by ${siteConfig.brandName} logs every complaint with a ticket number, starts a service-level timer and escalates the ticket if nobody acts in time. Customers get an update at each stage, and root-cause reports show what keeps going wrong. It is for UAE businesses that handle complaints on WhatsApp, by phone and by email.`,

  // The hero photo, P25 (src/lib/media/photos.ts; the media plan): 116 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'Hands typing on a laptop showing ticket cards in three columns, beside a headset and a cup of tea, in a Dubai office',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1D.2's four capabilities, the timer and
  // the escalation as two rows). Lede: 40 words
  problem: {
    heading: 'Where complaints get lost',
    lede: 'Complaints arrive on WhatsApp, by phone and by email, and whoever sees one tries to help. Without a ticket, nobody owns it, nobody tracks the time and the customer waits. Each row shows what a ticket for every complaint changes.',
    rows: [
      {
        before: 'A complaint sits in one person’s chat or inbox, with no reference to find it by.',
        after: 'Every complaint is logged with a ticket number, whichever channel it arrived on.',
      },
      {
        before: 'Nobody knows how long a complaint has been waiting for an answer.',
        after: 'A service-level timer runs on each ticket from the moment it is logged.',
      },
      {
        before: 'A stalled complaint is noticed only when the customer complains again.',
        after: 'Escalation rules pass an overdue ticket to a manager automatically.',
      },
      {
        before: 'Customers chase you for news, and staff answer each chase by hand.',
        after: 'Customers get an update at each stage, on the channel they used.',
      },
      {
        before: 'The same problem keeps coming back, and nobody can say how often.',
        after: 'Root-cause reports group closed tickets by cause, so repeat problems stand out.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1D.2's list as one example flow, labelled "Example"; a
  // building maintenance company (catalogue 7.4). The timer's limit is the client's own setting, never
  // a figure. Lede: 52 words. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'From first message to closed ticket',
    lede: 'The Ticketing & Complaint Tracking System gives each complaint a ticket, a stage and a timer, from the first message to the fix. Your service levels and escalation rules decide who acts and by when. Here is one example flow for a building maintenance company; yours follows your own stages and rules.',
    steps: [
      {
        title: 'A complaint arrives',
        text: 'A tenant sends a WhatsApp message: the AC repaired last week is leaking again.',
      },
      {
        title: 'A ticket and a timer',
        text: 'The complaint is logged with a ticket number, the tenant receives it, and a service-level timer starts.',
      },
      {
        title: 'Assigned to the AC team',
        text: 'The ticket goes to the team that handles AC repairs, with the timer showing how long is left.',
      },
      {
        title: 'Escalated to a manager',
        text: 'Nobody has acted when the timer reaches your limit, so the escalation rule alerts the duty manager.',
      },
      {
        title: 'The tenant stays informed',
        text: 'At each stage, from assigned to visit booked to fixed, the tenant gets a WhatsApp update.',
      },
      {
        title: 'Closed, with its cause',
        text: 'The ticket is closed with its cause recorded, so root-cause reports show how often that fault comes back.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1D.2's list, §8 for the channels, §9 for consent and a
  // person to reach)
  deliverables: {
    heading: 'What the system includes',
    items: [
      'A ticket number for every complaint, from WhatsApp, Instagram, Messenger, email, website forms or a call',
      'Service-level timers for the response and resolution times you set',
      'Escalation rules that alert a manager when a ticket runs past its timer',
      'Ticket stages set up around how your team resolves complaints',
      'Customer updates at each stage, by WhatsApp, SMS or email',
      'Root-cause reports that show which problems keep coming back',
      'Consent wording in every update, and a person to reach at any stage',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 lists (Messaging, CRM, Automation). Lede:
  // 43 words
  worksWith: {
    heading: 'Works with the channels customers use',
    lede: 'Complaints are logged from the WhatsApp Business API, Instagram, Messenger, SMS, email and website forms, and updates go back on the same channel. Each ticket can be linked to the customer’s record in your CRM. The workflow runs on n8n, Make or Zapier.',
    platforms: [
      'WhatsApp Business API',
      'Instagram',
      'Messenger',
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

  // 6 · Is it right for you? 1D.2 has no "Best for" line and no 7.5 row, so the fits are situations
  // drawn from its list (several channels, hand-offs, timers, causes), and a decision aid. Lede: 42
  // words
  fit: {
    heading: 'Is a ticketing system right for you?',
    lede: 'The Ticketing & Complaint Tracking System suits businesses where complaints arrive on more than one channel, or pass between several people before they are fixed. It gives every complaint an owner and a clock. These questions help you decide where to start.',
    goodFit: [
      'Businesses that take complaints on WhatsApp, by phone and by email at the same time',
      'Teams where a complaint passes between staff, branches or departments before it is fixed',
      'Businesses that set response times for complaints and want to see them met',
      'Managers who want to see what causes complaints, not only how many arrive',
    ],
    decisionAid: [
      {
        question: 'Do customers chase you for news about a complaint?',
        answer: 'Then an update at each stage tells them where it stands before they need to ask.',
      },
      {
        question: 'Have complaints been missed because they sat in one person’s chat?',
        answer: 'Then every complaint gets a ticket number and a timer, and an overdue one reaches a manager.',
      },
      {
        question: 'Do the same problems keep coming back?',
        answer: 'Then root-cause reports show which causes repeat, so you can fix them at the source.',
      },
      {
        question: 'Do you get only a few complaints, each handled by the owner?',
        answer: 'Then a shared inbox may be enough for now. The free AI audit shows which automations pay back first.',
      },
    ],
  },

  // 7 · Try it: left out. None of the blueprint's demos shows a complaint or a ticket, so the hero
  // shows the audit CTA alone (types.ts)

  // 8 · UAE specifics: Deepzeta AI's own practice only (§8 and 1A.1: WhatsApp first, Arabic and
  // English; catalogue §9: consent wording and a way to reach a human; 1K.1: retention and access
  // rules). No laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Complaint handling for UAE customers',
    points: [
      'WhatsApp first: customers can complain, receive their ticket number and follow its progress in the chat they already use.',
      'Arabic and English: each update can go out in either language, matched to the one the customer wrote in.',
      'A person at every stage: a customer who replies to an update reaches the team member handling the ticket.',
      'Consent wording in every automated update, as in every automation we build that talks to customers.',
      'Data rules from day one: retention and access rules for tickets and complaint history, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: Review & Reputation Automation (1D.3, the same sub-group: its manager alert
  // catches a problem after a service), Job & Work-Order Management Automation (1E.1: a complaint that
  // needs a visit becomes a job) and Task & Approval Workflows (1E.6: discounts with approval chains).
  // No bundle includes 1D.2.
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1D.3',
        line: 'Asks for a review at the right moment after a service, and alerts your manager when a customer reports a problem.',
      },
      {
        catalogueNumber: '1E.1',
        line: 'Creates a job from a call or WhatsApp request, assigns a technician and tells the customer when they are on the way.',
      },
      {
        catalogueNumber: '1E.6',
        line: 'Sends internal requests, such as a discount to settle a complaint, through an approval chain with a full audit trail.',
      },
    ],
  },

  faq: {
    heading: 'Questions about complaint tracking',
    lede: 'What teams ask before tracking complaints: cost, timing, channels, Arabic, data and results.',
  },
};
