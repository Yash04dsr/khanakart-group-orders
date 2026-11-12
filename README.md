# CrowdPlate / KhanaKart

CrowdPlate turns a campus group’s individual food requests into one order-ready list.

An organizer starts a session for any campus outlet and sets a cutoff. Everyone adds their own items, quantities, and optional prices. CrowdPlate combines the submissions so the organizer can copy or export one order.

The same product is deployed with domain-specific branding:

- `crowdplate.online` → CrowdPlate
- `khanakart.me` → KhanaKart

## Product flow

1. Organizer starts a session for an outlet.
2. Participants add or update their own items before the cutoff.
3. Organizer reviews individual submissions and the combined order.
4. Organizer finalizes the session and places the order with the outlet.

## Stack

- React 18, TypeScript, and Vite
- Tailwind CSS and shadcn/ui
- Supabase Auth, Postgres, and Realtime
- TanStack Query
- Vercel

## Local development

```sh
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Verification

```sh
npm run lint
npm run build
```

## Deployment

The production Vercel project deploys from `main`. `vercel.json` rewrites application routes to `index.html` for client-side routing.
