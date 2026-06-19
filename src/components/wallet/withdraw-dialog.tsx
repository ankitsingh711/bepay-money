"use client";

import * as React from "react";
import { ArrowDown, ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OtpInput } from "@/components/ui/otp-input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Step =
  | "wallet"
  | "amount"
  | "providers"
  | "preview"
  | "alert"
  | "otp"
  | "success";

interface FiatWallet {
  id: string;
  name: string;
  badge: string;
  balance: string;
}

const WALLETS: FiatWallet[] = [
  { id: "usd", name: "Cash (USD)", badge: "$", balance: "$0.00" },
  { id: "sgd", name: "SGD Wallet", badge: "SS", balance: "$9.87" },
];

interface Provider {
  id: string;
  name: string;
  amount: string;
  fees: string;
  note: string;
  dot: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "moonpay",
    name: "MoonPay",
    amount: "0.0047 ETH",
    fees: "Fees: $2.65",
    note: "Best price:  $9.25",
    dot: "bg-[#7d00ff]",
  },
  {
    id: "mtpelerin",
    name: "Mt Pelerin",
    amount: "0.0047 ETH",
    fees: "Fees: $5.43",
    note: "$11.34",
    dot: "bg-[#19c2d8]",
  },
];

/** A full-width pill button — black when enabled, light grey when disabled. */
function NextButton({
  children = "Next",
  disabled,
  onClick,
}: {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="w-full disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
    >
      {children}
    </Button>
  );
}

/** Hand-drawn open-wallet illustration shown on the first withdraw screen. */
function WalletArt() {
  return (
    <svg
      viewBox="0 0 96 80"
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-20 text-foreground"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M14 30 L60 16 a6 6 0 0 1 7.5 4 L70 30" />
      <rect x="10" y="30" width="68" height="40" rx="8" />
      <path d="M78 44 h-16 a7 7 0 0 0 0 14 h16" />
      <circle cx="64" cy="51" r="2.4" fill="currentColor" stroke="none" />
      <path d="M76 8 l4 -5 M84 14 l6 -3 M82 24 l6 0" />
    </svg>
  );
}

export function WithdrawDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [step, setStep] = React.useState<Step>("wallet");
  const [walletId, setWalletId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState("");
  const [providerId, setProviderId] = React.useState<string>("moonpay");
  const [alertOn, setAlertOn] = React.useState(true);
  const [code, setCode] = React.useState("");

  function reset() {
    setStep("wallet");
    setWalletId(null);
    setAmount("");
    setProviderId("moonpay");
    setAlertOn(true);
    setCode("");
  }
  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  }

  const back: Partial<Record<Step, Step>> = {
    amount: "wallet",
    providers: "amount",
    preview: "providers",
    alert: "preview",
    otp: "alert",
  };

  function confirmOtp() {
    if (code.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setStep("success");
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="gap-0 p-7">
        {back[step] && (
          <button
            type="button"
            onClick={() => setStep(back[step]!)}
            aria-label="Back"
            className="absolute left-5 top-5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}

        {/* STEP 1 — select fiat wallet */}
        {step === "wallet" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 pt-2">
              <WalletArt />
              <h2 className="text-xl font-bold tracking-tight">
                Select flat wallet to withdraw
              </h2>
            </div>
            <div className="space-y-1">
              {WALLETS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWalletId(w.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                    walletId === w.id ? "bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                    {w.badge}
                  </span>
                  <span className="flex-1 text-base font-semibold">
                    {w.name}
                  </span>
                  <span className="text-base font-semibold">{w.balance}</span>
                </button>
              ))}
            </div>
            <NextButton
              disabled={!walletId}
              onClick={() => setStep("amount")}
            />
          </div>
        )}

        {/* STEP 2 — enter amount */}
        {step === "amount" && (
          <div className="space-y-7">
            <h2 className="text-center text-xl font-bold tracking-tight">
              Enter amount to withdraw
            </h2>
            <div className="flex items-center justify-center gap-3 py-4">
              <input
                autoFocus
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d.]/g, ""))
                }
                className="w-[7ch] border-r-2 border-foreground bg-transparent pr-2 text-right text-6xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40"
              />
              <span className="text-2xl font-bold">USDC</span>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setAmount("0.08")}
                className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70"
              >
                Cash out all
              </button>
            </div>
            <NextButton
              disabled={!amount || Number(amount) <= 0}
              onClick={() => setStep("providers")}
            />
          </div>
        )}

        {/* STEP 3 — top providers */}
        {step === "providers" && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold tracking-tight">
              Top Providers
            </h2>
            <div className="space-y-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProviderId(p.id)}
                  className={cn(
                    "w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors",
                    providerId === p.id
                      ? "border-foreground bg-card"
                      : "border-transparent bg-muted/60 hover:bg-muted",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className={cn("size-2.5 rounded-full", p.dot)} />
                      {p.name}
                    </span>
                    <span className="font-semibold">{p.amount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.fees}</span>
                    <span>{p.note}</span>
                  </div>
                </button>
              ))}
            </div>
            <NextButton onClick={() => setStep("preview")} />
          </div>
        )}

        {/* STEP 4 — withdraw preview */}
        {step === "preview" && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold tracking-tight">
              Withdraw preview
            </h2>
            <div className="flex flex-col items-center gap-3">
              <span className="relative flex size-16 items-center justify-center rounded-full bg-[#f7931a] text-3xl font-bold text-white">
                ₿
                <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowDown className="size-3.5" />
                </span>
              </span>
              <p className="text-3xl font-bold text-success">+0.0065</p>
              <p className="text-sm text-muted-foreground">$296.95</p>
            </div>
            <div className="border-t border-border pt-2">
              {[
                ["Date", "Aug 14, 2025 at 10:30 pm"],
                ["Status", "Succeeded"],
                ["From", "A3847….9dkf7"],
                ["Network", "Bitcoin"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-3 text-[15px]"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <NextButton onClick={() => setStep("alert")} />
          </div>
        )}

        {/* STEP 5 — price alert */}
        {step === "alert" && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold tracking-tight">
              Price alert
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-4">
                <span className="font-semibold">Enable BTC price alert</span>
                <Switch checked={alertOn} onCheckedChange={setAlertOn} />
              </div>
              <p className="px-1 text-sm text-muted-foreground">
                Get notified of price changes for Bitcoin.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm font-medium"
              >
                24h % <ChevronDown className="size-4" />
              </button>
            </div>
            <NextButton onClick={() => setStep("otp")} />
          </div>
        )}

        {/* STEP 6 — OTP */}
        {step === "otp" && (
          <div className="space-y-5">
            <h2 className="pr-6 text-xl font-bold leading-snug tracking-tight">
              Enter the 6 digit code texted to +91 *********
            </h2>
            <p className="text-[15px] text-muted-foreground">
              A 6 digit code has been sent to{" "}
              <span className="font-semibold text-foreground">
                +91 776277662
              </span>{" "}
              Please enter it within the next 30 minutes.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Verification code</p>
              <OtpInput value={code} onChange={setCode} />
            </div>
            <Button
              size="lg"
              onClick={confirmOtp}
              disabled={code.length < 6}
              className="w-full disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
            >
              {code.length < 6 ? "Resend Code" : "Confirm"}
            </Button>
            <button
              type="button"
              className="w-full text-center text-[15px] font-semibold transition-colors hover:text-muted-foreground"
            >
              Try another way
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="relative flex size-16 items-center justify-center rounded-full bg-[#f7931a] text-3xl font-bold text-white">
              ₿
              <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-success text-white">
                <ArrowDown className="size-3.5" />
              </span>
            </span>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Withdrawal requested</p>
              <p className="text-sm text-muted-foreground">
                +0.0065 BTC is on its way to your wallet.
              </p>
            </div>
            <Button size="lg" className="w-full" onClick={() => close(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
