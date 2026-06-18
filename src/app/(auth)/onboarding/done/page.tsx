"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Gift, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { clearDraft, getDraft } from "@/lib/onboarding";

export default function OnboardingDonePage() {
  const router = useRouter();
  const [shopName, setShopName] = React.useState("your shop");

  React.useEffect(() => {
    const draft = getDraft();
    setShopName(draft.shopName || "your shop");
  }, []);

  function enterApp() {
    const draft = getDraft();
    signIn({
      email: draft.email || "merchant@bepay.app",
      businessName: draft.businessName,
    });
    clearDraft();
    toast.success("Welcome to bepay!");
    router.replace("/");
  }

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-success-bg text-success-fg">
          <Store className="size-8" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {shopName} has been created
          </h1>
          <p className="text-sm text-muted-foreground">
            Your shop is ready. Redeem your welcome reward and head to your
            dashboard.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border p-4 text-left">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg text-warning-fg">
          <Gift className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium">Welcome reward unlocked</p>
          <p className="text-sm text-muted-foreground">
            10 USDC in fee credits added to your account.
          </p>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={enterApp}>
        Go to dashboard
      </Button>
    </div>
  );
}
