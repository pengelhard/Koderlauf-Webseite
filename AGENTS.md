# AGENTS.md

## Cursor Cloud specific instructions

This is the **Koderlauf-Webseite** — a Next.js 16 / React 19 website for a local forest run event in Obermögersheim (Germany).

### Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Supabase** (project ref: `dulsyqvhylxjdtntbzbw`) — Auth, Postgres, Storage
- Stripe Checkout for payments, Resend for emails
- Hosting target: Vercel

### Running the dev server

```bash
npm run dev
```

Runs on `http://localhost:3000`. Hot reload works out of the box.

### Key commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm start` | Serve production build |

### Project structure

- `src/app/` — App Router pages (home, `/ergebnisse`, `/galerie`, `/anmeldung`, `/anmeldung/erfolg`)
- `src/app/api/checkout/` — Stripe Checkout API route
- `src/app/opengraph-image.tsx` — Dynamic OG image generation (edge runtime)
- `src/components/ui/` — shadcn/ui components + custom `Logo`
- `src/components/layout/` — Navbar, Footer
- `src/components/sections/` — Hero (video+parallax), Features, Stats, Countdown
- `src/lib/pricing.ts` — Pricing engine (Early Bird / Normal / Nachmeldung)
- `src/lib/supabase/` — Supabase client (browser) and server helpers
- `src/types/database.ts` — Supabase DB types (events, participants, results, gallery_images)

### Environment variables

A `.env.local` file is required with:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `STRIPE_SECRET_KEY` — Required for `/api/checkout` (payment route)
- `NEXT_PUBLIC_SITE_URL` — Used for OG metadata base URL

The dev server starts fine with placeholder Supabase values. Stripe requires a real key only when the checkout API is called.

### Caveats

- Tailwind v4 uses CSS-based config (`@theme inline` in `globals.css`), not `tailwind.config.js`.
- The design system colors (Koder-Orange `#FF6B00`, Forest Green `#0A3D2A`) are defined as both CSS variables and Tailwind theme tokens in `globals.css`.
- The Stripe client in `api/checkout/route.ts` is lazy-initialized to avoid build errors when `STRIPE_SECRET_KEY` is not set.
- The React Compiler lint rule flags `setState` inside `useEffect`; use `requestAnimationFrame` wrapper for mount-detection patterns.
- Hero video is a Pexels placeholder; replace `HERO_VIDEO_SRC` in `hero.tsx` with the real video later.
- The font Satoshi is planned but not yet available; Inter is used as fallback everywhere.
