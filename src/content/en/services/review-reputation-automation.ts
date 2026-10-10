// The Review & Reputation Automation page's copy (catalogue 1D.3, a lead service, registry R038),
// batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order;
// docs/design/service-page.md). The pilot's shape, its own words.
// Sources: the Services Catalogue (1D.3's list and "Best for", 1E.1, 1H.2 for AI-drafted Arabic and
// English text reviewed by a person, 1H.4, 4A.3, 1K.1, 5.2, 7.5, §8 platforms, §9 naming rules),
// the blueprint (the review and reputation card: automatic requests, AI-drafted replies; demo 3, the
// workflow explorer), docs/facts/company-facts.md.
// Left out on purpose: 1D.3's "before posting publicly" — the manager alert is written as an alert,
// never as keeping unhappy customers from reviewing (a platform-policy question with no APPROVED
// citation row; flagged to the owner); every policy claim about reviews (incentives, filtering,
// Google's rules: no APPROVED citation row); any rating, ranking or volume result (facts §5); prices
// and timeframes (facts §3: UNKNOWN); review sites other than Google (the catalogue names Google
// reviews only). The UAE section states only Deepzeta AI's own practice (catalogue §9, 1K.1, 1H.1).
// Fields typed as catalogue numbers name a service by number; prose uses the exact catalogue names.
// The flow is an example, labelled as one (10 §3.6). The FAQ array at the end moves into faq-bank.ts
// when the page is wired.
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const reviewReputationAutomation: ServicePageContent = {
  catalogueNumber: '1D.3',
  // 41 characters; rendered with " | Deepzeta AI", 55 (08 §1: 50–60)
  title: 'Review & Reputation Automation in the UAE',
  // 155 characters: the key point (review requests after a service, drafted replies to Google
  // reviews) in the first 120, one concrete fact (Google reviews), ends with the action (08 §1)
  description: `${siteConfig.brandName}’s Review & Reputation Automation sends review requests after a service and drafts replies to Google reviews for approval. Book a free AI audit.`,
  // 45 characters: the three jobs of catalogue 1D.3 (requests, the manager alert, drafted replies);
  // clears the European banner at 360 × 640
  heading: 'Ask for reviews, catch complaints, reply fast',
  // 58 words: what it is, the outcome, who it's for (1D.3's "Best for")
  answer: `Review & Reputation Automation by ${siteConfig.brandName} asks customers for a review at the right moment after a service, alerts your manager when someone is unhappy, and drafts replies to your Google reviews for you to approve. It is for UAE clinics, restaurants, hotels and service companies that want reviews requested and answered without chasing them by hand.`,

  // 2 · The problem it solves (before-after, at most 5 rows; catalogue 1D.3's four capabilities, the
  // monitoring and the report as two rows). Lede: 37 words
  problem: {
    heading: 'Where reputation slips',
    lede: 'Your Google reviews speak for you before a customer ever calls. Yet asking for reviews, answering them and catching problems early all depend on someone finding the time. Here is what changes when the routine runs itself.',
    rows: [
      {
        before: 'Asking for a review depends on someone remembering at a busy moment.',
        after: 'Review requests go out automatically at the right moment after a service.',
      },
      {
        before: 'An unhappy customer’s first complaint can be a public one.',
        after: 'A customer who reports a problem reaches your manager straight away.',
      },
      {
        before: 'Google reviews wait for a reply because nobody has time to write one.',
        after: 'AI drafts a reply to each new Google review, ready for your approval.',
      },
      {
        before: 'A new review goes unnoticed until someone happens to look.',
        after: 'Reviews are monitored, so each new one is picked up and flagged.',
      },
      {
        before: 'You can’t tell at a glance whether your reputation is improving.',
        after: 'A monthly report shows how reviews, ratings and replies are trending.',
      },
    ],
  },

  // 3 · How it works (story-flow): catalogue 1D.3's list as one example flow, labelled "Example"; an
  // AC maintenance visit (1D.3's "service companies"; bundle 5.2's maintenance). The review link goes
  // in the request itself; a complaint in the reply alerts the manager. Lede: 45 words.
  // Each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How Review & Reputation Automation works',
    lede: 'Review & Reputation Automation listens for the end of a service, asks for the review, and keeps watch for what customers say afterwards. Here is one example flow for a home maintenance company; the trigger, the timing and the wording are set up around your business.',
    steps: [
      {
        title: 'The job is marked done',
        text: 'Your technician finishes an AC maintenance visit and marks the job complete in your job system.',
      },
      {
        title: 'The review request goes out',
        text: 'At the time you set, the customer gets a WhatsApp thank-you with a link to review you on Google.',
      },
      {
        title: 'A complaint reaches the manager',
        text: 'If the customer replies that something went wrong, your manager gets an alert to call them straight away.',
      },
      {
        title: 'AI drafts a reply',
        text: 'When a new Google review appears, AI drafts a reply in the language of the review, Arabic or English.',
      },
      {
        title: 'The manager approves it',
        text: 'Your manager approves or edits the draft, and the reply is posted under your business name.',
      },
      {
        title: 'The monthly report',
        text: 'Each month, a report sums up new reviews, their ratings and the replies sent.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8; catalogue 1D.3, §8 for the channels and triggers, §9 and 1H.1 for
  // consent and opt-out)
  deliverables: {
    heading: 'What you get',
    items: [
      'Review requests sent automatically at the right moment after a service',
      'Requests by WhatsApp, SMS or email, with a direct link to review you on Google',
      'Triggers from your calendar, CRM or job system, so requests follow completed services',
      'Manager alerts when a customer reports a problem',
      'AI-drafted replies to Google reviews, in Arabic or English, for your approval',
      'Review monitoring that flags each new review',
      'A monthly report on new reviews, ratings and replies',
      'Consent wording and an easy opt-out in every request',
    ],
  },

  // 5 · Works with: names as text, only those catalogue 1D.3 ("Google reviews") and §8 (Messaging,
  // CRM, Booking, AI models, Automation) name
  worksWith: {
    heading: 'Works with Google reviews and your systems',
    lede: 'Each request is triggered by your calendar, CRM or job system and sent through the WhatsApp Business API, SMS or email. Replies to Google reviews are drafted with AI models such as OpenAI, Anthropic, Jais or Falcon, and we build the workflow on n8n, Make or Zapier.',
    platforms: [
      'Google reviews',
      'WhatsApp Business API',
      'SMS',
      'email',
      'Google Calendar',
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

  // 6 · Is it right for you? Catalogue 7.5's fits (Healthcare & Dentists, Hospitality & Restaurants:
  // "Review Automation"), 1D.3's "Best for", the Quote-to-Cash System's "Best for" (5.2), and a
  // decision aid
  fit: {
    heading: 'Is review automation right for you?',
    lede: 'Review & Reputation Automation suits businesses that serve customers in person or on site and want asking for reviews to be routine. It is a best-fit automation for healthcare and dentists and for hospitality and restaurants, and part of the Quote-to-Cash System for technical services and maintenance companies. Ask yourself these questions first.',
    goodFit: [
      'Clinics and dental practices that see patients by appointment',
      'Restaurants and hotels whose guests leave reviews on Google',
      'Technical services, maintenance and fit-out companies that finish jobs on site',
    ],
    decisionAid: [
      {
        question: 'Do you ask for reviews only when you remember?',
        answer: 'Then automatic requests after a service make asking a routine instead of an afterthought.',
      },
      {
        question: 'Do Google reviews wait days for a reply?',
        answer: 'Then AI-drafted replies leave your manager with a quick check and an approval.',
      },
      {
        question: 'Have you learned about a problem from a public review?',
        answer: 'Then manager alerts on complaints give your team the chance to act straight away.',
      },
      {
        question: 'Do you know every customer personally and ask in person?',
        answer:
          'Then asking face to face may be enough for now. A free AI audit shows where automation would pay back first.',
      },
    ],
  },

  // 7 · Try it: the stub's lead-in (blueprint demo 3, the workflow explorer; P7 builds it, so nothing
  // here says it works today or shows this exact flow)
  tryIt: {
    heading: 'Follow a workflow as it runs',
    line: 'The workflow explorer will let you choose your industry and follow an automated workflow step by step, the way a customer moves through it. It is still being built and arrives in a later update of this site.',
    trigger: 'Open the workflow explorer',
    demoId: 'workflow-explorer',
    icon: 'arrow',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (catalogue §9: consent wording and a way to
  // reach a human; 1H.2: Arabic and English text reviewed by a person; 1D.3: replies for approval;
  // 1H.1: opt-out). No laws or review-platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Made for UAE customers',
    points: [
      'Review requests go out on WhatsApp first, falling back to SMS or email.',
      'Draft replies in Arabic or English, matching the language of each review.',
      'A person approves every reply before it is posted.',
      'Consent wording in each request, and an easy way to opt out of future messages.',
      'Customers who reply to a request reach your manager directly.',
    ],
  },

  // 9 · Pairs well with: Job & Work-Order Management Automation (1E.1), with the Quote-to-Cash System
  // (bundle 5.2) named on its line, a fellow component; the add-on Google Business Profile
  // Automation (1H.4); and Local AI Dominance (Bilingual, Hyperlocal) (4A.3). No claim that reviews
  // change rankings (no source)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1E.1',
        line: 'A job marked complete can trigger the review request. Both are part of the Quote-to-Cash System.',
      },
      {
        catalogueNumber: '1H.4',
        line: 'Keeps your Google Business Profile active with scheduled posts, offers, and photo and information updates.',
      },
      {
        catalogueNumber: '4A.3',
        line: 'Optimises your Google Business Profile in Arabic and English and works on map pack ranking for each area and emirate.',
      },
    ],
  },

  faq: {
    heading: 'Questions about review automation',
    lede: 'What it costs, how it handles complaints and Arabic reviews, and what it can’t promise.',
  },
};
