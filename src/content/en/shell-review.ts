// The review page's copy (P2 plan, A3 and N; registry R165). Internal only: the page is built on
// local, CI and preview builds and returns 404 in production, so it's never indexed or linked.
// Part B adds the hero CTA and the icon section; the shell's own copy lives in shell.ts.
export const shellReviewContent = {
  title: 'Shell review',
  description: 'The complete site shell for review and tests. Local, CI and preview builds only.',
  banner: 'Review build: links are placeholders',
  heading: 'Shell review',
  intro:
    'This page shows the header, the menus, the footer and the display preferences with every item on. Scroll it to see the glass pass over light and dark content.',
  // Alternating themes, so the header's glass is seen over both.
  sections: [
    {
      theme: 'light',
      heading: 'Light section',
      body: 'A light section under the navy header. The glass must keep the header readable over it.',
    },
    {
      theme: 'dark',
      heading: 'Dark section',
      body: 'A dark section. The header’s edge and highlight separate it from the page.',
    },
    {
      theme: 'light',
      heading: 'Second light section',
      body: 'More content to scroll, so the header condenses and the page reaches the footer.',
    },
    {
      theme: 'dark',
      heading: 'Second dark section',
      body: 'The last section before the footer.',
    },
  ],
} as const;
