import { describe, expect, it } from "vitest";
import { FixedWindowRateLimiter } from "../src/rate-limit";

const options = { limit: 10, windowMs: 60_000, maxEntries: 2 };

describe("FixedWindowRateLimiter", () => {
  it("counts increment amounts and rejects only the excess", () => {
    const limiter = new FixedWindowRateLimiter(options);

    expect(limiter.consume("ip-a", 6, 1_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-a", 5, 2_000)).toEqual({
      allowed: false,
      retryAfter: 58,
    });
    expect(limiter.consume("ip-a", 4, 3_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-a", 1, 4_000)).toEqual({
      allowed: false,
      retryAfter: 56,
    });
  });

  it("tracks clients independently and resets at the window boundary", () => {
    const limiter = new FixedWindowRateLimiter(options);

    expect(limiter.consume("ip-a", 10, 1_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-b", 10, 1_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-a", 1, 59_999).allowed).toBe(false);
    expect(limiter.consume("ip-a", 10, 60_000)).toEqual({ allowed: true });
  });

  it("caps the number of clients without blocking known clients", () => {
    const limiter = new FixedWindowRateLimiter(options);

    expect(limiter.consume("ip-a", 1, 1_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-b", 1, 2_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-c", 1, 3_000)).toEqual({
      allowed: false,
      retryAfter: 57,
    });
    expect(limiter.consume("ip-a", 1, 4_000)).toEqual({ allowed: true });
  });

  it("prunes expired clients before enforcing the capacity limit", () => {
    const limiter = new FixedWindowRateLimiter(options);

    expect(limiter.consume("ip-a", 1, 1_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-b", 1, 2_000)).toEqual({ allowed: true });
    expect(limiter.consume("ip-c", 1, 60_000)).toEqual({ allowed: true });
  });
});
