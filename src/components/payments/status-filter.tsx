"use client";

import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/lib/types";

type StatusValue = TransactionStatus | "all";

const OPTIONS: { value: StatusValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "failed", label: "Failed" },
  { value: "expired", label: "Expired" },
];

export function StatusFilter({
  value,
  onChange,
}: {
  value: StatusValue;
  onChange: (v: StatusValue) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
      role="tablist"
      aria-label="Filter by status"
    >
      {OPTIONS.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
