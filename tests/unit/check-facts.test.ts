import { describe, expect, it } from 'vitest';
import { findTodoMarkers } from '../../scripts/check-facts.mjs';

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
});
