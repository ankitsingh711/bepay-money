"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Link2,
  Wallet as WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/queries";
import { formatUsd } from "@/lib/format";
import { SendSheet } from "@/components/wallet/send-sheet";
import { ReceiveDialog } from "@/components/wallet/receive-dialog";
import { SwapSheet } from "@/components/wallet/swap-sheet";

type ActionKey = "send" | "receive" | "pay" | "swap";

const ACTIONS: { key: ActionKey; label: string; icon: LucideIcon }[] = [
  { key: "send", label: "Send", icon: ArrowUpRight },
  { key: "receive", label: "Recieve", icon: ArrowDownLeft },
  { key: "pay", label: "Pay Link", icon: Link2 },
  { key: "swap", label: "Swap", icon: ArrowLeftRight },
];

export function AccountInfo() {
  const router = useRouter();
  const { data: wallet, isLoading } = useWallet();
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState<ActionKey | null>(null);

  const balance = wallet ? Number(wallet.balance) : 0;

  function trigger(key: ActionKey) {
    if (key === "pay") {
      router.push("/payment-links/new");
      return;
    }
    setOpen(key);
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">My Account Info</h2>

      {/* balance block with faint grid */}
      <div
        className="mt-4 flex flex-col items-center rounded-2xl py-6"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Arshi’s Wallets balance</span>
          <WalletIcon className="size-4" />
          <button
            type="button"
            onClick={() => setHidden((h) => !h)}
            aria-label={hidden ? "Show balance" : "Hide balance"}
            className="transition-colors hover:text-foreground"
          >
            {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {isLoading ? (
          <Skeleton className="mt-3 h-12 w-72" />
        ) : (
          <p className="mt-2 text-5xl font-bold tracking-tight">
            {hidden ? "$ ••••••" : formatUsd(balance, 2)}
          </p>
        )}

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Today
          <span className="size-1.5 rounded-full bg-success" />
          $2.56
        </span>

        {/* actions */}
        <div className="mt-6 grid w-full grid-cols-2 gap-3 px-2 sm:grid-cols-4 sm:px-6">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => trigger(a.key)}
                className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-muted/60 px-4 py-4 text-[15px] font-medium shadow-sm transition-colors hover:bg-muted"
              >
                {a.label}
                <Icon className="size-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      <SendSheet open={open === "send"} onOpenChange={(o) => !o && setOpen(null)} />
      <ReceiveDialog
        open={open === "receive"}
        onOpenChange={(o) => !o && setOpen(null)}
      />
      <SwapSheet open={open === "swap"} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  );
}
