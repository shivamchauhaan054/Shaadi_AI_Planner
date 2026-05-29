import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCategoryBudgets,
  computeTotalSpent,
} from "@/lib/budget/calculations";
import { computeBudgetSummary } from "@/lib/budget/summary";
import type { PaymentRecord } from "@/lib/validations/payments";
import type { VendorRecommendation } from "@/lib/validators";

const mockRecommendations: VendorRecommendation[] = [
  {
    vendor_category: "Venue & Catering",
    priority_rank: 1,
    suggested_budget: 500_000,
    rationale: "Main venue selection.",
  },
  {
    vendor_category: "Decor & Florals",
    priority_rank: 2,
    suggested_budget: 150_000,
    rationale: "Wedding backdrop.",
  },
];

describe("computeTotalSpent extra edge cases", () => {
  it("sums negative payments correctly (refund scenario)", () => {
    const payments: PaymentRecord[] = [
      {
        id: "p1",
        intake_id: "intake-1",
        vendor_category: "Venue & Catering",
        vendor_name: "Hall A",
        amount_paid: 100_000,
        payment_date: "2026-01-10",
        created_at: "2026-01-10T00:00:00Z",
      },
      {
        id: "p2",
        intake_id: "intake-1",
        vendor_category: "Venue & Catering",
        vendor_name: "Hall A",
        amount_paid: -20_000, // refund
        payment_date: "2026-01-12",
        created_at: "2026-01-12T00:00:00Z",
      },
    ];

    const total = computeTotalSpent(payments);
    assert.equal(total, 80_000);
  });

  it("handles floating point values precisely without losing accuracy", () => {
    const payments: PaymentRecord[] = [
      {
        id: "p1",
        intake_id: "intake-1",
        vendor_category: "Decor & Florals",
        vendor_name: "Florist",
        amount_paid: 10000.55,
        payment_date: "2026-01-10",
        created_at: "2026-01-10T00:00:00Z",
      },
      {
        id: "p2",
        intake_id: "intake-1",
        vendor_category: "Decor & Florals",
        vendor_name: "Florist",
        amount_paid: 20000.45,
        payment_date: "2026-01-12",
        created_at: "2026-01-12T00:00:00Z",
      },
    ];

    const total = computeTotalSpent(payments);
    assert.equal(total, 30001.0);
  });
});

describe("buildCategoryBudgets extra edge cases", () => {
  it("correctly handles floating numbers in category allocations and spent calculations", () => {
    const payments: PaymentRecord[] = [
      {
        id: "p1",
        intake_id: "intake-1",
        vendor_category: "Decor & Florals",
        vendor_name: "Florist",
        amount_paid: 15200.75,
        payment_date: "2026-01-10",
        created_at: "2026-01-10T00:00:00Z",
      },
    ];

    const result = buildCategoryBudgets(mockRecommendations, payments);
    const decor = result.find((r) => r.vendor_category === "Decor & Florals");

    assert.ok(decor);
    assert.equal(decor.allocated, 150_000);
    assert.equal(decor.spent, 15200.75);
    assert.equal(decor.remaining, 150000 - 15200.75);
  });

  it("identifies a category as overspend when spent exceeds allocated", () => {
    const payments: PaymentRecord[] = [
      {
        id: "p1",
        intake_id: "intake-1",
        vendor_category: "Decor & Florals",
        vendor_name: "Florist",
        amount_paid: 200_000,
        payment_date: "2026-01-10",
        created_at: "2026-01-10T00:00:00Z",
      },
    ];

    const result = buildCategoryBudgets(mockRecommendations, payments);
    const decor = result.find((r) => r.vendor_category === "Decor & Florals");

    assert.ok(decor);
    assert.equal(decor.remaining, -50_000);
  });
});

describe("computeBudgetSummary extra edge cases", () => {
  it("handles total spent exceeding total budget correctly", () => {
    const summary = computeBudgetSummary(1_000_000, mockRecommendations, 1_200_000);

    assert.equal(summary.total_budget, 1_000_000);
    assert.equal(summary.total_allocated, 650_000);
    assert.equal(summary.total_spent, 1_200_000);
    assert.equal(summary.remaining, -200_000);
    assert.equal(summary.unallocated, 350_000);
  });
});
