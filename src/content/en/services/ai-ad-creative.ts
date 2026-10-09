// The service page's copy: AI Ad Creative Production (catalogue 4B.6, registry R076, 🔥 lead),
// batch 1 of the service pages under the standing plan
// (docs/plans/2026-10-08-service-pages-standing-plan.md; engine §3.1, the service order; the pilot
// speed-to-lead-system.ts is the model).
// Sources: the Services Catalogue (4B.6's list; 4B.1–4B.4, the ad channels the creatives run on;
// 4B.3's "creator-style ads" and "younger audiences"; 4E's Creative stage, "Made in-house, tested in
// market, replaced when fatigued"; 4C.2's Arabic and English copywriting; 5.4 E-Commerce Growth
// Engine; 6.3; 7.2 and 7.5 "E-Commerce & Beauty"; §8 Messaging and Analytics; §9 naming rules),
// docs/facts/company-facts.md, and Home's published data answer ("We never sell or share your
// data").
// Left out, and why: no prices, turnaround times, clients, results, ROAS or cost-per-lead numbers
// (10 §3; facts §3, §5); no ad platform policies, ad review rules or disclosure rules for
// AI-generated ads (no citation row is APPROVED yet); no promise of better ad results (catalogue
// §9); no named AI video or image tools, because the catalogue names none; no rights or licence
// terms for the finished creatives and no statement on AI-generated people in UGC-style ads, both
// owner policy questions. No "Try it": no demo matches this service (types.ts), so the hero shows
// the audit CTA alone.
// Works with: the chips hold only §8 names (Instagram; GA4, Google Tag Manager, Meta Conversions
// API, LinkedIn Insight), because 4B.6's entry names no platform; the ad channels (Google, Meta,
// TikTok, Snapchat, LinkedIn) are named in the lede's prose from 4B.1–4B.4.
// The flow is an example, labelled as one (10 §3.6). The FAQ questions are in faq-bank.ts
// (aiAdCreativeFaq).
import type { ServicePageContent } from '@/content/en/services/types';
import { siteConfig } from '@/lib/site-config';

export const aiAdCreative: ServicePageContent = {
  catalogueNumber: '4B.6',
  // 40 characters; rendered with " | Deepzeta AI", 54 (08 §1: 50–60)
  title: 'AI Ad Creative Production for UAE Brands',
  // 145 characters: the key point in the first 120 (the formats, many variations, tired ads
  // replaced; 4B.6's list), ends with the action (08 §1)
  description: `AI Ad Creative Production by ${siteConfig.brandName} makes video, UGC-style and static ads in many variations, and replaces tired ones. Book a free AI audit.`,
  // 55 characters, one statement headline (4E: "replaced when fatigued")
  heading: 'AI Ad Creative Production: fresh ads when old ones tire',
  // 55 words: what it is (4B.6's list), the outcome (variations to test, tired ads replaced) and who
  // it's for (7.5 E-Commerce & Beauty, 7.2 consumer brands; the 4B channels)
  answer: `AI Ad Creative Production by ${siteConfig.brandName} makes AI-assisted video, UGC-style and static ads, plus 3D and motion graphics, for your campaigns. You get many variations to test, and tired creatives are replaced when their performance drops. It is for e-commerce, beauty and consumer brands that run paid ads on Meta, Google, TikTok or Snapchat.`,

  // 2 · The problem it solves (before-after, at most 5 rows; 4B.6's three items and 4E's Creative
  // stage). The lede is 34 words
  problem: {
    heading: 'When the same ad runs too long',
    lede: 'An ad that worked last month can stop working this month, and making new ones takes time your team may not have. Here is what changes when creative production keeps pace with your campaigns.',
    rows: [
      {
        before: 'The same creatives run until results fade.',
        after: 'Fresh creatives are ready to replace any ad whose performance drops.',
      },
      {
        before: 'Each new video needs a shoot, an editor and rounds of feedback.',
        after: 'AI-assisted video and static ads are made in-house from your brief, products and brand.',
      },
      {
        before: 'You run each ad in a single version and guess why it worked.',
        after: 'Many variations are made for testing, so results, not opinions, decide.',
      },
      {
        before: 'Every campaign gets the same style of ad, whatever the audience.',
        after: 'UGC-style video, static ads, 3D and motion graphics give each campaign a format that suits it.',
      },
      {
        before: 'Nobody can say which version of an ad actually performed.',
        after: 'Each variation’s performance is read from your ad accounts, so you see which one works.',
      },
    ],
  },

  // 3 · How it works (story-flow): 4B.6's list and 4E's make-test-replace stage as one example flow
  // for a skincare brand (7.5 E-Commerce & Beauty), labelled "Example". The lede is 60 words; each
  // title ≤ 5 words, each text ≤ 20 words (types.ts)
  how: {
    heading: 'How AI Ad Creative Production works',
    lede: 'AI Ad Creative Production runs as a loop: make, test, measure, replace. We produce variations from your brief, your campaigns test them, and the results decide what runs next. AI speeds up production; our team directs it. Here is one example flow for a skincare brand running Meta and TikTok ads; your products, channels and brand rules shape the real loop.',
    steps: [
      {
        title: 'Brief and brand rules',
        text: 'The brand shares its products, offer and brand rules, and we agree the formats and platforms.',
      },
      {
        title: 'Variations produced in-house',
        text: 'We make AI-assisted videos, UGC-style clips and static ads in many variations.',
      },
      {
        title: 'The brand approves',
        text: 'The brand reviews the creatives and approves the ones that go live.',
      },
      {
        title: 'Tested side by side',
        text: 'Approved variations run side by side in the brand’s Meta and TikTok campaigns.',
      },
      {
        title: 'Tired ads replaced',
        text: 'When an ad’s performance drops, a fresh variation replaces it and the loop starts again.',
      },
    ],
    exampleLabel: 'Example flow',
  },

  // 4 · What you get (at most 8: 4B.6's list, 4B.3's creator-style look, 4C.2's Arabic and English
  // copywriting)
  deliverables: {
    heading: 'What you get',
    items: [
      'AI-assisted video ads for your campaigns',
      'UGC-style ads with a natural, creator-style look',
      'Static ads sized for the placements in your campaigns',
      '3D and motion graphics for products, offers and launches',
      'Many variations of each idea, ready for testing',
      'Fresh creatives to replace ads whose performance drops',
      'Ad copy and on-screen text in Arabic, English or both',
    ],
  },

  // 5 · Works with: the chips are §8 names only (see the header); the lede (40 words) names the ad
  // channels from 4B.1–4B.4 and 4E's "Made in-house"
  worksWith: {
    heading: 'Works with your ad accounts and tracking',
    lede: 'Creatives are made in-house for your campaigns on Google, Meta, TikTok, Snapchat and LinkedIn. Performance is read from your ad accounts and your tracking, such as GA4 and the Meta Conversions API, so each replacement follows real results, not taste.',
    platforms: ['Instagram', 'GA4', 'Google Tag Manager', 'Meta Conversions API', 'LinkedIn Insight'],
  },

  // 6 · Is it right for you? Catalogue 7.5 (E-Commerce & Beauty: "AI Ad Creative"), 5.4 (online
  // stores and D2C brands; its Google and Meta ads), 4B.3 (younger audiences), and a decision aid.
  // The lede is 45 words
  fit: {
    heading: 'Is it right for you?',
    lede: 'AI Ad Creative Production suits brands that run paid ads and need new creatives more often than a shoot allows. E-commerce and beauty brands are its best fit. Inside the E-Commerce Growth Engine, it feeds the Google and Meta campaigns. These questions help you decide.',
    goodFit: [
      'E-commerce and D2C brands running Meta and Google ads',
      'Beauty and cosmetics brands with regular launches and offers',
      'Consumer brands reaching younger audiences on TikTok and Snapchat',
    ],
    decisionAid: [
      {
        question: 'Do your ads perform well at first, then fade?',
        answer: 'Then a steady supply of fresh variations lets you replace them before results slide further.',
      },
      {
        question: 'Do creatives change only when someone finds the time?',
        answer: 'Then a replacement loop tied to performance takes the timing out of guesswork.',
      },
      {
        question: 'Do you need video but lack the time or budget for shoots?',
        answer: 'Then AI-assisted video and motion graphics can be made from your products and brand assets.',
      },
      {
        question: 'Do you already have product photos and brand assets?',
        answer: 'Then production starts from them, and every variation stays true to how your brand looks.',
      },
      {
        question: 'Are you not running paid ads yet?',
        answer: 'Then creatives can wait. A free AI audit shows which channel to open first.',
      },
    ],
  },

  // 7 · Try it: left out, no demo matches this service (types.ts; the caller's batch brief)

  // 8 · UAE specifics: Deepzeta AI's own practice only (4C.2: Arabic and English copywriting; 4E:
  // made in-house, tested in market, replaced when fatigued; the 4B channels; the client's approval
  // before anything runs). Ramadan, Eid and UAE National Day are named as campaign moments, with no
  // claim about them. No laws or ad platform rules until their citation rows are APPROVED.
  uae: {
    heading: 'Made for UAE audiences',
    points: [
      'Arabic and English: copy and on-screen text in either language, or both, for the audiences you target.',
      'Seasonal moments planned ahead: creatives for Ramadan, Eid and UAE National Day campaigns.',
      'Made in-house, tested in market and replaced when fatigued, never left running until results fade.',
      'Formats for the channels UAE campaigns run on, from Meta and Google to TikTok and Snapchat.',
      'You approve every creative before it goes live in your campaigns.',
    ],
  },

  // 9 · Pairs well with: the add-on Analytics & Tracking Setup (6.3), Meta Ads (Facebook &
  // Instagram) (4B.2), whose line names the E-Commerce Growth Engine solution (bundle 5.4) both
  // belong to, and TikTok & Snapchat Ads (4B.3)
  pairs: {
    heading: 'Pairs well with',
    items: [
      {
        catalogueNumber: '6.3',
        line: 'Sets up GA4, Google Tag Manager and the Meta Conversions API, so you can see which creative brings results.',
      },
      {
        catalogueNumber: '4B.2',
        line: 'Runs the lead ads, catalogue ads and Advantage+ campaigns these creatives feed. Both are part of the E-Commerce Growth Engine.',
      },
      {
        catalogueNumber: '4B.3',
        line: 'Runs short-video campaigns and creator-style ads for younger audiences, the formats UGC-style creatives are made for.',
      },
    ],
  },

  faq: {
    heading: 'Questions about AI Ad Creative Production',
    lede: 'What brands ask before handing over their creative: cost, timing, results, Arabic and their files.',
  },
};
