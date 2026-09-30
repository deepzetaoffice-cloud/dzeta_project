import { describe, expect, it } from 'vitest';
import { scanText, TOKENS_FILE } from '../../scripts/check-tokens.mjs';

const rulesFound = (path: string, text: string) => scanText(path, text).map((finding) => finding.rule);

describe('check:tokens', () => {
  it('passes clean component code', () => {
    const clean = `<main className="mx-auto max-w-prose ps-6 pe-4 text-start md:ms-2">{copy}</main>`;
    expect(rulesFound('src/app/page.tsx', clean)).toEqual([]);
  });

  it('allows raw values in the tokens file only', () => {
    expect(rulesFound(TOKENS_FILE, '--dz-navy: #010413; --dz-radius-sm: 8px;')).toEqual([]);
    expect(rulesFound('src/styles/globals.css', 'body { color: #010413; }')).toContain('raw-colour');
    expect(rulesFound('src/styles/globals.css', '.x { gap: 12px; }')).toContain('raw-px-css');
  });

  it('fails raw colour functions and Tailwind arbitrary px values in code', () => {
    expect(rulesFound('src/components/ui/Card.tsx', `style={{ color: 'rgb(1, 4, 19)' }}`)).toContain('raw-colour');
    expect(rulesFound('src/components/ui/Card.tsx', `className="w-[37px]"`)).toContain('raw-px-arbitrary');
  });

  it('fails physical-direction classes, CSS properties and style props', () => {
    expect(rulesFound('src/components/ui/Card.tsx', `className="ml-4 text-right"`)).toContain('physical-class');
    expect(rulesFound('src/components/ui/Card.tsx', `className="md:-left-2"`)).toContain('physical-class');
    expect(rulesFound('src/styles/globals.css', '.x { margin-left: 0; }')).toContain('physical-css-property');
    expect(rulesFound('src/styles/globals.css', '.x { text-align: right; }')).toContain('physical-css-property');
    expect(rulesFound('src/components/ui/Card.tsx', 'style={{ paddingLeft: 0 }}')).toContain('physical-style-prop');
  });

  it('leaves prose in content files alone but still catches Google Fonts there', () => {
    expect(rulesFound('src/content/en/offer.ts', `body: 'Only a few spots left-over this month.'`)).toEqual([]);
    expect(rulesFound('src/content/en/offer.ts', 'https://fonts.googleapis.com/css2')).toEqual(['google-fonts']);
  });

  it('fails Google Fonts hosts everywhere, including the tokens file', () => {
    expect(rulesFound(TOKENS_FILE, '@import url(https://fonts.gstatic.com/x.woff2);')).toContain('google-fonts');
  });
});
