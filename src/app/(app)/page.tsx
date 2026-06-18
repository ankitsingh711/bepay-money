"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState } from "@/components/ui/states";
import {
  MetricCard,
  MetricCardSkeleton,
} from "@/components/dashboard/metric-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { useDashboardSummary } from "@/hooks/queries";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const TURNOVER = [
  { label: "Jan", value: 18 },
  { label: "Feb", value: 26 },
  { label: "Mar", value: 22 },
  { label: "Apr", value: 31 },
  { label: "May", value: 44 },
  { label: "Jun", value: 38 },
  { label: "Jul", value: 29 },
];

const HOLDINGS = [
  { label: "USDC", value: 46, color: "var(--chart-2)" },
  { label: "Ethereum", value: 28, color: "var(--chart-3)" },
  { label: "Polygon", value: 16, color: "var(--chart-4)" },
  { label: "Base", value: 10, color: "var(--chart-5)" },
];

export default function DashboardPage() {
  const { data, isLoading, isError, isFetching, refetch } =
    useDashboardSummary();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome back — here’s your payment activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="h-10 w-[150px] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => refetch()}
            aria-label="Refresh dashboard"
          >
            <RefreshCw className={cn(isFetching && "animate-spin")} />
          </Button>
          <Button size="sm" className="h-10" asChild>
            <Link href="/payment-links/new">
              <Plus />
              Create payment link
            </Link>
          </Button>
        </div>
      </div>

      {isError ? (
        <Card>
          <ErrorState onRetry={() => refetch()} />
        </Card>
      ) : (
        <>
          {/* metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading || !data ? (
              Array.from({ length: 4 }).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))
            ) : (
              <>
                <MetricCard
                  label="Total received"
                  value={formatMoney(data.totalReceived, data.currency)}
                  icon={Wallet}
                  delta={data.deltas.totalReceived}
                />
                <MetricCard
                  label="Successful payments"
                  value={String(data.successfulCount)}
                  icon={CheckCircle2}
                  tone="success"
                  delta={data.deltas.successful}
                />
                <MetricCard
                  label="Pending payments"
                  value={String(data.pendingCount)}
                  icon={Clock}
                  tone="warning"
                  delta={data.deltas.pending}
                />
                <MetricCard
                  label="Failed or expired"
                  value={String(data.failedCount)}
                  icon={XCircle}
                  tone="danger"
                  delta={data.deltas.failed}
                />
              </>
            )}
          </div>

          {/* charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle>Total turnover</CardTitle>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {data
                      ? formatMoney(data.totalReceived, data.currency)
                      : "—"}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart data={TURNOVER} highlightIndex={4} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Holding tokens</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5">
                <DonutChart
                  segments={HOLDINGS}
                  centervalue={String(
                    HOLDINGS.reduce((s, h) => s + h.value, 0),
                  )}
                  centerLabel="Total tokens"
                />
                <ul className="w-full space-y-2">
                  {HOLDINGS.map((h) => (
                    <li
                      key={h.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: h.color }}
                        />
                        {h.label}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {h.value}%
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* recent transactions */}
          <RecentTransactions
            transactions={data?.recentTransactions}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
