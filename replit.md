# BarberOS — Barbershop SaaS Platform

## Overview
A full-stack SaaS platform for barbershop scheduling and management, inspired by weibook.co. Built as a pnpm monorepo with a React+Vite SPA frontend and Express 5 API backend.

## Architecture

### Packages
- `artifacts/barbershop-saas` — React+Vite SPA (port 19935, preview at `/`)
- `artifacts/api-server` — Express 5 REST API (port 8080, routes at `/api`)
- `lib/api-spec` — OpenAPI spec (`openapi.yaml`) + codegen
- `lib/api-zod` — Zod schemas generated from OpenAPI
- `lib/api-client-react` — React Query hooks generated from OpenAPI
- `lib/db` — Drizzle ORM schema + migrations

### Design System
- Colors: Indigo `#6366F1` (accent), White `#FFFFFF`, Deep Black `#0A0A0A`
- Fonts: Outfit (headings, `font-display`), Inter (body)
- Dark mode via `next-themes` with `attribute="class"`
- Tailwind CSS v4 with custom CSS variables

## Frontend Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing.tsx` | Marketing landing page with 6+ sections |
| `/register` | `Register.tsx` | Split-screen admin/client registration |
| `/admin` | `admin/Dashboard.tsx` | Admin bento dashboard with real data |
| `/admin/calendar` | `admin/Calendar.tsx` | Day-view appointments calendar |
| `/admin/services` | `admin/Services.tsx` | Services management table |
| `/admin/team` | `admin/Team.tsx` | Barber team management |
| `/admin/clients` | `admin/Clients.tsx` | Client list |
| `/book/:slug` | `booking/BookingFlow.tsx` | 5-step client booking flow |
| `/client` | `client/Dashboard.tsx` | Client dashboard with appointment history |

## API Endpoints
- `GET /api/healthz`
- `GET/POST /api/barbershops`
- `GET /api/barbershops/:id`
- `GET /api/barbershops/:id/dashboard` — stats, revenue, upcoming appointments
- `GET/POST /api/barbershops/:id/services`
- `GET/POST /api/barbershops/:id/barbers`
- `GET/POST /api/barbershops/:id/appointments`
- `PATCH /api/appointments/:id`
- `GET/POST /api/clients`
- `GET /api/clients/:id/appointments`

## Database Schema (PostgreSQL via Drizzle ORM)
- `barbershops` — id, name, slug, address, phone, description, logo_url, cover_url, open_time, close_time
- `barbers` — id, barbershop_id, name, photo_url, bio, specialties
- `services` — id, barbershop_id, name, description, duration_minutes, price
- `clients` — id, name, email, phone
- `appointments` — id, barbershop_id, barber_id, client_id, service_id, date, time, status, notes

## Seeded Demo Data
- Barbershop: "Barbería El Maestro" (ID: 1, slug: `el-maestro`)
- 3 barbers: Carlos Mendoza, Andrés Torres, Felipe Ríos
- 5 services: Corte Clásico, Fade + Barba, Corte + Barba, Arreglo de Barba, Skin Fade
- 5 clients: Mateo García, Juan Pérez, David López, Sebastián Mora, Camilo Castro
- 7 appointments (today + tomorrow)

## Codegen
Run `pnpm --filter @workspace/api-spec run codegen` to regenerate Zod schemas and React Query hooks from `lib/api-spec/openapi.yaml`.

## Key Dependencies
- `wouter` v3 — SPA routing (Link renders its own `<a>`, do NOT nest `<a>` inside `<Link>`)
- `@tanstack/react-query` — server state management
- `next-themes` — dark mode
- `framer-motion` — animations
- `recharts` — charts
- `date-fns` — date formatting
- `drizzle-orm` + `pg` — database

## Deployment
A `vercel.json` at project root configures: `framework: "vite"`, `outputDirectory: "dist/public"`, SPA rewrite rule (`/*` → `/index.html`).
