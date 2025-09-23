# AgriLink — Smart Farm Marketplace & AI Cold Chain (Starter)

This is a production-ready starter scaffold for **AgriLink** with:
- **Frontend**: React + Vite + TypeScript + Tailwind + shadcn-style UI (local stubs), i18n (Thai/English), accessible, SEO-friendly, mobile-first.
- **Backend**: Node + Express + Prisma + PostgreSQL + Socket.IO for realtime IoT events.
- **CI/CD**: Firebase Hosting (frontend) and Render (backend), GitHub Actions for lint/build/test.
- **Modules**: (1) Digital Farm Marketplace, (2) Smart Logistics & Cold Chain, (3) Farm Support & QA.
- **Interactive**: QR traceability, role-based dashboards (Farmer, Buyer, Inspector, Admin), realtime IoT tracking, Request Pilot Access form.

> Quick start
```bash
# prerequisites: Node 20+, pnpm, Docker (optional), PostgreSQL (local or cloud)
pnpm i
cp apps/backend/.env.example apps/backend/.env    # fill DATABASE_URL and JWT_SECRET
pnpm --filter backend prisma generate
pnpm --filter backend prisma migrate dev --name init
pnpm dev
```

## Deploy
- **Frontend** → Firebase: `firebase deploy` (after `pnpm --filter frontend build`).
- **Backend** → Render: use `render.yaml` or create a Web Service linked to `apps/backend` and set env vars.

See per-app READMEs for details.
