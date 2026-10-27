import { describe, expect, it } from 'vitest';
import { currentStreak, dailyIndex, dateKeyOffset, getDailyQuestion, parseEstimate, scoreEstimate } from './fermi';
import type { FermiQuestion } from './types';

const questions: FermiQuestion[] = [
  { id: 'b', question: 'B', answer: 100, unit: 'things', assumptions: [], explanation: '' },
  { id: 'a', question: 'A', answer: 200, unit: 'things', assumptions: [], explanation: '' },
];

describe('Fermi daily selection', () => {
  it('is deterministic and sorted by id', () => {
    expect(getDailyQuestion(questions, new Date('2026-10-27T12:00:00Z'))).toBe(getDailyQuestion(questions, new Date('2026-10-27T23:00:00Z')));
    expect(dailyIndex('2026-10-27', 2)).toBeGreaterThanOrEqual(0);
    expect(dailyIndex('2026-10-27', 2)).toBeLessThan(2);
  });

  it('rejects an empty question set', () => {
    expect(() => getDailyQuestion([], new Date())).toThrow();
  });
});

describe('estimate parsing and scoring', () => {
  it('accepts common number formatting', () => {
    expect(parseEstimate('1,250,000')).toBe(1250000);
    expect(parseEstimate(' 1250 ')).toBe(1250);
  });

  it('rejects invalid and non-positive estimates', () => {
    expect(parseEstimate('')).toBeNull();
    expect(parseEstimate('-4')).toBeNull();
    expect(parseEstimate('many')).toBeNull();
  });

  it('scores symmetrically around the answer', () => {
    expect(scoreEstimate(105, 100)).toBe('Remarkably close');
    expect(scoreEstimate(100, 105)).toBe('Remarkably close');
    expect(scoreEstimate(190, 100)).toBe('In the right neighborhood');
  });
});

describe('streaks', () => {
  it('counts consecutive UTC days', () => {
    const history = {
      '2026-10-27': { estimate: 1, score: 'Close', playedAt: '' },
      '2026-10-26': { estimate: 1, score: 'Close', playedAt: '' },
      '2026-10-25': { estimate: 1, score: 'Close', playedAt: '' },
    };
    expect(currentStreak(history, '2026-10-27')).toBe(3);
    expect(currentStreak(history, '2026-10-26')).toBe(2);
    expect(dateKeyOffset('2026-01-01', -1)).toBe('2025-12-31');
  });
});
