import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Shaadi AI Planner — AI-powered Indian wedding planning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(145deg, #fdf8f4 0%, #f5e6e8 45%, #efe0d0 100%)",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8b3a4a",
              marginBottom: 16,
            }}
          >
            AI-powered shaadi planning
          </p>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#3d1f2a",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Shaadi AI Planner
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#5c3d45",
              marginTop: 24,
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            Vendor budgets, payment tracking, and guided intake for Indian
            weddings
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
