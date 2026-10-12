// The privacy policy (/privacy, R006; the privacy page plan, docs/plans/2026-10-12-privacy-page.md).
// The copy is the owner-approved draft, docs/content-drafts/legal/privacy-policy.md, Part 2 (re-approved
// 2026-10-12), byte for byte except its {tokens}, which come from the site config (06 §3): a contact
// fact is never typed here (check:facts). Its periods, the law's number and the date are the policy's
// own terms, so check:facts exempts this file alone (the plan, question 2). External facts: S001, S002,
// S007, S012, S014, S015 (docs/facts/external-sources.md, APPROVED). The FAQ lives here, not in the
// bank, for the same exemption; the FAQ module and the FAQPage schema read the same strings.
import type { Tier1Name } from '@/components/icons/registry';
import type { FaqQuestion } from '@/content/en/faq-bank';
import { siteConfig } from '@/lib/site-config';

const brand = siteConfig.brandName;
const { legalName, email, address, licenceAuthority, licenceNumber, phone, whatsapp } = siteConfig;

export type LegalListItem = { lead?: string; text: string };

export type LegalBlock =
  | { kind: 'p'; text: string; lead?: string; strong?: true }
  | { kind: 'list'; items: readonly LegalListItem[] }
  | { kind: 'table'; caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }
  | { kind: 'sources'; label: string; items: readonly { label: string; publisher: string; href: string }[] };

export type LegalSection = { id: string; title: string; blocks: readonly LegalBlock[] };

export type LegalGlanceCard = { icon: Tier1Name; title: string; line: string };

// A list item shown only while its fact is set (facts §2: a null fact hides what uses it)
const ifSet = (value: string | null, item: LegalListItem): LegalListItem[] => (value ? [item] : []);

export const privacyPolicy = {
  // 2.1 Metadata (the layout's title template adds the brand, 08 §1)
  title: 'Privacy Policy: How We Protect Your Data',
  description:
    'How Deepzeta AI collects, uses and protects your personal data under the UAE PDPL, who processes it for us, and how to use your rights. Read the policy.',
  breadcrumb: 'Privacy policy',
  // 2.2 Hero
  eyebrow: 'Privacy',
  heading: 'Privacy Policy',
  answer: `${brand} collects only the personal data it needs to answer your enquiry and deliver your project, and never sells it. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland; elsewhere they're on until you switch them off in Cookie settings. Email ${email} to use your UAE PDPL rights.`,
  lastUpdatedLabel: 'Last updated',
  // The owner's re-approval (02 §1.5: a date changes only when the content really changes)
  lastUpdated: { iso: '2026-10-12', display: '12 October 2026' },
  // 2.3 At a glance
  glanceHeading: 'At a glance',
  glance: [
    { icon: 'lock', title: 'We never sell your data', line: 'Not to advertisers, not to data brokers, not to anyone.' },
    {
      icon: 'check',
      title: 'Cookies you control',
      line: 'We ask first in the EEA, the UK and Switzerland. Anywhere, you can switch them off at any time.',
    },
    {
      icon: 'mail',
      title: 'Your rights, one email away',
      line: `Ask to see, correct or delete your data at ${email}.`,
    },
    {
      icon: 'shield',
      title: 'Protected by UAE law',
      line: 'Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.',
    },
  ] satisfies readonly LegalGlanceCard[],
  // The contents list (the draft's Part 1, block 3)
  contentsLabel: 'Privacy policy sections',
  contentsHeading: 'On this page',
  // 2.4 Sections
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      blocks: [
        {
          kind: 'p',
          text: `This Privacy Policy explains how ${legalName}, trading as ${brand} ("${brand}", "we", "us"), collects, uses, shares and protects your personal data when you visit this website, message us on WhatsApp, contact us or work with us.`,
        },
        {
          kind: 'p',
          text: 'We handle personal data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "PDPL") and the other UAE laws that apply to us.',
        },
        {
          kind: 'p',
          text: 'In short: we collect what we need, we use it for the reason you gave it to us, we never sell it, and optional cookies wait for your permission if you visit from the EEA, the UK or Switzerland.',
        },
      ],
    },
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        {
          kind: 'p',
          text: `${brand} is the trading name of ${legalName}, a limited liability company licensed by the ${licenceAuthority}${licenceNumber ? `, trade licence number ${licenceNumber}` : ''}. Our office is at ${address}.`,
        },
        {
          kind: 'p',
          text: 'We build custom-coded websites, AI automations and growth systems for businesses in the UAE and the GCC. For the personal data described here, we are the controller: we decide why and how it is used.',
        },
      ],
    },
    {
      id: 'information-we-collect',
      title: 'What we collect',
      blocks: [
        {
          kind: 'p',
          text: "We collect the smallest amount of personal data that does the job. We don't ask for sensitive data (such as health, religion or biometric data) and ask you not to send it to us.",
        },
        {
          kind: 'table',
          caption: 'Table A: What we collect',
          head: ['Category', 'Examples', 'When'],
          rows: [
            [
              'Contact details',
              'Name, business name, email, phone or WhatsApp number, your WhatsApp profile name',
              'You message us, email us or book an audit',
            ],
            ['Your request', "The service you're interested in and your message", 'You message us or email us'],
            [
              'Booking details',
              "Meeting time, how you'd like to meet, the email you give for a confirmation, notes",
              'You book a call',
            ],
            [
              'Conversations',
              'Emails and WhatsApp messages with us, including voice notes and their written transcript',
              'You contact us or we reply',
            ],
            [
              'What our assistant remembers',
              'A short summary of your enquiry: your name, your email if you gave it, and what you asked',
              'You chat with our WhatsApp assistant',
            ],
            ['Project and billing records', 'Scope, quotes, invoices, payment status', 'You become a client'],
            [
              'How you found us',
              'Campaign tags (UTM) and ad click IDs saved with your form',
              'You arrive from a link or an ad and send a form',
            ],
            [
              'Technical data',
              'IP address, browser, device, pages visited, approximate location (city level)',
              "You visit the site. Analytics data: with your consent if you're in the EEA, the UK or Switzerland; elsewhere unless you switch it off.",
            ],
          ],
        },
      ],
    },
    {
      id: 'how-we-collect',
      title: 'How we collect it',
      blocks: [
        {
          kind: 'list',
          items: [
            { lead: 'From you:', text: 'through WhatsApp, email and phone calls.' },
            {
              lead: 'Automatically:',
              text: 'through essential cookies and, if you allow them, analytics and marketing cookies (§9). If you visit from outside the EEA, the UK and Switzerland, analytics and marketing are on until you switch them off.',
            },
          ],
        },
      ],
    },
    {
      id: 'how-we-use',
      title: "How we use it, and why we're allowed to",
      blocks: [
        {
          kind: 'table',
          caption: 'Table B: Purposes and legal basis',
          head: ['Purpose', 'Data used', 'Basis'],
          rows: [
            [
              'Reply to you, prepare and schedule your free AI audit',
              'Contact details, your request, booking details',
              'Your request (steps before a contract)',
            ],
            [
              'Answer your WhatsApp messages with our AI assistant, and remember your enquiry',
              "Your messages and voice notes, contact details, the assistant's summary",
              'Your request (steps before a contract)',
            ],
            [
              'Deliver and support your project',
              'Contact details, project records, conversations',
              'Our contract with you',
            ],
            ['Invoicing, tax and accounting', 'Billing records', 'UAE legal obligations'],
            ['Keep the site secure and stop spam and abuse', 'Technical data', 'Needed to run the site safely'],
            [
              'Understand which pages help people',
              'Analytics data',
              'Your consent in the EEA, the UK and Switzerland; elsewhere, your choice: on unless you switch it off',
            ],
            [
              'Measure our ads',
              'Marketing cookies; hashed email or phone',
              'Your consent in the EEA, the UK and Switzerland; elsewhere, your choice: on unless you switch it off',
            ],
            ['Send you ideas and news by email', 'Email address', 'Your consent (opt-in; unsubscribe any time)'],
          ],
        },
        {
          kind: 'p',
          text: "We don't use your data for anything unrelated to these purposes without asking you first.",
        },
      ],
    },
    {
      id: 'ai-features',
      title: 'Our WhatsApp AI assistant',
      blocks: [
        {
          kind: 'list',
          items: [
            {
              lead: 'Who replies:',
              text: "when you message us on WhatsApp, an AI assistant replies first and tells you it's an AI. It answers from what we've written about our services, and it can book your free AI automation audit.",
            },
            {
              lead: 'How it works:',
              text: "your messages go to DeepSeek, which writes the assistant's replies. OpenAI turns voice notes into text, checks messages for safety, and helps the assistant find the right answer in what we've written. OpenAI doesn't use what we send it to train its models.",
            },
            {
              lead: 'What it remembers:',
              text: "a short summary of your enquiry (your name, your email if you gave it, and what you asked), so you don't have to repeat yourself. We delete the messages themselves after 90 days, and clear the summary 12 months after your last message.",
            },
            {
              lead: 'Talking to a person:',
              text: "ask for a person at any time. If the assistant can't help, it passes your enquiry to our team, and a team member replies from their own WhatsApp number.",
            },
            { lead: "Please don't share", text: 'medical, ID or payment details in the chat.' },
            {
              lead: 'No automated decisions:',
              text: "we don't make decisions about you, with legal or similarly significant effects, based only on automated processing.",
            },
          ],
        },
      ],
    },
    {
      id: 'sharing',
      title: 'Who we share it with',
      blocks: [
        {
          kind: 'p',
          strong: true,
          text: 'We never sell or rent your personal data, and we never give it to other companies for their own marketing.',
        },
        {
          kind: 'p',
          text: 'We use a small number of service providers to run this website and our services. They process data on our behalf, for the purposes in this policy only.',
        },
        {
          kind: 'table',
          caption: 'Table C: Our service providers',
          head: ['Provider', 'What they do for us', 'Data involved'],
          rows: [
            ['Vercel', 'Hosts this website', 'Technical data'],
            [
              'Google',
              'Our email and calendar (Gmail, Google Calendar); tag management and analytics (Google Tag Manager, Google Analytics; with your consent in the EEA, the UK and Switzerland)',
              'Contact details, requests, conversations, booking details; analytics data',
            ],
            [
              'n8n',
              "Runs our automations: our WhatsApp assistant's steps, team alerts and booking emails",
              'Your messages, contact and booking details',
            ],
            [
              'Supabase',
              "Stores our WhatsApp conversations, the assistant's summary of your enquiry, and bookings",
              'Phone number, profile name, messages, booking details',
            ],
            ['DeepSeek', "Writes our WhatsApp assistant's replies", 'Your messages and the conversation so far'],
            [
              'OpenAI',
              "Turns voice notes into text, checks messages for safety, and finds answers in what we've written",
              'Your messages and voice notes',
            ],
            ['Meta (WhatsApp Business Platform)', 'WhatsApp messages with us', 'Phone number, profile name, messages'],
            [
              'Meta, Microsoft Advertising (with marketing consent in the EEA, the UK and Switzerland; on elsewhere until you switch them off)',
              'Measure whether our ads work',
              'Cookie identifiers; a hashed (scrambled) email or phone after you send a form',
            ],
          ],
        },
        {
          kind: 'p',
          text: 'We may also disclose personal data when UAE law, a court or a competent authority requires it, or to protect our rights, our clients or the public.',
        },
      ],
    },
    {
      id: 'international-transfers',
      title: 'Where your data is stored',
      blocks: [
        {
          kind: 'p',
          text: 'Some of our providers store or process data outside the UAE: in the European Union (n8n), India (Supabase), the United States (OpenAI, Google, Meta, Microsoft and Vercel) and China (DeepSeek). When that happens, we transfer it only as the PDPL allows, and we choose providers that commit to protecting it.',
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and similar technologies',
      blocks: [
        {
          kind: 'p',
          text: "Cookies are small files your browser stores. We sort them into three groups. Essential ones always run. If you visit from the EEA, the UK or Switzerland, analytics and marketing wait for your choice; elsewhere they're on until you switch them off.",
        },
        {
          kind: 'table',
          caption: 'Table D: Cookie groups',
          head: ['Group', 'What it does', 'Default'],
          rows: [
            [
              'Essential',
              'Keeps the site secure, stops spam on forms, and remembers your cookie choice and display settings (such as Reduce effects)',
              'Always on',
            ],
            [
              'Analytics',
              'Google Analytics shows us, in aggregate, which pages people visit and where they get stuck',
              'Off until you allow it in the EEA, the UK and Switzerland; on elsewhere',
            ],
            [
              'Marketing',
              "Meta and Microsoft Advertising measure whether our ads bring people here, and can show our ads to people who've visited",
              'Off until you allow it in the EEA, the UK and Switzerland; on elsewhere',
            ],
          ],
        },
        {
          kind: 'list',
          items: [
            {
              lead: 'Changing your choice:',
              text: 'use "Cookie settings" at the bottom of every page. We remember your choice for 12 months.',
            },
            {
              lead: 'Blocking cookies:',
              text: 'you can also block cookies in your browser. Essential ones are needed for forms to work.',
            },
          ],
        },
        {
          kind: 'p',
          text: 'The full list of cookies, with each one\'s name, provider and lifetime, is shown in "Cookie settings".',
        },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing emails',
      blocks: [
        {
          kind: 'p',
          text: `We send marketing emails only if you tick the box that asks for them. Every email has a one-click unsubscribe link, and you can also reply "unsubscribe" or email ${email}.`,
        },
      ],
    },
    {
      id: 'data-security',
      title: 'How we protect it',
      blocks: [
        {
          kind: 'list',
          items: [
            { text: 'Everything travels over encrypted connections (HTTPS).' },
            { text: 'Access is limited to people who need it for your request or project.' },
            { text: 'Our business accounts use two-step verification.' },
            { text: 'Passwords and keys are kept in encrypted stores, never in code.' },
          ],
        },
        {
          kind: 'p',
          text: 'No system is perfectly secure. If a breach puts your data at risk, we will tell you and the authorities as the law requires.',
        },
      ],
    },
    {
      id: 'data-retention',
      title: 'How long we keep it',
      blocks: [
        {
          kind: 'p',
          text: 'We keep personal data only as long as we need it for the purpose you gave it for, or as long as the law requires. Then we delete it or make it anonymous.',
        },
        {
          kind: 'table',
          caption: 'Table E: Retention',
          head: ['Data', 'How long'],
          rows: [
            ["Enquiries that don't become projects", '24 months after our last contact'],
            ['Client project records', 'For the project, then as long as UAE law requires'],
            ['Billing and accounting records', 'As long as UAE tax and accounting laws require'],
            ['WhatsApp messages', '90 days'],
            ["Our WhatsApp assistant's summary of your enquiry", '12 months after your last message'],
            ['Your WhatsApp number and booking records', '24 months after our last contact'],
            ['Email conversations', '24 months after the last message, or longer as part of a client project record'],
            ['Analytics data', '14 months'],
            ['Your cookie choice', '12 months'],
            ['How you found us (campaign tags and ad click IDs, in your browser)', '90 days'],
          ],
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights under the UAE PDPL',
      blocks: [
        { kind: 'p', text: 'You can ask us to:' },
        {
          kind: 'list',
          items: [
            { text: 'tell you what personal data we hold about you and how we use it' },
            { text: 'give you a copy of it' },
            { text: "correct anything that's wrong or incomplete" },
            { text: 'delete it, where the law allows' },
            { text: 'restrict or stop certain uses of it' },
            { text: 'send it to you or another company in a common format, where applicable' },
          ],
        },
        { kind: 'p', text: 'You can also withdraw your consent at any time (§18).' },
        {
          kind: 'p',
          lead: 'How to ask:',
          text: `email ${email} from the address we know you by, or tell us how else we can confirm it's you. We acknowledge every request within 24 hours on business days (Monday to Friday) and answer fully within the time the law allows.`,
        },
        {
          kind: 'p',
          text: "If you're unhappy with our answer, you can complain to the UAE Data Office, the authority that supervises the PDPL.",
        },
        {
          kind: 'sources',
          label: 'Official sources:',
          items: [
            {
              label: 'Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data',
              publisher: 'UAE Legislation portal',
              href: 'https://uaelegislation.gov.ae/en/legislations/1972',
            },
            {
              label: 'Data protection laws',
              publisher: 'the UAE Government portal',
              href: 'https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws',
            },
          ],
        },
      ],
    },
    {
      id: 'childrens-privacy',
      title: 'Children',
      blocks: [
        {
          kind: 'p',
          text: "Our services are for businesses. We don't knowingly collect personal data from anyone under 18. If you think a child has sent us personal data, contact us and we'll delete it.",
        },
      ],
    },
    {
      id: 'third-party-links',
      title: 'Links to other websites',
      blocks: [
        {
          kind: 'p',
          text: "This site links to other websites, such as our social profiles and official sources. They have their own privacy policies, and we're not responsible for them.",
        },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [
        {
          kind: 'p',
          text: 'When we change how we handle personal data, we update this page and its "Last updated" date. If a change is significant, we\'ll also tell clients by email.',
        },
      ],
    },
    {
      id: 'contact-us',
      title: 'Contact us',
      blocks: [
        { kind: 'p', text: 'For any privacy question or request:' },
        {
          kind: 'list',
          items: [
            { lead: 'Email:', text: email },
            ...ifSet(whatsapp, { lead: 'WhatsApp:', text: whatsapp ?? '' }),
            ...ifSet(phone, { lead: 'Phone:', text: phone ?? '' }),
            { lead: 'Office:', text: address },
            { lead: 'Hours:', text: siteConfig.openingHours.display },
          ],
        },
      ],
    },
    {
      id: 'consent',
      title: 'Consent, and how to withdraw it',
      blocks: [
        {
          kind: 'p',
          text: 'Where we rely on your consent or your choice (analytics and marketing cookies, marketing emails, WhatsApp follow-ups you opted into), you can withdraw it at any time:',
        },
        {
          kind: 'list',
          items: [
            { lead: 'Cookies:', text: 'change your choice in "Cookie settings" at the bottom of every page.' },
            { lead: 'Emails:', text: 'use the unsubscribe link in any email.' },
            { lead: 'WhatsApp:', text: "send STOP, and we won't send you follow-up messages." },
            { lead: 'Anything else:', text: `email ${email}.` },
          ],
        },
        {
          kind: 'p',
          text: "Withdrawing consent doesn't affect what we did before you withdrew it. We may still need to keep some records that the law requires.",
        },
      ],
    },
  ] satisfies readonly LegalSection[],
  // 2.8 The note under the tables
  note: 'This policy describes how we handle personal data today. We update it when our practices or the law change.',
  // 2.5 FAQ
  faqHeading: 'Privacy questions, answered',
  faqLede: 'Short answers to what people ask most about their data.',
  // 2.6 The contact block: Email always, WhatsApp while set, the contact page once it's live
  contact: {
    heading: 'Questions about your data?',
    body: 'Ask us anything about how we handle your data, or send a request to see, correct or delete it. A real person replies.',
    email: 'Email us',
    whatsapp: 'WhatsApp us',
    contactPage: 'Contact page',
  },
  // 2.7 Related links: each only once its page is live (04 §1.4)
  relatedHeading: 'Related',
  related: [
    { route: 'R005', title: 'Contact Deepzeta AI', line: 'Talk to a person about your project or your data.' },
    { route: 'R003', title: 'About us', line: 'Who we are and how we work.' },
    { route: 'R007', title: 'Terms of service', line: 'The terms for using this site, the audit and our tools.' },
  ],
} as const;

// 2.5 The FAQ (the text matches the FAQPage schema word for word, 08 §3 rule 7)
export const privacyFaq: readonly FaqQuestion[] = [
  {
    id: 'privacy-sell-my-data',
    topic: 'data-privacy',
    question: `Does ${brand} sell my personal data?`,
    answer:
      'No. We never sell or rent your personal data, and we never give it to other companies for their own marketing. Service providers such as our hosting and email companies process it only to run our services for you.',
  },
  {
    id: 'privacy-audit-booking',
    topic: 'data-privacy',
    question: 'What data do you collect when I book a free AI audit?',
    answer:
      "Your name, your WhatsApp number, the time you choose, how you'd like to meet and what you'd like to discuss, plus your email if you want a confirmation by email. We use this only to prepare and hold your audit, and we delete booking records 24 months after our last contact.",
  },
  {
    id: 'privacy-cookies',
    topic: 'data-privacy',
    question: 'Do you use cookies?',
    answer:
      'Yes. Essential cookies keep the site secure and working. Analytics and marketing cookies wait for your permission if you visit from the EEA, the UK or Switzerland, and are on elsewhere. You can change your choice at any time from "Cookie settings" at the bottom of every page.',
  },
  {
    id: 'privacy-providers',
    topic: 'data-privacy',
    question: 'Which companies process my data for you?',
    answer:
      'Our main service providers are Vercel (hosting), Google (email, calendar and analytics), n8n (automation), Supabase (our WhatsApp records), DeepSeek and OpenAI (our WhatsApp AI assistant), Meta (WhatsApp and ad measurement) and Microsoft (ad measurement). Section 7 lists what each one does for us and which data it handles.',
  },
  {
    id: 'privacy-data-location',
    topic: 'data-privacy',
    question: 'Is my data stored in the UAE?',
    answer:
      'Not always. Some of our providers store or process data outside the UAE: in the European Union, India, the United States and China. We transfer data only as the UAE PDPL allows and choose providers that commit to protecting it. Section 8 names the provider in each place.',
  },
  {
    id: 'privacy-whatsapp',
    topic: 'data-privacy',
    question: 'What happens when I message you on WhatsApp?',
    answer:
      "Our AI assistant replies first and tells you it's an AI. DeepSeek writes its replies, and OpenAI turns voice notes into text and checks messages for safety. We delete messages after 90 days and clear the assistant's short summary of your enquiry 12 months after your last message. Ask for a person at any time.",
  },
  {
    id: 'privacy-retention',
    topic: 'data-privacy',
    question: 'How long do you keep my data?',
    answer:
      "Only as long as we need it. For example, enquiries that don't become projects are kept for 24 months after our last contact, and billing records for as long as UAE tax and accounting laws require. Section 12 lists every period.",
  },
  {
    id: 'privacy-your-rights',
    topic: 'data-privacy',
    question: 'How do I see, correct or delete my data?',
    answer: `Email ${email} and tell us what you need. We'll confirm it's you, then answer within the time the UAE PDPL allows. You can also withdraw consent or unsubscribe from marketing emails at any time.`,
  },
];
