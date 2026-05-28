import { getAppUrl } from "@/lib/env/app-url";

export const APP_NAME = "Shaadi AI Planner";
export const APP_DESCRIPTION =
  "Plan your dream Indian wedding with AI-powered vendor budgets, payment tracking, and elegant intake flows.";

/** Resolved at runtime; uses NEXT_PUBLIC_APP_URL or VERCEL_URL on Vercel. */
export const APP_URL = getAppUrl();

export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#intake", label: "Intake" },
] as const;

export const WEDDING_FEATURES = [
  {
    title: "Smart Timeline",
    description:
      "AI-generated milestones from engagement to reception, tailored to your culture and dates.",
    icon: "calendar" as const,
  },
  {
    title: "Budget Intelligence",
    description:
      "Track categories, forecast spend, and get suggestions to stay within your shaadi budget.",
    icon: "wallet" as const,
  },
  {
    title: "Vendor Shortlist",
    description:
      "Compare venues, caterers, and decorators with structured notes and priority scores.",
    icon: "sparkles" as const,
  },
  {
    title: "Guest Experience",
    description:
      "Plan seating, invitations, and day-of flows without the spreadsheet chaos.",
    icon: "users" as const,
  },
] as const;
