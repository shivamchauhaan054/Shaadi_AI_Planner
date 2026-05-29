import Link from "next/link";
import { Heart, Compass } from "lucide-react";

import { Container } from "@/components/layout/container";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-secondary/25 py-12 md:py-16">
      <Container className="grid gap-10 md:grid-cols-4 lg:gap-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            <Heart className="size-4 text-primary fill-current" aria-hidden />
            {APP_NAME}
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered Indian wedding planner helping couples map budgets, vendor allocations, and payment tracking with elegance and clarity.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Follow us on Pinterest"
            >
              <Compass className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Planning Tools</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/#intake" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Budget Intake
              </Link>
            </li>
            <li>
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AI Recommendations
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Payment History
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Resources</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shaadi Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Vendor Checklist
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Company</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border/40 mt-12 pt-8">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {year} {APP_NAME}. Crafted for couples who dream in detail. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right flex items-center gap-1">
            Made with <Heart className="size-3 text-primary fill-current" /> in India.
          </p>
        </Container>
      </div>
    </footer>
  );
}
