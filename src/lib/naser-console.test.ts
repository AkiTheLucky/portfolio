import { describe, expect, it } from 'vitest';
import { clampGauge } from './naser-console';

describe('console gauge command', () => {
  it('keeps console input inside the name-weight range', () => {
    expect(clampGauge(0.5)).toBe(0.5);
    expect(clampGauge(0)).toBe(0);
    expect(clampGauge(1)).toBe(1);
    expect(clampGauge(-2)).toBe(0);
    expect(clampGauge(9)).toBe(1);
    expect(clampGauge(Number.POSITIVE_INFINITY)).toBe(1);
    expect(clampGauge(Number.NaN)).toBe(0);
  });
});
