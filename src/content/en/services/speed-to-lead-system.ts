// The pilot service page's copy: Speed-to-Lead System (catalogue 1B.1, registry R027), the P6 part A
// plan, S10 ("S10 detail"; engine §3.1, the service order; docs/design/service-page.md).
// Sources: the Services Catalogue (1B.1's list, §8 platforms, §9 naming rules, 1K.1, 6.1, 7.5),
// the blueprint (the speed-to-lead system card and demo 4), docs/facts/company-facts.md.
// "60 seconds" is the facts §6 service design target, written exactly as the allowlist has it, and
// always as a target, never as a measured result. No prices, timeframes, clients or results
// (10 §3; facts §3, §5). No external facts: no citation row is APPROVED yet, so the UAE section
// states only Deepzeta AI's own practice (catalogue §9, 1K.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const speedToLeadSystem: ServicePageContent = {
  catalogueNumber: '1B.1',
  // 39 characters; rendered with " | Deepzeta AI", 53 (08 §1: 50–60)
  title: 'Speed-to-Lead System for UAE Businesses',
  // 156 characters: the key point in the first 120, one concrete fact, ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Speed-to-Lead System is built to answer new leads from ads, portals, WhatsApp and calls within 60 seconds. Book a free AI audit to plan yours.`,
  // 59 characters, the catalogue's own promise for 1B.1 ("Every new lead gets a reply within 60 seconds")
  heading: 'Speed-to-Lead System: reply to every lead within 60 seconds',
  // 53 words: what it is, the outcome (a design target), who it's for
  answer: `The Speed-to-Lead System by ${siteConfig.brandName} is built to reply to every new lead within 60 seconds, on WhatsApp, SMS or email, then route it to the right salesperson. It is for UAE businesses that get enquiries from ads, property portals, their website and calls, and can’t afford to answer them hours later.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1B.1's five capabilities)
  problem: {
    heading: 'Where leads slip away',
    lede: 'Leads arrive from many places at all hours, and each one waits for someone to notice it. Every minute it waits is a minute a competitor can answer first. Here is what changes when the first reply is automatic.',
    rows: [
      {
        before: 'Portal, ad and website leads land in separate inboxes until someone checks.',
        after: 'Leads from ads, portals, your website, WhatsApp and calls enter one flow.',
      },
      {
        before: 'An enquiry sent at night waits for the next working day.',
        after: 'Every new lead gets a first reply within 60 seconds, day or night.',
      },
      {
        before: 'The first salesperson to notice a lead takes it, or nobody does.',
        after: 'Your routing rules send each lead to the right salesperson.',
      },
      {
        before: 'Managers learn that a lead was ignored when it is too late.',
        after: 'The manager gets an alert when nobody responds to a lead.',
      },
      {
        before: 'Calling back depends on someone having a free moment.',
        after: 'An optional AI call-back phones the lead straight away.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1B.1's list as one example flow, labelled "Example".
  // Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How the Speed-to-Lead System works',
    lede: 'The Speed-to-Lead System sits between your lead sources and your sales team. It catches each enquiry, sends the first reply and makes sure a named salesperson picks it up. Here is one example flow for a property enquiry; your sources, messages and routing rules are set up around how your team sells.',
    steps: [
      {
        title: 'A buyer enquires',
        text: 'A buyer asks about an apartment on a property portal such as Bayut, Property Finder or Dubizzle.',
      },
      {
        title: 'The first reply goes out',
        text: 'Within 60 seconds, the buyer gets a reply in your agency’s name on WhatsApp, or by SMS or email.',
      },
      {
        title: 'An AI call-back, if enabled',
        text: 'If you switch it on, an AI voice calls the buyer straight away, in Arabic or English.',
      },
      {
        title: 'Routed to the right salesperson',
        text: 'Your routing rules pick the salesperson, for example by area or language, and pass them the lead.',
      },
      {
        title: 'The manager steps in',
        text: 'If nobody responds, the manager gets an alert and can hand the lead to someone else.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8, each from catalogue 1B.1, or §9 for the consent and human line)
  deliverables: {
    heading: 'What you get',
    items: [
      'Lead capture from your ads, website, WhatsApp, phone calls, Bayut, Property Finder and Dubizzle',
      'An instant first reply to every new lead, by WhatsApp, SMS or email',
      'First-reply messages in Arabic and English, written for your business',
      'An optional instant AI call-back to new leads',
      'Routing rules that send each lead to the right salesperson',
      'A manager alert whenever nobody responds to a lead',
      'Consent wording and a clear way to reach a person in every message',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1B.1 and §8 name
  worksWith: {
    heading: 'Works with your lead sources and tools',
    lede: 'Leads come in from the property portals, your ads, your website forms, WhatsApp and phone calls. First replies go out through the WhatsApp Business API, SMS or email. We build the flows on n8n, Make or Zapier, and can log each lead in your CRM.',
    platforms: [
      'Bayut',
      'Property Finder',
      'Dubizzle',
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

  // 6 · Is it right for you? Catalogue 7.5's fits (Real Estate: "Speed-to-Lead (portals)";
  // Education & Training: "Enquiry Speed-to-Lead"), the blueprint's ad leads, and a decision aid
  fit: {
    heading: 'Is it right for you?',
    lede: 'The Speed-to-Lead System suits any business where new enquiries arrive faster than the team can answer them. It is a best-fit automation for real estate and for education and training, and it suits anyone who pays for leads from ads. These questions help you decide.',
    goodFit: [
      'Real estate agencies and brokers with leads from Bayut, Property Finder and Dubizzle',
      'Education and training providers that get enquiries about their courses',
      'Businesses that run ads and want every paid lead answered fast',
    ],
    decisionAid: [
      {
        question: 'Do leads reach you from more than one place?',
        answer: 'Then one flow that catches every source saves your team from checking several inboxes.',
      },
      {
        question: 'Do enquiries arrive in the evening or at weekends?',
        answer: 'Then an automatic first reply means nobody waits until your team is back.',
      },
      {
        question: 'Do several salespeople share the leads?',
        answer: 'Then routing rules and manager alerts give every lead a clear owner.',
      },
      {
        question: 'Do you already answer every lead within minutes, by hand?',
        answer: 'Then you may not need it yet. A free AI audit shows what to automate first instead.',
      },
    ],
  },

  // 7 · Try it: the stub's lead-in (blueprint demo 4; P7 builds the live test, so nothing here says
  // it works today). The trigger matches Home's: "60-second" would put a bare "60" past the
  // numbers allowlist, which only holds "60 seconds".
  tryIt: {
    heading: 'See it from your lead’s side',
    line: 'The speed-to-lead test will let you leave your number and get a WhatsApp reply from our own automation, just as your leads would. The test is still being built and goes live in a later update of this site.',
    trigger: 'Take the speed-to-lead test',
    demoId: 'speed-to-lead',
    icon: 'send',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (catalogue §9: consent wording and a way to
  // reach a human; §8: Arabic and English voices; 1A.3 and 1H.1: opt-out handling). No laws or
  // platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for UAE leads',
    points: [
      'WhatsApp first: the first reply goes to WhatsApp, with SMS and email for leads who don’t use it.',
      'Arabic and English: replies and the AI call-back come in both languages, and you choose which each lead gets.',
      'Consent wording in every message and call, and a simple way for the lead to opt out.',
      'A person is always one reply away: the lead can ask for a human, and your salesperson takes over.',
    ],
  },

  // 9 · Pairs well with: the add-on AI Sales Prospecting & Outreach (1B.7), and the AI Front Desk
  // solution (bundle 5.1), named in prose on the line of WhatsApp AI Agent (1A.1), its fellow
  // component; the type takes service numbers only, so the bundle has no field of its own
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1B.7',
        line: 'Finds B2B prospects and contacts them by email and LinkedIn, while this system answers the leads who come to you.',
      },
      {
        catalogueNumber: '1A.1',
        line: 'Carries the WhatsApp conversation on after the first reply. Both are part of the AI Front Desk solution.',
      },
    ],
  },

  faq: {
    heading: 'Questions about the Speed-to-Lead System',
    lede: 'Straight answers on cost, set-up time, Arabic replies and your data.',
  },
};
