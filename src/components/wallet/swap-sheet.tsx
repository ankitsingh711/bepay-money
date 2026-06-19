"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpDown,
  Check,
  ChevronDown,
  History,
  Plus,
  Search,
  Settings2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Asset {
  sym: string;
  label: string;
  chain: string;
  tag: string;
  balance: number;
  fiat: string;
  color: string;
  glyph: string;
  usd: number;
}

const ASSETS: Asset[] = [
  { sym: "BTC", label: "BTC", chain: "Bitcoin", tag: "Bitcoin", balance: 0.25, fiat: "$1190", color: "#f7931a", glyph: "₿", usd: 60000 },
  { sym: "USDT", label: "USDT (ERC 20)", chain: "Ethereum", tag: "ERC20", balance: 200, fiat: "$200", color: "#26a17b", glyph: "₮", usd: 1 },
  { sym: "ETH", label: "Etherium", chain: "Ethereum", tag: "ERC20", balance: 0.08, fiat: "$1190", color: "#1f1f1f", glyph: "Ξ", usd: 2127 },
  { sym: "TON", label: "TON", chain: "TON", tag: "TON", balance: 0.25, fiat: "$1190", color: "#0098ea", glyph: "T", usd: 5 },
  { sym: "XRP", label: "XRP", chain: "XRPL", tag: "XRPL", balance: 0.25, fiat: "$1190", color: "#111111", glyph: "✕", usd: 0.5 },
  { sym: "USDC", label: "USDC", chain: "Solana", tag: "Solana", balance: 0.25, fiat: "$1190", color: "#2775ca", glyph: "$", usd: 1 },
  { sym: "HBAR", label: "HBAR", chain: "Hedera hashgraph", tag: "Hedera", balance: 0.25, fiat: "$1190", color: "#000000", glyph: "ℏ", usd: 0.07 },
];

const CHAINS = ["All", "Bitcoin", "Ethereum", "Solana", "TON"];

function decimals(sym: string) {
  return sym === "BTC" ? 6 : sym === "ETH" ? 4 : 2;
}
function convert(amount: number, from: Asset, to: Asset) {
  if (!amount) return 0;
  return (amount * from.usd) / to.usd;
}
function fmt(n: number, sym: string) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals(sym),
  });
}

function AssetIcon({ asset, size = 40 }: { asset: Asset; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ backgroundColor: asset.color, width: size, height: size, fontSize: size * 0.45 }}
    >
      {asset.glyph}
    </span>
  );
}

type View = "form" | "tokensFrom" | "tokensTo" | "history";
const SLIPPAGES = ["1%", "2%", "3%", "5%"];

export function SwapSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [view, setView] = React.useState<View>("form");
  const [from, setFrom] = React.useState<Asset>(ASSETS[1]); // USDT
  const [to, setTo] = React.useState<Asset>(ASSETS[2]); // ETH
  const [amount, setAmount] = React.useState("10");

  const [tokenSearch, setTokenSearch] = React.useState("");
  const [chain, setChain] = React.useState("All");

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [count, setCount] = React.useState(7);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [slipOpen, setSlipOpen] = React.useState(false);
  const [customSlipOpen, setCustomSlipOpen] = React.useState(false);
  const [slippage, setSlippage] = React.useState("2%");
  const [customSlip, setCustomSlip] = React.useState("30%");

  const childOpen =
    confirmOpen || successOpen || detailsOpen || slipOpen || customSlipOpen;

  const toAmount = convert(Number(amount) || 0, from, to);
  const rate = convert(1, from, to);

  // confirmation countdown (display only)
  React.useEffect(() => {
    if (!confirmOpen || count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [confirmOpen, count]);

  function reset() {
    setView("form");
    setFrom(ASSETS[1]);
    setTo(ASSETS[2]);
    setAmount("10");
    setTokenSearch("");
    setChain("All");
    setConfirmOpen(false);
    setSuccessOpen(false);
    setDetailsOpen(false);
  }
  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 250);
  }
  function requestClose() {
    if (view !== "form") setView("form");
    else close(false);
  }

  function flip() {
    setFrom(to);
    setTo(from);
  }

  function pickToken(a: Asset) {
    if (view === "tokensFrom") {
      setFrom(a);
      if (a.sym === to.sym) setTo(from);
    } else {
      setTo(a);
      if (a.sym === from.sym) setFrom(to);
    }
    setView("form");
  }

  const filteredTokens = ASSETS.filter(
    (a) =>
      (chain === "All" || a.chain === chain) &&
      (a.sym.toLowerCase().includes(tokenSearch.toLowerCase()) ||
        a.label.toLowerCase().includes(tokenSearch.toLowerCase())),
  );

  return (
    <>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) requestClose();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onInteractOutside={(e) => {
              e.preventDefault();
              if (!childOpen) requestClose();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              if (!childOpen) requestClose();
            }}
            className="fixed inset-y-0 right-0 z-40 flex h-full w-full max-w-md flex-col rounded-l-[2rem] bg-card shadow-2xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right"
          >
            <DialogPrimitive.Title className="sr-only">Swap</DialogPrimitive.Title>

            {view === "form" && (
              <FormView
                from={from}
                to={to}
                amount={amount}
                toAmount={fmt(toAmount, to.sym)}
                rate={`1 ${from.sym} = ${rate.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${to.sym}`}
                onAmount={(v) => setAmount(v.replace(/[^\d.]/g, ""))}
                onFromToken={() => setView("tokensFrom")}
                onToToken={() => setView("tokensTo")}
                onFlip={flip}
                onMin={() => setAmount("1")}
                onHalf={() => setAmount(String(from.balance / 2))}
                onMax={() => setAmount(String(from.balance))}
                onHistory={() => setView("history")}
                onSettings={() => setSlipOpen(true)}
                onContinue={() => {
                  setCount(7);
                  setConfirmOpen(true);
                }}
              />
            )}

            {(view === "tokensFrom" || view === "tokensTo") && (
              <TokensView
                direction={view === "tokensFrom" ? "from" : "to"}
                search={tokenSearch}
                onSearch={setTokenSearch}
                chain={chain}
                onChain={setChain}
                tokens={filteredTokens}
                onBack={() => setView("form")}
                onSelect={pickToken}
              />
            )}

            {view === "history" && <HistoryView onBack={() => setView("form")} />}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* swap confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md gap-5" hideClose>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              aria-label="Back"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </button>
            <DialogTitle className="text-base font-semibold">
              Swap confirmation
            </DialogTitle>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <div className="flex items-stretch gap-3">
            <SwapSideCard label="From" asset={from} value={`${amount} ${from.sym}`} />
            <div className="flex items-center">
              <ArrowRight className="size-5 text-muted-foreground" />
            </div>
            <SwapSideCard
              label="To"
              asset={to}
              value={`${fmt(toAmount, to.sym)} ${to.sym}`}
            />
          </div>

          <div className="space-y-3 border-t border-border pt-4 text-sm">
            <Row label="Path/provider" value="Bridgers" />
            <Row label="Fee" value="$1.35" />
            <Row
              label="Est. receive amount"
              value={<b>{fmt(toAmount * 0.98, to.sym)} {to.sym}</b>}
            />
            <Row label="Est. complete time" value="1-3 min" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="h-12 flex-1 rounded-full border border-border text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmOpen(false);
                setSuccessOpen(true);
              }}
              className="h-12 flex-1 rounded-full bg-foreground text-sm font-medium text-background hover:opacity-90"
            >
              Confirmation ({count}s)
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* successfully converted */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md" hideClose>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              aria-label="Back"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-9" strokeWidth={3} />
            </span>
            <DialogTitle className="text-xl font-bold">
              Successfully converted
            </DialogTitle>
            <button
              type="button"
              onClick={() => {
                setSuccessOpen(false);
                setDetailsOpen(true);
              }}
              className="text-sm font-medium underline underline-offset-2"
            >
              View details
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccessOpen(false);
                close(false);
              }}
              className="mt-2 h-14 w-full rounded-full bg-foreground text-base font-medium text-background hover:opacity-90"
            >
              Awesome
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* transaction details */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md gap-5" hideClose>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              aria-label="Back"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <div className="text-center">
            <DialogTitle className="text-2xl font-bold">
              +{fmt(toAmount, to.sym)} {to.label}
            </DialogTitle>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-success text-white">
                <Check className="size-2.5" strokeWidth={4} />
              </span>
              Completed
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold">Transaction details</p>
            <div className="space-y-3 text-sm">
              <Row label="Type" value="Convert" />
              <Row label="Payment amount" value={`-${amount}.00 ${from.sym}`} />
              <Row
                label="Receive amount"
                value={<b>{fmt(toAmount * 0.98, to.sym)} {to.sym}</b>}
              />
              <Row label="Created on" value="2025-07-08  16:26:56" />
            </div>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setDetailsOpen(false);
                reset();
              }}
              className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background hover:opacity-90"
            >
              Convert again
            </button>
            <button
              type="button"
              onClick={() => {
                setDetailsOpen(false);
                close(false);
              }}
              className="h-14 w-full rounded-full border border-border text-base font-medium hover:bg-muted"
            >
              Back to wallet
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* slippage tolerance */}
      <Dialog open={slipOpen} onOpenChange={setSlipOpen}>
        <DialogContent className="max-w-md gap-5">
          <DialogTitle className="text-center text-base font-semibold">
            Slippage tolerance
          </DialogTitle>
          <div className="flex flex-wrap gap-2">
            {SLIPPAGES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSlippage(s);
                  setSlipOpen(false);
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  slippage === s ? "bg-foreground text-background" : "bg-muted hover:bg-muted/70",
                )}
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSlipOpen(false);
                setCustomSlipOpen(true);
              }}
              className="rounded-xl bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/70"
            >
              Custom
            </button>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Setting a higher slippage can help your trade go through, but you may
            not get the best price. Please use with caution.
          </p>
        </DialogContent>
      </Dialog>

      {/* custom slippage */}
      <Dialog open={customSlipOpen} onOpenChange={setCustomSlipOpen}>
        <DialogContent className="max-w-md gap-5" hideClose>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setCustomSlipOpen(false);
                setSlipOpen(true);
              }}
              aria-label="Back"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </button>
            <DialogTitle className="text-base font-semibold">
              Set custom slippage tolerance
            </DialogTitle>
            <button
              type="button"
              onClick={() => setCustomSlipOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <input
            value={customSlip}
            onChange={(e) => setCustomSlip(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border px-4 text-sm outline-none focus-visible:border-ring"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Setting a higher slippage can help your trade go through, but you may
            not get the best price. Please use with caution.
          </p>
          <button
            type="button"
            onClick={() => {
              setSlippage(customSlip);
              setCustomSlipOpen(false);
            }}
            className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background hover:opacity-90"
          >
            Save
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function SwapSideCard({
  label,
  asset,
  value,
}: {
  label: string;
  asset: Asset;
  value: string;
}) {
  return (
    <div className="flex-1 rounded-2xl bg-muted/50 p-4">
      <AssetIcon asset={asset} size={28} />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function FormView({
  from,
  to,
  amount,
  toAmount,
  rate,
  onAmount,
  onFromToken,
  onToToken,
  onFlip,
  onMin,
  onHalf,
  onMax,
  onHistory,
  onSettings,
  onContinue,
}: {
  from: Asset;
  to: Asset;
  amount: string;
  toAmount: string;
  rate: string;
  onAmount: (v: string) => void;
  onFromToken: () => void;
  onToToken: () => void;
  onFlip: () => void;
  onMin: () => void;
  onHalf: () => void;
  onMax: () => void;
  onHistory: () => void;
  onSettings: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-7 pb-2 pt-7">
        <h2 className="text-2xl font-bold tracking-tight">Swap</h2>
        <button
          type="button"
          onClick={onHistory}
          aria-label="History"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <History className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-4">
        <div className="relative space-y-2">
          {/* from */}
          <div className="rounded-3xl bg-muted/50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">From</span>
              <span className="text-muted-foreground">
                Available Bal:{" "}
                <span className="font-semibold text-foreground">
                  {from.balance} {from.sym}
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={onFromToken}
                className="flex items-center gap-2.5"
              >
                <AssetIcon asset={from} size={36} />
                <span className="text-left leading-tight">
                  <span className="block font-bold">{from.sym}</span>
                  <span className="block text-xs text-muted-foreground">
                    ({from.tag})
                  </span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              <input
                value={amount}
                inputMode="decimal"
                onChange={(e) => onAmount(e.target.value)}
                className="w-28 bg-transparent text-right text-3xl font-bold outline-none"
                aria-label="From amount"
              />
            </div>
            <div className="mt-3 flex justify-end gap-4 text-xs font-medium text-muted-foreground">
              <button type="button" onClick={onMin} className="hover:text-foreground">
                MIN
              </button>
              <button type="button" onClick={onHalf} className="hover:text-foreground">
                50%
              </button>
              <button type="button" onClick={onMax} className="hover:text-foreground">
                MAX
              </button>
            </div>
          </div>

          {/* flip */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={onFlip}
              aria-label="Switch tokens"
              className="flex size-10 items-center justify-center rounded-full border-4 border-card bg-muted text-foreground shadow-sm hover:bg-muted/70"
            >
              <ArrowUpDown className="size-4" />
            </button>
          </div>

          {/* to */}
          <div className="rounded-3xl bg-muted/50 p-5">
            <span className="text-sm text-muted-foreground">To</span>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={onToToken}
                className="flex items-center gap-2.5"
              >
                <AssetIcon asset={to} size={36} />
                <span className="text-left leading-tight">
                  <span className="block font-bold">{to.sym}</span>
                  <span className="block text-xs text-muted-foreground">
                    ({to.tag})
                  </span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              <span className="text-3xl font-bold">{toAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium"
          >
            My xyz wallet <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onSettings}
            aria-label="Slippage settings"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="size-5" />
          </button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{rate}</p>
      </div>

      <div className="px-7 pb-8 pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </>
  );
}

function TokensView({
  direction,
  search,
  onSearch,
  chain,
  onChain,
  tokens,
  onBack,
  onSelect,
}: {
  direction: "from" | "to";
  search: string;
  onSearch: (v: string) => void;
  chain: string;
  onChain: (c: string) => void;
  tokens: Asset[];
  onBack: () => void;
  onSelect: (a: Asset) => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between px-7 pb-3 pt-7">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 mt-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-2xl font-bold leading-tight tracking-tight">
            Select a token to swap {direction}
          </h2>
        </div>
        <History className="mt-1 size-5 shrink-0 text-muted-foreground" />
      </div>

      <div className="px-7 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center gap-2 rounded-full border border-border px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name or contract address"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="button"
            aria-label="Add token"
            className="flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {CHAINS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChain(c)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  chain === c
                    ? "border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <ArrowRightLeft className="size-5 shrink-0 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-7 pb-8">
        {tokens.map((a) => (
          <button
            key={a.sym}
            type="button"
            onClick={() => onSelect(a)}
            className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-0 hover:bg-muted/40"
          >
            <AssetIcon asset={a} />
            <span className="flex-1">
              <span className="block font-semibold">{a.label}</span>
              <span className="block text-sm text-muted-foreground">{a.chain}</span>
            </span>
            <span className="text-right">
              <span className="block font-semibold">{a.balance}</span>
              <span className="block text-sm text-muted-foreground">{a.fiat}</span>
            </span>
          </button>
        ))}
        {tokens.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No tokens found
          </p>
        )}
      </div>
    </>
  );
}

function HistoryView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 px-7 pb-3 pt-7">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="-ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-2xl font-bold tracking-tight">History</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-7 pb-8">
        {[
          { date: "Tue, Jul 8" },
          { date: "Fri, June 29" },
        ].map((g) => (
          <div key={g.date} className="mt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {g.date}
            </p>
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ArrowRightLeft className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">Convert</span>
                <span className="block text-xs text-muted-foreground">16:26:56</span>
              </span>
              <span className="text-right">
                <span className="block font-semibold text-success">+0.0046 ETH</span>
                <span className="block text-xs text-muted-foreground">-10.00 USDT</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
