# AGENTS.md

## Cursor Cloud specific instructions

This is the **Koderlauf-Webseite** — a Next.js 16 / React 19 website for a local forest run event in Obermögersheim (Germany).

### Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Supabase** (project ref: `dulsyqvhylxljdntbzbw`) — Auth, Postgres, Storage
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
- `src/lib/data/` — Data layer: events, results, gallery, registration (Supabase + demo fallback)
- `src/lib/supabase/` — Supabase client (browser) and server helpers
- `src/types/database.ts` — Supabase DB types
- `supabase/migrations/` — SQL migration to create all tables

### Environment variables

A `.env.local` file is required with:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/publishable key
- `STRIPE_SECRET_KEY` — Required for `/api/checkout` (payment route)
- `NEXT_PUBLIC_SITE_URL` — Used for OG metadata base URL

The dev server starts fine with placeholder Supabase values (demo data is shown as fallback). Stripe requires a real key only when the checkout API is called.

### Database setup

Tables must be created by running the SQL in `supabase/migrations/20260225_init_schema.sql` via the Supabase SQL Editor. The migration creates: `events`, `participants`, `results`, `gallery_images`, RLS policies, indexes, and seed data for 2026/2027 events.

### Caveats

- Tailwind v4 uses CSS-based config (`@theme inline` in `globals.css`), not `tailwind.config.js`.
- The Stripe client in `api/checkout/route.ts` is lazy-initialized to avoid build errors when `STRIPE_SECRET_KEY` is not set.
- The React Compiler lint rule flags `setState` inside `useEffect`; use `requestAnimationFrame` wrapper for mount-detection patterns.
- All data-fetching functions in `src/lib/data/` gracefully fall back to demo data when DB tables don't exist.
- Hero video is a Pexels placeholder; replace `HERO_VIDEO_SRC` in `hero.tsx` with the real video.
- Logo SVG at `public/logo-koderlauf.svg` is a placeholder; replace with the real logo file when available.
