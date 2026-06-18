"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisteredPage() {
  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-success-bg text-success-fg">
          <PartyPopper className="size-8" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            You’re successfully registered
          </h1>
          <p className="text-sm text-muted-foreground">
            Just one more step — create your shop to start accepting payments.
          </p>
        </div>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/onboarding/shop">Create your shop</Link>
      </Button>
    </div>
  );
}
