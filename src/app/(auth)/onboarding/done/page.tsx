"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { signIn } from "@/lib/auth";
import { clearDraft, getDraft } from "@/lib/onboarding";

const REFERRAL_CODE = "ACA_00123QASD";
const REFERRAL_LINK = "https://bepay.app/r/ACA_00123QASD-S902";

function CopyRow({
  label,
  value,
  display,
}: {
  label: string;
  value: string;
  display: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/50 px-4 py-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-sm font-semibold">{display}</span>
        <CopyButton
          value={value}
          size="icon"
          variant="ghost"
          className="size-7"
          toastMessage={`${label} copied`}
        />
      </span>
    </div>
  );
}

export default function RedeemRewardsPage() {
  const router = useRouter();

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
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Redeem your rewards
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Got an invite code from a friend? Enter it below and redeem your 50
          reward points instantly!
        </p>
      </div>

      <div className="space-y-3">
        <CopyRow
          label="Referral Code"
          value={REFERRAL_CODE}
          display={REFERRAL_CODE}
        />
        <CopyRow
          label="Referral Link"
          value={REFERRAL_LINK}
          display="https://ww..S902"
        />
      </div>

      <Button size="lg" className="w-full" onClick={enterApp}>
        Next
      </Button>
    </div>
  );
}
