# The Brownfaloon

A family cocktail-hour site: monthly Zoom calls, a hosting rotation, and a
running recipe box. Built with the same stack and file structure as the
portfolio project — Next.js App Router, TypeScript, Tailwind.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy with Vercel Blob

1. Create a Vercel project from this repository and deploy it.
2. In the Vercel project, open **Storage**, create a Blob store, and connect it
  to the project.
3. Make sure the store's `BLOB_READ_WRITE_TOKEN` is available in the Preview
  and Production environments, then redeploy.

The site data API stores its JSON in a private Blob at
`brownfaloon/site-data.json`. Local browser storage is only used as a fallback
when the API is unavailable.

The admin passcode is currently a browser-side family gate, not server-side
authentication. Protect the `/admin` route and `/api/site-data` write/delete
operations with real server authentication before using this for sensitive
content.

## Where things live

- `app/` — one route per page (`/`, `/schedule`, `/recipes`, `/zoom`, `/gallery`).
- `components/` — one component per section, matching each page's block.
- `lib/` — the actual content: `roster.ts`, `recipes.ts`, `zoom.ts`.

## Updating each month

Use `/admin` to update the roster, recipe, archive, Zoom details, and countdown
data. Changes are saved through the Blob-backed API and shared across deployed
visitors.

## Notes

- The Zoom Portal gate and the Gallery upload are client components
  (`"use client"`) since they hold interactive state; everything else is a
  server component, same split the portfolio uses.
- Gallery uploads only last for the current browser session; gallery storage is
  not wired up yet.
