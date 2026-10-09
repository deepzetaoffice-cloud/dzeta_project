// The service page's copy: Local AI Dominance (Bilingual, Hyperlocal) (catalogue 4A.3, registry
// R070, 🔥 lead), batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order; the pilot
// speed-to-lead-system.ts is the model).
// Sources: the Services Catalogue (4A.3's list, 1H.4, 1D.3, 2.1's "Local SEO setup for each area or
// emirate served", 4A.1, 5.3 Get Found by AI, 5.5 Launch Pack, 5.1 and 7.4 local industries, §8
// AI models, §9 naming rules), the blueprint (D6, Local AI Dominance as bilingual; demo 6, "See how
// AI reads this page"), docs/facts/company-facts.md, and this site's own build: the name, address
// and phone read from the one site config (src/lib/site-config.ts) and the check:facts gate that
// fails any retyped contact fact.
// Left out, and why: no prices, timeframes, clients, rankings, map positions, review counts or
// ratings (10 §3; facts §3, §5); no claim about how Google ranks the map pack, how Google Business
// Profile roles, languages or categories work, or how AI assistants pick local businesses (no
// citation row is APPROVED yet, so the copy describes our own practice only); no promise of a map
// pack position (catalogue §9); no review policy beyond 1D.3's own list. ChatGPT and Perplexity
// aren't in the platform chips: 4A.3's entry and §8 don't name them (§8 names Google Gemini).
// The sibling 4A.1 is citation-wide; this page stays local, bilingual and area by area. The short
// form "Local AI Dominance" is the catalogue's own (5.3, 5.5); the full name opens the direct
// answer. The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (localAiDominanceFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const localAiDominance: ServicePageContent = {
  catalogueNumber: '4A.3',
  // 40 characters; rendered with " | Deepzeta AI", 54 (08 §1: 50–60)
  title: 'Local AI Dominance in Arabic and English',
  // 154 characters: the key point in the first 120 (the Google Business Profile in both languages,
  // per area and emirate; 4A.3's own items), ends with the action (08 §1)
  description: `Local AI Dominance by ${siteConfig.brandName} optimises your Google Business Profile in Arabic and English, for each area and emirate you serve. Book a free AI audit.`,
  // 58 characters, one statement headline
  heading: 'Local AI Dominance: get found nearby in Arabic and English',
  // 58 words: the full catalogue name, the outcome, what it covers (4A.3's four items) and who it's
  // for (catalogue 7.4 and 5.1's local businesses)
  answer: `Local AI Dominance (Bilingual, Hyperlocal) by ${siteConfig.brandName} helps customers find you in each area and emirate you serve. We optimise your Google Business Profile in Arabic and English, work on map pack ranking, keep your details consistent everywhere and build local AI-search visibility. It is for clinics, gyms, car services and other businesses that serve their area.`,

  // 2 · The problem it solves (before-after, at most 5 rows; 4A.3's four items). The lede is 37 words
  problem: {
    heading: 'Where nearby customers miss you',
    lede: 'Your nearest customers may search in Arabic or English, from a street away or across the emirate. Each gap in your profile and your business details is a reason to choose someone else. Here is what changes.',
    rows: [
      {
        before: 'Your Google Business Profile is in English only, with thin details.',
        after: 'Your profile is optimised in Arabic and English, with full and accurate details.',
      },
      {
        before: 'You show up near your office, but not in the other areas you serve.',
        after: 'Map pack work is planned for each area and emirate you serve.',
      },
      {
        before: 'Your name, address and phone differ from one directory to the next.',
        after: 'Local citations carry the same business details everywhere, in both languages.',
      },
      {
        before: 'AI assistants describe your business vaguely, or not at all, when asked about your area.',
        after: 'Your local facts are stated clearly, so AI assistants have accurate details to work from.',
      },
    ],
  },

  // 3 · How it works (story-flow): 4A.3's list as one example flow for a dental clinic (catalogue
  // 7.4), labelled "Example"; the neighbourhoods are examples of areas, not clients. The lede is 59
  // words; each title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How Local AI Dominance works',
    lede: 'Local AI Dominance works area by area and in both languages. We fix your profile first, then your details across the web, then the areas you want to reach, and finally how AI assistants describe you locally. Here is one example flow for a dental clinic in Dubai serving several neighbourhoods; your own areas and services decide the real plan.',
    steps: [
      {
        title: 'Profile checked in both languages',
        text: 'We check the clinic’s Google Business Profile for missing details, wrong categories and English-only text.',
      },
      {
        title: 'Arabic and English versions',
        text: 'The profile’s services and description are prepared in Arabic and English, each written natively.',
      },
      {
        title: 'Details made consistent',
        text: 'The clinic’s name, address and phone are matched across directories and local citations.',
      },
      {
        title: 'Each neighbourhood planned',
        text: 'Map pack work is planned for each neighbourhood the clinic serves, such as Al Barsha or Jumeirah.',
      },
      {
        title: 'Local AI answers checked',
        text: 'We ask AI assistants local questions in both languages and record how they describe the clinic.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8, each from 4A.3's list; the second spells out the profile work)
  deliverables: {
    heading: 'What you get',
    items: [
      'Google Business Profile optimisation in Arabic and English',
      'Categories, services, hours and descriptions corrected on your profile',
      'Map pack work planned for each area and emirate you serve',
      'Local citations with your business details consistent everywhere',
      'Local AI-search visibility, checked in Arabic and English',
    ],
  },

  // 5 · Works with: names as text, only those 4A.3's entry (Google Business Profile, the map pack,
  // local citations) and §8 (Google Gemini) name. The lede is 41 words
  worksWith: {
    heading: 'Works where local customers look',
    lede: 'The work centres on your Google Business Profile and the map pack, plus the directories and local citations that list your business. We also check how AI assistants such as Google Gemini describe your business locally, in Arabic and in English.',
    platforms: ['Google Business Profile', 'Map pack', 'Local citations', 'Google Gemini'],
  },

  // 6 · Is it right for you? Catalogue 5.3 (any local or B2B business), 5.5 (Launch Pack, new
  // businesses), 5.1 and 7.4's local industries, and a decision aid. The lede is 44 words
  fit: {
    heading: 'Is it right for you?',
    lede: 'Local AI Dominance suits any business whose customers come from the areas around it and search in Arabic, English or both. It is part of the Get Found by AI solution, and of the Launch Pack for new businesses. Use these questions to decide.',
    goodFit: [
      'Clinics and dentists whose patients come from nearby neighbourhoods',
      'Car services, gyms, salons and pet care businesses serving their area',
      'Technical services and building maintenance companies covering more than one emirate',
      'New businesses that need a local presence from launch, through the Launch Pack',
    ],
    decisionAid: [
      {
        question: 'Do customers come to you, or do you go to them?',
        answer: 'Either way, map pack work is planned for each area you serve, not only the street your office is on.',
      },
      {
        question: 'Do your customers search in Arabic as well as English?',
        answer: 'Then a profile in both languages gives each of them details they can read at a glance.',
      },
      {
        question: 'Has your business moved, rebranded or changed its phone number?',
        answer: 'Then old details may still be listed online, so consistent local citations come first.',
      },
      {
        question: 'Do you sell only online, with no local customers?',
        answer: 'Then local work matters less for you. A free AI audit shows where to start instead.',
      },
    ],
  },

  // 7 · Try it: the non-commodity point, our own details from one source (true today: the site
  // config and the check:facts gate), and AI View (blueprint demo 6; P7 builds it), which says it
  // is still being built. 53 words
  tryIt: {
    heading: 'One source for our own details',
    line: 'On this site, our name, address and phone come from one source, and an automated check rejects any page that retypes them by hand. AI View will show those details as they sit in this page’s structured data. The tool is still being built and goes live in a later update of this site.',
    trigger: 'See how AI reads this page',
    demoId: 'ai-view',
    icon: 'globe',
  },

  // 8 · UAE specifics: Deepzeta AI's own practice only (4A.3: Arabic and English, each area and
  // emirate, consistent details; opening hours as part of the profile's details). No laws or
  // platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Built for local search in the UAE',
    points: [
      'Arabic and English: your profile, services and descriptions in both, so customers read them in the language they search in.',
      'Each emirate and area you serve gets its own plan, from a single neighbourhood to several emirates.',
      'The same name, address and phone in both languages, wherever your business is listed.',
      'Opening hours that match reality, including Ramadan and public holiday hours.',
    ],
  },

  // 9 · Pairs well with: the add-on Google Business Profile Automation (1H.4), Review & Reputation
  // Automation (1D.3) and AI Citation & Answer Engine Optimisation (4A.1), whose line names the Get
  // Found by AI solution (bundle 5.3) both belong to
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '1H.4',
        line: 'Keeps the profile active after set-up, with scheduled posts and updates, so the details this service fixes stay current.',
      },
      {
        catalogueNumber: '1D.3',
        line: 'Sends review requests at the right moment after a service, and drafts replies to Google reviews for your approval.',
      },
      {
        catalogueNumber: '4A.1',
        line: 'Takes your business into AI answers beyond your area: entity, schema and direct-answer content. Both are part of Get Found by AI.',
      },
    ],
  },

  faq: {
    heading: 'Questions about Local AI Dominance',
    lede: 'What local business owners ask: cost, timing, Arabic profiles, ownership and what no one can promise.',
  },
};
