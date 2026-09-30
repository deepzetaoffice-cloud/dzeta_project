import { describe, expect, it } from 'vitest';
import { checkRuns, FIRST_LOAD_LIMIT, firstLoadBytes } from '../../scripts/check-page-weight.mjs';

// A Lighthouse result with only the parts the gate reads.
function lhr(bytes: Partial<Record<string, number>>, url = 'http://localhost:3000/') {
  const types = ['document', 'stylesheet', 'script', 'font', 'image', 'total'];
  return {
    finalDisplayedUrl: url,
    audits: {
      'resource-summary': {
        details: { items: types.map((resourceType) => ({ resourceType, transferSize: bytes[resourceType] ?? 0 })) },
      },
    },
  };
}

describe('check:page-weight', () => {
  it('adds HTML, CSS and JS, and leaves fonts and images to their own budgets', () => {
    expect(firstLoadBytes(lhr({ document: 3000, stylesheet: 3500, script: 140000, font: 38000, image: 9000 }))).toBe(
      146500,
    );
  });

  it('passes a run exactly at the limit and fails one 1 byte over', () => {
    const atLimit = { name: 'at', lhr: lhr({ document: 1000, stylesheet: 1000, script: FIRST_LOAD_LIMIT - 2000 }) };
    const over = { name: 'over', lhr: lhr({ document: 1000, stylesheet: 1001, script: FIRST_LOAD_LIMIT - 2000 }) };
    expect(checkRuns([atLimit]).pass).toBe(true);
    const result = checkRuns([atLimit, over]);
    expect(result.pass).toBe(false);
    expect(result.rows.map((row) => row.pass)).toEqual([true, false]);
  });

  it('fails when there are no results, or a result has no resource summary', () => {
    expect(checkRuns([]).problems).toContainEqual(expect.stringContaining('no Lighthouse results'));
    const broken = checkRuns([{ name: 'lhr-1.json', lhr: { audits: {} } }]);
    expect(broken.pass).toBe(false);
    expect(broken.problems).toContainEqual(expect.stringContaining('no resource-summary audit'));
  });

  it('uses the budget from decision 0014: the framework baseline + 50 KB', () => {
    expect(FIRST_LOAD_LIMIT).toBe(139_668 + 50 * 1024);
  });
});
