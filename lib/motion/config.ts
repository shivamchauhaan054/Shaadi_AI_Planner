/** Shared motion tokens — keep durations consistent app-wide. */
export const MOTION = {
  duration: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.5,
  },
  ease: [0.16, 1, 0.3, 1] as const,
  spring: { type: "spring" as const, stiffness: 320, damping: 32 },
} as const;
