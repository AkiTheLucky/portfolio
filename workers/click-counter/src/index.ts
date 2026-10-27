import type { Env } from "./env";
import { errorResponse } from "./http";

export { Counter } from "./counter";

function corsHeaders(allowedOrigin: string): Headers {
  return new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });
}

function addCors(response: Response, headers: Headers): Response {
  const result = new Response(response.body, response);
  headers.forEach((value, key) => result.headers.set(key, value));
  result.headers.set("Cache-Control", "no-store");
  return result;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN?.trim();
    if (!allowedOrigin) {
      return errorResponse("ALLOWED_ORIGIN is not configured.", 500);
    }

    const cors = corsHeaders(allowedOrigin);
    const requestOrigin = request.headers.get("Origin");
    if (
      requestOrigin !== null &&
      allowedOrigin !== "*" &&
      requestOrigin !== allowedOrigin
    ) {
      return addCors(errorResponse("Origin is not allowed.", 403), cors);
    }

    const { pathname } = new URL(request.url);
    const isCounter = pathname === "/counter";
    const isIncrement = pathname === "/counter/increment";
    if (!isCounter && !isIncrement) {
      return addCors(errorResponse("Not found.", 404), cors);
    }

    if (request.method === "OPTIONS") {
      return addCors(
        new Response(null, {
          status: 204,
          headers: { Allow: isCounter ? "GET, OPTIONS" : "POST, OPTIONS" },
        }),
        cors,
      );
    }

    if ((isCounter && request.method !== "GET") ||
        (isIncrement && request.method !== "POST")) {
      return addCors(
        errorResponse("Method not allowed.", 405, {
          Allow: isCounter ? "GET, OPTIONS" : "POST, OPTIONS",
        }),
        cors,
      );
    }

    try {
      const id = env.COUNTER.idFromName("global");
      const response = await env.COUNTER.get(id).fetch(request);
      return addCors(response, cors);
    } catch (error) {
      console.error("Counter request failed", error);
      return addCors(errorResponse("Internal server error.", 500), cors);
    }
  },
} satisfies ExportedHandler<Env>;
