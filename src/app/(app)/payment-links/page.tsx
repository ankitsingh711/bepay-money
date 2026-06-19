"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Copy, Link2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Pagination } from "@/components/ui/pagination";
import { CreatePaymentTools } from "@/components/payment-links/create-payment-tools";
import {
  FiltersSheet,
  EMPTY_FILTERS,
  type PaymentFilters,
} from "@/components/payments/filters-sheet";
import { usePaymentLinks } from "@/hooks/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentLink, PaymentLinkStatus } from "@/lib/types";

const LIMIT = 9;
const DISPLAY_URL = "https//:bepay.net.co.8275253719376+hdgx";

const STATUS_PRESENTATION: Record<
  PaymentLinkStatus,
  { label: string; className: string }
> = {
  paid: { label: "COMPLETED", className: "bg-[#3f7d58]" },
  active: { label: "IN PROGRESS", className: "bg-[#e0a23c]" },
  expired: { label: "FAILED", className: "bg-[#b1564f]" },
};

function invoiceId(link: PaymentLink): string {
  const n = Number(link.id.replace(/\D/g, "")) || 0;
  return `519373${String(2660 + (n % 40)).padStart(4, "0")}`;
}

export default function PaymentLinksPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<PaymentFilters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(1);
  const [createOpen, setCreateOpen] = React.useState(false);
  const debouncedSearch = useDebounce(search);

  const status: PaymentLinkStatus | "all" =
    filters.state === "active"
      ? "active"
      : filters.state === "expired"
        ? "expired"
        : "all";

  const { data, isLoading, isError, isFetching, refetch } = usePaymentLinks({
    search: debouncedSearch || undefined,
    status,
    page,
    limit: LIMIT,
  });

  const rows = data?.data ?? [];
  const showEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Link</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              aria-label="Search payment links"
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus-visible:border-ring sm:w-64"
            />
          </div>
          <FiltersSheet
            value={filters}
            onApply={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Create Payment Link
          </button>
        </div>
      </div>

      {/* table */}
      <div className="rounded-3xl border border-border/70">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : showEmpty ? (
          <EmptyState
            icon={<Link2 className="size-6" />}
            title="No payment links yet"
            description="Create your first payment link to start collecting crypto payments."
          />
        ) : (
          <>
            <div
              className={cn(
                "overflow-x-auto",
                isFetching && "opacity-60 transition-opacity",
              )}
            >
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <Th className="pl-6">Invoice ID</Th>
                    <Th>Order ID</Th>
                    <Th>Currency</Th>
                    <Th>Invoice URL</Th>
                    <Th>Status</Th>
                    <Th>
                      Created/ Last
                      <br />
                      Updated Date
                    </Th>
                    <Th className="pr-6">
                      Created/ Last
                      <br />
                      Updated Time
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: LIMIT }).map((_, i) => (
                        <tr key={i} className="border-t border-border/60">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <td
                              key={j}
                              className={cn(
                                "px-4 py-4",
                                j === 0 && "pl-6",
                                j === 6 && "pr-6",
                              )}
                            >
                              <Skeleton className="h-5 w-24" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : rows.map((link, i) => {
                        const s = STATUS_PRESENTATION[link.status];
                        return (
                          <tr
                            key={link.id}
                            className={cn(
                              "border-t border-border/50",
                              i % 2 === 1 && "bg-muted/40",
                            )}
                          >
                            <td className="px-4 py-4 pl-6 font-medium">
                              {invoiceId(link)}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">
                              {link.externalReference ?? "—"}
                            </td>
                            <td className="px-4 py-4">All currencies</td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1.5 text-[#3b6cff]">
                                <button
                                  type="button"
                                  onClick={() => router.push(`/pay/${link.id}`)}
                                  className="font-medium hover:underline"
                                >
                                  {DISPLAY_URL}
                                </button>
                                <button
                                  type="button"
                                  aria-label="Copy invoice URL"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(
                                      link.paymentUrl,
                                    );
                                    toast.success("Copied to Clipboard");
                                  }}
                                  className="hover:opacity-70"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={cn(
                                  "inline-block rounded-full px-3 py-1 text-xs font-semibold text-white",
                                  s.className,
                                )}
                              >
                                {s.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">
                              {formatDate(link.createdAt)}
                            </td>
                            <td className="px-4 py-4 pr-6 text-muted-foreground">
                              {format(new Date(link.createdAt), "hh:mm a")}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            {data && data.total > 0 && (
              <div className="border-t border-border/60">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  total={data.total}
                  limit={data.limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <CreatePaymentTools
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => refetch()}
      />
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 pb-4 pt-5 align-top text-sm font-normal leading-snug",
        className,
      )}
    >
      {children}
    </th>
  );
}
