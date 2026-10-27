export const COUNTER_STORAGE_KEY = 'akram-click-count';
export const MAX_CLICK_BATCH = 20;

export function readPersonalCount(value: string | null): number {
  if (!value) return 0;
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : 0;
}

export function takeClickBatch(pending: number): number {
  if (!Number.isFinite(pending) || pending <= 0) return 0;
  return Math.min(MAX_CLICK_BATCH, Math.floor(pending));
}
