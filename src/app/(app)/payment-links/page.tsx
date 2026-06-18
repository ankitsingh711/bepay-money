"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { usePaymentLinks } from "@/hooks/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NETWORK_LABELS, type PaymentLinkStatus } from "@/lib/types";

const LIMIT = 10;

const STATUS_TABS: { value: PaymentLinkStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paid", label: "Paid" },
  { value: "expired", label: "Expired" },
];

export default function PaymentLinksPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<PaymentLinkStatus | "all">("all");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleStatus(v: PaymentLinkStatus | "all") {
    setStatus(v);
    setPage(1);
  }

  const { data, isLoading, isError, isFetching, refetch } = usePaymentLinks({
    search: debouncedSearch || undefined,
    status,
    page,
    limit: LIMIT,
  });

  const rows = data?.data ?? [];
  const showEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search links by title or reference"
            className="h-10 rounded-full pl-9"
            aria-label="Search payment links"
          />
        </div>
        <Button asChild className="h-10">
          <Link href="/payment-links/new">
            <Plus />
            Create payment link
          </Link>
        </Button>
      </div>

      <div
        className="inline-flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card p-1"
        role="tablist"
        aria-label="Filter by status"
      >
        {STATUS_TABS.map((t) => {
          const active = t.value === status;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleStatus(t.value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : showEmpty ? (
          <EmptyState
            icon={<Link2 className="size-6" />}
            title="No payment links yet"
            description="Create your first payment link to start collecting crypto payments."
            action={
              <Button asChild size="sm">
                <Link href="/payment-links/new">
                  <Plus />
                  Create payment link
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5 sm:pl-6">Title</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5 text-right sm:pr-6">
                      Expires
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: LIMIT }).map((_, i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <TableCell
                              key={j}
                              className={
                                j === 0
                                  ? "pl-5 sm:pl-6"
                                  : j === 4
                                    ? "pr-5 sm:pr-6"
                                    : ""
                              }
                            >
                              <Skeleton className="h-5 w-full max-w-[140px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : rows.map((link) => (
                        <TableRow
                          key={link.id}
                          className="cursor-pointer"
                          tabIndex={0}
                          role="button"
                          onClick={() =>
                            router.push(`/payment-links/${link.id}`)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              router.push(`/payment-links/${link.id}`);
                            }
                          }}
                        >
                          <TableCell className="pl-5 sm:pl-6">
                            <div className="font-medium">{link.title}</div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {link.externalReference ?? link.id}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {NETWORK_LABELS[link.network]}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatMoney(link.amount, link.currency)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={link.status} />
                          </TableCell>
                          <TableCell className="pr-5 text-right text-sm text-muted-foreground sm:pr-6">
                            {formatDate(link.expiresAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
            {data && data.total > 0 && (
              <div className="border-t border-border">
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
      </Card>
    </div>
  );
}
