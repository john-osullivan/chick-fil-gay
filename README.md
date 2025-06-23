# Chick-fil-Gay

A web app to match your Chick-fil-A spend with a donation to LGBTQ charities.

## Monorepo Structure

- `apps/web`: React + Tailwind frontend
- `apps/api`: Serverless backend (Cloudflare Worker style)
- `packages/`: Shared code (optional)

## Setup

1. Install dependencies (pnpm recommended):
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` and fill in your Plaid/Stripe credentials.

## Frontend

- Dev: `pnpm dev:web`
- Build: `pnpm build:web`

## Backend

- Dev: `pnpm dev:api`
- Build: `pnpm build:api`
- Test: `pnpm test:api`

## Deployment

- Frontend: Deploy `apps/web/dist` as static site (e.g., GitHub Pages)
- Backend: Deploy `apps/api` with Cloudflare Workers

## UI Components

Implement your custom UI in `apps/web/components/`.

---

Happy Pride! 🏳️‍🌈
