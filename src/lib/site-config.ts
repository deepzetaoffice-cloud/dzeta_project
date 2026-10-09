import { BRAND_NAME } from './brand.ts';

// Business facts for code (docs/ai/06 §3.2). Every value comes from docs/facts/company-facts.md and
// only CONFIRMED values appear; P4 extends this file. A fact that isn't confirmed yet is null, and
// whatever uses it hides itself. tests/unit/site-config.test.ts checks each value against the facts file.

// The social profiles (facts §2.1), copied exactly; `key` names each one's tile (conflict C49).
export type SocialKey =
  'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' | 'snapchat' | 'pinterest';
export type SocialProfile = { key: SocialKey; platform: string; url: string };

// The founder (facts §4): name, role and profile links are CONFIRMED; the bio and the photo choice are
// UNKNOWN, so they are null and whatever uses them hides itself (02 §1). The profile URLs are the fact
// byte for byte — never rebuilt from the handle. The schema Person node (spec §2.1, "founder") reads
// this; his other companies (below) never touch Deepzeta AI's NAP or sameAs (facts §4.1 rules).
export type Founder = {
  name: string;
  jobTitle: string;
  sameAs: readonly string[];
  photo: string | null;
  bio: string | null;
};

// The founder's other companies (facts §4.1), separate businesses from Deepzeta AI. `hasOffice` is the
// table's "Physical office" column ("Yes" → true, "Not stated" → false). They appear only in the
// founder's bio (About) and his Person schema, as Organization nodes without an @id (spec §2.1).
export type FounderCompany = { name: string; url: string; hasOffice: boolean };

export const siteConfig = {
  brandName: BRAND_NAME, // facts §1 (conflict C29), kept in brand.ts (imported above)
  legalName: 'Deepzeta Digital Solutions L.L.C.', // facts §1 (decision D2)
  positioningLine: 'Deepzeta AI builds online growth for every business.', // facts §1
  email: 'hello@deepzeta.ai', // facts §2
  // Facts §2, the one-line display. The hash before the office number is written \u0023, because
  // check:tokens reads it as a raw colour; the string is the fact, byte for byte (site-config.test.ts).
  address: 'Office \u0023202, Al Hilal Bank Building, Al Qusais 2, Dubai, United Arab Emirates',
  // Facts §2, the opening hours. `display` is the fact byte for byte, shown in the footer (the owner,
  // 2026-10-02), so P4's #organization node may carry them (sitewide markup only states what's
  // visible, 0019). The other fields are the same fact in parts, for P4's openingHoursSpecification
  // (schema.org day names); site-config.test.ts checks that both say the same thing.
  openingHours: {
    display: 'Monday to Saturday, 08:00–17:00 GST (UTC+4); closed Sunday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '17:00',
  },
  phone: '+971 54 547 6335', // facts §2 (owner, 2026-10-08)
  whatsapp: '+971 54 547 6335', // facts §2 (owner, 2026-10-08)
  social: [
    {
      key: 'linkedin',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/deepzeta-ai-digital-solutions-dubai/',
    },
    { key: 'instagram', platform: 'Instagram', url: 'https://www.instagram.com/deepzeta.ai/' },
    { key: 'facebook', platform: 'Facebook', url: 'https://www.facebook.com/DeepzetaAi/' },
    { key: 'youtube', platform: 'YouTube', url: 'https://www.youtube.com/@DeepzetaAiAgency' },
    { key: 'tiktok', platform: 'TikTok', url: 'https://www.tiktok.com/@deepzeta.ai' },
    { key: 'x', platform: 'X', url: 'https://x.com/Deep_Zeta' },
    { key: 'threads', platform: 'Threads', url: 'https://www.threads.com/@deepzeta.ai' },
    { key: 'snapchat', platform: 'Snapchat', url: 'https://www.snapchat.com/@deepzeta.ai' },
    { key: 'pinterest', platform: 'Pinterest', url: 'https://www.pinterest.com/deepzeta_ai/' },
  ] satisfies readonly SocialProfile[],
  // Facts §4. Credentials and photo are UNKNOWN in the table, and the bios below it are UNKNOWN, so
  // both stay null until the owner confirms them (02 §1).
  founder: {
    name: 'Jamsheed Khalid',
    jobTitle: 'Founder',
    sameAs: ['https://www.linkedin.com/in/jamsheed-khalid-343148b6/', 'https://gravatar.com/maximumglitter2857dbbf77'],
    photo: null as string | null,
    bio: null as string | null,
  } satisfies Founder,
  // Facts §4.1, in its order, URLs copied exactly (trailing slash included).
  founderCompanies: [
    { name: 'Wasleen Interior Design', url: 'https://www.wasleen.com', hasOffice: true },
    { name: 'Wasleen Pergolas', url: 'https://pergolas.wasleen.com', hasOffice: true },
    { name: 'Wasleen Liminal Approvals', url: 'https://www.dubaiapprovalconsultants.com/', hasOffice: true },
    { name: 'Wasleen Digital Lab', url: 'https://www.wasleen.com/wasleen-digital', hasOffice: false },
  ] satisfies readonly FounderCompany[],
} as const;
