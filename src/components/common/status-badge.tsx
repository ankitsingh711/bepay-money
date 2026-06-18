import { Badge } from "@/components/ui/badge";
import type { PaymentLinkStatus, TransactionStatus } from "@/lib/types";

type AnyStatus = TransactionStatus | PaymentLinkStatus;

const STATUS_MAP: Record<
  AnyStatus,
  { label: string; variant: "success" | "warning" | "danger" | "neutral" }
> = {
  // transactions
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  expired: { label: "Expired", variant: "neutral" },
  // payment links
  active: { label: "Active", variant: "success" },
  paid: { label: "Paid", variant: "success" },
};

export function StatusBadge({ status }: { status: AnyStatus }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  );
}
