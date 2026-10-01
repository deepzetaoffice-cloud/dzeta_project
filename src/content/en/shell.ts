// The shell's copy (P2 plan, N): the skip link, the header's labels, the CTA, the display switches and,
// from part C, the footer's nav name, its finale, the social links' names and the legal line's start.
// Names, the legal name and the address come from siteConfig, never from here (docs/ai/10 §2).
export const shellContent = {
  skipLink: 'Skip to content',
  // The header nav's accessible name, so it stays distinct from the footer's (part C)
  navLabel: 'Main',
  cta: 'Book a free AI audit',
  // Until /free-ai-audit (R002) ships, the CTA is an email to siteConfig.email with this subject (Q1)
  ctaEmailSubject: 'Free AI audit',
  // The menu button's accessible names, closed and open
  menuOpen: 'Menu',
  menuClose: 'Close menu',
  // The display switches (docs/ai/13 §2.11; Q2), and their group's accessible name
  displayLabel: 'Display',
  reduceEffects: 'Reduce effects',
  lightTheme: 'Light theme',
  deviceSettingNote: 'Your device settings turn this on.',
  // The mega menu's rail card (header.md); shown on the review page until P7's demos ship
  demoCard: 'Try a live demo',
  // The footer nav's accessible name, distinct from the header's "Main" (part C)
  footerNavLabel: 'Footer',
  // The footer finale's headline, display size (C41); catalogue 0.1 ("shows what to automate first")
  finaleHeading: 'Find out what to automate first.',
  // The finale's line under it; catalogue 0.1, with no numbers
  finaleLine:
    'A free AI automation audit maps your sales, operations and admin, and shows which automations pay back first.',
  // The legal line's start: the founding year (facts §1), typed by hand, never computed at build
  // (docs/ai/02 §1.5). The legal name after it comes from siteConfig.legalName.
  copyright: '© 2026',
  // Each social link's accessible name, "Deepzeta AI on LinkedIn" (facts §2.1). A function, so the brand
  // (siteConfig.brandName) and the platform (siteConfig's social profiles, plan N) are never typed here
  // (docs/ai/10 §2).
  socialLinkName: (brand: string, platform: string) => `${brand} on ${platform}`,
} as const;
