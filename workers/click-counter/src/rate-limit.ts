interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  maxEntries: number;
}

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: RateLimiterOptions) {}

  consume(key: string, amount: number, now = Date.now()): RateLimitDecision {
    this.pruneExpired(now);

    let bucket = this.buckets.get(key);
    if (!bucket) {
      if (this.buckets.size >= this.options.maxEntries) {
        return {
          allowed: false,
          retryAfter: this.secondsUntilEarliestReset(now),
        };
      }

      bucket = {
        count: 0,
        resetAt: (Math.floor(now / this.options.windowMs) + 1) *
          this.options.windowMs,
      };
      this.buckets.set(key, bucket);
    }

    if (bucket.count + amount > this.options.limit) {
      return {
        allowed: false,
        retryAfter: retryAfterSeconds(bucket.resetAt, now),
      };
    }

    bucket.count += amount;
    return { allowed: true };
  }

  private pruneExpired(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }

  private secondsUntilEarliestReset(now: number): number {
    let earliestReset = Number.POSITIVE_INFINITY;
    for (const bucket of this.buckets.values()) {
      earliestReset = Math.min(earliestReset, bucket.resetAt);
    }
    return retryAfterSeconds(earliestReset, now);
  }
}

function retryAfterSeconds(resetAt: number, now: number): number {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}
