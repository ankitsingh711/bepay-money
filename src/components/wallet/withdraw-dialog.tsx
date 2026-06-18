"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { useWallet } from "@/hooks/queries";
import { formatMoney } from "@/lib/money";
import type { Token } from "@/lib/types";
import {
  AmountField,
  ConfirmRow,
  SuccessView,
  TokenSelect,
  validateAmount,
} from "./shared";

type Step = "form" | "otp" | "success";

export function WithdrawDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { data: wallet } = useWallet();
  const [step, setStep] = React.useState<Step>("form");
  const [token, setToken] = React.useState<Token>("USDC");
  const [amount, setAmount] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<{ amount?: string; destination?: string }>(
    {},
  );
  const [submitting, setSubmitting] = React.useState(false);

  const holding = wallet?.holdings.find((h) => h.token === token);

  function reset() {
    setStep("form");
    setAmount("");
    setDestination("");
    setCode("");
    setErrors({});
  }
  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  }

  function toOtp(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    next.amount = validateAmount(amount, holding?.amount);
    if (destination.trim().length < 4)
      next.destination = "Enter a destination account";
    setErrors(next);
    if (next.amount || next.destination) return;
    setStep("otp");
  }

  function confirm() {
    if (code.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("success");
    }, 900);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "Withdrawal requested" : "Withdraw funds"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={toOtp} className="space-y-4">
            <TokenSelect
              value={token}
              onChange={setToken}
              holdings={wallet?.holdings ?? []}
            />
            <AmountField
              value={amount}
              onChange={setAmount}
              token={token}
              max={holding?.amount}
              error={errors.amount}
            />
            <Field
              label="Destination account"
              htmlFor="destination"
              error={errors.destination}
              hint="Bank account or external wallet"
            >
              <Input
                id="destination"
                placeholder="Account / IBAN / address"
                value={destination}
                invalid={!!errors.destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>
        )}

        {step === "otp" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-muted/60 p-4">
              <ConfirmRow
                label="Withdrawing"
                value={formatMoney(amount || "0", token)}
              />
              <ConfirmRow label="To" value={destination} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your device to confirm. (Demo:
                any 6 digits.)
              </p>
              <OtpInput value={code} onChange={setCode} />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("form")}
                disabled={submitting}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={confirm}
                disabled={submitting}
              >
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? "Confirming…" : "Confirm"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <SuccessView
            title={`${formatMoney(amount || "0", token)} on its way`}
            description={`Your withdrawal to ${destination} is being processed.`}
            onClose={() => close(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
