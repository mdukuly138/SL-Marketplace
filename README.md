# SL Marketplace

A mobile-first marketplace and social discovery platform for Sierra Leone. Buy, sell, and message sellers directly — built for individuals, restaurants, shops, and service providers.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Supabase (Database, Auth, Storage, Realtime) — added in a later milestone
- Deployed on Vercel

## Project Structure

```
src/
  assets/       Static images/icons used within components
  components/   Reusable UI building blocks (ui/, navigation/, listings/, social/)
  pages/        Route-level screens (Home, Market, Sell, Messages, Profile, etc.)
  layouts/      Shared page shells (e.g. layout wrapping bottom nav)
  hooks/        Reusable React hooks
  lib/          Low-level clients and utilities (supabase.ts, utils.ts)
  services/     Backend/API interaction logic (added once Supabase is connected)
  types/        Shared TypeScript types
  data/         Temporary local demo data (replaced by Supabase later)

public/         Static files served as-is
supabase/
  migrations/   Database schema migrations
  seed.sql      Seed data (empty until Supabase is connected)
```

## Environment Variables

Set these in Vercel → Project → Settings → Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

See `.env.example` for reference. Never commit a real `.env` file.

## Status

- [x] Base project setup (Vite + React + TypeScript + Tailwind)
- [x] Design system (colors, typography, core UI components)
- [ ] Pages (Home, Market, Sell, Messages, Profile, Listing Details, Seller Profile)
- [ ] Supabase integration (Auth, Database, Storage, Realtime)
- [ ] Payments (Monime) — future
