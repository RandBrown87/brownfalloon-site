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

## Where things live

- `app/` — one route per page (`/`, `/schedule`, `/recipes`, `/zoom`, `/gallery`).
- `components/` — one component per section, matching each page's block.
- `lib/` — the actual content: `roster.ts`, `recipes.ts`, `zoom.ts`.

## Updating each month

- **New host / new drink**: edit `lib/roster.ts` (bump `currentMonthIndex`)
  and `lib/recipes.ts` (update `currentDrink`, move last month's into
  `archive`).
- **Next call date**: edit `NEXT_CALL_ISO` at the top of
  `components/Countdown.tsx`.
- **Zoom link/ID/passcode**: edit `lib/zoom.ts`. `portalPasscode` is the
  family passcode that unlocks the `/zoom` page — this is a friendly
  speed-bump, not real security, since it all runs in the browser.

## Notes

- The Zoom Portal gate and the Gallery upload are client components
  (`"use client"`) since they hold interactive state; everything else is a
  server component, same split the portfolio uses.
- Gallery uploads only last for the current browser session — there's no
  storage wired up yet. Say the word if you want that made persistent.
