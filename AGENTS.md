# AGENTS.md

## Cursor Cloud specific instructions

This is the **Koderlauf-Webseite** — a Next.js 16 / React 19 website for a local forest run event in Obermögersheim (Germany).

### Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Supabase** (project ref: `dulsyqvhylxjdtntbzbw`) — Auth, Postgres, Storage
- Stripe Checkout, Resend for emails
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

- `src/app/` — App Router pages (home, `/ergebnisse`, `/galerie`, `/anmeldung`)
- `src/components/ui/` — shadcn/ui components
- `src/components/layout/` — Navbar, Footer
- `src/components/sections/` — Hero, Features, Stats, Countdown
- `src/lib/supabase/` — Supabase client (browser) and server helpers
- `src/types/database.ts` — Supabase DB types

### Environment variables

A `.env.local` file is required with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are gitignored. The dev server starts fine with placeholder values but Supabase features (auth, data) need real keys.

### Caveats

- Tailwind v4 uses CSS-based config (`@theme inline` in `globals.css`), not `tailwind.config.js`.
- The design system colors (Koder-Orange `#FF6B00`, Forest Green `#0A3D2A`) are defined as both CSS variables and Tailwind theme tokens in `globals.css`.
- External images from `images.unsplash.com` and the Supabase storage domain are allowed in `next.config.ts`.
- The React Compiler lint rule flags `setState` inside `useEffect`; use `requestAnimationFrame` wrapper for mount-detection patterns.
