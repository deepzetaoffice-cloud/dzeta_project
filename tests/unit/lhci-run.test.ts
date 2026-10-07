import { describe, expect, it } from 'vitest';
import {
  benchmarkIndexes,
  CLAMP,
  DEFAULT_MULTIPLIER,
  median,
  multiplierFor,
  parseMultiplier,
  REFERENCE_BENCHMARK_INDEX,
} from '../../scripts/lhci-run.mjs';

// The lhci wrapper's calibration (decision 0024; the P6 part A plan, S1): multiplier = 4 ×
// benchmarkIndex ÷ the reference, clamped to 2–8.

describe('lhci-run calibration', () => {
  it('keeps the default multiplier on the reference machine', () => {
    expect(multiplierFor(REFERENCE_BENCHMARK_INDEX)).toEqual({ value: DEFAULT_MULTIPLIER, clamped: false });
  });

  it('scales the multiplier with the machine’s speed, rounded to 2 decimals', () => {
    // CI's slowest and fastest runners on identical code (2026-10-06/07)
    expect(multiplierFor(2450, 4000)).toEqual({ value: 2.45, clamped: false });
    expect(multiplierFor(4443, 4000)).toEqual({ value: 4.44, clamped: false });
    expect(multiplierFor(3000, 3000).value).toBe(4);
  });

  it('clamps to 2–8 and says so', () => {
    expect(CLAMP).toEqual({ min: 2, max: 8 });
    expect(multiplierFor(1000, 4000)).toEqual({ value: 2, clamped: true });
    expect(multiplierFor(10000, 4000)).toEqual({ value: 8, clamped: true });
  });

  it('refuses a missing or invalid benchmarkIndex', () => {
    expect(() => multiplierFor(0)).toThrow();
    expect(() => multiplierFor(Number.NaN)).toThrow();
  });

  it('takes the median of the calibration runs', () => {
    expect(median([3899, 3755, 3949])).toBe(3899);
    expect(median([2, 4])).toBe(3);
    expect(() => median([])).toThrow();
  });

  it('reads each run’s benchmarkIndex and skips runs without one', () => {
    expect(benchmarkIndexes([{ environment: { benchmarkIndex: 3900.5 } }, {}, { environment: {} }])).toEqual([3900.5]);
  });

  it('parses DZ_LHCI_CPU_MULTIPLIER: unset calibrates, a positive number is used as it is', () => {
    expect(parseMultiplier(undefined)).toBeUndefined();
    expect(parseMultiplier('')).toBeUndefined();
    expect(parseMultiplier('5.6')).toBe(5.6);
    expect(() => parseMultiplier('0')).toThrow();
    expect(() => parseMultiplier('fast')).toThrow();
  });
});
