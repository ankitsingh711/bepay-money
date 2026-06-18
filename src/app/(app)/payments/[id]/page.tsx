"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/states";
import {
  TransactionDetail,
  TransactionDetailSkeleton,
} from "@/components/payments/transaction-detail";
import { useTransaction } from "@/hooks/queries";

export default function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = useTransaction(id);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/payments">
          <ArrowLeft />
          Back to payments
        </Link>
      </Button>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <TransactionDetailSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {data && <TransactionDetail tx={data} />}
        </CardContent>
      </Card>
    </div>
  );
}
