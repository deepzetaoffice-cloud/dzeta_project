// The Appointment Reminder & No-Show Reduction page's copy (catalogue 1C.2, a core service, registry
// R034), batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order;
// docs/design/service-page.md). The pilot's shape, its own words.
// Sources: the Services Catalogue (1C.2's list; 1C.1's reminder channels and "Best for", the same
// sub-group; 1A.3, 1D.3, 1K.1, 7.5 Healthcare & Dentists, §8 platforms, §9 naming rules), the
// blueprint (demo 3, the workflow explorer), docs/facts/company-facts.md.
// Left out on purpose: the catalogue's example timings (48, 24 and 2 hours before) — the numbers
// allowlist doesn't hold them, so the schedule reads "days ahead, the day before, shortly before";
// any no-show figure or result (facts §5); prices and timeframes (facts §3: UNKNOWN); messaging
// fees and health-data rules (catalogue 7.6) — external facts with no APPROVED citation row. The UAE
// section states only Deepzeta AI's own practice (catalogue §9, 1K.1, 1H.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ array at the end moves into faq-bank.ts
// when the page is wired.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const appointmentRemindersNoShowReduction: ServicePageContent = {
  catalogueNumber: '1C.2',
  // 40 characters, the exact catalogue name; rendered with " | Deepzeta AI", 54 (08 §1: 50–60)
  title: 'Appointment Reminder & No-Show Reduction',
  // 159 characters: the key point (reminders with one-tap confirm or reschedule) in the first 120,
  // one concrete fact (WhatsApp), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Appointment Reminder & No-Show Reduction sends WhatsApp reminders with one-tap confirm or reschedule, and rebooks no-shows. Book a free AI audit.`,
  // 60 characters: the exact name and catalogue 1C.2's "One-tap confirm or reschedule"
  heading: 'Appointment Reminder & No-Show Reduction: confirm in one tap',
  // 57 words: what it is, the outcome, who it's for (catalogue 7.5: Healthcare & Dentists)
  answer: `Appointment Reminder & No-Show Reduction by ${siteConfig.brandName} sends each customer a series of reminders before their appointment, each with a one-tap way to confirm or reschedule. If someone still misses the visit, the system follows up automatically to rebook them. It is for UAE clinics, dentists and service businesses that lose hours to empty appointment slots.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1C.2's three capabilities).
  // Lede: 35 words
  problem: {
    heading: 'Why booked appointments go empty',
    lede: 'A missed appointment is a slot you held and staff time you paid for. When rescheduling means a phone call, some customers simply don’t come. Here is what changes when reminders and rebooking run themselves.',
    rows: [
      {
        before: 'A single reminder goes out by hand, if someone remembers to send it.',
        after: 'A reminder series goes out on its own, starting days ahead and ending shortly before the visit.',
      },
      {
        before: 'To confirm, the customer has to call during opening hours.',
        after: 'The customer confirms with one tap, straight from the reminder.',
      },
      {
        before: 'Moving an appointment means a phone call and a wait on hold.',
        after: 'One tap lets the customer pick a new time, and the old slot becomes free for someone else.',
      },
      {
        before: 'Front-desk staff spend the morning phoning to confirm the day’s appointments.',
        after: 'Staff see who has confirmed and call only the customers who haven’t replied.',
      },
      {
        before: 'A no-show is noticed, noted and then forgotten.',
        after: 'Each no-show gets an automatic follow-up inviting the customer to book again.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1C.2's list as one example flow, labelled "Example"; a
  // dental check-up (catalogue 7.5: Healthcare & Dentists). Lede: 44 words.
  // Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How the reminders and rebooking work',
    lede: 'Appointment Reminder & No-Show Reduction reads the appointments in your calendar and works through each one on a schedule you set. Here is one example flow for a dental check-up; the timing, wording and channels are set up around your business and your customers.',
    steps: [
      {
        title: 'A check-up is booked',
        text: 'A patient books a dental check-up, and the appointment appears in your practice-management system or calendar.',
      },
      {
        title: 'An early reminder',
        text: 'Days before the visit, a WhatsApp reminder arrives with one-tap options to confirm or reschedule.',
      },
      {
        title: 'Confirmed in one tap',
        text: 'The patient taps confirm, and the appointment is marked as confirmed for your front desk.',
      },
      {
        title: 'A final reminder',
        text: 'Shortly before the visit, a last reminder goes out by WhatsApp, or by SMS or email.',
      },
      {
        title: 'A missed visit',
        text: 'If the patient doesn’t arrive, the system sends a message inviting them to choose a new time.',
      },
      {
        title: 'Back in the diary',
        text: 'The patient picks a new slot, and your calendar updates without anyone picking up the phone.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8; catalogue 1C.2, 1C.1's reminder channels, §9 for the consent and
  // human line, 1H.1 for opt-out)
  deliverables: {
    heading: 'What’s included',
    items: [
      'A reminder series on a schedule you choose, for example days ahead, the day before and shortly before',
      'Reminders by WhatsApp, SMS and email, in Arabic and English',
      'One-tap confirm or reschedule in every reminder',
      'Confirmations and new times written back to your calendar automatically',
      'Automatic rebooking follow-ups for customers who miss their appointment',
      'Consent wording and an easy opt-out in every reminder, with your team one reply away',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 lists (Booking, Messaging, Automation)
  worksWith: {
    heading: 'Works with the calendar you already use',
    lede: 'Reminders read appointments from Google Calendar, Outlook, Cal.com or your practice-management system, and go out through the WhatsApp Business API, SMS or email. Confirmations and new times flow back to the same place. The automation itself runs on n8n, Make or Zapier.',
    platforms: [
      'Google Calendar',
      'Outlook',
      'Cal.com',
      'practice-management systems',
      'WhatsApp Business API',
      'SMS',
      'email',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5's fit (Healthcare & Dentists: "Reminders & No-Show
  // Reduction"), 1C.1's "Best for" (the booking sub-group), and a decision aid
  fit: {
    heading: 'Who it helps most',
    lede: 'Appointment Reminder & No-Show Reduction suits any business whose day is built on booked appointments. It is a best-fit automation for healthcare and dentists, and it works from the calendar you already keep. These checks help you decide.',
    goodFit: [
      'Clinics and dental practices, where an empty chair is lost treatment time',
      'Salons, spas, gyms and consultants that run on booked appointments',
      'Businesses that already take bookings but lose slots to no-shows',
    ],
    decisionAid: [
      {
        question: 'Do customers miss appointments without telling you?',
        answer: 'Then reminders with one-tap rescheduling give them an easy way to tell you in time.',
      },
      {
        question: 'Does your front desk phone customers to confirm?',
        answer: 'Then one-tap confirmations show who is coming, so calls go only to those who haven’t replied.',
      },
      {
        question: 'Do missed appointments just drop out of your diary?',
        answer: 'Then automatic follow-ups give each customer who missed a visit a simple way to book again.',
      },
      {
        question: 'Do you also need a better way for customers to book?',
        answer: 'Then start with the Booking Automation System, which already includes reminders and a waitlist.',
      },
    ],
  },

  // 7 · Try it: the stub's lead-in (blueprint demo 3: pick an industry and watch a lead become a booked
  // appointment; P7 builds it, so nothing here says it works today or shows this exact flow)
  tryIt: {
    heading: 'Watch a workflow, step by step',
    line: 'The workflow explorer will let you pick an industry, such as a clinic, and watch an automation run step by step, from the first message to the booked appointment. The explorer is still being built and goes live in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (catalogue §9: consent wording and a way to
  // reach a human; §8 and 1A.1: Arabic and English; 1H.1: opt-out; 1C.2's "for example" schedule:
  // the send times are the client's choice). No laws or platform rules until their citation rows
  // are APPROVED.
  uae: {
    heading: 'How it fits UAE businesses',
    points: [
      'WhatsApp as the main channel, with SMS or email for customers who prefer them.',
      'Reminders in Arabic, English or both, set for each customer.',
      'Send times you choose, so reminders reach customers at sensible hours.',
      'Consent wording in each reminder, and a simple way to stop them.',
      'A customer who replies with a question reaches a person on your team.',
    ],
  },

  // 9 · Pairs well with: the Booking Automation System (1C.1, the same sub-group), the AI Outbound
  // Calling Agent (1A.3: "Appointment reminders and confirmations", consent-based calling with
  // opt-out handling) and Review & Reputation Automation (1D.3; both best fits for Healthcare &
  // Dentists in catalogue 7.5). 1C.2 is in no bundle (§5)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1C.1',
        line: 'Adds online, WhatsApp and phone booking, deposits, and a waitlist that fills cancelled slots.',
      },
      {
        catalogueNumber: '1A.3',
        line: 'Phones customers with appointment reminders and confirmations, using consent-based calls with opt-out handling.',
      },
      {
        catalogueNumber: '1D.3',
        line: 'Takes over after the visit, asking for a review at the right moment once the appointment is done.',
      },
    ],
  },

  faq: {
    heading: 'Questions about appointment reminders',
    lede: 'Answers on price, timing, calendars, Arabic and what reminders can really change.',
  },
};
