"use client";

// Lightweight dependency-free bar chart (matches the dashboard turnover panel).

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
}

export function BarChart({
  data,
  highlightIndex,
  tooltip,
  className,
}: {
  data: BarDatum[];
  highlightIndex?: number;
  tooltip?: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex h-48 items-stretch gap-2 sm:gap-3", className)}>
      {data.map((d, i) => {
        const heightPct = Math.max((d.value / max) * 100, 6);
        const highlighted = i === highlightIndex;
        return (
          <div
            key={d.label}
            className="flex h-full flex-1 flex-col items-center gap-2"
          >
            <div className="relative flex w-full flex-1 items-end">
              {highlighted && tooltip && (
                <div className="absolute -top-1 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
                  <span className="whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold shadow-md">
                    {tooltip}
                  </span>
                  <span className="h-3 w-px bg-border" />
                  <span className="size-2 -translate-y-1 rounded-full bg-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  highlighted
                    ? "bg-gradient-to-t from-foreground to-foreground/70"
                    : "bg-gradient-to-t from-foreground/70 via-muted-foreground/30 to-muted",
                )}
                style={{ height: `${heightPct}%` }}
                role="img"
                aria-label={`${d.label}: ${d.value}`}
              />
            </div>
            <span
              className={cn(
                "flex h-6 items-center rounded-full px-2 text-[11px]",
                highlighted
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground",
              )}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
