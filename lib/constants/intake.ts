export const INTAKE_STEPS = [
  { id: 1, label: "Date & guests", shortLabel: "Date" },
  { id: 2, label: "Location", shortLabel: "Venue" },
  { id: 3, label: "Budget", shortLabel: "Budget" },
  { id: 4, label: "Priorities", shortLabel: "Focus" },
] as const;

export const VENUE_OPTIONS = [
  { value: "banquet-hall", label: "Banquet Hall" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "resort", label: "Resort" },
  { value: "destination-wedding", label: "Destination Wedding" },
  { value: "beach-wedding", label: "Beach Wedding" },
] as const;

export const BUDGET_OPTIONS = [
  {
    value: "5l-10l",
    label: "₹5L – 10L",
    description: "Intimate celebrations with curated essentials",
    midpointInr: 750_000,
  },
  {
    value: "10l-20l",
    label: "₹10L – 20L",
    description: "Balanced décor, catering, and photography",
    midpointInr: 1_500_000,
  },
  {
    value: "20l-40l",
    label: "₹20L – 40L",
    description: "Premium venues and elevated guest experience",
    midpointInr: 3_000_000,
  },
  {
    value: "40l-plus",
    label: "₹40L+",
    description: "Luxury multi-day celebrations",
    midpointInr: 5_000_000,
  },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "photography", label: "Photography", icon: "camera" },
  { value: "food", label: "Food", icon: "utensils" },
  { value: "decor", label: "Decor", icon: "sparkles" },
  { value: "makeup", label: "Makeup", icon: "palette" },
  { value: "music", label: "Music", icon: "music" },
  { value: "venue", label: "Venue", icon: "building" },
] as const;

export const MAX_PRIORITIES = 2;

export type VenueType = (typeof VENUE_OPTIONS)[number]["value"];
export type BudgetRange = (typeof BUDGET_OPTIONS)[number]["value"];
export type PriorityValue = (typeof PRIORITY_OPTIONS)[number]["value"];
