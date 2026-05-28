import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/env/app-url";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/recommendations/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
