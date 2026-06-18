"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/queries";
import { formatMoney } from "@/lib/money";
import { NETWORK_LABELS, type Token } from "@/lib/types";
import {
  AmountField,
  ConfirmRow,
  SuccessView,
  TokenSelect,
  validateAmount,
} from "./shared";

type Step = "form" | "confirm" | "success";

export function SendDialog({
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
  const [address, setAddress] = React.useState("");
  const [errors, setErrors] = React.useState<{ amount?: string; address?: string }>(
    {},
  );
  const [submitting, setSubmitting] = React.useState(false);

  const holding = wallet?.holdings.find((h) => h.token === token);

  function reset() {
    setStep("form");
    setAmount("");
    setAddress("");
    setErrors({});
  }

  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  }

  function review(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    next.amount = validateAmount(amount, holding?.amount);
    if (!/^0x[a-fA-F0-9]{6,}$/.test(address))
      next.address = "Enter a valid wallet address";
    setErrors(next);
    if (next.amount || next.address) return;
    setStep("confirm");
  }

  function confirmSend() {
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
            {step === "success" ? "Sent" : "Send money"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={review} className="space-y-4">
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
              label="Recipient address"
              htmlFor="address"
              error={errors.address}
            >
              <Input
                id="address"
                placeholder="0x…"
                value={address}
                invalid={!!errors.address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </Field>
            <Button type="submit" className="w-full" size="lg">
              Review
            </Button>
          </form>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-muted/60 p-5 text-center">
              <p className="text-sm text-muted-foreground">You’re sending</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                {formatMoney(amount || "0", token)}
              </p>
            </div>
            <div className="divide-y divide-border">
              <ConfirmRow label="To" value={`${address.slice(0, 10)}…`} />
              <ConfirmRow label="Network" value={NETWORK_LABELS.polygon} />
              <ConfirmRow label="Network fee" value="~0.01 USDC" />
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
                onClick={confirmSend}
                disabled={submitting}
              >
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? "Sending…" : "Confirm & send"}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <SuccessView
            title={`${formatMoney(amount || "0", token)} sent`}
            description={`Your transfer to ${address.slice(0, 10)}… is on its way.`}
            onClose={() => close(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
