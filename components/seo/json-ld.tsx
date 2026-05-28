import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants/app";
import { getAppUrl } from "@/lib/env/app-url";

export function HomeJsonLd() {
  const url = getAppUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
