// The shell's copy (P2 plan, N): the skip link, the header's labels, the CTA and the display switches.
// Part C adds the finale, the company block's labels and the legal line. Names and the address come
// from siteConfig, never from here (docs/ai/10 §2).
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
  // The display switches (docs/ai/13 §2.11; Q2)
  reduceEffects: 'Reduce effects',
  lightTheme: 'Light theme',
  deviceSettingNote: 'Your device settings turn this on.',
} as const;
