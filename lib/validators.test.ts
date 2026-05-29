import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseAiRecommendations, parseStoredRecommendations } from "@/lib/validators";

describe("Validators - Optional Enhanced Fields", () => {
  it("should successfully parse legacy recommendations without optional fields", () => {
    const legacyPayload = {
      recommendations: [
        {
          vendor_category: "Venue & Catering",
          priority_rank: 1,
          suggested_budget: 400000,
          rationale: "Largest cost category representing a major priority for the couple.",
        },
        {
          vendor_category: "Photography & Videography",
          priority_rank: 2,
          suggested_budget: 150000,
          rationale: "To document all multi-day traditional festivities beautifully.",
        },
        {
          vendor_category: "Decor & Florals",
          priority_rank: 3,
          suggested_budget: 100000,
          rationale: "To dress up the main mandap and multi-day venue styling.",
        },
        {
          vendor_category: "Music & Entertainment",
          priority_rank: 4,
          suggested_budget: 80000,
          rationale: "DJ and traditional dhol elements for interactive high energy.",
        },
        {
          vendor_category: "Makeup & Styling",
          priority_rank: 5,
          suggested_budget: 70000,
          rationale: "Professional bridal hair, makeup, draping, and relative package.",
        },
      ],
    };

    const parsed = parseAiRecommendations(legacyPayload, 1000000);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.recommendations.length, 5);
      assert.equal(parsed.data.recommendations[0].suggestedVendorStyles, undefined);
      assert.equal(parsed.data.recommendations[0].vendorConsiderations, undefined);
      assert.equal(parsed.data.recommendations[0].evaluationTips, undefined);
    }
  });

  it("should successfully parse recommendations with enhanced fields", () => {
    const enhancedPayload = {
      recommendations: [
        {
          vendor_category: "Venue & Catering",
          priority_rank: 1,
          suggested_budget: 400000,
          rationale: "Largest cost category representing a major priority for the couple.",
          suggestedVendorStyles: ["Palace hotel grand banquet", "Luxury farmhouse lawns"],
          vendorConsiderations: ["Alcohol permissions", "Valet parking availability"],
          evaluationTips: ["Check per-plate pricing inclusive of tax", "Ask for venue tour during live event setup"],
        },
        {
          vendor_category: "Photography & Videography",
          priority_rank: 2,
          suggested_budget: 150000,
          rationale: "To document all multi-day traditional festivities beautifully.",
          suggestedVendorStyles: ["Cinematic documentary", "Fine-art portraiture style"],
          vendorConsiderations: ["Overtime hours charges", "Travel and lodging terms"],
          evaluationTips: ["Verify editor is part of main shooting crew", "Ask for full gallery from previous wedding"],
        },
        {
          vendor_category: "Decor & Florals",
          priority_rank: 3,
          suggested_budget: 100000,
          rationale: "To dress up the main mandap and multi-day venue styling.",
          suggestedVendorStyles: ["Classic marigold traditional", "Bohemian contemporary chic"],
          vendorConsiderations: ["Floral freshness guarantees", "Monsoon windproofing setups"],
          evaluationTips: ["Request 3D layout rendering for stage decor", "Verify power back-up for stage lighting"],
        },
        {
          vendor_category: "Music & Entertainment",
          priority_rank: 4,
          suggested_budget: 80000,
          rationale: "DJ and traditional dhol elements for interactive high energy.",
          suggestedVendorStyles: ["Bollywood party set list", "Sufi fusion live band"],
          vendorConsiderations: ["Sound decibel level limits", "Local performance permissions"],
          evaluationTips: ["Check if console rental is included in pricing", "Verify song playlist requests handling"],
        },
        {
          vendor_category: "Makeup & Styling",
          priority_rank: 5,
          suggested_budget: 70000,
          rationale: "Professional bridal hair, makeup, draping, and relative package.",
          suggestedVendorStyles: ["HD airbrush natural finish", "Traditional royal heavy makeup"],
          vendorConsiderations: ["Draping and hair styling time", "Product toxicity check"],
          evaluationTips: ["Request pre-wedding paid trial session", "Ask if trial fee can be adjusted in booking"],
        },
      ],
    };

    const parsed = parseAiRecommendations(enhancedPayload, 1000000);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.recommendations.length, 5);
      assert.deepEqual(parsed.data.recommendations[0].suggestedVendorStyles, ["Palace hotel grand banquet", "Luxury farmhouse lawns"]);
      assert.deepEqual(parsed.data.recommendations[0].vendorConsiderations, ["Alcohol permissions", "Valet parking availability"]);
      assert.deepEqual(parsed.data.recommendations[0].evaluationTips, ["Check per-plate pricing inclusive of tax", "Ask for venue tour during live event setup"]);
    }
  });

  it("should successfully parse stored database payload using parseStoredRecommendations", () => {
    const rawPayload = {
      recommendations: [
        {
          vendor_category: "Venue & Catering",
          priority_rank: 1,
          suggested_budget: 400000,
          rationale: "Largest cost category representing a major priority for the couple.",
          suggestedVendorStyles: ["Palace hotel grand banquet"],
        },
      ],
    };

    const parsed = parseStoredRecommendations(rawPayload);
    assert.equal(parsed.length, 1);
    assert.deepEqual(parsed[0].suggestedVendorStyles, ["Palace hotel grand banquet"]);
    assert.equal(parsed[0].vendorConsiderations, undefined);
  });
});
