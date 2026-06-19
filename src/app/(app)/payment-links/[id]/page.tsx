"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Palette,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { StatusBadge } from "@/components/common/status-badge";
import { LinkInfo } from "@/components/payment-links/link-info";
import { usePaymentLink } from "@/hooks/queries";
import { formatMoney } from "@/lib/money";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentLinkStatus } from "@/lib/types";

const STATE_BANNER: Record<
  PaymentLinkStatus,
  { icon: typeof Clock; tone: string; title: string; description: string }
> = {
  active: {
    icon: Clock,
    tone: "bg-success-bg text-success-fg",
    title: "Active",
    description: "This link is live and ready to accept a payment.",
  },
  paid: {
    icon: CheckCircle2,
    tone: "bg-success-bg text-success-fg",
    title: "Paid",
    description: "This payment link has been settled.",
  },
  expired: {
    icon: XCircle,
    tone: "bg-neutral-bg text-neutral-fg",
    title: "Expired",
    description: "This link has expired and can no longer be paid.",
  },
};

export default function PaymentLinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = usePaymentLink(id);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/payment-links">
          <ArrowLeft />
          Back to payment links
        </Link>
      </Button>

      {isLoading && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <ErrorState
            title="Payment link not found"
            description="This link may have been removed or the URL is incorrect."
            onRetry={() => refetch()}
          />
        </Card>
      )}

      {data && (
        <>
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">{data.title}</CardTitle>
                <p className="font-mono text-xs text-muted-foreground">
                  {data.id}
                </p>
              </div>
              <StatusBadge status={data.status} />
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const banner = STATE_BANNER[data.status];
                const Icon = banner.icon;
                return (
                  <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl",
                        banner.tone,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{banner.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {banner.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <LinkInfo link={data} showQr={data.status !== "expired"} />

              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="outline" asChild>
                  <Link href={`/pay/${data.id}`} target="_blank">
                    <ExternalLink />
                    Preview payment page
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/payment-links/customize">
                    <Palette />
                    Customize page
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* associated transaction once paid */}
          {data.transaction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Associated transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/payments/${data.transaction.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-mono text-sm">{data.transaction.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(
                        data.transaction.paidAt ?? data.transaction.createdAt,
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {formatMoney(
                        data.transaction.amount,
                        data.transaction.currency,
                      )}
                    </span>
                    <StatusBadge status={data.transaction.status} />
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
