# Portfolio click counter

A small Cloudflare Worker backed by one global Durable Object using SQLite storage. It provides a no-store JSON counter for a static portfolio.

## API

- `GET /counter` → `{ "total": 0 }`
- `POST /counter/increment` with `Content-Type: application/json` and `{ "amount": 5 }` → `{ "total": 5 }`
- `OPTIONS` is supported on both routes.

`amount` must be a finite JSON number. It is truncated to an integer and clamped to `1..20`, so omitted, non-numeric, `NaN`, and infinite values are rejected while out-of-range numbers are clamped. Errors use `{ "error": "..." }`; rate limits return HTTP 429 and `Retry-After`.

All responses include `Cache-Control: no-store`. `ALLOWED_ORIGIN` controls CORS. Requests with a different `Origin` receive HTTP 403; requests without an `Origin` header (such as curl) are allowed. Use an exact origin such as `https://username.github.io`, with no path or trailing slash. `*` is supported but not recommended for a public write endpoint.

The increment limit is a best-effort 120 counted clicks per fixed 60-second window per `CF-Connecting-IP`. The limiter is in memory, keeps at most 1,024 IP buckets, and prunes expired buckets, so it does not create unbounded persistent state. Buckets can reset if the Durable Object is evicted; this is basic abuse protection, not a security boundary. SQLite stores only the single counter row, and increments use one atomic `UPDATE ... RETURNING` statement.

## Setup

Requires Node.js 20 or newer.

```sh
npm install
```

Set `ALLOWED_ORIGIN` in `wrangler.jsonc` to the portfolio origin. The checked-in default is Astro's local origin, `http://localhost:4321`; change it to the production GitHub Pages origin before deploying. It is a non-secret Worker variable.

## Local development

```sh
npm run dev
```

Wrangler normally serves the Worker at `http://localhost:8787`:

```sh
curl http://localhost:8787/counter
curl -X POST http://localhost:8787/counter/increment \
  -H "Content-Type: application/json" \
  -d '{"amount":5}'
```

For browser testing from Astro, keep `ALLOWED_ORIGIN` set to `http://localhost:4321` and send requests to the Wrangler URL.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

`npm run build` runs `wrangler deploy --dry-run`; it bundles and validates the Worker but does not deploy it.

## Deploy

After authenticating Wrangler locally and setting the production `ALLOWED_ORIGIN`:

```sh
npm run deploy
```

The command prints the Worker URL. Use that URL from the static site's client-side code. The `v1` migration in `wrangler.jsonc` deliberately uses `new_sqlite_classes`; do not change it to `new_classes`, which would select key-value storage instead.
