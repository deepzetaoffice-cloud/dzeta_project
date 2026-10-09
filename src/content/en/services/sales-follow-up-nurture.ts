// The service page's copy: Sales Follow-Up & Nurture Sequences (catalogue 1B.5, registry R031, a core
// service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 1; engine
// §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.5's list; 7.5's fit for education and training, "Nurture
// Sequences"; 1B.2, "puts cold leads into nurture"; 1H.1, campaigns with consent and opt-out
// management, for the sequence-or-campaign decision aid; §8 platforms, including the booking tools
// that end a sequence; §9 naming rules and consent; 1K.1, retention and access rules; 1B.1 for the
// pairs), the blueprint (demo 3, the workflow explorer), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, reply or conversion rates, and any claim
// about how many leads need follow-up (10 §3; facts §3, §5); WhatsApp's messaging-window and
// template rules, and any law on marketing messages (no citation row is APPROVED); quiet hours and
// read receipts (the catalogue doesn't list them). No bundle includes 1B.5, so none is named. The
// UAE section states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are at the end of this file,
// for the integrator to move into faq-bank.ts.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const salesFollowUpNurture: ServicePageContent = {
  catalogueNumber: '1B.5',
  // 45 characters (the exact catalogue name, 35, is too short alone); rendered with
  // " | Deepzeta AI", 59 (08 §1: 50–60)
  title: 'Automated Sales Follow-Up & Nurture Sequences',
  // 147 characters: the key point in the first 120, one concrete fact (the stop rule), ends with the
  // action (08 §1)
  description: `${siteConfig.brandName}’s Sales Follow-Up & Nurture Sequences message leads on WhatsApp, email and SMS, and stop when they reply or book. Book a free AI audit.`,
  // 59 characters: the outcome and 1B.5's "Stops automatically when the lead replies"
  heading: 'Sales follow-up that runs itself and stops when leads reply',
  // 58 words: what it is, the outcome, who it's for
  answer: `Sales Follow-Up & Nurture Sequences by ${siteConfig.brandName} keep in touch with each lead through a series of WhatsApp, email and SMS messages. The next message depends on how the lead responds, and the sequence stops by itself when they reply or book. It is for UAE businesses whose leads need more than one message before they decide.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1B.5's three capabilities).
  // Lede: 38 words
  problem: {
    heading: 'Why leads go cold',
    lede: 'A lead who doesn’t answer the first message isn’t always a lost lead. But following up by hand slips when the team is busy, and some leads never hear back. Compare that with a sequence that runs itself.',
    rows: [
      {
        before: 'Follow-up depends on a salesperson finding time to send it.',
        after: 'Each lead gets the next message on time, on WhatsApp, email or SMS.',
      },
      {
        before: 'One reminder goes out, then the lead hears nothing more.',
        after: 'Follow-ups continue step by step, on the schedule you set.',
      },
      {
        before: 'Every lead gets the same message, whatever they did last.',
        after: 'Each lead takes its own path, based on how they respond.',
      },
      {
        before: 'Leads who already replied or booked still get chased.',
        after: 'The sequence stops by itself when the lead replies or books.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.5's list as one example flow, labelled "Example"
  // (7.5: nurture sequences fit education and training). The lede (57 words) says how a sequence is
  // built: entry, steps, paths, exit. Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a follow-up sequence runs',
    lede: 'A sequence is a planned series of messages. It starts when a lead enters it and ends when the lead replies, books or reaches the last step. Each step has a channel, a message and a wait time, and each response can send the lead down a different path. Here is one example for a course enquiry.',
    steps: [
      {
        title: 'A course enquiry goes quiet',
        text: 'A parent asks about a coding course on your website, then doesn’t answer the first reply.',
      },
      {
        title: 'A WhatsApp follow-up',
        text: 'After the wait you set, a WhatsApp message shares the course dates and asks one simple question.',
      },
      {
        title: 'The path changes',
        text: 'The parent taps the timetable link but doesn’t book, so the next step offers a call instead.',
      },
      {
        title: 'Still no reply',
        text: 'The call offer goes unanswered, so an email with the full course outline follows, then a short SMS.',
      },
      {
        title: 'A reply stops it',
        text: 'The parent replies with a question, so the sequence stops and a person from your team takes over.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (6; each from catalogue 1B.5, or §9 for the consent and human lines)
  deliverables: {
    heading: 'What’s included',
    items: [
      'Multi-step follow-up sequences on WhatsApp, email and SMS',
      'Messages and wait times for each step, written and set around how you sell',
      'Different paths for each lead, based on how they respond',
      'An automatic stop when the lead replies or books',
      'Consent wording in each sequence and an easy way to opt out',
      'A clear route to a person from any message in the sequence',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.5 and §8 name (messaging, CRM, booking,
  // automation). Lede: 44 words
  worksWith: {
    heading: 'Works with your channels, CRM and calendar',
    lede: 'Sequences send messages through the WhatsApp Business API, email and SMS. A lead can enter a sequence from a website form or a stage in your CRM, and a booking in your calendar ends it. We build each sequence on n8n, Make or Zapier.',
    platforms: [
      'WhatsApp Business API',
      'email',
      'SMS',
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'Cal.com',
      'Google Calendar',
      'Outlook',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5 (Education & Training: "Nurture Sequences"), 1B.2 (cold
  // leads into nurture), and a decision aid that separates a sequence (one lead, triggered by what
  // they did) from a campaign (a whole list, 1H.1). Lede: 43 words
  fit: {
    heading: 'Do you need follow-up sequences?',
    lede: 'Sales Follow-Up & Nurture Sequences suit businesses whose leads take time to decide, or go quiet after the first reply. Nurture sequences are a best-fit automation for education and training. These questions also show when a marketing campaign fits better than a sequence.',
    goodFit: [
      'Education and training providers following up on course enquiries',
      'Businesses whose sale needs more than one conversation before the client decides',
      'Teams with more leads than they can follow up by hand',
      'Businesses that score leads and want cold ones nurtured, not dropped',
    ],
    decisionAid: [
      {
        question: 'Do leads go quiet after your first reply?',
        answer: 'Then a sequence keeps the conversation open, with nobody setting reminders by hand.',
      },
      {
        question: 'Do you message one lead at a time, or a whole list at once?',
        answer:
          'One lead at a time, based on what they did, is a sequence. A whole list at once is a campaign, the job of Email & WhatsApp Marketing Automation.',
      },
      {
        question: 'Does your team already call back every lead that goes quiet?',
        answer: 'Then a sequence can cover the leads they miss on busy days, and hand back any lead who replies.',
      },
      {
        question: 'Do you get only a few leads, each handled personally?',
        answer:
          'Then personal follow-up may serve you better for now. A free AI audit shows where automation pays back first.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3: "lead arrives → AI replies → CRM
  // updated → appointment booked"; P7 builds it, so nothing here says it works today)
  tryIt: {
    heading: 'Follow a lead through a workflow',
    line: 'The workflow explorer will let you choose an industry and follow a lead from the first message to a booked appointment. We are still building it, and it arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1B.5: WhatsApp, email and SMS, the stop on a
  // reply; catalogue §9: consent wording and a way to reach a human; 1H.1: opt-out handling). No
  // laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Sequences for UAE leads',
    points: [
      'The lead’s own channel: each lead hears from you on WhatsApp, email or SMS, whichever they used to reach you.',
      'Arabic and English: each message can be written in both, matched to the language the lead used.',
      'Consent wording in each sequence, and a lead who asks to stop is removed from it straight away.',
      'Any reply reaches a person: the automated messages end, and your team picks up the conversation.',
    ],
  },

  // 9 · Pairs well with: AI Lead Qualification & Scoring (1B.2 feeds cold leads into nurture), the
  // Speed-to-Lead System (1B.1, the first reply before a sequence; "60 seconds" is the facts §6
  // design target, written as one) and Email & WhatsApp Marketing Automation (1H.1, campaigns to
  // whole lists). No bundle includes 1B.5.
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.2',
        line: 'Scores each lead from its answers and behaviour, sending hot leads to sales and cold leads into a nurture sequence.',
      },
      {
        catalogueNumber: '1B.1',
        line: 'Is built to answer each new lead within 60 seconds; a sequence takes over if that lead then goes quiet.',
      },
      {
        catalogueNumber: '1H.1',
        line: 'Sends segmented campaigns to whole lists, with consent and opt-out management, while sequences follow up one lead at a time.',
      },
    ],
  },

  faq: {
    heading: 'Questions about follow-up sequences',
    lede: 'What teams ask before automating follow-up: cost, timing, tone, Arabic and opt-outs.',
  },
};
