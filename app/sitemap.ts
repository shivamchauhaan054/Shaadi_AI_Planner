import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/env/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl();
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
