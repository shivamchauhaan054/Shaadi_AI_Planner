import { Cormorant_Garamond, DM_Sans } from "next/font/google";

import { ErrorBoundary } from "@/components/error-boundary";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { rootMetadata } from "@/lib/metadata";
import { themeInitScript } from "@/lib/theme/config";

import "./globals.css";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
