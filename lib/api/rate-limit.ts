/**
 * Rate limiting (production readiness)
 * ===================================
 * v1 does not enforce limits in-app. Before public launch, add limits at the edge:
 *
 * 1. **Vercel Firewall / WAF** — per-IP rules on `/api/*`
 * 2. **middleware.ts** — e.g. `@upstash/ratelimit` with Redis, keyed by `ip + route`
 * 3. **Reverse proxy** — nginx `limit_req_zone`, Cloudflare rate rules
 *
 * Suggested starting limits (tune per traffic and cost):
 *
 * | Route                         | Method | Suggested limit        |
 * |-------------------------------|--------|------------------------|
 * | /api/recommend                | POST   | 5 / 15 min / IP        |
 * | /api/payments                 | POST   | 30 / min / IP          |
 * | /api/recommendations/[id]     | GET    | 60 / min / IP          |
 * | /api/health                   | GET    | 120 / min / IP         |
 *
 * Return `429 Too Many Requests` with `Retry-After` when exceeded.
 * Log rate-limit hits without request bodies (PII).
 */

export const RATE_LIMIT_ROUTE_IDS = {
  recommend: "api:recommend:post",
  payments: "api:payments:post",
  recommendationDetails: "api:recommendations:get",
  health: "api:health:get",
} as const;
