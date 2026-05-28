/**
 * Canonical site URL for metadata, sitemaps, and Open Graph.
 * Prefers NEXT_PUBLIC_APP_URL; falls back to VERCEL_URL on Vercel deployments.
 */
export function getAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      console.warn(
        "[env] NEXT_PUBLIC_APP_URL is not a valid URL; falling back to VERCEL_URL or localhost.",
      );
    }
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return "http://localhost:3000";
}
