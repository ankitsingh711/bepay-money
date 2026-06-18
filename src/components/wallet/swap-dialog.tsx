"use client";

import * as React from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type Step = "form" | "success";

// Mocked indicative exchange rates relative to USDC.
const RATE: Record<Token, number> = { USDC: 1, USDT: 1, DAI: 1, ETH: 2978.12 };

function convert(amount: string, from: Token, to: Token): string {
  const n = Number(amount || "0");
  if (!n) return "0";
  const usd = n * RATE[from];
  return (usd / RATE[to]).toFixed(to === "ETH" ? 4 : 2);
}

export function SwapDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { data: wallet } = useWallet();
  const [step, setStep] = React.useState<Step>("form");
  const [from, setFrom] = React.useState<Token>("USDC");
  const [to, setTo] = React.useState<Token>("ETH");
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);

  const holding = wallet?.holdings.find((h) => h.token === from);
  const received = convert(amount, from, to);

  function reset() {
    setStep("form");
    setAmount("");
    setError(undefined);
  }
  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  }

  function swap() {
    const err = validateAmount(amount, holding?.amount);
    setError(err);
    if (err) return;
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
          <DialogTitle>{step === "success" ? "Swapped" : "Swap tokens"}</DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            <TokenSelect
              label="From"
              value={from}
              onChange={(t) => {
                setFrom(t);
                if (t === to) setTo(from);
              }}
              holdings={wallet?.holdings ?? []}
            />
            <AmountField
              value={amount}
              onChange={setAmount}
              token={from}
              max={holding?.amount}
              error={error}
            />

            <div className="flex justify-center">
              <span className="flex size-8 items-center justify-center rounded-full border border-border bg-muted">
                <ArrowDown className="size-4" />
              </span>
            </div>

            <TokenSelect
              label="To"
              value={to}
              onChange={(t) => {
                setTo(t);
                if (t === from) setFrom(to);
              }}
              holdings={wallet?.holdings ?? []}
              exclude={from}
            />

            <div className="rounded-2xl bg-muted/60 p-4">
              <ConfirmRow
                label="You receive"
                value={`≈ ${formatMoney(received, to)}`}
              />
              <ConfirmRow
                label="Rate"
                value={`1 ${from} ≈ ${convert("1", from, to)} ${to}`}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={swap}
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Swapping…" : "Swap"}
            </Button>
          </div>
        )}

        {step === "success" && (
          <SuccessView
            title="Swap complete"
            description={`You swapped ${formatMoney(amount || "0", from)} for ≈ ${formatMoney(received, to)}.`}
            onClose={() => close(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
