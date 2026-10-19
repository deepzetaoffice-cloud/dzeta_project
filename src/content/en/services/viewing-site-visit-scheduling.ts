// The service page's copy: Viewing & Site-Visit Scheduling (catalogue 1C.3, registry R035, a core
// service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2; engine
// §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1C.3's list: property viewings, site surveys and inspections
// booked automatically, route-friendly scheduling for agents and surveyors, reminders to client and
// staff with location pins; 1C.1 for the reminder channels and calendar sync, the same sub-group;
// 7.5's fit for real estate, "Viewing Scheduling", beside "Speed-to-Lead (portals)" and "CRM
// Automation"; 1B.1, 1B.6 and 1C.2 for the pairs; §8 platforms; §9 naming rules and consent; 1K.1,
// retention and access rules and a record of what each step uses), the blueprint (demo 3, the
// workflow explorer, with real estate among its industries), docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, driving time or distance saved, and any
// no-show figure (10 §3; facts §3, §5); map and routing vendors (the catalogue names none, so the
// copy says "location pin" and "route"); RERA, DLD or any rule on property viewings and access (no
// citation row is APPROVED); a waitlist, deposits and one-tap rescheduling (1C.1's and 1C.2's, not
// 1C.3's; 1C.2 is named as a pair). No bundle includes 1C.3, so none is named. The UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (viewingSiteVisitSchedulingFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const viewingSiteVisitScheduling: ServicePageContent = {
  catalogueNumber: '1C.3',
  // 42 characters (the exact catalogue name, 31, plus the market); rendered with " | Deepzeta AI",
  // 56 (08 §1: 50–60)
  title: 'Viewing & Site-Visit Scheduling in the UAE',
  // 153 characters: the key point (viewings, surveys and inspections booked) in the first 120 (ends at
  // 91), one concrete fact (location pins), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Viewing & Site-Visit Scheduling books viewings, site surveys and inspections, and sends reminders with location pins. Book a free AI audit.`,
  // 40 characters: catalogue 1C.3's "booked automatically" as the outcome; clears the European banner
  // at 360 × 640 under the long breadcrumb
  heading: 'Viewings and site visits, booked for you',
  // 57 words: what it is, the outcome, who it's for (catalogue 7.5: Real Estate; 1C.3's surveyors)
  answer: `Viewing & Site-Visit Scheduling by ${siteConfig.brandName} books property viewings, site surveys and inspections automatically, in an order that keeps each agent’s or surveyor’s day on a sensible route. The client and your staff both get reminders with a location pin. It is for UAE real estate agencies, and for firms whose surveyors and inspectors visit sites.`,

  // The hero photo, P24 (src/lib/media/photos.ts; the media plan): 112 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'One hand holds a phone map with a location pin, the other a set of keys, at a modern villa’s door in Dubai Hills',

  // 2 · The problem it solves (before-after, 4 rows; catalogue 1C.3's three capabilities, the
  // reminders to client and staff as two rows). Lede: 38 words
  problem: {
    heading: 'Where viewing days go wrong',
    lede: 'Arranging a viewing means matching a client’s free time with an agent’s diary, then hoping both turn up at the right place. When agents cross the city between visits, the day fills with driving. Here is what changes.',
    rows: [
      {
        before: 'Each viewing is arranged by calls and messages back and forth.',
        after: 'Viewings, site surveys and inspections are booked automatically, at times that suit both sides.',
      },
      {
        before: 'Visits are booked wherever there is a gap, so agents criss-cross the city.',
        after: 'Route-friendly scheduling plans each agent’s or surveyor’s visits in a sensible order.',
      },
      {
        before: 'Clients forget the time, or arrive at the wrong building.',
        after: 'The client gets reminders with a location pin for the exact address.',
      },
      {
        before: 'Staff hear about a new booking late, or look up the address themselves.',
        after: 'Your staff get reminders too, with the same location pin.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1C.3's list as one example flow, labelled "Example"; a
  // villa viewing (catalogue 7.5: Real Estate). The lede (52 words) says what the schedule reads.
  // Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How a viewing gets booked',
    lede: 'Viewing & Site-Visit Scheduling reads your team’s calendars and the address of each property or site, then offers the client times that fit both the diary and the route. Here is one example flow for a villa viewing; your areas, calendars and reminder times are set up around how your team works.',
    steps: [
      {
        title: 'A viewing is requested',
        text: 'A buyer asks on WhatsApp to view a villa in Dubai Hills this weekend.',
      },
      {
        title: 'Times that fit the route',
        text: 'The system checks the agent’s diary and nearby viewings, then offers slots that fit the day’s route.',
      },
      {
        title: 'The buyer picks a slot',
        text: 'The buyer chooses a time, and the viewing goes straight into the agent’s calendar.',
      },
      {
        title: 'A reminder with a pin',
        text: 'Before the viewing, the buyer gets a reminder with a location pin for the villa.',
      },
      {
        title: 'The agent is reminded too',
        text: 'The agent gets a reminder with the same pin and the buyer’s name and number.',
      },
      {
        title: 'One sensible route',
        text: 'The agent’s viewings that day follow one sensible route, not trips back and forth across the city.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1C.3's list, 1C.1's reminder channels and calendar sync,
  // or §9 for the consent and human line)
  deliverables: {
    heading: 'What’s included',
    items: [
      'Automatic booking for property viewings, site surveys and inspections',
      'Route-friendly scheduling that keeps each agent’s or surveyor’s visits in a sensible order',
      'Each booking placed straight into the agent’s or surveyor’s calendar',
      'Reminders to the client with a location pin',
      'Reminders to your staff with the same location pin',
      'Reminders by WhatsApp, SMS or email, in Arabic and English',
      'Consent wording in every message, and a person on your team one reply away',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1C.1 and §8 name (Booking, Messaging, CRM,
  // Automation). Lede: 46 words
  worksWith: {
    heading: 'Works with the calendars your team uses',
    lede: 'Viewings and site visits are booked into your team’s Google Calendar, Outlook or Cal.com, and each booking can be logged in your CRM. Reminders with location pins go out through the WhatsApp Business API, SMS or email. We build the flows on n8n, Make or Zapier.',
    platforms: [
      'Google Calendar',
      'Outlook',
      'Cal.com',
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

  // 6 · Is it right for you? Catalogue 7.5 (Real Estate: "Viewing Scheduling"), 1C.3's surveyors and
  // inspections, and a decision aid. Lede: 36 words
  fit: {
    heading: 'Is viewing scheduling right for you?',
    lede: 'Viewing & Site-Visit Scheduling suits any team that meets clients on site: agents showing property, surveyors measuring sites and staff carrying out inspections. It is a best-fit automation for real estate. These questions help you decide.',
    goodFit: [
      'Real estate agencies whose agents run several viewings a day',
      'Firms whose surveyors visit a site before they can quote',
      'Companies whose staff carry out inspections at clients’ properties',
    ],
    decisionAid: [
      {
        question: 'Does booking a viewing take several calls or messages?',
        answer: 'Then automatic booking lets the client pick a time that already fits the agent’s diary.',
      },
      {
        question: 'Do your agents or surveyors cross the city between visits?',
        answer: 'Then route-friendly scheduling offers times that keep each day’s visits in a sensible order.',
      },
      {
        question: 'Do clients turn up late, or at the wrong address?',
        answer: 'Then reminders with a location pin show them where to go, and when.',
      },
      {
        question: 'Do you arrange only a few visits a week?',
        answer: 'Then your diary may cope for now. A free AI audit shows which automations pay back first.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3: pick an industry, real estate among
  // them, and watch "lead arrives → AI replies → CRM updated → appointment booked"; P7 builds it, so
  // nothing here says it works today or shows this exact flow)
  tryIt: {
    heading: 'Watch a real estate workflow run',
    line: 'The workflow explorer will let you pick real estate and watch an automation run step by step, from the first enquiry to the booked appointment. It is still being built and arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (1C.1: WhatsApp, SMS and email; 1A.1: Arabic
  // and English; catalogue §9: consent wording and a way to reach a human; 1K.1: retention and access
  // rules). No laws, RERA or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for UAE viewings and visits',
    points: [
      'WhatsApp first: booking messages and reminders go to WhatsApp, with SMS or email for clients who prefer them.',
      'Arabic and English: every message and reminder can go out in either language, set for each client.',
      'Consent wording in every message, and a client can reach a person on your team at any step.',
      'Data rules from day one: who can see client details and addresses, and how long they are kept, agreed before launch.',
    ],
  },

  // 9 · Pairs well with: the Speed-to-Lead System (1B.1) and CRM Setup & Automation (1B.6), its two
  // fellow best fits for real estate in catalogue 7.5 ("60 seconds" is the facts §6 design target,
  // written as one; "Viewing booked" is the CRM page's own example stage), and Appointment Reminder &
  // No-Show Reduction (1C.2, the same sub-group). No bundle includes 1C.3
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.1',
        line: 'Is built to answer each new portal lead within 60 seconds, so a viewing can be offered while the buyer is still keen.',
      },
      {
        catalogueNumber: '1B.6',
        line: 'Sets up a CRM pipeline with stages such as Viewing booked, so each viewing moves its deal forward.',
      },
      {
        catalogueNumber: '1C.2',
        line: 'Adds a reminder series with one-tap confirm or reschedule, and automatic rebooking when a client misses a visit.',
      },
    ],
  },

  faq: {
    heading: 'Questions about viewing scheduling',
    lede: 'What agencies and site teams ask first: cost, timing, routes, calendars, Arabic and privacy.',
  },
};
