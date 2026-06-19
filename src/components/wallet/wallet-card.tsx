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
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/queries";
import { formatMoney } from "@/lib/money";
import { truncateMiddle } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SendDialog } from "./send-dialog";
import { ReceiveDialog } from "./receive-dialog";
import { SwapSheet } from "./swap-sheet";

type ActionKey = "send" | "receive" | "pay" | "swap";

const ACTIONS: { key: ActionKey; label: string; icon: LucideIcon }[] = [
  { key: "send", label: "Send", icon: ArrowUpRight },
  { key: "receive", label: "Receive", icon: ArrowDownLeft },
  { key: "pay", label: "Pay Link", icon: Link2 },
  { key: "swap", label: "Swap", icon: ArrowLeftRight },
];

export function WalletCard() {
  const router = useRouter();
  const { data: wallet, isLoading } = useWallet();
  const [open, setOpen] = React.useState<ActionKey | null>(null);
  const [hidden, setHidden] = React.useState(false);

  function trigger(key: ActionKey) {
    if (key === "pay") {
      router.push("/payment-links/new");
      return;
    }
    setOpen(key);
  }

  return (
    <Card className="overflow-hidden bg-sidebar p-6 text-white">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">My account balance</p>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          className="text-white/60 transition-colors hover:text-white"
          aria-label={hidden ? "Show balance" : "Hide balance"}
        >
          {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      <div className="mt-2">
        {isLoading || !wallet ? (
          <Skeleton className="h-9 w-56 bg-white/10" />
        ) : (
          <p className="text-3xl font-semibold tracking-tight">
            {hidden ? "••••••" : formatMoney(wallet.balance, wallet.currency)}
          </p>
        )}
        {wallet && (
          <p className="mt-1 font-mono text-xs text-white/40">
            {truncateMiddle(wallet.address, 8, 6)}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.key}
              type="button"
              onClick={() => trigger(a.key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 transition-colors hover:bg-white/10",
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          );
        })}
      </div>

      <SendDialog open={open === "send"} onOpenChange={(o) => !o && setOpen(null)} />
      <ReceiveDialog
        open={open === "receive"}
        onOpenChange={(o) => !o && setOpen(null)}
      />
      <SwapSheet open={open === "swap"} onOpenChange={(o) => !o && setOpen(null)} />
    </Card>
  );
}
