# Koderlauf-Webseite

Modern Athletic Forest Energy Plattform für den jährlichen Koderlauf in Obermögersheim.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3.4 + shadcn/ui-Style Komponenten
- Framer Motion
- Supabase (SSR + Browser + Admin Client)
- Stripe Checkout + Resend

## Entwicklung

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Qualitätschecks

```bash
npm run lint
npm run typecheck
npm run build
```