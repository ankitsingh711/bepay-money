"use client";

// Dependency-free SVG donut chart (used for "Plan progress" and "Holding tokens").

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  segments,
  size = 160,
  thickness = 18,
  centerLabel,
  centervalue,
  trackColor = "var(--muted)",
  centerClassName,
  className,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centervalue?: string;
  trackColor?: string;
  centerClassName?: string;
  className?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // Precompute cumulative offsets without mutating across the render.
  const arcs = segments.map((s, i) => {
    const precedingDash = segments
      .slice(0, i)
      .reduce((sum, p) => sum + (p.value / total) * circumference, 0);
    const dash = (s.value / total) * circumference;
    return {
      ...s,
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -precedingDash,
    };
  });

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={a.color}
            strokeWidth={thickness}
            strokeDasharray={a.dasharray}
            strokeDashoffset={a.dashoffset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {(centerLabel || centervalue) && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center text-center",
            centerClassName,
          )}
        >
          {centervalue && (
            <span className="text-2xl font-semibold">{centervalue}</span>
          )}
          {centerLabel && <span className="text-xs opacity-70">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
