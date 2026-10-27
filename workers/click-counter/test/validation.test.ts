import { describe, expect, it } from "vitest";
import { validateIncrementBody } from "../src/validation";

describe("validateIncrementBody", () => {
  it("accepts an integer amount", () => {
    expect(validateIncrementBody({ amount: 5 })).toEqual({ ok: true, amount: 5 });
  });

  it("truncates fractional amounts toward zero", () => {
    expect(validateIncrementBody({ amount: 5.9 })).toEqual({ ok: true, amount: 5 });
    expect(validateIncrementBody({ amount: -2.9 })).toEqual({ ok: true, amount: 1 });
  });

  it("clamps amounts to the inclusive range 1 through 20", () => {
    expect(validateIncrementBody({ amount: 0 })).toEqual({ ok: true, amount: 1 });
    expect(validateIncrementBody({ amount: 0.9 })).toEqual({ ok: true, amount: 1 });
    expect(validateIncrementBody({ amount: -100 })).toEqual({ ok: true, amount: 1 });
    expect(validateIncrementBody({ amount: 21 })).toEqual({ ok: true, amount: 20 });
    expect(validateIncrementBody({ amount: 1e100 })).toEqual({ ok: true, amount: 20 });
  });

  it.each([
    undefined,
    null,
    [],
    "amount",
    1,
    {},
    { amount: "5" },
    { amount: null },
    { amount: Number.NaN },
    { amount: Number.POSITIVE_INFINITY },
  ])("rejects invalid input: %j", (body) => {
    expect(validateIncrementBody(body).ok).toBe(false);
  });
});
