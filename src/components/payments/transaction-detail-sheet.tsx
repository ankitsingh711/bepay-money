"use client";

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ErrorState } from "@/components/ui/states";
import { useTransaction } from "@/hooks/queries";
import {
  TransactionDetail,
  TransactionDetailSkeleton,
} from "./transaction-detail";

export function TransactionDetailSheet({
  transactionId,
  open,
  onOpenChange,
}: {
  transactionId: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, isError, refetch } = useTransaction(
    open ? transactionId : undefined,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Transaction details</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Full record for this payment.
          </p>
        </SheetHeader>
        <SheetBody>
          {isLoading && <TransactionDetailSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {data && <TransactionDetail tx={data} />}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
