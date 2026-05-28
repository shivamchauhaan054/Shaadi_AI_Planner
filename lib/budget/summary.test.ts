import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeBudgetSummary } from "@/lib/budget/summary";
import type { VendorRecommendation } from "@/lib/validators";

const recommendations: VendorRecommendation[] = [
  {
    vendor_category: "Venue & Catering",
    priority_rank: 1,
    suggested_budget: 400_000,
    rationale: "Largest line item for the celebration.",
  },
  {
    vendor_category: "Photography & Videography",
    priority_rank: 2,
    suggested_budget: 150_000,
    rationale: "Capture multi-day events.",
  },
  {
    vendor_category: "Decor & Florals",
    priority_rank: 3,
    suggested_budget: 100_000,
    rationale: "Mandap and reception styling.",
  },
  {
    vendor_category: "Music & Entertainment",
    priority_rank: 4,
    suggested_budget: 80_000,
    rationale: "DJ and live elements.",
  },
  {
    vendor_category: "Makeup & Styling",
    priority_rank: 5,
    suggested_budget: 70_000,
    rationale: "Bridal and family looks.",
  },
];

describe("computeBudgetSummary", () => {
  it("computes runway and unallocated cap separately", () => {
    const summary = computeBudgetSummary(1_000_000, recommendations, 200_000);

    assert.equal(summary.total_budget, 1_000_000);
    assert.equal(summary.total_allocated, 800_000);
    assert.equal(summary.total_spent, 200_000);
    assert.equal(summary.remaining, 800_000);
    assert.equal(summary.unallocated, 200_000);
  });

  it("never reports negative unallocated when AI exceeds cap display", () => {
    const overAllocated: VendorRecommendation[] = recommendations.map((r) => ({
      ...r,
      suggested_budget: r.suggested_budget * 2,
    }));

    const summary = computeBudgetSummary(500_000, overAllocated, 0);

    assert.equal(summary.unallocated, 0);
  });
});
