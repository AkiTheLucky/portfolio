import { describe, expect, it } from 'vitest';
import { readPersonalCount, takeClickBatch, unlockedTiers } from './counter';

describe('click counter', () => {
  it('reads valid local counts and rejects corrupt values', () => {
    expect(readPersonalCount('42')).toBe(42);
    expect(readPersonalCount(null)).toBe(0);
    expect(readPersonalCount('-1')).toBe(0);
    expect(readPersonalCount('NaN')).toBe(0);
    expect(readPersonalCount('1.5')).toBe(0);
  });

  it('batches increments within the API limit', () => {
    expect(takeClickBatch(1)).toBe(1);
    expect(takeClickBatch(100)).toBe(20);
    expect(takeClickBatch(0)).toBe(0);
    expect(takeClickBatch(-4)).toBe(0);
  });

  it('unlocks a faster button at 4 and 20 browser clicks', () => {
    const amounts = (clicks: number) => unlockedTiers(clicks).map((tier) => tier.amount);
    expect(amounts(0)).toEqual([1]);
    expect(amounts(3)).toEqual([1]);
    expect(amounts(4)).toEqual([1, 2]);
    expect(amounts(19)).toEqual([1, 2]);
    expect(amounts(20)).toEqual([1, 2, 5]);
    expect(amounts(5000)).toEqual([1, 2, 5]);
  });
});
