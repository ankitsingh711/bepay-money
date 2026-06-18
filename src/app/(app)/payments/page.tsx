"use client";

import * as React from "react";
import { Search } from "lucide-react";
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
import { StatusFilter } from "@/components/payments/status-filter";
import {
  AdvancedFilters,
  EMPTY_FILTERS,
  FiltersSheet,
} from "@/components/payments/filters-sheet";
import { ExportDialog } from "@/components/payments/export-dialog";
import { TransactionDetailSheet } from "@/components/payments/transaction-detail-sheet";
import { useTransactions } from "@/hooks/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { formatMoney } from "@/lib/money";
import { formatDateTime } from "@/lib/format";
import { NETWORK_LABELS, type TransactionStatus } from "@/lib/types";

const LIMIT = 10;

export default function PaymentsPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<TransactionStatus | "all">("all");
  const [filters, setFilters] = React.useState<AdvancedFilters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string | undefined>();
  const [detailOpen, setDetailOpen] = React.useState(false);

  const debouncedSearch = useDebounce(search);

  // Reset to the first page whenever a filter changes (handled in the change
  // handlers below rather than an effect to avoid cascading renders).
  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleStatus(v: TransactionStatus | "all") {
    setStatus(v);
    setPage(1);
  }
  function handleFilters(v: AdvancedFilters) {
    setFilters(v);
    setPage(1);
  }

  const query = {
    search: debouncedSearch || undefined,
    status,
    network: filters.network,
    from: filters.from || undefined,
    to: filters.to || undefined,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useTransactions(query);

  function openTx(id: string) {
    setSelected(id);
    setDetailOpen(true);
  }

  const rows = data?.data ?? [];
  const showEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by ID, title or reference"
            className="h-10 rounded-full pl-9"
            aria-label="Search transactions"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiltersSheet value={filters} onApply={handleFilters} />
          <ExportDialog query={query} />
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <StatusFilter value={status} onChange={handleStatus} />
      </div>

      <Card className="overflow-hidden">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : showEmpty ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your search or filters to find what you’re looking for."
          />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5 sm:pl-6">Transaction</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5 text-right sm:pr-6">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: LIMIT }).map((_, i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell
                              key={j}
                              className={
                                j === 0 ? "pl-5 sm:pl-6" : j === 5 ? "pr-5 sm:pr-6" : ""
                              }
                            >
                              <Skeleton className="h-5 w-full max-w-[140px]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : rows.map((tx) => (
                        <TableRow
                          key={tx.id}
                          className="cursor-pointer"
                          tabIndex={0}
                          role="button"
                          onClick={() => openTx(tx.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openTx(tx.id);
                            }
                          }}
                        >
                          <TableCell className="pl-5 sm:pl-6">
                            <div className="font-medium">
                              {tx.paymentLinkTitle ?? "Direct payment"}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {tx.id}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tx.customerReference ?? "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {NETWORK_LABELS[tx.network]}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatMoney(tx.amount, tx.currency)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={tx.status} />
                          </TableCell>
                          <TableCell className="pr-5 text-right text-sm text-muted-foreground sm:pr-6">
                            {formatDateTime(tx.createdAt)}
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

      <TransactionDetailSheet
        transactionId={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
