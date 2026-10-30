export const COUNTER_STORAGE_KEY = 'akram-click-count';
export const MAX_CLICK_BATCH = 20;

export interface ClickTier {
  threshold: number;
  amount: number;
}

export const CLICK_TIERS: ClickTier[] = [
  { threshold: 0, amount: 1 },
  { threshold: 4, amount: 2 },
  { threshold: 20, amount: 5 },
];

export function unlockedTiers(personal: number): ClickTier[] {
  return CLICK_TIERS.filter((tier) => personal >= tier.threshold);
}

export function readPersonalCount(value: string | null): number {
  if (!value) return 0;
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : 0;
}

export function takeClickBatch(pending: number): number {
  if (!Number.isFinite(pending) || pending <= 0) return 0;
  return Math.min(MAX_CLICK_BATCH, Math.floor(pending));
}
