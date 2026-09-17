# AGENTS.md

## Cursor Cloud specific instructions

This is the **Koderlauf-Webseite** — a Next.js 16 / React 19 website for a local forest run event in Obermögersheim (Germany).

### Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Supabase** (project ref: `rrhcoelbplyiwczzkrjl`, URL `https://rrhcoelbplyiwczzkrjl.supabase.co`) — Orga-Stammdaten (Sponsoren, Fassjagd-Overrides). Auth/Storage bei Bedarf. Teilnehmer bleiben bei Race Result.
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
- `NEXT_PUBLIC_SUPABASE_URL` — `https://rrhcoelbplyiwczzkrjl.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Publishable key (`sb_publishable_…`, also as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SECRET_KEY` — Server only (`sb_secret_…`); Fassjagd persist + sponsor contacts PDF. Alias: `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` — Optional; `/api/checkout` is not used for live registration
- `NEXT_PUBLIC_SITE_URL` — Public site URL (`https://koderlauf.de` prod, `https://test.koderlauf.de` test)

The dev server starts without the secret key (demo/code fallback). Set the secret key in Vercel so admin overrides survive deploys.

### Testdomain (test.koderlauf.de)

Separate test URL for reviewers; production stays on `koderlauf.de`.

| Domain | Branch (Vercel) | Purpose |
|---|---|---|
| `test.koderlauf.de` | `main` | Latest version for testers |
| `koderlauf.de` | `production` | Official live site |

**DNS:** CNAME `test` → `cname.vercel-dns.com`

**Setup script:** `powershell -File scripts/setup-test-domain.ps1` (after `npx vercel login`)

**Code behaviour on test domain:**
- Amber banner „Testumgebung“
- `noindex` via middleware + metadata (not indexed by Google)
- Dynamic `metadataBase` from request host

**Recommended Git workflow:** develop on `main` → testers use test domain → merge `main` into `production` when going live on koderlauf.de.

### Database setup

Neues leeres Projekt: SQL in `supabase/migrations/20260917_orga_stammdaten.sql` im Editor ausführen:

https://supabase.com/dashboard/project/rrhcoelbplyiwczzkrjl/sql/new

Creates `sponsors` (2026 seed: Namen/Ort/Website, Kontakte leer) and `fassjagd_state`. Do **not** apply `supabase/archive/20260225_init_schema.sql` (old unused Stripe/participants draft).

Or: `SUPABASE_DB_URL='postgresql://…' node scripts/setup-db.mjs`

### Caveats

- Tailwind v4 uses CSS-based config (`@theme inline` in `globals.css`), not `tailwind.config.js`.
- The Stripe client in `api/checkout/route.ts` is lazy-initialized to avoid build errors when `STRIPE_SECRET_KEY` is not set.
- The React Compiler lint rule flags `setState` inside `useEffect`; use `requestAnimationFrame` wrapper for mount-detection patterns.
- All data-fetching functions in `src/lib/data/` gracefully fall back to demo data when DB tables don't exist.
- Hero video is a Pexels placeholder; replace `HERO_VIDEO_SRC` in `hero.tsx` with the real video.
- Logo SVG at `public/logo-koderlauf.svg` is a placeholder; replace with the real logo file when available.
