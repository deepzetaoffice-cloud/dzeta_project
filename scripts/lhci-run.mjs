#!/usr/bin/env node
// The lhci gate with Lighthouse's CPU slowdown calibrated to the machine (docs/ai/03 · lhci;
// decision 0025; the P6 part A plan, S1). No dependencies.
// In simulate mode Lantern multiplies every observed CPU task by `cpuSlowdownMultiplier`. CI
// runners differ in speed (benchmarkIndex 2,408–4,443 on identical code, 2026-10-06/07), so the
// same page measured slower on a slow runner: Home's TBT ran from 24 to 126 ms in Europe and from 84
// to 274 ms on the UAE profile. The wrapper first measures this machine's benchmarkIndex (one
// 3-run collect of Home), sets multiplier = 4 × benchmarkIndex ÷ REFERENCE_BENCHMARK_INDEX
// (clamped to 2–8), then runs the unchanged chain with DZ_LHCI_CPU_MULTIPLIER set: both region
// profiles, assert, upload, the page-weight gate. Both lhci configs read the variable.
// A DZ_LHCI_CPU_MULTIPLIER already in the environment skips the calibration (a fixed value for
// experiments). No threshold changes: the same page measures the same on a fast and a slow machine.

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// The machine the lab numbers are expressed for (decision 0025).
export const REFERENCE_BENCHMARK_INDEX = 4000;
// Lighthouse's default, which every allowance so far was measured with.
export const DEFAULT_MULTIPLIER = 4;
// Inside Lighthouse's documented 2–10 (docs/throttling.md at v12.6.1).
export const CLAMP = { min: 2, max: 8 };
const RESULTS_DIR = '.lighthouseci';

export function median(values) {
  if (values.length === 0) throw new Error('no values');
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// The multiplier for a machine, rounded to 2 decimals, and whether the clamp changed it.
export function multiplierFor(benchmarkIndex, reference = REFERENCE_BENCHMARK_INDEX) {
  if (!(benchmarkIndex > 0) || !(reference > 0)) throw new Error(`invalid benchmarkIndex ${benchmarkIndex}`);
  const raw = (DEFAULT_MULTIPLIER * benchmarkIndex) / reference;
  const value = Math.min(CLAMP.max, Math.max(CLAMP.min, raw));
  return { value: Math.round(value * 100) / 100, clamped: value !== raw };
}

// DZ_LHCI_CPU_MULTIPLIER: unset or empty → undefined (calibrate); otherwise a number inside the clamp,
// so a hand-set value can't soften the CPU-bound checks (03 §3.4).
export function parseMultiplier(text) {
  if (text === undefined || text === '') return undefined;
  const value = Number(text);
  if (!Number.isFinite(value) || value < CLAMP.min || value > CLAMP.max)
    throw new Error(`DZ_LHCI_CPU_MULTIPLIER must be a number from ${CLAMP.min} to ${CLAMP.max}, not "${text}"`);
  return value;
}

// Every saved run's benchmarkIndex.
export function benchmarkIndexes(lhrs) {
  return lhrs.map((lhr) => lhr?.environment?.benchmarkIndex).filter((value) => value > 0);
}

function run(command) {
  const result = spawnSync(command, { shell: true, stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function savedRuns() {
  return readdirSync(RESULTS_DIR)
    .filter((name) => /^lhr-.*\.json$/.test(name))
    .map((name) => JSON.parse(readFileSync(join(RESULTS_DIR, name), 'utf8')));
}

function main() {
  let multiplier = parseMultiplier(process.env.DZ_LHCI_CPU_MULTIPLIER);
  if (multiplier === undefined) {
    // One collect of Home, 3 runs: lighthouserc.cjs' server, this machine's Chrome. The chain's first
    // collect below runs without --additive, so these runs never reach the assertions.
    run('lhci collect --url=http://localhost:3000/ --numberOfRuns=3');
    const indexes = benchmarkIndexes(savedRuns()).map(Math.round);
    const benchmarkIndex = median(indexes);
    const { value, clamped } = multiplierFor(benchmarkIndex);
    multiplier = value;
    // No comma or colon in an annotation's title (ci.yml's note)
    console.log(
      `::notice title=Lighthouse calibration::benchmarkIndex ${benchmarkIndex} (runs ${indexes.join(' ')}) · ` +
        `reference ${REFERENCE_BENCHMARK_INDEX} · cpuSlowdownMultiplier ${value}`,
    );
    if (clamped)
      console.log(`::warning title=Lighthouse calibration::the multiplier hit its clamp (${CLAMP.min}–${CLAMP.max})`);
  } else {
    console.log(`Lighthouse: cpuSlowdownMultiplier ${multiplier} from DZ_LHCI_CPU_MULTIPLIER (no calibration)`);
  }
  process.env.DZ_LHCI_CPU_MULTIPLIER = String(multiplier);
  run('lhci collect');
  run('lhci collect --config=./lighthouserc.row.cjs --additive');
  run('lhci assert');
  run('lhci upload');
  run('node scripts/check-page-weight.mjs');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
