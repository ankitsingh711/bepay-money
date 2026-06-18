import { StatusBadge } from "@/components/common/status-badge";
import { CopyButton } from "@/components/common/copy-button";
import { Input } from "@/components/ui/input";
import { QrCode } from "./qr-code";
import { formatMoney } from "@/lib/money";
import { formatDateTime } from "@/lib/format";
import { NETWORK_LABELS, type PaymentLink } from "@/lib/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

/** Shared presentation of a payment link's details, incl. URL + QR. */
export function LinkInfo({
  link,
  showQr = true,
}: {
  link: PaymentLink;
  showQr?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-3xl font-semibold tracking-tight">
            {formatMoney(link.amount, link.currency)}
          </p>
          <div className="mt-2 flex justify-center sm:justify-start">
            <StatusBadge status={link.status} />
          </div>
        </div>
        {showQr && <QrCode value={link.paymentUrl} />}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Payment URL</label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={link.paymentUrl}
            className="font-mono text-xs"
            onFocus={(e) => e.currentTarget.select()}
          />
          <CopyButton
            value={link.paymentUrl}
            label="Copy"
            toastMessage="Payment link copied"
            className="shrink-0"
          />
        </div>
      </div>

      <dl className="divide-y divide-border">
        <Row label="Token" value={link.currency} />
        <Row label="Network" value={NETWORK_LABELS[link.network]} />
        <Row label="Created" value={formatDateTime(link.createdAt)} />
        <Row label="Expires" value={formatDateTime(link.expiresAt)} />
        {link.externalReference && (
          <Row label="Order reference" value={link.externalReference} />
        )}
        {link.description && (
          <Row label="Description" value={link.description} />
        )}
      </dl>
    </div>
  );
}
