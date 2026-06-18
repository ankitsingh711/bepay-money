import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { CopyButton } from "@/components/common/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/money";
import { formatDateTime, truncateMiddle } from "@/lib/format";
import { NETWORK_LABELS, type Transaction } from "@/lib/types";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{children}</dd>
    </div>
  );
}

export function TransactionDetail({ tx }: { tx: Transaction }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-muted/60 p-5 text-center">
        <p className="text-sm text-muted-foreground">Amount</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {formatMoney(tx.amount, tx.currency)}
        </p>
        <div className="mt-3 flex justify-center">
          <StatusBadge status={tx.status} />
        </div>
      </div>

      <dl className="divide-y divide-border">
        <Row label="Transaction ID">
          <span className="flex items-center justify-end gap-1.5">
            <span className="font-mono">{tx.id}</span>
            <CopyButton value={tx.id} size="icon" variant="ghost" className="size-7" />
          </span>
        </Row>
        <Row label="Network">{NETWORK_LABELS[tx.network]}</Row>
        <Row label="Token">{tx.currency}</Row>
        {tx.txHash && (
          <Row label="Tx hash">
            <span className="flex items-center justify-end gap-1.5">
              <span className="font-mono">{truncateMiddle(tx.txHash, 8, 6)}</span>
              <CopyButton
                value={tx.txHash}
                size="icon"
                variant="ghost"
                className="size-7"
              />
            </span>
          </Row>
        )}
        {tx.customerReference && (
          <Row label="Customer">{tx.customerReference}</Row>
        )}
        {tx.externalReference && (
          <Row label="Order reference">{tx.externalReference}</Row>
        )}
        <Row label="Created">{formatDateTime(tx.createdAt)}</Row>
        {tx.paidAt && <Row label="Paid">{formatDateTime(tx.paidAt)}</Row>}
        {tx.paymentLinkId && (
          <Row label="Payment link">
            <Link
              href={`/payment-links/${tx.paymentLinkId}`}
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
            >
              {tx.paymentLinkTitle ?? tx.paymentLinkId}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Row>
        )}
      </dl>
    </div>
  );
}

export function TransactionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 rounded-2xl" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
