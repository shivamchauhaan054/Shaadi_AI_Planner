import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Camera, Music, Utensils, Flower2, CircleDollarSign, ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatInr } from "@/lib/format/currency";
import { staggerItem } from "@/lib/motion/variants";
import { FIELD_LIMITS } from "@/lib/security/constants";
import { sanitizeDisplayText } from "@/lib/security/sanitize";
import type { VendorRecommendation } from "@/lib/validators";
import { cn } from "@/lib/utils";

type RecommendationCardProps = {
  recommendation: VendorRecommendation;
};

function getCategoryIcon(category: string) {
  const norm = category.toLowerCase();
  if (norm.includes("venue") || norm.includes("cater") || norm.includes("food") || norm.includes("dine")) {
    return Utensils;
  }
  if (norm.includes("photo") || norm.includes("video") || norm.includes("camera") || norm.includes("memory")) {
    return Camera;
  }
  if (norm.includes("decor") || norm.includes("flower") || norm.includes("style") || norm.includes("design")) {
    return Flower2;
  }
  if (norm.includes("music") || norm.includes("entertain") || norm.includes("dj") || norm.includes("band")) {
    return Music;
  }
  if (norm.includes("makeup") || norm.includes("bride") || norm.includes("styling") || norm.includes("groom")) {
    return Sparkles;
  }
  return CircleDollarSign;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isTopPriority = recommendation.priority_rank === 1;
  const category = sanitizeDisplayText(
    recommendation.vendor_category,
    FIELD_LIMITS.vendorCategory,
  );
  const rationale = sanitizeDisplayText(recommendation.rationale, 280);

  const [expanded, setExpanded] = useState(false);
  const isLong = rationale.length > 165;
  const targetText = isLong && !expanded ? `${rationale.substring(0, 160)}...` : rationale;

  // Client-safe Typewriter Effect
  const [typedText, setTypedText] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (prefersReducedMotion) {
      setTypedText(targetText);
      return;
    }

    let currentIndex = 0;
    setTypedText("");

    const intervalId = setInterval(() => {
      setTypedText((prev) => prev + targetText.charAt(currentIndex));
      currentIndex++;
      if (currentIndex >= targetText.length) {
        clearInterval(intervalId);
      }
    }, 6); // blazing fast and fluid typewriter effect

    return () => clearInterval(intervalId);
  }, [targetText, prefersReducedMotion, isClient]);

  const IconComponent = getCategoryIcon(recommendation.vendor_category);

  return (
    <motion.div 
      variants={prefersReducedMotion ? undefined : staggerItem}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "interactive-card h-full transition-all duration-300 border-border/80 bg-card hover:shadow-card hover:border-primary/20",
          isTopPriority && "border-primary/30 ring-1 ring-primary/15 bg-gradient-to-b from-card to-primary/[0.01]",
        )}
      >
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="font-display text-xl leading-snug sm:text-2xl flex items-center gap-2">
                <span className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm",
                  isTopPriority ? "bg-primary/10 text-primary" : "bg-secondary/80 text-muted-foreground"
                )}>
                  <IconComponent className="size-4.5" />
                </span>
                <span className="truncate">{category}</span>
              </CardTitle>
              {isTopPriority ? (
                <CardDescription className="flex items-center gap-1 text-primary/95 font-medium text-xs pt-0.5">
                  <Sparkles className="size-3 shrink-0 animate-pulse" aria-hidden />
                  Top priority for your celebration
                </CardDescription>
              ) : null}
            </div>
            <Badge
              variant={isTopPriority ? "default" : "secondary"}
              className="shrink-0 font-mono text-[10px] tracking-wider"
              aria-label={`Priority rank ${recommendation.priority_rank}`}
            >
              #{recommendation.priority_rank}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-secondary/50 px-4 py-3 border border-border/40 transition-colors duration-200">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/90">
              Suggested budget
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground sm:text-3xl mt-0.5">
              {formatInr(recommendation.suggested_budget)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/90">
              AI rationale
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground transition-all duration-200 min-h-[4.5rem]">
              {isClient ? typedText : targetText}
            </p>
            
            {isLong && (
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:text-primary-foreground flex items-center gap-0.5 mt-2 transition-colors focus-visible:ring-1 focus-visible:ring-ring rounded px-1.5 py-0.5 bg-primary/5 hover:bg-primary"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
