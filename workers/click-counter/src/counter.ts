import type { Env } from "./env";
import { errorResponse, jsonResponse } from "./http";
import { FixedWindowRateLimiter } from "./rate-limit";
import { validateIncrementBody } from "./validation";

const MAX_BODY_BYTES = 1024;

export class Counter {
  private readonly rateLimiter = new FixedWindowRateLimiter({
    limit: 120,
    windowMs: 60_000,
    maxEntries: 1024,
  });

  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        total INTEGER NOT NULL
      )
    `);
    this.state.storage.sql.exec(
      "INSERT OR IGNORE INTO counter (id, total) VALUES (1, 0)",
    );
  }

  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/counter" && request.method === "GET") {
      return jsonResponse({ total: this.readTotal() });
    }

    if (pathname === "/counter/increment" && request.method === "POST") {
      return this.increment(request);
    }

    return errorResponse("Not found.", 404);
  }

  private async increment(request: Request): Promise<Response> {
    const contentType = request.headers.get("Content-Type") ?? "";
    if (contentType.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
      return errorResponse("Content-Type must be application/json.", 415);
    }

    const contentLength = request.headers.get("Content-Length");
    if (contentLength !== null && Number(contentLength) > MAX_BODY_BYTES) {
      return errorResponse("JSON body is too large.", 413);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Request body must be valid JSON.", 400);
    }

    const validation = validateIncrementBody(body);
    if (!validation.ok) {
      return errorResponse(validation.error, 400);
    }

    const ip = request.headers.get("CF-Connecting-IP")?.trim() || "unknown";
    const decision = this.rateLimiter.consume(ip, validation.amount);
    if (!decision.allowed) {
      return errorResponse(
        "Rate limit exceeded. Try again later.",
        429,
        { "Retry-After": String(decision.retryAfter) },
      );
    }

    const row = this.state.storage.sql.exec<{ total: number }>(
      "UPDATE counter SET total = total + ? WHERE id = 1 RETURNING total",
      validation.amount,
    ).one();

    return jsonResponse({ total: row.total });
  }

  private readTotal(): number {
    return this.state.storage.sql.exec<{ total: number }>(
      "SELECT total FROM counter WHERE id = 1",
    ).one().total;
  }
}
