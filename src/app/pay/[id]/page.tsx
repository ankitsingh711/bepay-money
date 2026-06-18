"use client";

import { use } from "react";
import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/status-badge";
import { QrCode } from "@/components/payment-links/qr-code";
import { Brand } from "@/components/layout/brand";
import { usePaymentLink } from "@/hooks/queries";
import { useBrand } from "@/hooks/use-brand";
import { formatMoney } from "@/lib/money";
import { formatDateTime } from "@/lib/format";
import { NETWORK_LABELS } from "@/lib/types";

export default function PublicPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = usePaymentLink(id);
  const brand = useBrand();
  const [paid, setPaid] = React.useState(false);
  const [paying, setPaying] = React.useState(false);

  function pay() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 1400);
  }

  const status = paid ? "paid" : data?.status;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {/* merchant header */}
        <div className="flex items-center justify-between text-white/80">
          <Brand />
          <span className="inline-flex items-center gap-1 text-xs text-white/50">
            <ShieldCheck className="size-3.5" />
            Secured by bepay
          </span>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-xl sm:p-8">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="mx-auto h-6 w-40" />
              <Skeleton className="mx-auto h-10 w-48" />
              <Skeleton className="mx-auto size-44 rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-danger-bg text-danger-fg">
                <XCircle className="size-6" />
              </span>
              <p className="font-semibold">Payment link not found</p>
              <p className="text-sm text-muted-foreground">
                This link may have been removed or the URL is incorrect.
              </p>
            </div>
          )}

          {data && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-semibold tracking-tight">
                  {brand.tagline}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pay {brand.businessName}
                </p>
              </div>

              {/* paid / expired states */}
              {status === "paid" ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-success-bg text-success-fg">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold">Payment successful</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(data.amount, data.currency)} paid to{" "}
                      {brand.businessName}.
                    </p>
                  </div>
                </div>
              ) : status === "expired" ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-neutral-bg text-neutral-fg">
                    <Clock className="size-7" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold">This link has expired</p>
                    <p className="text-sm text-muted-foreground">
                      Contact {brand.businessName} for a new payment link.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-muted/60 p-5 text-center">
                    <p className="text-sm text-muted-foreground">
                      {data.title}
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      {formatMoney(data.amount, data.currency)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      on {NETWORK_LABELS[data.network]}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <QrCode value={data.paymentUrl} size={160} />
                    <p className="text-center text-xs text-muted-foreground">
                      Scan with your wallet, or pay in one tap below.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={pay}
                    disabled={paying}
                    style={{ backgroundColor: brand.color }}
                  >
                    {paying && <Loader2 className="animate-spin" />}
                    {paying
                      ? "Processing…"
                      : `Pay ${formatMoney(data.amount, data.currency)}`}
                  </Button>
                </>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>Expires {formatDateTime(data.expiresAt)}</span>
                <StatusBadge status={status ?? data.status} />
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/40">
          Non-custodial · You control your funds · Powered by bepay
        </p>
      </div>
    </div>
  );
}
