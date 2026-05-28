# Shaadi AI Planner

An AI-assisted wedding planning platform for Indian celebrations. Couples complete a guided intake, receive vendor budget allocations powered by Groq LLMs, and track real spend against AI-suggested categories—all without authentication in the current release.

Built as a production-grade Next.js 14 application with a clear separation between UI, API routes, and data access layers.

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Folder structure](#folder-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database schema](#database-schema)
- [API reference](#api-reference)
- [AI prompt engineering](#ai-prompt-engineering)
- [Tradeoffs](#tradeoffs)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

Shaadi AI Planner helps couples plan multi-day Indian weddings (mehendi, sangeet, ceremony, reception) with:

1. **Guided intake** — A four-step form capturing date, guests, city, venue type, budget range, and up to two couple priorities.
2. **AI recommendations** — Five vendor-category budget allocations with priority ranks and rationales, generated via Groq.
3. **Budget tracking** — Per-category allocated vs. spent vs. remaining, plus a payment ledger.

The frontend never talks to Supabase directly. All data flows through Next.js Route Handlers, which keeps credentials server-side and makes the client surface easy to reason about.

---

## Features

| Area | Capability |
|------|------------|
| **Intake** | Multi-step form with Zod validation, progress indicator, step persistence, Framer Motion transitions |
| **AI planning** | Groq `llama-3.3-70b-versatile` with strict JSON output and server-side schema validation |
| **Results dashboard** | Vendor cards, budget overview, spend utilization bar |
| **Payments** | Record vendor payments via modal; category budgets update in real time |
| **UX** | Wedding-themed UI (shadcn/ui), skeleton loaders, empty/error states, Sonner toasts, mobile nav |
| **Reliability** | Error boundaries, retry flows, intake rollback on AI failure, reduced-motion support |

Authentication is intentionally **not** included in v1—suitable for demos, internal tools, or a future auth pass with Supabase RLS.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, CSS variables, shadcn/ui (Radix) |
| Forms | react-hook-form, Zod, @hookform/resolvers |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| Database | Supabase (PostgreSQL) |
| AI | Groq SDK (`llama-3.3-70b-versatile`) |
| Dates | date-fns |

---

## Architecture

### High-level flow

```
┌─────────────┐     fetch (client)      ┌──────────────────┐
│  Next.js UI │ ───────────────────────▶│  Route Handlers  │
│  (React)    │                         │  /api/*          │
└─────────────┘                         └────────┬─────────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
            ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
            │ lib/services  │           │  lib/groq.ts  │           │ lib/supabase  │
            │ (orchestration)│          │  (LLM calls)  │           │ (DB client)   │
            └───────┬───────┘           └───────────────┘           └───────┬───────┘
                    │                                                        │
                    └────────────────────────────┬───────────────────────────────┘
                                                 ▼
                                        ┌───────────────┐
                                        │   Supabase PG   │
                                        └───────────────┘
```

### Key decisions

1. **API-first client data access** — Pages such as `/recommendations/[id]` call `GET /api/recommendations/[id]` instead of importing Supabase in client bundles. This avoids exposing query patterns, simplifies caching, and mirrors how a separate mobile app would integrate.

2. **Service layer** — Route handlers stay thin; `lib/services/*` owns orchestration (e.g. save intake → call Groq → validate → persist → rollback on failure).

3. **Zod at every boundary** — Request bodies, LLM responses, and API responses are validated with schemas in `lib/validators.ts`, `lib/validations/*`, and `lib/api/responses.ts`. Budget totals are computed only on the server (`lib/budget/*`).

4. **Server-only secrets** — `GROQ_API_KEY` is never prefixed with `NEXT_PUBLIC_`. Groq and Supabase server clients live in `lib/groq.ts` and `lib/supabase.ts`.

5. **Functional components** — No class components except `ErrorBoundary`, which requires React’s error boundary API.

6. **No auth in v1** — Faster shipping and simpler RLS story; production deployments should add Supabase Auth + Row Level Security before public launch.

### Security (v1 groundwork)

| Control | Implementation |
|---------|----------------|
| **Secrets** | `GROQ_API_KEY` / optional service role in `lib/env.server.ts` (`server-only`); never `NEXT_PUBLIC_*` |
| **Supabase** | Anon key only in `lib/supabase.ts`; service role not used by routes |
| **Request bodies** | `parseJsonPostRequest()` — JSON content-type, 64KB max, object root, `.strict()` Zod schemas |
| **Route params** | `parseIntakeIdParam()` — UUID validation on `[id]` |
| **Errors** | `handleRouteError()` — generic 500s; details logged server-side only |
| **AI prompts** | `sanitizeRecommendRequest()` + `<intake>` delimiters; control-char stripping |
| **Rate limits** | Documented in `lib/api/rate-limit.ts` (wire at edge before launch) |
| **RLS** | Example policies in `supabase/migrations/rls.example.sql` |

---

## Folder structure

```
shaadi-ai-planner/
├── app/
│   ├── api/
│   │   ├── health/route.ts              # Service health check
│   │   ├── recommend/route.ts           # POST — intake + AI recommendations
│   │   ├── recommendations/[id]/route.ts # GET — full plan + payments
│   │   └── payments/route.ts            # POST — record payment
│   ├── recommendations/[id]/            # Results & budget tracking page
│   ├── layout.tsx                       # Root layout, fonts, providers
│   ├── page.tsx                         # Marketing + intake
│   ├── error.tsx / global-error.tsx     # Error boundaries
│   └── globals.css                      # Theme tokens & utilities
├── components/
│   ├── budget/                          # Budget cards, payment modal/table
│   ├── forms/                           # FormField, SelectionCard
│   ├── home/                            # Landing sections
│   ├── intake/                          # Multi-step intake wizard
│   ├── layout/                          # Header, footer, typography
│   ├── recommendations/                 # Dashboard, skeletons, states
│   ├── shared/                          # EmptyState, ErrorState, SectionHeader
│   └── ui/                              # shadcn primitives
├── lib/
│   ├── actions/                         # Server Actions (intake submit)
│   ├── api/                             # HTTP helpers, typed responses, client fetch
│   ├── budget/                          # Server-side budget snapshot & summary
│   ├── constants/                       # App & intake constants
│   ├── db/                              # Supabase persistence + row mappers
│   ├── errors/                          # Domain errors (e.g. IntakeNotFound)
│   ├── format/                          # INR currency, label formatters
│   ├── motion/                          # Shared Framer Motion variants
│   ├── services/                        # Business orchestration
│   ├── validations/                       # Zod schemas (intake, payments)
│   ├── env.ts                           # Validated environment
│   ├── groq.ts                          # Groq client + generation
│   ├── prompts.ts                       # LLM prompt templates
│   ├── supabase.ts                      # Supabase client factories
│   └── validators.ts                    # Shared Zod types & AI response schema
├── supabase/migrations/init.sql         # Database schema
├── types/                               # TypeScript domain & DB types
└── public/                              # Static assets (if any)
```

---

## Getting started

### Prerequisites

- **Node.js** 18.17+ (20 LTS recommended)
- **npm** 9+
- [Supabase](https://supabase.com) project (for persistence)
- [Groq](https://console.groq.com) API key (for AI recommendations)

### Local setup

```bash
# Clone and enter the project
cd shaadi-ai-planner

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and Groq credentials

# Apply database schema (Supabase SQL Editor → paste supabase/migrations/init.sql)
# Or use Supabase CLI: supabase db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verify services

```bash
curl http://localhost:3000/api/health
```

Expected response when configured:

```json
{
  "status": "ok",
  "timestamp": "2026-05-28T12:00:00.000Z",
  "services": { "supabase": true, "groq": true }
}
```

---

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Public | Canonical URL for SEO metadata (e.g. `https://app.example.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes* | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Public | Supabase anonymous key |
| `GROQ_API_KEY` | Yes* | **Server only** | Groq API key (`lib/env.server.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | No | **Server only** | Optional; bypasses RLS — not used in v1 |

\*Required for full functionality (intake persistence, AI, payments). The UI loads without them, but API routes return `503` when missing.

> **Security:** Never commit `.env.local`. Never expose server secrets with a `NEXT_PUBLIC_` prefix. Before public launch, enable Auth + RLS (`supabase/migrations/rls.example.sql`) and add edge rate limits (`lib/api/rate-limit.ts`).

---

## Database schema

Migration files: `supabase/migrations/init.sql` (schema), `supabase/migrations/rls.example.sql` (RLS template for Auth)

### Entity relationship

```
wedding_intakes (1) ──< recommendations
                 └──< payments
```

All child tables use `ON DELETE CASCADE`.

### Tables

#### `wedding_intakes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `wedding_date` | DATE | Ceremony / main reception date |
| `guest_count` | INTEGER | CHECK > 0 |
| `city` | TEXT | Primary city |
| `venue_type` | TEXT | e.g. `banquet-hall`, `destination-wedding` |
| `total_budget` | NUMERIC(12,2) | Midpoint of selected budget range (INR) |
| `priorities` | TEXT[] | Up to 2 couple priorities |
| `created_at` | TIMESTAMPTZ | Default `now()` |

#### `recommendations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `intake_id` | UUID | FK → `wedding_intakes` |
| `recommendations` | JSONB | AI payload: `{ recommendations: [...] }` |
| `created_at` | TIMESTAMPTZ | Default `now()` |

GIN index on `recommendations` for JSON queries.

#### `payments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `intake_id` | UUID | FK → `wedding_intakes` |
| `vendor_category` | TEXT | Matches AI category labels |
| `vendor_name` | TEXT | Vendor display name |
| `amount_paid` | NUMERIC(12,2) | CHECK >= 0 |
| `payment_date` | DATE | Date of payment |
| `created_at` | TIMESTAMPTZ | Default `now()` |

### Budget calculations (application layer)

For each vendor category:

```
allocated = AI suggested_budget (from latest recommendation)
spent     = SUM(payments.amount_paid) for that category
remaining = allocated - spent
```

Overall:

```
total_spent = SUM(all payments)
remaining   = total_budget - total_spent
```

---

## API reference

Base URL: `/api` (same origin as the Next.js app).

### `GET /api/health`

Health check and integration status.

**Response `200`:**

```json
{
  "status": "ok",
  "timestamp": "ISO-8601",
  "services": { "supabase": true, "groq": true }
}
```

---

### `POST /api/recommend`

Creates a wedding intake, generates AI vendor allocations, and persists recommendations.

**Request body:**

```json
{
  "weddingDate": "2026-12-15",
  "guestCount": 350,
  "city": "Mumbai",
  "venueType": "banquet-hall",
  "budgetRange": "10l-20l",
  "priorities": ["photography", "food"]
}
```

**Response `201`:**

```json
{
  "intake_id": "uuid",
  "recommendations": [
    {
      "vendor_category": "Venue & Catering",
      "priority_rank": 1,
      "suggested_budget": 900000,
      "rationale": "Largest share for 350 guests in Mumbai banquet setting."
    }
  ]
}
```

| Status | Meaning |
|--------|---------|
| `400` | Invalid request body |
| `404` | — |
| `502` | Groq failure or invalid AI JSON after retries |
| `503` | Supabase or Groq not configured |
| `500` | Database error |

On AI/validation failure, the created intake is **rolled back** (deleted).

---

### `GET /api/recommendations/[id]`

Returns intake details, AI recommendations, payments, and computed category budgets.

**Response `200`:** Includes `intake_id`, `wedding_date`, `city`, `guest_count`, `venue_type`, `total_budget`, `priorities`, `recommendations[]`, `budget_summary`, `category_budgets[]`, `payments[]`, `vendor_categories[]`, `generated_at`.

| Status | Meaning |
|--------|---------|
| `400` | Invalid UUID |
| `404` | Intake not found |
| `503` | Supabase not configured |
| `500` | Server error |

---

### `POST /api/payments`

Records a vendor payment.

**Request body:**

```json
{
  "intake_id": "uuid",
  "vendor_category": "Photography & Videography",
  "vendor_name": "Studio Nama",
  "amount_paid": 150000,
  "payment_date": "2026-03-01"
}
```

**Response `201`:**

```json
{
  "payment": { "id": "uuid", "...": "..." },
  "payments": [ { "id": "uuid", "...": "..." } ],
  "category_budgets": [ { "vendor_category": "...", "allocated": 0, "spent": 0, "remaining": 0 } ],
  "budget_summary": {
    "total_budget": 0,
    "total_allocated": 0,
    "total_spent": 0,
    "remaining": 0
  }
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error |
| `404` | Intake not found |
| `503` | Supabase not configured |
| `500` | Insert failed |

---

## AI prompt engineering

Implementation: `lib/prompts.ts` + `lib/groq.ts`

### Model & parameters

- **Model:** `llama-3.3-70b-versatile`
- **Response format:** `{ type: "json_object" }` (Groq structured output)
- **Temperature:** `0.35` (balance creativity vs. consistency)
- **Retries:** Up to 2 attempts; second attempt includes validation error feedback

### Prompt structure

1. **System prompt** — Role (expert Indian wedding planner), strict JSON-only rules, exact schema example, constraints:
   - Exactly 5 recommendations
   - Unique `priority_rank` 1–5
   - Integer INR budgets; sum ≤ `total_budget_inr`
   - Weight ranks toward couple priorities
   - Realistic vendor categories for Indian weddings

2. **User prompt** — Structured intake: formatted date, city, venue label, guest count, budget range label, total budget cap, priority labels.

3. **Retry prompt** — Appends validation failure message from Zod (e.g. budget overrun, wrong count) and asks for a corrected JSON object.

### Post-generation validation

Server-side Zod schema (`lib/validators.ts`) enforces:

- Array length = 5
- Unique ranks 1–5
- Positive integer `suggested_budget`
- Concise `rationale` (10–280 chars)
- **Sum of suggested budgets ≤ total wedding budget**

Invalid responses never reach the client or database.

---

## Tradeoffs

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| **No authentication** | Faster MVP, simpler demo | Not suitable for public multi-tenant production without RLS + auth |
| **Anon Supabase key on server** | Simple setup with `@supabase/supabase-js` | Must add RLS policies before exposing to untrusted users |
| **Client fetches own API** | Consistent contract, no Supabase in browser | Extra network hop vs. server components calling DB directly |
| **Budget range → midpoint INR** | Simple mapping from form UX | Less precise than user-entered exact budget |
| **Single recommendation row per generation** | Append-only history possible later | Only latest row used for dashboard today |
| **Groq vs. OpenAI** | Fast inference, competitive cost | Vendor lock-in; model availability may change |
| **No edge runtime for AI routes** | Node runtime for full SDK compatibility | Slightly higher cold start on serverless vs. edge |
| **Intake rollback on AI fail** | Avoid orphan intakes | Extra delete call; not a true DB transaction across Groq |

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set environment variables (Production + Preview):

   - `NEXT_PUBLIC_APP_URL` → `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`

4. Deploy. Build command: `npm run build` · Output: Next.js default.

5. Run `supabase/migrations/init.sql` on your production Supabase project if not already applied.

### Other platforms

Any Node.js 18+ host that supports Next.js 14:

```bash
npm run build
npm run start
```

Set the same environment variables. Ensure `NEXT_PUBLIC_APP_URL` matches your public domain for correct metadata and OG tags.

### Pre-production checklist

- [ ] Supabase migration applied
- [ ] RLS policies defined (if opening to public users)
- [ ] Environment variables set in hosting provider
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Groq rate limits and spend caps configured
- [ ] Error monitoring (e.g. Sentry) wired to `app/error.tsx` (not included by default)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint (Next.js config) |

### Adding UI components

```bash
npx shadcn@latest add [component-name]
```

---

## License

Private / unlicensed unless otherwise specified by the repository owner.

---

**Shaadi AI Planner** — Plan your dream shaadi with clarity, structure, and AI-assisted budgets.
