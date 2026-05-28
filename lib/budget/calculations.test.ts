import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCategoryBudgets,
  computeTotalSpent,
} from "@/lib/budget/calculations";
import type { PaymentRecord } from "@/lib/validations/payments";
import type { VendorRecommendation } from "@/lib/validators";

const recommendations: VendorRecommendation[] = [
  {
    vendor_category: "Venue & Catering",
    priority_rank: 1,
    suggested_budget: 600_000,
    rationale: "Primary spend for guests and hall.",
  },
  {
    vendor_category: "Photography & Videography",
    priority_rank: 2,
    suggested_budget: 200_000,
    rationale: "Couple priority on memories.",
  },
  {
    vendor_category: "Decor & Florals",
    priority_rank: 3,
    suggested_budget: 100_000,
    rationale: "Ambience for multiple events.",
  },
  {
    vendor_category: "Music & Entertainment",
    priority_rank: 4,
    suggested_budget: 80_000,
    rationale: "Sangeet and reception energy.",
  },
  {
    vendor_category: "Makeup & Styling",
    priority_rank: 5,
    suggested_budget: 20_000,
    rationale: "Bridal party prep.",
  },
];

describe("buildCategoryBudgets", () => {
  it("sums payments per vendor category", () => {
    const payments: PaymentRecord[] = [
      {
        id: "11111111-1111-4111-8111-111111111111",
        intake_id: "22222222-2222-4222-8222-222222222222",
        vendor_category: "Venue & Catering",
        vendor_name: "Hall A",
        amount_paid: 100_000,
        payment_date: "2026-01-15",
        created_at: "2026-01-15T00:00:00.000Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333333",
        intake_id: "22222222-2222-4222-8222-222222222222",
        vendor_category: "Venue & Catering",
        vendor_name: "Caterer B",
        amount_paid: 50_000,
        payment_date: "2026-02-01",
        created_at: "2026-02-01T00:00:00.000Z",
      },
    ];

    const rows = buildCategoryBudgets(recommendations, payments);
    const venue = rows.find((r) => r.vendor_category === "Venue & Catering");

    assert.ok(venue);
    assert.equal(venue.allocated, 600_000);
    assert.equal(venue.spent, 150_000);
    assert.equal(venue.remaining, 450_000);
  });

  it("tracks spend for categories without AI allocation", () => {
    const payments: PaymentRecord[] = [
      {
        id: "44444444-4444-4444-8444-444444444444",
        intake_id: "22222222-2222-4222-8222-222222222222",
        vendor_category: "Misc",
        vendor_name: "Extras",
        amount_paid: 10_000,
        payment_date: "2026-03-01",
        created_at: "2026-03-01T00:00:00.000Z",
      },
    ];

    const rows = buildCategoryBudgets(recommendations, payments);
    const misc = rows.find((r) => r.vendor_category === "Misc");

    assert.ok(misc);
    assert.equal(misc.allocated, 0);
    assert.equal(misc.spent, 10_000);
    assert.equal(misc.remaining, -10_000);
  });
});

describe("computeTotalSpent", () => {
  it("returns zero for an empty ledger", () => {
    assert.equal(computeTotalSpent([]), 0);
  });
});
