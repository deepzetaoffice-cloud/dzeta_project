import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

// The retired Meta IDs guard (P3 part C, Q5; handoff §1): the two IDs must never appear anywhere in
// the repo. They sit outside the business portfolio and are retired; publishing them by writing them
// anywhere (code, docs, container) would be a mistake. This test holds only their SHA-256 hashes, so
// the guard itself can't leak them.

const RETIRED_SHA256 = new Set([
  '6ec174a5bc6cd9cde71488bd436a2e4aadab2caddf2e4c1e83d5db9b7ef84109',
  'e45d1e9ae8b3445216f9f0ee8e8466c2a247927d0f076918bb6fb68f3bb286f0',
]);

// Where the guard scans: the files git tracks (the handoff file itself is untracked by Q4 and holds
// the IDs by design — it never ships). Untracked caches and logs are not the repo's content.
function trackedFiles(): string[] {
  // -z: NUL-separated, so git never quotes a path with spaces or special characters
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: process.cwd(), encoding: 'utf8' });
  return out.split('\0').filter((line) => line.length > 0);
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

describe('the retired Meta IDs never appear (hashes only, Q5)', () => {
  it('no file in the repo hashes to a retired ID', () => {
    const files = trackedFiles();
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(join(process.cwd(), file), 'utf8');
      // The ID as a standalone token (in JSON, markdown, code): line-wise, so a longer number that
      // merely contains the digits doesn't match, and a hash line can't contain the raw ID anyway.
      for (const line of text.split(/\r?\n/)) {
        for (const token of line.match(/\d{6,}/g) ?? []) {
          if (RETIRED_SHA256.has(sha256(token))) offenders.push(`${file}: ${token.length} digits`);
        }
      }
    }
    // Only the shape is reported, never the value
    expect(offenders).toEqual([]);
  });

  it('the active accounts.ts IDs are not the retired ones', async () => {
    const { accounts } = await import('@/lib/tracking/accounts');
    for (const value of [accounts.metaDatasetId]) {
      if (value !== null) expect(RETIRED_SHA256.has(sha256(value))).toBe(false);
    }
  });
});
