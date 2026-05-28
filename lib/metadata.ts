import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants/app";
import { getAppUrl } from "@/lib/env/app-url";

const OG_IMAGE_PATH = "/opengraph-image";

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

function buildAbsoluteUrl(path: string): string {
  const base = getAppUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function sharedOpenGraph(
  title: string,
  description: string,
  url: string,
): NonNullable<Metadata["openGraph"]> {
  const imageUrl = buildAbsoluteUrl(OG_IMAGE_PATH);

  return {
    type: "website",
    locale: "en_IN",
    url,
    siteName: APP_NAME,
    title,
    description,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — AI-powered Indian wedding planning`,
      },
    ],
  };
}

function sharedTwitter(title: string, description: string): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [buildAbsoluteUrl(OG_IMAGE_PATH)],
  };
}

export function createPageMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path || "/";
  const url = buildAbsoluteUrl(canonicalPath);
  const fullTitle = title === APP_NAME ? title : `${title} | ${APP_NAME}`;

  return {
    title,
    description,
    metadataBase: new URL(getAppUrl()),
    alternates: { canonical: canonicalPath },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: sharedOpenGraph(fullTitle, description, url),
    twitter: sharedTwitter(fullTitle, description),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  keywords: [
    "wedding planner",
    "shaadi",
    "Indian wedding",
    "AI wedding planning",
    "wedding budget",
    "vendor recommendations",
    "wedding intake",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: sharedOpenGraph(APP_NAME, APP_DESCRIPTION, getAppUrl()),
  twitter: sharedTwitter(APP_NAME, APP_DESCRIPTION),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  category: "lifestyle",
};
