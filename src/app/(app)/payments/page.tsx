"use client";

import * as React from "react";
import { ArrowDownCircle, ArrowUpCircle, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  EMPTY_FILTERS,
  FiltersSheet,
  type PaymentFilters,
} from "@/components/payments/filters-sheet";
import { ExportDialog } from "@/components/payments/export-dialog";
import { TransactionDetailSheet } from "@/components/payments/transaction-detail-sheet";
import { useTransactions } from "@/hooks/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/format";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const LIMIT = 9;

export default function PaymentsPage() {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<PaymentFilters>(EMPTY_FILTERS);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string | undefined>();
  const [detailOpen, setDetailOpen] = React.useState(false);

  const debouncedSearch = useDebounce(search);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleFilters(v: PaymentFilters) {
    setFilters(v);
    setPage(1);
  }

  const query = {
    search: debouncedSearch || undefined,
    state: filters.state,
    outcomeCurrency: filters.outcomeCurrency,
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
    <div className="mx-auto max-w-[1400px]">
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search"
              className="h-11 rounded-xl pl-10"
              aria-label="Search payments"
            />
          </div>
          <FiltersSheet value={filters} onApply={handleFilters} />
          <ExportDialog query={query} />
        </div>
      </div>

      {/* table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-border">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : showEmpty ? (
          <EmptyState
            title="No payments found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 pl-6 font-normal capitalize tracking-normal text-muted-foreground">
                    Payment ID
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Order ID
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Original Price
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Amount Recieved
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Amount Sent
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-normal capitalize tracking-normal text-muted-foreground">
                    Created/ Last Updated Date
                  </TableHead>
                  <TableHead className="pr-6 font-normal capitalize tracking-normal text-muted-foreground">
                    Created/ Last Updated Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: LIMIT }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell
                            key={j}
                            className={j === 0 ? "pl-6" : j === 7 ? "pr-6" : ""}
                          >
                            <Skeleton className="h-5 w-full max-w-[120px]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : rows.map((t, i) => (
                      <TableRow
                        key={t.id}
                        className={cn(
                          "cursor-pointer border-0",
                          i % 2 === 1 && "bg-muted/40",
                        )}
                        tabIndex={0}
                        role="button"
                        onClick={() => openTx(t.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openTx(t.id);
                          }
                        }}
                      >
                        <TableCell className="py-4 pl-6 font-medium">
                          {t.paymentId}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {t.externalReference ?? "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {t.originalPrice} USD
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <ArrowDownCircle className="size-4 text-success-fg" />
                            {t.received.amount} {t.received.token}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <ArrowUpCircle className="size-4 text-danger-fg" />
                            {t.sent.amount} {t.sent.token}
                          </span>
                        </TableCell>
                        <TableCell>
                          {t.paymentState === "active" ? (
                            <Badge
                              variant="success"
                              className="bg-success px-3 py-1 text-[11px] font-semibold uppercase text-white"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="danger"
                              className="bg-danger px-3 py-1 text-[11px] font-semibold uppercase text-white"
                            >
                              Expired
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(t.createdAt)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap pr-6 text-muted-foreground">
                          {format(new Date(t.createdAt), "hh:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {data && data.total > 0 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={data.limit}
          onPageChange={setPage}
        />
      )}

      <TransactionDetailSheet
        transactionId={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
