# Neighborhood Oktoberfest beer tasting

A small React + Vite invitation and public beer-claim list. A Cloudflare Worker owns the API, and D1 enforces that a brewery/beer pair can only be claimed once.

## Edit the event details

Update the placeholder values in `src/eventConfig.js`.

## Install and run locally

Requirements: Node.js 20+ and a Cloudflare account for deployment.

```bash
npm install
npm run db:migrate:local
```

Run the Worker (including its local D1 database) in one terminal:

```bash
npm run build
npx wrangler dev
```

For frontend hot reloading, run this in a second terminal. Vite proxies `/api` to Wrangler on port 8787:

```bash
npm run dev
```

Open the Vite URL printed in the terminal. Local D1 data lives under `.wrangler/` and is ignored by Git.

## Database migrations

Migrations live in `migrations/`. Apply them locally with `npm run db:migrate:local`. To apply them to the deployed database, use `npm run db:migrate:remote`.

The unique index on `normalized_brewery, normalized_beer_name` is the final duplicate guard. The Worker normalizes Unicode, case, leading/trailing whitespace, and repeated internal whitespace before insertion. D1 resolves concurrent attempts atomically: one succeeds, and the other receives HTTP 409.

## Test and build

```bash
npm test
npm run lint
npm run build
```

## Deploy to Cloudflare

1. Authenticate: `npx wrangler login`.
2. Create the database: `npx wrangler d1 create oktoberfest-signups`.
3. Copy the returned database ID into `wrangler.jsonc`.
4. Apply the migration: `npm run db:migrate:remote`.
5. Deploy the Worker and static assets: `npm run deploy`.

The Worker serves the built frontend and the API from one origin. No browser code or public configuration has direct D1 access.
