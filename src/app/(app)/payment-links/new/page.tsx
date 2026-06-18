"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatePaymentLinkForm } from "@/components/payment-links/create-form";
import { LinkInfo } from "@/components/payment-links/link-info";
import { useCreatePaymentLink } from "@/hooks/queries";
import type { PaymentLink } from "@/lib/types";

export default function CreatePaymentLinkPage() {
  const [created, setCreated] = React.useState<PaymentLink | null>(null);
  const mutation = useCreatePaymentLink();

  function handleCreate(input: Parameters<typeof mutation.mutate>[0]) {
    mutation.mutate(input, {
      onSuccess: (link) => {
        setCreated(link);
        toast.success("Payment link created");
      },
      onError: () => toast.error("Couldn’t create the link — please try again"),
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/payment-links">
          <ArrowLeft />
          Back to payment links
        </Link>
      </Button>

      {created ? (
        <Card>
          <CardHeader className="items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-success-bg text-success-fg">
              <CheckCircle2 className="size-6" />
            </span>
            <CardTitle className="text-xl">Payment link created</CardTitle>
            <CardDescription>
              Share this link or QR code with your customer to collect payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LinkInfo link={created} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href={`/payment-links/${created.id}`}>View details</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCreated(null)}
              >
                <Plus />
                Create another
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create payment link</CardTitle>
            <CardDescription>
              Generate a shareable link to collect a crypto payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePaymentLinkForm
              onSubmit={handleCreate}
              isSubmitting={mutation.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
