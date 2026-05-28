import { z } from "zod";

import { vendorRecommendationSchema } from "@/lib/validators";

/** POST /api/recommend — 201 response body */
export const recommendResponseSchema = z.object({
  intake_id: z.string().uuid(),
  recommendations: z.array(vendorRecommendationSchema).length(5),
});

export type RecommendResponse = z.infer<typeof recommendResponseSchema>;
