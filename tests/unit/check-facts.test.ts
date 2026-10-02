import { describe, expect, it } from 'vitest';
import { contactFacts, findRetypedFacts, findTodoMarkers } from '../../scripts/check-facts.mjs';

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
    ).toEqual(['hello@deepzeta.ai', 'Office #202, Dubai', 'https://www.linkedin.com/company/x/', 'https://x.com/Deep_Zeta']);
  });

  it('fails a contact fact typed outside the site config (handoff §7.3)', () => {
    const facts = ['hello@deepzeta.ai', 'https://x.com/Deep_Zeta'];
    expect(findRetypedFacts('src/components/layout/SiteFooter.tsx', `mailto:hello@deepzeta.ai`, facts)).toEqual([
      { file: 'src/components/layout/SiteFooter.tsx', fact: 'hello@deepzeta.ai' },
    ]);
    // A file that reads it through the config passes
    expect(findRetypedFacts('src/components/layout/SiteFooter.tsx', `mailto:${'siteConfig.email'}`, facts)).toEqual([]);
  });
});
