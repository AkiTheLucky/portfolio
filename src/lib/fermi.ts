import type { FermiQuestion } from './types';

export interface PlayedEstimate {
  estimate: number;
  score: string;
  playedAt: string;
}

export type FermiHistory = Record<string, PlayedEstimate>;

export function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function dateKeyOffset(dateKey: string, offset: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return utcDateKey(date);
}

export function dailyIndex(dateKey: string, length: number): number {
  if (length <= 0) throw new Error('At least one Fermi question is required.');
  let hash = 2166136261;
  for (const character of dateKey) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

export function getDailyQuestion(questions: FermiQuestion[], date: Date): FermiQuestion {
  const sorted = [...questions].sort((a, b) => a.id.localeCompare(b.id));
  return sorted[dailyIndex(utcDateKey(date), sorted.length)];
}

export function parseEstimate(value: string): number | null {
  const normalized = value.trim().replace(/[,\s_']/g, '');
  if (!normalized) return null;
  const estimate = Number(normalized);
  return Number.isFinite(estimate) && estimate > 0 ? estimate : null;
}

export function scoreEstimate(estimate: number, answer: number): string {
  const ratio = Math.max(estimate / answer, answer / estimate);
  if (ratio <= 1.1) return 'Remarkably close';
  if (ratio <= 1.35) return 'Close';
  if (ratio <= 2) return 'In the right neighborhood';
  if (ratio <= 10) return 'Right order of magnitude';
  return 'A useful first estimate';
}

export function currentStreak(history: FermiHistory, todayKey: string): number {
  let streak = 0;
  let cursor = todayKey;
  while (history[cursor]) {
    streak += 1;
    cursor = dateKeyOffset(cursor, -1);
  }
  return streak;
}

export function formatAnswer(value: number): string {
  return new Intl.NumberFormat('en', { maximumSignificantDigits: 4 }).format(value);
}
