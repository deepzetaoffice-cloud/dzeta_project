// The consent copy: the cookie banner (first layer) and the privacy settings panel (second layer).
// Moved verbatim from docs/content-drafts/legal/consent-copy.md §1 and §2, the owner's approved wording
// (2026-09-29), and keyed by the draft's stable IDs so the Arabic partner can be written natively in P11
// (docs/ai/11 §1.4). The draft's §3 and §4 (the form and tool notices) join in P6 and P7.
// The banner is shown only in the EEA, the UK and Switzerland (docs/ai/09 §2.7, C52), where nothing
// optional runs before a choice, so its text is true wherever it's shown. Cookie settings is for everyone.
// Vendor cookie names, lifetimes, numbers and regions come from code (src/lib/tracking/), never from here.
// Keys marked NEW are not in the draft (P3 step B4).
export const consentContent = {
  banner: {
    // Shown as a <p>, not a heading, so no page's outline changes (P3 plan, D)
    title: 'Your data, your choice',
    body: "We use essential cookies to keep this site secure and working. With your permission, we'd also like to use analytics to learn which pages help you most, and marketing cookies to measure our ads. Nothing optional runs until you choose, and we never sell your data.",
    // The same size and weight, neither on the action gradient (the draft's principle 2)
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    // Opens the settings panel below
    choose: 'Choose settings',
    // Links to /privacy (R006), and appears only once R006 is live (P3 plan, D)
    policyLink: 'Read our privacy policy',
  },
  settings: {
    title: 'Privacy settings',
    // Names footer.cookieSettings, so the two change together
    intro:
      'Choose what you\'re comfortable with. You can change this at any time from "Cookie settings" at the bottom of every page.',
    essential: {
      name: 'Essential',
      // Shown as a locked state, not a disabled-looking switch (the draft, §2)
      state: 'Always on',
      body: "Keep the site secure, stop spam on our forms, and remember your choices here. The site can't work without them.",
    },
    analytics: {
      name: 'Analytics',
      body: 'Show us, in aggregate, which pages people visit and where they get stuck, so we can make the site faster and clearer. Uses Google Analytics.',
    },
    marketing: {
      name: 'Marketing',
      body: "Measure whether our ads on Google, Meta and LinkedIn bring people here, and show our ads to people who've visited us.",
    },
    // Each switch's visible state
    toggleOn: 'On',
    toggleOff: 'Off',
    save: 'Save my choices',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    // The status line after saving; it names footer.cookieSettings too
    saved: 'Saved. You can change this at any time in Cookie settings.',
    // NEW: the close button's accessible name
    close: 'Close privacy settings',
    // NEW: above each group's list of tools and their cookies and storage (P3 plan, E)
    cookiesHeading: 'Cookies and storage',
    // NEW: that list's column headers
    cookieColumns: { name: 'Name', provider: 'Provider', lifetime: 'Lifetime' },
    // NEW: the Lifetime column. The numbers come from code. No singular form: today the code passes only
    // 12 (months, the stored choice) and 90 (days, attribution), so a 1 would need one first.
    lifetime: {
      months: (n: number) => `${n} months`,
      days: (n: number) => `${n} days`,
      untilCleared: 'Until you clear it',
    },
  },
  footer: {
    // A button in every footer's legal line, for every visitor (P3 plan, E)
    cookieSettings: 'Cookie settings',
  },
} as const;
