"use client";

import * as React from "react";
import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = ["Week", "Month", "Year", "Custom"] as const;

const SERIES: Record<string, { label: string; value: number }[]> = {
  Week: [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 28 },
    { label: "Wed", value: 18 },
    { label: "Thu", value: 34 },
    { label: "Fri", value: 48 },
    { label: "Sat", value: 30 },
    { label: "Sun", value: 22 },
  ],
  Month: [
    { label: "Jan", value: 30 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 40 },
    { label: "May", value: 70 },
    { label: "Jun", value: 18 },
    { label: "Jul", value: 26 },
  ],
  Year: [
    { label: "2021", value: 40 },
    { label: "2022", value: 55 },
    { label: "2023", value: 48 },
    { label: "2024", value: 70 },
    { label: "2025", value: 62 },
  ],
  Custom: [
    { label: "Q1", value: 44 },
    { label: "Q2", value: 66 },
    { label: "Q3", value: 38 },
    { label: "Q4", value: 58 },
  ],
};

export function TurnoverPanel() {
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Month");
  const data = SERIES[tab];
  const highlight = tab === "Month" ? 4 : Math.floor(data.length / 2);

  return (
    <div className="space-y-5 rounded-3xl bg-muted/50 p-5">
      {/* headline */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Total Monthly Turnover</p>
        <p className="mt-1 flex items-end justify-center gap-2">
          <span className="text-4xl font-bold tracking-tight">
            {formatUsd(273937)}
          </span>
          <span className="pb-1 text-sm font-medium text-success">+$ 2,937</span>
        </p>
      </div>

      {/* tabs */}
      <div className="flex items-center justify-center gap-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "text-sm transition-colors",
              t === tab
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* chart */}
      <BarChart data={data} highlightIndex={highlight} tooltip="$ 653.09" />

      {/* plan donut — stacked-card effect */}
      <div className="relative mt-3">
        <div className="absolute -top-3 left-8 right-8 h-6 rounded-2xl bg-foreground/15" />
        <div className="absolute -top-1.5 left-4 right-4 h-6 rounded-2xl bg-foreground/30" />
        <div className="relative flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-[#1b1f27] to-black p-6 text-white">
        <div>
          <p className="text-sm text-white/60">Plan for May</p>
          <p className="text-2xl font-bold">Completed</p>
        </div>
        <DonutChart
          size={96}
          thickness={12}
          segments={[
            { label: "done", value: 72, color: "url(#planGrad)" },
          ]}
          trackColor="rgba(255,255,255,0.15)"
          centervalue="72%"
          centerClassName="text-white [&_span:first-child]:text-lg"
        />
        {/* gradient def for the plan arc */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="planGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#9aa0aa" />
            </linearGradient>
          </defs>
        </svg>
        </div>
      </div>
    </div>
  );
}
