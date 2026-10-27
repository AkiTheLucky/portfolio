export type IncrementValidation =
  | { ok: true; amount: number }
  | { ok: false; error: string };

export function validateIncrementBody(body: unknown): IncrementValidation {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      ok: false,
      error: 'Expected a JSON object with a numeric "amount".',
    };
  }

  const amount = (body as Record<string, unknown>).amount;
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return { ok: false, error: '"amount" must be a finite number.' };
  }

  return {
    ok: true,
    amount: Math.min(20, Math.max(1, Math.trunc(amount))),
  };
}
