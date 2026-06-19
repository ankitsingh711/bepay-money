"use client";

import { use } from "react";
import * as React from "react";
import { Check, ChevronDown, Copy, Grip, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCode } from "@/components/payment-links/qr-code";
import { Brand } from "@/components/layout/brand";
import { usePaymentLink } from "@/hooks/queries";
import { useBrand } from "@/hooks/use-brand";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const ASSETS = [
  { id: "BTC", label: "BTC", network: "Bitcoin network", color: "#f7931a" },
  { id: "ETH", label: "Etherium", network: "Ethereum network", color: "#627eea" },
  { id: "SOL", label: "Solana", network: "Solana network", color: "#111" },
  { id: "TON", label: "TON", network: "TON network", color: "#0098ea" },
];

const DEPOSIT_ADDRESS = "0xdwdhwhdwhysuwyhduhwhxbhjabvxhsaghxahw827w8";

type Stage = "choose" | "deposit" | "success";

export default function PublicPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = usePaymentLink(id);
  const brand = useBrand();

  const [stage, setStage] = React.useState<Stage>("choose");
  const [asset, setAsset] = React.useState(ASSETS[0]);
  const [assetOpen, setAssetOpen] = React.useState(false);
  const [depositTab, setDepositTab] = React.useState<"address" | "amount">(
    "address",
  );
  const [sendAmount, setSendAmount] = React.useState("0.08");
  const [confirming, setConfirming] = React.useState(false);

  const amountLabel = data
    ? `0.000005678 ${data.currency}`
    : "0.000005678 USDC";

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard!");
  }

  function confirmDeposit() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setStage("success");
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-sidebar p-3 sm:p-5">
      <div className="relative grid min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#15181f] to-black sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2">
        {/* LEFT — brand */}
        <div className="relative flex flex-col justify-between p-8 sm:p-12">
          <Brand />
          <CubeArt />
          <div className="relative z-10 max-w-md space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {brand.tagline}
            </h1>
            <p className="text-sm leading-relaxed text-white/55">
              Join us in reshaping the future of finance where security,
              flexibility, and inclusivity are at the core of everything we do.
            </p>
          </div>
        </div>

        {/* RIGHT — widget */}
        <div className="relative z-10 flex items-center justify-center p-6 sm:p-10">
          {isLoading ? (
            <div className="w-full max-w-sm space-y-4">
              <Skeleton className="h-20 rounded-2xl bg-white/10" />
              <Skeleton className="h-80 rounded-2xl bg-white/10" />
            </div>
          ) : isError || !data ? (
            <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center">
              <XCircle className="size-10 text-danger" />
              <p className="font-semibold">Payment link not found</p>
              <p className="text-sm text-muted-foreground">
                This link may have been removed or the URL is incorrect.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-3">
              <StepIndicator stage={stage} />

              <div className="rounded-[1.75rem] bg-card p-5 shadow-xl sm:p-6">
                {/* widget tabs */}
                <div className="mb-5 grid grid-cols-2 gap-3 text-sm font-medium">
                  <div className="space-y-2">
                    <span
                      className={
                        stage === "choose"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      Choose Assets
                    </span>
                    <div className="h-1 rounded-full bg-foreground" />
                  </div>
                  <div className="space-y-2">
                    <span
                      className={
                        stage !== "choose"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      Send Deposits
                    </span>
                    <div
                      className={cn(
                        "h-1 rounded-full",
                        stage !== "choose" ? "bg-foreground" : "bg-muted",
                      )}
                    />
                  </div>
                </div>

                {stage === "choose" && (
                  <ChooseAssets
                    asset={asset}
                    open={assetOpen}
                    onToggle={() => setAssetOpen((o) => !o)}
                    onSelect={(a) => {
                      setAsset(a);
                      setAssetOpen(false);
                    }}
                    amountLabel={amountLabel}
                    onNext={() => setStage("deposit")}
                  />
                )}

                {stage === "deposit" && (
                  <SendDeposit
                    tab={depositTab}
                    onTab={setDepositTab}
                    amountLabel={amountLabel}
                    fiat={`- ${formatMoney(data.amount, data.currency, { withSymbol: false })}`}
                    sendAmount={sendAmount}
                    onSendAmount={setSendAmount}
                    currency={data.currency}
                    onCopy={copy}
                    onNext={confirmDeposit}
                    confirming={confirming}
                  />
                )}

                {stage === "success" && (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <span className="flex size-16 items-center justify-center rounded-full bg-success-bg text-success-fg">
                      <Check className="size-8" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xl font-bold">Payment received</p>
                      <p className="text-sm text-muted-foreground">
                        {formatMoney(data.amount, data.currency)} paid to{" "}
                        {brand.businessName}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ stage }: { stage: Stage }) {
  const s1Done = true;
  const s2Done = stage === "success";
  const s3Done = stage === "success";
  return (
    <div className="relative rounded-[1.5rem] bg-card p-5 shadow-xl">
      <div className="flex items-start justify-between">
        {[
          { n: "STEP 1", label: "Waiting", done: s1Done, current: stage === "choose" },
          { n: "STEP 2", label: "Processing", done: s2Done, current: stage === "deposit" },
          { n: "STEP 3", label: "Success", done: s3Done, current: false },
        ].map((step, i) => (
          <React.Fragment key={step.n}>
            <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full",
                  step.done
                    ? "bg-foreground text-background"
                    : step.current
                      ? "bg-muted text-foreground"
                      : "border-2 border-border text-muted-foreground",
                )}
              >
                {step.done ? (
                  <Check className="size-4" />
                ) : step.current ? (
                  <Grip className="size-3.5" />
                ) : null}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {step.n}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  step.done || step.current
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < 2 && (
              <div className="mt-3.5 h-0.5 flex-1 rounded-full bg-border">
                <div
                  className={cn(
                    "h-full rounded-full bg-foreground transition-all",
                    (i === 0 && stage !== "choose") || s2Done
                      ? "w-full"
                      : "w-0",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* pointer */}
      <div className="absolute -bottom-2 left-1/3 size-4 -translate-x-1/2 rotate-45 bg-card" />
    </div>
  );
}

function AssetIcon({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {label.charAt(0)}
    </span>
  );
}

function ChooseAssets({
  asset,
  open,
  onToggle,
  onSelect,
  amountLabel,
  onNext,
}: {
  asset: (typeof ASSETS)[number];
  open: boolean;
  onToggle: () => void;
  onSelect: (a: (typeof ASSETS)[number]) => void;
  amountLabel: string;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-14 w-full items-center justify-between rounded-2xl border border-border px-4"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <AssetIcon color={asset.color} label={asset.label} />
            {asset.label} ({asset.network})
          </span>
          <ChevronDown className="size-5 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-lg">
            {ASSETS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors",
                  a.id === asset.id
                    ? "bg-foreground text-background"
                    : "hover:bg-muted",
                )}
              >
                <AssetIcon color={a.color} label={a.label} />
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Amount to pay</p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
          {amountLabel}
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="h-12 w-full rounded-full bg-muted text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        Next
      </button>
    </div>
  );
}

function SendDeposit({
  tab,
  onTab,
  amountLabel,
  fiat,
  sendAmount,
  onSendAmount,
  currency,
  onCopy,
  onNext,
  confirming,
}: {
  tab: "address" | "amount";
  onTab: (t: "address" | "amount") => void;
  amountLabel: string;
  fiat: string;
  sendAmount: string;
  onSendAmount: (v: string) => void;
  currency: string;
  onCopy: (t: string) => void;
  onNext: () => void;
  confirming: boolean;
}) {
  return (
    <div className="space-y-5">
      {/* sub-tabs */}
      <div className="mx-auto flex w-fit rounded-full bg-muted p-1 text-sm font-medium">
        {(["address", "amount"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTab(t)}
            className={cn(
              "rounded-full px-5 py-2 transition-colors",
              tab === t ? "bg-foreground text-background" : "text-muted-foreground",
            )}
          >
            {t === "address" ? "Address" : "With Amount"}
          </button>
        ))}
      </div>

      {tab === "address" ? (
        <>
          <div className="flex justify-center">
            <QrCode value={DEPOSIT_ADDRESS} size={150} className="border-0 p-0" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount to pay</span>
              <span className="font-medium text-danger-fg">{fiat}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-bold">{amountLabel}</span>
              <button
                type="button"
                onClick={() => onCopy(amountLabel)}
                aria-label="Copy amount"
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Address</p>
            <div className="flex items-start justify-between gap-2">
              <span className="break-all font-mono text-sm">
                {DEPOSIT_ADDRESS}
              </span>
              <button
                type="button"
                onClick={() => onCopy(DEPOSIT_ADDRESS)}
                aria-label="Copy address"
                className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4 py-2">
          <div className="flex items-end justify-center gap-2">
            <input
              value={sendAmount}
              onChange={(e) =>
                onSendAmount(e.target.value.replace(/[^\d.]/g, ""))
              }
              className="w-32 bg-transparent text-right text-5xl font-bold tracking-tight outline-none"
              aria-label="Amount to send"
            />
            <span className="pb-2 text-lg font-medium text-muted-foreground">
              {currency}
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Enter the amount you wish to send
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={confirming}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-70"
      >
        {confirming && <Loader2 className="size-4 animate-spin" />}
        {confirming ? "Processing…" : "Next"}
      </button>
    </div>
  );
}

function CubeArt() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-90">
      <svg
        viewBox="0 0 300 300"
        className="h-[60%] max-h-[460px] w-auto"
        fill="none"
      >
        <defs>
          <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a3f49" />
            <stop offset="100%" stopColor="#23272f" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1f26" />
            <stop offset="100%" stopColor="#0f1116" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#272b33" />
            <stop offset="100%" stopColor="#15181e" />
          </linearGradient>
        </defs>
        {/* top */}
        <path d="M150 40 260 100 150 160 40 100Z" fill="url(#cubeTop)" stroke="#000" strokeOpacity="0.3" />
        {/* left */}
        <path d="M40 100 150 160 150 280 40 220Z" fill="url(#cubeLeft)" stroke="#000" strokeOpacity="0.3" />
        {/* right */}
        <path d="M260 100 150 160 150 280 260 220Z" fill="url(#cubeRight)" stroke="#000" strokeOpacity="0.3" />
        {/* subtle grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <path
            key={t}
            d={`M${40 + (150 - 40) * t} ${100 + (160 - 100) * t} ${260 - (260 - 150) * t} ${100 + (160 - 100) * t}`}
            stroke="#fff"
            strokeOpacity="0.04"
          />
        ))}
      </svg>
    </div>
  );
}
