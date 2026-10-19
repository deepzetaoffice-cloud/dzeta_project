// The service page's copy: Loyalty, Renewal & Win-Back Automation (catalogue 1D.4, registry R039, a
// core service), from the pilot template (the service pages' standing plan, 2026-10-08, batch 2;
// engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1D.4's list; 7.5's fits for fitness and gyms, "Renewal & Win-Back
// Automation", and for automotive, "Service-Due Reminders"; 1E.2, contract renewal alerts, for the
// maintenance fit and the pairs; 1H.1, segmented campaigns with consent and opt-out management, for
// the campaign-or-reminder decision aid and the consent check; §8 platforms; §9 naming rules, consent
// and a way to reach a human; 0.1, the audit's written summary and quote; 1K.1, retention and access
// rules; 1C.1 and 1D.3 for the pairs), the blueprint (demo 3, the workflow explorer),
// docs/facts/company-facts.md.
// Left out, with no source: prices, timeframes, clients, return, renewal or redemption rates, and any
// offer value (10 §3; facts §3, §5; the inactivity period and reminder timing read "the period you
// set", since no number is allowlisted); a points or stamps programme (1D.4 lists none, so "loyalty"
// means the reminders, offers and referrals it does list); WhatsApp's template and marketing-message
// rules, and any law on marketing messages or birthday data (no citation row is APPROVED). No bundle
// includes 1D.4, so none is named. The UAE section states only Deepzeta AI's own practice (catalogue
// §9, 1H.1, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (loyaltyRenewalWinBackAutomationFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const loyaltyRenewalWinBackAutomation: ServicePageContent = {
  catalogueNumber: '1D.4',
  // 38 characters, the exact catalogue name; rendered with " | Deepzeta AI", 52 (08 §1: 50–60)
  title: 'Loyalty, Renewal & Win-Back Automation',
  // 155 characters: the key point (renewal and service-due reminders) in the first 120 (ends at 93),
  // one concrete fact (birthday offers), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Loyalty, Renewal & Win-Back Automation sends renewal and service-due reminders, birthday offers and win-back campaigns. Book a free AI audit.`,
  // 37 characters: catalogue 1D.4's three jobs (reminders, offers, win-backs) as verbs; clears the
  // European banner at 360 × 640 under the long breadcrumb
  heading: 'Remind, reward and win back customers',
  // 54 words: what it is, the outcome, who it's for (7.5: fitness and gyms, automotive)
  answer: `Loyalty, Renewal & Win-Back Automation by ${siteConfig.brandName} reminds customers when a renewal or service is due, sends birthday and anniversary offers, and runs win-back campaigns for customers who have gone quiet. It also asks customers for referrals. It is for UAE gyms, car service centres and other businesses that rely on repeat customers.`,

  // The hero photo, P26 (src/lib/media/photos.ts; the media plan): 120 characters (08 §7: ≤ 125)
  heroPhotoAlt:
    'Hands holding a phone with an offer message, beside a gift box with a lavender ribbon and a coffee, in a Dubai mall café',

  // 2 · The problem it solves (before-after, 5 rows; catalogue 1D.4's four capabilities, the renewal
  // and service-due reminders as two rows). Lede: 35 words
  problem: {
    heading: 'Where repeat customers slip away',
    lede: 'A customer who doesn’t renew hasn’t always chosen someone else. Sometimes the date simply passed and nobody got in touch. Each row shows what changes when renewals, offers and win-backs go out on their own.',
    rows: [
      {
        before: 'Renewal dates sit in a spreadsheet until a membership or contract has already lapsed.',
        after: 'Renewal reminders go out ahead of each date, on the schedule you set.',
      },
      {
        before: 'Customers learn a service is due only when something goes wrong.',
        after: 'Service-due reminders tell each customer when their next service is due.',
      },
      {
        before: 'Birthdays and anniversaries pass without a word from you.',
        after: 'Birthday and anniversary offers go out automatically, timed as you choose.',
      },
      {
        before: 'Customers who stop coming are never contacted again.',
        after: 'Win-back campaigns reach customers who have been inactive for the period you set.',
      },
      {
        before: 'Referrals depend on customers mentioning you without being asked.',
        after: 'Referral requests go out automatically, so asking becomes routine.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1D.4's list as one example flow, labelled "Example"; a gym
  // (7.5: Fitness & Gyms, "Renewal & Win-Back Automation"). The offer is an example of the client's
  // own choice, never a promised value. Lede: 52 words. Each title ≤ 5 words, each text ≤ 20 words
  // (types.ts)
  how: {
    heading: 'How the reminders and offers run',
    lede: 'Loyalty, Renewal & Win-Back Automation reads dates from your customer records: when a membership renews, when a service falls due, when someone last visited. Each date triggers a message by WhatsApp, SMS or email. Here is one example for a gym; your dates, offers and wording are set up around your business.',
    steps: [
      {
        title: 'A membership nears renewal',
        text: 'A member’s annual membership comes up for renewal, and the date is in your records.',
      },
      {
        title: 'A renewal reminder',
        text: 'Ahead of the date you set, a WhatsApp message reminds the member that their membership is due for renewal.',
      },
      {
        title: 'A birthday offer',
        text: 'On the member’s birthday, a message arrives with an offer you chose, such as a free guest pass.',
      },
      {
        title: 'A member goes quiet',
        text: 'A member who hasn’t visited for the period you set enters the win-back campaign.',
      },
      {
        title: 'Invited back',
        text: 'They receive a message inviting them back, and any reply goes straight to your front desk.',
      },
      {
        title: 'A referral request',
        text: 'After a member renews, a message asks whether they know someone who would enjoy training with you.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (7; each from catalogue 1D.4's list, 7.5 and 1E.2 for the service-due examples,
  // §8 for the channels, §9 and 1H.1 for consent and opt-out)
  deliverables: {
    heading: 'What’s included',
    items: [
      'Renewal reminders ahead of each membership, contract or subscription date',
      'Service-due reminders, for example for a car service or a maintenance visit',
      'Birthday and anniversary offers, sent on the dates in your records',
      'Win-back campaigns for customers inactive for a period you set',
      'Referral requests sent automatically, at the moments you choose',
      'Messages by WhatsApp, SMS or email, in Arabic and English',
      'Consent wording and an easy opt-out in every message, with replies reaching your team',
    ],
  },

  // 5 · Works with: names as text, only those catalogue §8 lists (CRM, Booking, Messaging,
  // Automation). Lede: 45 words
  worksWith: {
    heading: 'Works with your customer records',
    lede: 'Dates come from where you already keep customers: HubSpot, Zoho CRM, Pipedrive, Salesforce or Odoo, or a Google Calendar or Outlook diary of service visits. Messages go out through the WhatsApp Business API, SMS or email, and the automation runs on n8n, Make or Zapier.',
    platforms: [
      'HubSpot',
      'Zoho CRM',
      'Pipedrive',
      'Salesforce',
      'Odoo',
      'Google Calendar',
      'Outlook',
      'WhatsApp Business API',
      'SMS',
      'email',
      'n8n',
      'Make',
      'Zapier',
    ],
  },

  // 6 · Is it right for you? Catalogue 7.5 (Fitness & Gyms: "Renewal & Win-Back Automation";
  // Automotive: "Service-Due Reminders"), 1E.2 (contract renewal alerts), and a decision aid that
  // separates date-led messages (one customer at a time) from a campaign to a whole list (1H.1).
  // Lede: 43 words
  fit: {
    heading: 'Is win-back automation right for you?',
    lede: 'Loyalty, Renewal & Win-Back Automation suits businesses whose customers renew, return for a service or buy again. Renewal and win-back automation is a best fit for fitness and gyms, and service-due reminders for automotive businesses. These questions help you decide where to start.',
    goodFit: [
      'Gyms and fitness studios with memberships that renew',
      'Car service centres and garages whose customers come back for regular servicing',
      'Maintenance companies with service contracts that come up for renewal',
      'Businesses with past customers who haven’t heard from them in a while',
    ],
    decisionAid: [
      {
        question: 'Do memberships or contracts lapse before anyone gets in touch?',
        answer: 'Then renewal reminders reach each customer ahead of the date, with nobody checking a spreadsheet.',
      },
      {
        question: 'Do customers come back only when they remember a service is due?',
        answer: 'Then service-due reminders tell them when it is time, on WhatsApp, SMS or email.',
      },
      {
        question: 'Do you have past customers nobody has contacted in months?',
        answer: 'Then a win-back campaign invites them back, with an offer you choose and an easy way to opt out.',
      },
      {
        question: 'Do you want to send one offer to your whole list at once?',
        answer:
          'That is a campaign to a list, the job of Email & WhatsApp Marketing Automation. These messages follow each customer’s own dates.',
      },
    ],
  },

  // 7 · Try it: the workflow explorer's stub (blueprint demo 3: pick an industry and follow a customer
  // from the first message to a booked appointment, the path a win-back reply takes; P7 builds it, so
  // nothing here says it works today, and nothing promises it will show a renewal flow)
  tryIt: {
    heading: 'Follow a customer through a workflow',
    line: 'The workflow explorer will let you pick an industry and follow an automation step by step, from the first message to a booked appointment. It is still being built and arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (§8 messaging; 1A.1: Arabic and English;
  // catalogue §9: consent wording and a way to reach a human; 1H.1: consent and opt-out management).
  // No laws or platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Messages that suit UAE customers',
    points: [
      'The customer’s own channel: WhatsApp, SMS or email, whichever they agreed to hear from you on.',
      'Arabic and English: each message can be written in both, and every customer receives their own language.',
      'Offers you approve: you set each offer, its wording and who receives it, and nothing goes out unapproved.',
      'Consent wording and an easy opt-out in every message, and any reply reaches a person on your team.',
    ],
  },

  // 9 · Pairs well with: the Booking Automation System (1C.1: a reminder answered becomes a booking),
  // Maintenance Contract & Preventive Maintenance Scheduling (1E.2: AMC visits and contract renewal
  // alerts) and Review & Reputation Automation (1D.3, the same sub-group). No bundle includes 1D.4.
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1C.1',
        line: 'Lets a customer who answers a reminder book online, on WhatsApp or by phone, with confirmations and reminders.',
      },
      {
        catalogueNumber: '1E.2',
        line: 'Schedules annual maintenance contract visits automatically and alerts you when a contract is due for renewal.',
      },
      {
        catalogueNumber: '1D.3',
        line: 'Asks customers for a review at the right moment after a service, and drafts replies to your Google reviews.',
      },
    ],
  },

  faq: {
    heading: 'Questions about loyalty and win-back',
    lede: 'What owners ask before automating renewals and win-backs: cost, timing, consent, Arabic and results.',
  },
};
