import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${APP_URL}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(APP_URL),
    alternates: { canonical: path || "/" },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: APP_NAME,
      title: `${title} | ${APP_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${APP_NAME}`,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  ...createPageMetadata({ title: APP_NAME }),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  keywords: [
    "wedding planner",
    "shaadi",
    "Indian wedding",
    "AI wedding planning",
    "wedding budget",
    "vendor recommendations",
  ],
};
