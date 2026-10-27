import { describe, expect, it } from 'vitest';
import { readPersonalCount, takeClickBatch } from './counter';

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
});
