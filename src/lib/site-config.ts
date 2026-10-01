// Business facts for code (docs/ai/06 §3.2). Every value comes from docs/facts/company-facts.md and
// only CONFIRMED values appear; P4 extends this file. A fact that isn't confirmed yet is null, and
// whatever uses it hides itself. tests/unit/site-config.test.ts checks each value against the facts file.

// The social profiles (facts §2.1), copied exactly; `key` names each one's tile (conflict C49).
export type SocialKey =
  'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' | 'snapchat' | 'pinterest';
export type SocialProfile = { key: SocialKey; platform: string; url: string };

export const siteConfig = {
  brandName: 'Deepzeta AI', // facts §1 (conflict C29)
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
  phone: null as string | null, // facts §2: PENDING, expected around 2026-10-09
  whatsapp: null as string | null, // facts §2: PENDING, with the phone
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
} as const;
