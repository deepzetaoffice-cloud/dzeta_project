// The Booking Automation System page's copy (catalogue 1C.1, a lead service, registry R033), batch 1
// of the service pages under the standing plan (docs/plans/2026-10-08-service-pages-standing-plan.md;
// engine §3.1, the service order; docs/design/service-page.md). The pilot's shape, its own words.
// Sources: the Services Catalogue (1C.1's list and "Best for", 1A.1, 1A.2, 1B.6, 1C.2, 1K.1, 5.1, 6.1,
// 7.5, §8 platforms, §9 naming rules), the blueprint (demo 1, the AI agent that books the audit),
// docs/facts/company-facts.md (§3: the audit's meeting types).
// Left out on purpose: prices and timeframes (facts §3: UNKNOWN); any no-show figure or result (facts
// §5); the audit's length (a number the allowlist doesn't hold, so "short"); payment providers and
// practice-management system names (no source names them); "24/7" appears only on the WhatsApp AI
// Agent's line, its facts §6 meaning. No external facts: no citation row is APPROVED yet, so the UAE
// section states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ array at the end moves into faq-bank.ts
// when the page is wired.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const bookingAutomationSystem: ServicePageContent = {
  catalogueNumber: '1C.1',
  // 44 characters; rendered with " | Deepzeta AI", 58 (08 §1: 50–60)
  title: 'Booking Automation System for UAE Businesses',
  // 157 characters: the key point (book online, on WhatsApp or by phone) in the first 120, one
  // concrete fact (the waitlist), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Booking Automation System lets customers book online, on WhatsApp or by phone, and fills cancelled slots from a waitlist. Book a free AI audit.`,
  // 58 characters, the catalogue's own promise for 1C.1 ("with no back-and-forth")
  heading: 'Booking Automation System: bookings with no back-and-forth',
  // 52 words: what it is, the outcome, who it's for (1C.1's "Best for")
  answer: `The Booking Automation System by ${siteConfig.brandName} lets customers book, reschedule and cancel online, on WhatsApp or by phone, choosing from your real-time availability. Confirmations, calendar invites and reminders go out automatically. It is for UAE clinics, salons, gyms, consultants, car services and training centres that still arrange every appointment by hand.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1C.1's list). Lede: 39 words
  problem: {
    heading: 'Where bookings get stuck',
    lede: 'A phone or WhatsApp booking usually needs a person: someone checks the diary, offers a time, waits for an answer, then confirms. Every round trip costs staff time, and the customer may book elsewhere meanwhile. Here is what changes.',
    rows: [
      {
        before: 'Customers can only book when someone is free to answer the phone or the chat.',
        after: 'Customers book on your booking page, your website, WhatsApp or the phone, any time.',
      },
      {
        before: 'One diary covers people, rooms and equipment, so double bookings slip through.',
        after:
          'Real-time availability for each staff member, room, vehicle or piece of equipment shows only free slots.',
      },
      {
        before: 'Changing a booking takes another round of calls and messages.',
        after: 'Customers reschedule or cancel themselves, and your calendar updates on its own.',
      },
      {
        before: 'A cancelled slot stays empty unless someone phones round to fill it.',
        after: 'A waitlist offers each cancelled slot to the next customer automatically.',
      },
      {
        before: 'Deposits are chased by hand, or not taken at all.',
        after: 'Deposits and prepayments are paid online when the customer books.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1C.1's list as one example flow, labelled "Example"; a
  // car service booking (catalogue 7.5: Automotive, Booking Automation). Lede: 53 words.
  // Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How the Booking Automation System works',
    lede: 'The Booking Automation System connects every place a customer can book to a single live calendar. It checks availability, takes the booking, confirms it and offers any freed slot to your waitlist. Here is one example flow for a car service booking; your channels, resources and rules are set up around how you work.',
    steps: [
      {
        title: 'A driver asks on WhatsApp',
        text: 'A driver messages your business on WhatsApp to book a car service for next week.',
      },
      {
        title: 'Free times offered',
        text: 'The AI agent checks your technicians and service bays in real time and offers only free times.',
      },
      {
        title: 'Optional deposit paid online',
        text: 'If you take deposits, the driver pays through a payment link before the slot is confirmed.',
      },
      {
        title: 'Confirmed and in the calendar',
        text: 'The driver gets a confirmation and a calendar invite, and the booking appears in your Google Calendar or Outlook.',
      },
      {
        title: 'Reminders before the visit',
        text: 'Reminders go out by WhatsApp, SMS or email, each with a link to reschedule or cancel.',
      },
      {
        title: 'The waitlist fills the gap',
        text: 'If the driver cancels, the slot is offered to the next customer on your waitlist automatically.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8, each from catalogue 1C.1, or §9 for the consent and human line).
  // Item 2 is 1C.1's own line ("Booking through the WhatsApp AI agent and voice receptionist"), with
  // the two services' exact names
  deliverables: {
    heading: 'What you get',
    items: [
      'An online booking page and a booking widget for your website',
      'Booking on WhatsApp and by phone, through the WhatsApp AI Agent and AI Voice Receptionist',
      'Real-time availability for staff, rooms, vehicles or equipment',
      'Online deposits and prepayments, taken when the customer books',
      'Automatic confirmations and calendar invites, synced with Google Calendar, Outlook or your practice-management system',
      'Reminders by WhatsApp, SMS and email to reduce no-shows',
      'Self-service reschedule and cancel, and a waitlist that fills cancelled slots automatically',
      'Consent wording in every message, and a person on your team one reply away',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1C.1 and §8 (Booking, Messaging, Automation)
  // name
  worksWith: {
    heading: 'Works with your calendars and channels',
    lede: 'Customers book on your website, a booking page, WhatsApp or the phone. Bookings land in Google Calendar, Outlook or your practice-management system, and messages go out through the WhatsApp Business API, SMS and email. We work with Cal.com for booking pages and build the flows on n8n, Make or Zapier.',
    platforms: [
      'Cal.com',
      'Google Calendar',
      'Outlook',
      'practice-management systems',
      'WhatsApp Business API',
      'SMS',
      'email',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5's fits (Healthcare & Dentists, Law Firms & Professional
  // Services, Automotive, Fitness & Gyms: "Booking Automation"), 1C.1's "Best for", and a decision aid
  fit: {
    heading: 'Is booking automation right for you?',
    lede: 'The Booking Automation System suits any business that runs on appointments, sessions or rentals. It is a best-fit automation for healthcare and dentists, law firms and professional services, automotive, and fitness and gyms. Answer these questions to see if it fits.',
    goodFit: [
      'Clinics and dental practices that book patients by phone and WhatsApp',
      'Salons, spas and gyms with staff and rooms to schedule',
      'Car service centres and rental companies that book vehicles or equipment',
      'Consultants, law firms and training centres that book meetings and sessions',
    ],
    decisionAid: [
      {
        question: 'Do customers book by calling or messaging you?',
        answer: 'Then a booking page and WhatsApp booking let them choose a time without waiting for your reply.',
      },
      {
        question: 'Do you schedule rooms, vehicles or equipment as well as people?',
        answer: 'Then real-time availability checks each resource before a slot is offered.',
      },
      {
        question: 'Do cancellations leave gaps in your day?',
        answer: 'Then self-service rescheduling and a waitlist offer each freed slot to the next customer in line.',
      },
      {
        question: 'Are your bookings few and easy to handle by hand?',
        answer: 'Then keep doing them by hand for now, and let a free AI audit show where automation would help first.',
      },
    ],
  },

  // 7 · Try it: the stub's lead-in (blueprint demo 1: the AI agent answers in Arabic or English and
  // books the audit into the calendar; P7 builds it, so nothing here says it works today). The
  // trigger matches Home's ("Try our AI agent")
  tryIt: {
    heading: 'Book the way your customers will',
    line: 'Our own AI agent will answer your questions in Arabic or English and book your free AI audit into our calendar, the way your customers would book with you. The agent is still being built and goes live in a later update of this site.',
    trigger: 'Try our AI agent',
    demoId: 'ai-agent',
    icon: 'send',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (catalogue §9: consent wording and a way to
  // reach a human; 1A.1 and 1A.2: Arabic and English; 1H.1: opt-out; 1C.1: real-time availability).
  // No laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for how UAE customers book',
    points: [
      'WhatsApp first: customers can book, confirm and reschedule in a WhatsApp chat, with SMS and email as back-ups.',
      'Arabic and English: booking pages, confirmations and reminders in both languages.',
      'Your own opening hours and days off decide which slots customers see.',
      'Consent wording in every message, and a simple way to opt out of reminders.',
      'Your team stays in reach: a customer can ask for a person at any step of the booking.',
    ],
  },

  // 9 · Pairs well with: Appointment Reminder & No-Show Reduction (1C.2), and the AI Front Desk
  // solution (bundle 5.1) named in prose on the line of WhatsApp AI Agent (1A.1), a fellow component
  // with AI Voice Receptionist (1A.2); the type takes service numbers only, so the bundle has no
  // field of its own. "24/7" is 1A.1's own capability (facts §6)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1C.2',
        line: 'Adds a full reminder series, one-tap confirm or reschedule, and automatic rebooking for customers who miss their slot.',
      },
      {
        catalogueNumber: '1A.1',
        line: 'Answers questions on WhatsApp 24/7 and books straight into this system. Both are part of the AI Front Desk solution.',
      },
      {
        catalogueNumber: '1A.2',
        line: 'Answers phone calls in Arabic and English, after hours too, and books, reschedules or cancels in the same calendar.',
      },
    ],
  },

  faq: {
    heading: 'Questions about the Booking Automation System',
    lede: 'Clear answers on cost, set-up time, calendars, Arabic and no-shows.',
  },
};
