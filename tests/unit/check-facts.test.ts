import { describe, expect, it } from 'vitest';
import { contactFacts, findRetypedFacts, findTodoMarkers, findUnsourcedNumbers } from '../../scripts/check-facts.mjs';

describe('check:facts', () => {
  it('passes content without placeholders', () => {
    expect(findTodoMarkers('src/content/en/home.ts', `heading: 'AI automation for UAE businesses'`)).toEqual([]);
  });

  it('fails a [[TODO marker with its line number', () => {
    const text = `intro: 'We reply fast.',\nstat: '[[TODO: real figure from owner]]',`;
    expect(findTodoMarkers('src/content/en/home.ts', text)).toEqual([
      { file: 'src/content/en/home.ts', line: 2, text: `stat: '[[TODO: real figure from owner]]',` },
    ]);
  });

  it('collects the contact facts, skipping the pending ones', () => {
    expect(
      contactFacts({
        email: 'hello@deepzeta.ai',
        address: 'Office #202, Dubai',
        phone: null,
        whatsapp: null,
        social: [
          { key: 'linkedin', platform: 'LinkedIn', url: 'https://www.linkedin.com/company/x/' },
          { key: 'x', platform: 'X', url: 'https://x.com/Deep_Zeta' },
        ],
      }),
    ).toEqual([
      'hello@deepzeta.ai',
      'Office #202, Dubai',
      'https://www.linkedin.com/company/x/',
      'https://x.com/Deep_Zeta',
    ]);
  });

  it('fails a contact fact typed outside the site config (handoff §7.3)', () => {
    const facts = ['hello@deepzeta.ai', 'https://x.com/Deep_Zeta'];
    expect(findRetypedFacts('src/components/layout/SiteFooter.tsx', `mailto:hello@deepzeta.ai`, facts)).toEqual([
      { file: 'src/components/layout/SiteFooter.tsx', fact: 'hello@deepzeta.ai' },
    ]);
    // A file that reads it through the config passes
    expect(findRetypedFacts('src/components/layout/SiteFooter.tsx', `mailto:${'siteConfig.email'}`, facts)).toEqual([]);
  });

  it('the numbers allowlist: an allowed number passes, an unsourced one fails (P4 S9)', () => {
    const file = 'src/content/en/home.ts';
    const good = `// a comment mentioning 99 problems
      intro: 'We reply within 60 seconds, around the clock.',
      stat: 'Agents run 24/7.',
      catalogue: 'E-Invoicing Ready (5.6)', // an ID, not a claim
      copyright: '© 2026',
    `;
    expect(findUnsourcedNumbers(file, good)).toEqual([]);
    const bad = `intro: 'We boost revenue by 300 percent.'`;
    expect(findUnsourcedNumbers(file, bad)).toEqual([{ file, value: '300' }]);
  });
});
