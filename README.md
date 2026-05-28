# Shaadi AI Planner

**An AI-assisted wedding planning platform for Indian celebrations.**

Couples complete a guided intake, receive vendor budget allocations from a large language model, and track real spend against those categories. The application is built as a production-oriented Next.js 14 monolith with strict server boundaries, validated APIs, and PostgreSQL persistence via Supabase.

> **Release status:** v1 ships without authentication. Suitable for demos, internal tools, and controlled pilots. Public multi-tenant launch requires Supabase Auth and Row Level Security (RLS) before exposure to untrusted users.

---

## Table of contents

- [What this product does](#what-this-product-does)
- [Why this architecture was chosen](#why-this-architecture-was-chosen)
- [Architecture overview](#architecture-overview)
- [AI recommendation flow](#ai-recommendation-flow)
- [Server-computed budgets](#server-computed-budgets)
- [Validation strategy](#validation-strategy)
- [Error handling strategy](#error-handling-strategy)
- [Persistence strategy](#persistence-strategy)
- [Security considerations](#security-considerations)
- [Database schema overview](#database-schema-overview)
- [API examples](#api-examples)
- [Known tradeoffs](#known-tradeoffs)
- [Future improvements](#future-improvements)
- [Future scalability](#future-scalability)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [License](#license)

---

## What this product does

Indian weddings often span multiple events (mehendi, sangeet, ceremony, reception) with dozens of vendor categories and opaque pricing. Shaadi AI Planner gives couples a structured starting point:

| Stage | What the user gets |
|-------|---------------------|
| **Intake** | A four-step form: wedding date, guest count, city, venue type, budget range, and up to two priorities (e.g. photography, food). |
| **AI plan** | Five vendor-category budget lines with priority ranks and short rationales, generated from intake context. |
| **Dashboard** | A per-intake results page with vendor cards, utilization metrics, and a payment ledger. |
| **Tracking** | Record payments by vendor category; allocated vs. spent vs. remaining updates from server-computed snapshots. |

The browser never connects to Supabase or Groq directly. All reads and writes go through Next.js Route Handlers or Server Actions, which keeps credentials and business rules on the server.

---

## Why this architecture was chosen

We optimized for **clarity, safety, and a path to production** rather than maximum feature count in v1.

| Goal | Choice | Why |
|------|--------|-----|
| **Predictable data flow** | Thin routes + `lib/services/*` orchestration | Handlers stay readable; business logic is testable and reusable from actions and APIs. |
| **No secret leakage** | API-first client; `server-only` on Groq/Supabase | Client bundles never import DB or LLM clients; same contract works for a future mobile app. |
| **Trustworthy numbers** | Server-only budget math (`lib/budget/snapshot.ts`) | Prevents tampered allocations, duplicate ledger entries, and client/server drift. |
| **Safe AI output** | Zod on LLM JSON + retry with validation feedback | Models hallucinate; the server is the gate before persistence or UI. |
| **Fast MVP** | No auth; anon Supabase key on server only | Auth + RLS is a deliberate second phase with an example migration shipped. |
| **Deployability** | Next.js App Router on Vercel | Static marketing surface, dynamic API routes, instrumentation for env checks. |

This is intentionally a **modular monolith**: one repo, one deploy unit, clear module boundaries (`lib/db`, `lib/services`, `lib/budget`, `lib/api`). We did not introduce a separate BFF or microservices layer until product–market fit justifies the operational cost.

---

## Architecture overview

### System context

```
                    ┌─────────────────────────────────────────┐
                    │           Couple (browser)             │
                    └────────────────────┬────────────────────┘
                                         │
              Server Action (intake)     │     fetch /api/* (dashboard)
                         │               │              │
                         ▼               ▼              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Next.js 14 (App Router)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────────┐ │
│  │ Client UI    │  │ Server       │  │ Route Handlers /api/*         │ │
│  │ (React)      │  │ Actions      │  │ force-dynamic, Zod in/out   │ │
│  └──────────────┘  └──────┬───────┘  └──────────────┬──────────────┘ │
│                           │                          │                 │
│                           └──────────┬───────────────┘                 │
│                                      ▼                                 │
│                         ┌────────────────────────┐                     │
│                         │   lib/services/*       │                     │
│                         │   (orchestration)      │                     │
│                         └───────────┬────────────┘                     │
│              ┌──────────────────────┼──────────────────────┐           │
│              ▼                      ▼                      ▼           │
│     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐   │
│     │ lib/db/*       │    │ lib/groq.ts    │    │ lib/budget/*   │   │
│     │ (persistence)  │    │ (LLM + parse)  │    │ (snapshots)    │   │
│     └────────┬───────┘    └────────────────┘    └────────────────┘   │
└──────────────┼─────────────────────────────────────────────────────────┘
               │
               ▼
      ┌─────────────────┐         ┌─────────────────┐
      │ Supabase (PG)   │         │ Groq API        │
      │ wedding_intakes │         │ llama-3.3-70b   │
      │ recommendations │         │ json_object     │
      │ payments        │         └─────────────────┘
      └─────────────────┘
```

### Layer responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **UI** | `app/`, `components/` | Forms, dashboard, loading/empty/error states; calls APIs or Server Actions only. |
| **HTTP boundary** | `app/api/**` | Auth-less REST surface; parses JSON, maps errors via `handleRouteError`. |
| **Actions** | `lib/actions/` | Intake submit from the home page; same orchestration as `POST /api/recommend`. |
| **Services** | `lib/services/` | `processRecommendationRequest`, `getRecommendationDetails`, payment recording. |
| **Domain / budget** | `lib/budget/`, `lib/validators.ts` | Single source of truth for category rows and summary totals. |
| **Data access** | `lib/db/` | Supabase inserts/selects; row → domain mappers. |
| **Integrations** | `lib/groq.ts`, `lib/supabase.ts` | External SDKs; marked `server-only`. |

### Request paths (two entry points, one pipeline)

1. **Home intake (primary UX):** `WeddingIntakeForm` → `submitWeddingIntake` Server Action → `processRecommendationRequest` → redirect to `/recommendations/[id]`.
2. **REST clients:** `POST /api/recommend` → same `processRecommendationRequest` service.

The recommendations page loads data exclusively via `GET /api/recommendations/[id]` (client fetch), not via embedded Supabase queries in React.

---

## AI recommendation flow

End-to-end sequence from form submit to persisted plan:

```
User submits intake
        │
        ▼
┌───────────────────┐
│ Zod: recommend    │  wedding-intake / recommendRequestSchema
│ Request schema    │  (.strict() — no unknown keys)
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ sanitizeRecommend │  Strip control chars; bound string lengths;
│ Request           │  wrap user fields in prompt delimiters
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ createWedding     │  INSERT wedding_intakes (total_budget = range midpoint INR)
│ Intake            │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Groq chat         │  System + user prompts (lib/prompts.ts)
│ completion        │  response_format: json_object, temperature 0.35
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ parseAi           │  Zod: exactly 5 categories, ranks 1–5 unique,
│ Recommendations   │  sum(suggested_budget) ≤ total_budget_inr
└─────────┬─────────┘
          │
    valid?├── No ──▶ Retry once with validation error in user prompt
          │
         Yes
          ▼
┌───────────────────┐
│ createRecommendation│ INSERT recommendations JSONB
│ Record            │
└─────────┬─────────┘
          ▼
    Return intake_id + recommendations[]

On any failure after intake INSERT:
    deleteWeddingIntake(intake_id)  // best-effort rollback
    throw → 502/500 or user-facing action message
```

### Model and prompt contract

| Setting | Value |
|---------|--------|
| Provider | [Groq](https://groq.com) |
| Model | `llama-3.3-70b-versatile` |
| Output | `json_object` (structured JSON) |
| Attempts | Up to 2; second includes Zod failure text |
| Categories | Exactly 5 Indian-wedding vendor lines |
| Budget rule | Integer INR; **allocated sum must not exceed** intake cap |

Prompts live in `lib/prompts.ts`. Intake fields are never concatenated raw into the system prompt; sanitization and `<intake>` delimiters reduce injection surface.

---

## Server-computed budgets

**Budget numbers are never derived on the client for authoritative state.**

### Problem we avoided

If the browser computed `remaining = allocated - spent`:

- A user could manipulate DevTools and show incorrect balances.
- Payment POST responses and dashboard GET could diverge after optimistic UI updates.
- Category labels from the AI might not match payment `vendor_category` without a single normalization path.

### Solution

`buildBudgetSnapshot()` in `lib/budget/snapshot.ts` is the **only** function that produces `category_budgets` and `budget_summary` for:

- `GET /api/recommendations/[id]`
- `POST /api/payments` (response includes refreshed snapshot)

```ts
// Conceptual contract (see lib/budget/snapshot.ts)
category_budgets = f(AI recommendations[], payments[])
budget_summary   = g(total_budget, recommendations[], sum(payments))
```

Per category:

```
allocated = AI suggested_budget for that vendor_category
spent     = SUM(payments.amount_paid) WHERE vendor_category matches
remaining = allocated - spent
```

Overall summary:

```
total_allocated = SUM(AI suggested_budget)   // informational; may be < total_budget
total_spent     = SUM(all payments)
remaining       = total_budget - total_spent // cap-level runway
```

The UI may show loading skeletons and temporary disabled states, but after any mutation it **replaces** local state with the API response—no client-side prepending of payments to the ledger.

---

## Validation strategy

Validation is **defense in depth** at every trust boundary:

| Boundary | Mechanism | Location |
|----------|-----------|----------|
| **Environment** | Zod schemas for public + server env; startup assert in `instrumentation.ts` | `lib/env/validation.ts` |
| **HTTP ingress** | `Content-Type: application/json`, 64KB max body, object root | `lib/api/parse-request.ts` |
| **API body** | `.strict()` Zod objects (reject unknown keys) | `lib/validations/*`, `lib/validators.ts` |
| **Route params** | UUID parse for `[id]` | `lib/api/route-params.ts` |
| **LLM output** | Dedicated AI response schema + business rules (count, ranks, budget sum) | `lib/validators.ts` → `parseAiRecommendations` |
| **HTTP egress** | Response schemas for critical endpoints | `lib/api/responses.ts` |
| **Display / prompts** | Length limits, control-character stripping | `lib/security/sanitize*.ts` |

**Principle:** Untrusted input is parsed once at the edge; internal functions receive typed domain objects. The LLM is treated as an untrusted input source—same as a public API caller.

---

## Error handling strategy

We separate **operator visibility** from **user safety**.

### Server Actions (intake form)

`submitWeddingIntake` catches domain errors and returns `{ success, message }`—no stack traces to the browser. Known cases:

- `GroqGenerationError` → friendly retry message
- `IntakeNotFoundError` → re-submit guidance
- Corrupt stored JSON → support-oriented message

### Route Handlers

`handleRouteError()` in `lib/api/safe-errors.ts`:

| Error type | HTTP | Public message |
|------------|------|----------------|
| `IntakeNotFoundError` | 404 | Wedding intake not found |
| `InvalidVendorCategoryError` | 400 | Category not valid for this intake |
| `GroqConfigurationError` | 503 | AI service not configured |
| `GroqGenerationError` | 502 | Failed to generate valid AI recommendations |
| `ZodError` | 400 | Validation message + field errors |
| Unknown / DB | 500 | Generic message; details **logged server-side only** |

**We do not log request bodies** in error paths (PII: names, cities, dates).

### UI resilience

- Route-level `error.tsx` / `global-error.tsx` and a class `ErrorBoundary` for render failures
- Empty and error states with retry on the recommendations dashboard
- Sonner toasts for action-level feedback

### AI failure compensation

If Groq or post-validation fails after `wedding_intakes` insert, `deleteWeddingIntake` runs in a `catch` block so users do not land on orphan UUIDs. This is not a distributed transaction (Groq cannot participate in PG 2PC)—it is **compensating delete**, which is good enough for v1 volume.

---

## Persistence strategy

| Concern | Approach |
|---------|----------|
| **Database** | Supabase-hosted PostgreSQL |
| **Schema** | Versioned SQL in `supabase/migrations/init.sql` |
| **Access** | Server-side `@supabase/supabase-js` with anon key (`lib/supabase.ts`) |
| **Mapping** | `lib/db/*` returns typed rows; services work with domain types |
| **Recommendations** | Latest row per intake used for dashboard (JSONB payload) |
| **Payments** | Append-only ledger; budgets recomputed on read/write |
| **Cascades** | `ON DELETE CASCADE` from `wedding_intakes` → children |
| **Indexes** | B-tree on FKs and dates; GIN on `recommendations.recommendations` |

No ORM: intentional simplicity and full SQL visibility in migrations. When auth lands, RLS policies attach to the same tables (`supabase/migrations/rls.example.sql`).

---

## Security considerations

| Area | v1 posture | Before public launch |
|------|------------|----------------------|
| **Authentication** | None; intake UUID is the capability URL | Supabase Auth; bind rows to `user_id` |
| **Authorization** | Anyone with UUID can read/write that plan (IDOR) | RLS: `auth.uid()` owns intake rows |
| **Secrets** | `GROQ_API_KEY` server-only; never `NEXT_PUBLIC_*` | Rotate keys; use Vercel encrypted env |
| **Supabase key** | Anon key in server bundle only (not in browser) | RLS even if key leaks |
| **Input** | Strict Zod, size limits, sanitization for AI prompts | WAF / edge rate limits |
| **Rate limiting** | Documented, not enforced in-app | `lib/api/rate-limit.ts` → Vercel middleware / Upstash |
| **Errors** | Generic 500s; no DB/Groq message leakage | Sentry with scrubbing |
| **Headers** | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` | CSP as needed |
| **Transport** | HTTPS on Vercel | Custom domain + HSTS |

Treat every intake link as **secret** until auth exists. Do not share production URLs in public forums without understanding this model.

---

## Database schema overview

### Entity relationship

```
wedding_intakes (1) ──< recommendations
                 └──< payments

ON DELETE CASCADE on all child FKs
```

### Tables (summary)

#### `wedding_intakes`

Stores one row per couple submission.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` PK | Public capability identifier in v1 |
| `wedding_date` | `DATE` | Main celebration date |
| `guest_count` | `INTEGER` | `CHECK (guest_count > 0)` |
| `city` | `TEXT` | Primary city |
| `venue_type` | `TEXT` | e.g. `banquet-hall`, `destination-wedding` |
| `total_budget` | `NUMERIC(12,2)` | Midpoint of selected budget range (INR) |
| `priorities` | `TEXT[]` | Up to 2 values from allowed enum |
| `created_at` | `TIMESTAMPTZ` | Default `now()` |

Indexes: `wedding_date`, `city`, `created_at DESC`.

#### `recommendations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` PK | |
| `intake_id` | `UUID` FK | → `wedding_intakes` |
| `recommendations` | `JSONB` | `{ recommendations: VendorRecommendation[] }` |
| `created_at` | `TIMESTAMPTZ` | |

GIN index on `recommendations` for JSON queries. v1 reads the latest row per intake.

#### `payments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` PK | |
| `intake_id` | `UUID` FK | → `wedding_intakes` |
| `vendor_category` | `TEXT` | Must match an AI category label |
| `vendor_name` | `TEXT` | Display name |
| `amount_paid` | `NUMERIC(12,2)` | `CHECK (amount_paid >= 0)` |
| `payment_date` | `DATE` | |
| `created_at` | `TIMESTAMPTZ` | |

Indexes: `intake_id`, `payment_date DESC`, `vendor_category`, `created_at DESC`.

Full DDL: [`supabase/migrations/init.sql`](supabase/migrations/init.sql).

---

## API examples

Base URL: same origin as the app (e.g. `http://localhost:3000` or your Vercel deployment).

### Health check

```bash
curl -sS https://your-app.vercel.app/api/health | jq
```

```json
{
  "status": "ok",
  "timestamp": "2026-05-28T12:00:00.000Z",
  "services": {
    "supabase": true,
    "groq": true
  }
}
```

---

### Create intake + AI recommendations

```bash
curl -sS -X POST https://your-app.vercel.app/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "weddingDate": "2026-12-15",
    "guestCount": 350,
    "city": "Mumbai",
    "venueType": "banquet-hall",
    "budgetRange": "10l-20l",
    "priorities": ["photography", "food"]
  }' | jq
```

**`201 Created`** (abbreviated):

```json
{
  "intake_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "recommendations": [
    {
      "vendor_category": "Venue & Catering",
      "priority_rank": 1,
      "suggested_budget": 900000,
      "rationale": "Largest share for 350 guests at a Mumbai banquet hall."
    }
  ]
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation failed (body or strict schema) |
| `502` | Groq failure or AI JSON failed validation after retries |
| `503` | Supabase or Groq not configured |
| `500` | Database error |

---

### Fetch full plan (intake + budgets + payments)

```bash
INTAKE_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"

curl -sS "https://your-app.vercel.app/api/recommendations/${INTAKE_ID}" | jq
```

**`200 OK`** includes:

- Intake fields (`wedding_date`, `city`, `guest_count`, `total_budget`, `priorities`, …)
- `recommendations[]` — five AI vendor lines
- `category_budgets[]` — `{ vendor_category, allocated, spent, remaining }`
- `budget_summary` — `{ total_budget, total_allocated, total_spent, remaining }`
- `payments[]` — ledger entries
- `generated_at` — timestamp of the recommendation row used

---

### Record a payment

```bash
curl -sS -X POST https://your-app.vercel.app/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "intake_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "vendor_category": "Photography & Videography",
    "vendor_name": "Studio Nama",
    "amount_paid": 150000,
    "payment_date": "2026-03-01"
  }' | jq
```

**`201 Created`** returns the new `payment`, full `payments[]`, and a fresh `category_budgets` + `budget_summary` from `buildBudgetSnapshot()`—use this payload to update UI state; do not recompute locally.

| Status | Meaning |
|--------|---------|
| `400` | Validation error or category not in plan |
| `404` | Intake not found |
| `503` | Supabase not configured |

---

## Known tradeoffs

| Decision | Why we chose it | Cost |
|----------|-----------------|------|
| **No authentication** | Ship intake → AI → dashboard quickly | UUID capability URLs; not multi-tenant safe |
| **Anon Supabase key on server** | Simple SDK setup; no service role in routes | Requires RLS before any client-side Supabase use |
| **Client fetches `/api/*`** | Stable contract; no Supabase in browser | Extra round-trip vs. Server Components with direct DB |
| **Budget range → midpoint INR** | Matches slider UX; avoids free-text budget chaos | Less precise than exact couple-entered cap |
| **Latest recommendation row only** | Simpler dashboard | No in-app history of regenerations |
| **Groq / open models** | Fast, cost-effective inference | Model deprecation and vendor dependency |
| **Node runtime for AI routes** | Full SDK compatibility | Cold starts; Hobby timeout may need Pro + `maxDuration` |
| **Compensating delete on AI fail** | No orphan intakes | Not atomic with Groq (acceptable at MVP scale) |
| **No in-app rate limits** | Documented for edge layer | Abuse possible until middleware added |

---

## Future improvements

Near-term engineering backlog (not committed to a timeline):

- [ ] **Supabase Auth** — magic link or OAuth; attach `user_id` to `wedding_intakes`
- [ ] **RLS policies** — enable [`rls.example.sql`](supabase/migrations/rls.example.sql) in production
- [ ] **Edge rate limiting** — implement notes in `lib/api/rate-limit.ts`
- [ ] **Observability** — Sentry (or similar) in `app/error.tsx` with PII scrubbing
- [ ] **Recommendation history** — version AI outputs; let couples compare regenerations
- [ ] **Exact budget input** — optional override instead of range midpoint only
- [ ] **Export** — PDF or CSV of budget summary for family sharing
- [ ] **Admin** — internal view for support (search by email once auth exists)
- [ ] **E2E tests** — Playwright against `/api/health` and golden intake path
- [ ] **i18n** — Hindi/regional copy for intake labels and AI prompts

---

## Future scalability

How the current design extends without a rewrite:

| Dimension | v1 | Scale path |
|-----------|-----|------------|
| **Traffic** | Single Vercel deployment | Horizontal serverless instances; CDN for static assets |
| **Database** | Supabase PG | Read replicas; connection pooling (Supavisor); partition by `created_at` if ledger grows large |
| **AI** | Synchronous Groq in request | Queue (Inngest, BullMQ, Supabase Edge Functions) + webhook/poll for long plans |
| **Auth** | UUID URLs | JWT sessions; RLS enforces row ownership |
| **API** | Monolith route handlers | Extract OpenAPI-documented service behind same routes; or tRPC if type-sharing justifies it |
| **Caching** | `force-dynamic` everywhere | `unstable_cache` on read-heavy public pages; short TTL on recommendation GET |
| **Multi-region** | Single region | Supabase region choice + Vercel edge for static only |

The **service layer boundary** (`lib/services/*`) is the intended seam for extracting a standalone API if mobile or partner integrations arrive.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS, CSS variables, [shadcn/ui](https://ui.shadcn.com/) (Radix) |
| Forms | react-hook-form, Zod, @hookform/resolvers |
| Animation | Framer Motion (`prefers-reduced-motion` respected) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| AI | [Groq](https://groq.com) SDK — `llama-3.3-70b-versatile` |
| Hosting | [Vercel](https://vercel.com) (recommended) |

---

## Folder structure

```
shaadi-ai-planner/
├── app/
│   ├── api/                    # Route Handlers (health, recommend, details, payments)
│   ├── recommendations/[id]/ # Dynamic dashboard page
│   ├── layout.tsx              # Root layout, metadata, fonts
│   ├── page.tsx                # Landing + intake
│   ├── robots.ts / sitemap.ts  # SEO
│   ├── opengraph-image.tsx     # Generated OG image
│   └── manifest.ts             # Web app manifest
├── components/                 # UI by feature (intake, budget, recommendations, …)
├── lib/
│   ├── actions/                # Server Actions
│   ├── api/                    # HTTP helpers, parse, safe errors, client fetch
│   ├── budget/                 # Snapshot & summary (source of truth)
│   ├── db/                     # Supabase persistence
│   ├── env/                    # Zod env validation, app URL resolution
│   ├── security/               # Sanitization for prompts and display
│   ├── services/               # Orchestration
│   ├── validations/            # Request/response Zod schemas
│   ├── groq.ts / supabase.ts   # server-only integrations
│   └── prompts.ts              # LLM templates
├── supabase/migrations/        # init.sql, rls.example.sql
├── instrumentation.ts          # Production env assert on boot
├── next.config.mjs             # Security headers, instrumentation hook
└── vercel.json
```

---

## Getting started

### Prerequisites

- **Node.js** 18.17+ (20 LTS recommended)
- **npm** 9+
- [Supabase](https://supabase.com) project
- [Groq](https://console.groq.com) API key

### Local setup

```bash
cd shaadi-ai-planner
npm install
cp .env.example .env.local
# Edit .env.local — Supabase URL/anon key, GROQ_API_KEY, optional APP_URL
```

Apply schema: paste [`supabase/migrations/init.sql`](supabase/migrations/init.sql) into the Supabase SQL editor (or use Supabase CLI).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Verify integrations:

```bash
curl http://localhost:3000/api/health
```

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`:

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Public | Canonical URL for SEO/OG; falls back to `VERCEL_URL` on Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes* | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Public | Anon key (used **server-side only** in this app) |
| `GROQ_API_KEY` | Yes* | Server | Groq API key — never prefix with `NEXT_PUBLIC_` |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server | Not used by v1 routes |

\*Required for full functionality. UI loads without them; data routes return `503`.

Validated at runtime via `lib/env/validation.ts` and `instrumentation.ts` on server start.

---

## Deployment

### Vercel (recommended)

1. Import the GitHub repository (set root directory to `shaadi-ai-planner` if the repo includes a parent folder).
2. Add environment variables from `.env.example` for **Production** and **Preview**.
3. Deploy (`npm run build`).
4. Run `init.sql` on production Supabase if not already applied.

**Post-deploy smoke test**

- `GET /api/health` → `200`, services true
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`
- Submit intake → land on `/recommendations/[id]`

**Production safeguards**

- `instrumentation.ts` → `assertProductionEnvironment()`
- API routes: `dynamic = "force-dynamic"`; `/api/recommend` → `maxDuration = 60`
- `server-only` on Groq and Supabase modules
- Security headers in `next.config.mjs`

### Pre-production checklist

- [ ] `init.sql` applied to production database
- [ ] Environment variables set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` or custom domain configured
- [ ] Groq spend/rate limits configured
- [ ] RLS plan reviewed if opening to public users
- [ ] Error monitoring wired (optional; not included by default)

### Other hosts

Any Node.js 18+ platform:

```bash
npm run build
npm run start
```

Set the same environment variables and public URL for metadata.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server at `localhost:3000` |
| `npm run build` | Production build (typecheck + lint) |
| `npm run start` | Production server |
| `npm run lint` | ESLint (Next.js config) |

Add shadcn components:

```bash
npx shadcn@latest add [component-name]
```

---

## License

Private / unlicensed unless otherwise specified by the repository owner.

---

**Shaadi AI Planner** — structured intake, AI-assisted vendor budgets, and server-authoritative spend tracking for Indian weddings.
