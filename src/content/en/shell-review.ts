// The review page's copy (P2 plan, A3 and N; registry R165). Internal only: the page is built on
// local, CI and preview builds and returns 404 in production, so it's never indexed or linked.
// The hero has a CTA and an icon section follows; the shell's own copy lives in shell.ts.
export const shellReviewContent = {
  title: 'Shell review',
  description: 'The complete site shell for review and tests. Local, CI and preview builds only.',
  banner: 'Review build: links are placeholders',
  heading: 'Shell review',
  intro:
    'This page shows the header, the mega menu, the mobile menu, the status island and the footer with every item on. Scroll it to see the header condense and its reading progress run.',
  // The icons drawn in P2, for the owner's verdict (plan K6). Names and "the pixel is" come from the
  // icon registry.
  icons: {
    heading: 'Icons for review',
    intro:
      'Signature icons play their story once as they scroll into view. Hover or focus one to play it again. Each is shown here at one size, 128 px.',
    pixelIs: 'The pixel is',
    interfaceHeading: 'Interface icons',
    interfaceLabels: { chevron: 'Chevron (opens below)', 'external-link': 'External link (new tab)' },
  },
  // Alternating surfaces, so the header's pill is seen over both.
  sections: [
    {
      theme: 'light',
      heading: 'Light section',
      body: 'A section on the canvas. The header pill stays readable over it.',
    },
    {
      theme: 'dark',
      heading: 'Muted section',
      body: 'A section on the muted surface. The pill’s shadow separates it from the page.',
    },
    {
      theme: 'light',
      heading: 'Second light section',
      body: 'More content to scroll, so the header condenses and the page reaches the footer.',
    },
    {
      theme: 'dark',
      heading: 'Second muted section',
      body: 'The last section before the footer.',
    },
  ],
} as const;
