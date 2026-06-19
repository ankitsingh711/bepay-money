"use client";

// Lightweight dependency-free bar chart (matches the dashboard turnover panel).

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
    <div className={cn("relative", className)}>
      {/* faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-52"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "100% 25%, 14.28% 100%",
          opacity: 0.5,
        }}
      />

      <div className="relative flex h-52 items-end gap-2 sm:gap-3">
        {data.map((d, i) => {
          const heightPct = Math.max((d.value / max) * 100, 6);
          const highlighted = i === highlightIndex;
          return (
            <div key={d.label} className="flex h-full flex-1 flex-col">
              <div className="relative flex w-full flex-1 items-end">
                {/* floating tooltip with connector for the highlighted bar */}
                {highlighted && tooltip && (
                  <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center">
                    <span className="size-2 rounded-full bg-foreground" />
                    <span className="h-5 w-px bg-border" />
                    <span className="whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold shadow-md">
                      {tooltip}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    "w-full rounded-t-lg bg-gradient-to-b from-muted via-muted-foreground/30 to-foreground transition-all",
                  )}
                  style={{ height: `${heightPct}%` }}
                  role="img"
                  aria-label={`${d.label}: ${d.value}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* month labels */}
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 justify-center">
            <span
              className={cn(
                "flex h-6 items-center rounded-full px-2.5 text-[11px]",
                i === highlightIndex
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground",
              )}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
