"use client";

// Lightweight dependency-free bar chart (matches the dashboard "turnover" card).

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
}

export function BarChart({
  data,
  highlightIndex,
  className,
}: {
  data: BarDatum[];
  highlightIndex?: number;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex h-40 items-end gap-2 sm:gap-3", className)}>
      {data.map((d, i) => {
        const heightPct = Math.max((d.value / max) * 100, 4);
        const highlighted = i === highlightIndex;
        return (
          <div
            key={d.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex w-full flex-1 items-end">
              <div
                className={cn(
                  "w-full rounded-md transition-all",
                  highlighted ? "bg-primary" : "bg-muted",
                )}
                style={{ height: `${heightPct}%` }}
                role="img"
                aria-label={`${d.label}: ${d.value}`}
              />
            </div>
            <span
              className={cn(
                "text-[11px]",
                highlighted
                  ? "font-medium text-foreground"
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
