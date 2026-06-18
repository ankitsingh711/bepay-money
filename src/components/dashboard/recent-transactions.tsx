"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionDetailSheet } from "@/components/payments/transaction-detail-sheet";
import { formatMoney } from "@/lib/money";
import { formatRelative } from "@/lib/format";
import { NETWORK_LABELS, type Transaction } from "@/lib/types";

export function RecentTransactions({
  transactions,
  isLoading,
}: {
  transactions?: Transaction[];
  isLoading?: boolean;
}) {
  const [selected, setSelected] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);

  function openTx(id: string) {
    setSelected(id);
    setOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent transactions</CardTitle>
        <Link
          href="/payments"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
          <ArrowUpRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="px-0 sm:px-0">
        {isLoading ? (
          <div className="space-y-2 px-5 sm:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : !transactions?.length ? (
          <EmptyState
            title="No transactions yet"
            description="Incoming payments will appear here once customers start paying."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5 sm:pl-6">Transaction</TableHead>
                <TableHead>Network</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
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
                    {NETWORK_LABELS[tx.network]}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatMoney(tx.amount, tx.currency)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="pr-5 text-right text-sm text-muted-foreground sm:pr-6">
                    {formatRelative(tx.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <TransactionDetailSheet
        transactionId={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </Card>
  );
}
