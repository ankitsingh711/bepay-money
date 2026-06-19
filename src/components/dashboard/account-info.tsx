"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wallet as WalletIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/queries";
import { formatUsd } from "@/lib/format";
import { SendSheet } from "@/components/wallet/send-sheet";
import { ReceiveDialog } from "@/components/wallet/receive-dialog";
import { SwapSheet } from "@/components/wallet/swap-sheet";

type ActionKey = "send" | "receive" | "pay" | "swap";

const ACTIONS: { key: ActionKey; label: string; icon: string }[] = [
  { key: "send", label: "Send", icon: "/dashboard-button/send.png" },
  { key: "receive", label: "Recieve", icon: "/dashboard-button/receive.png" },
  { key: "pay", label: "Pay Link", icon: "/dashboard-button/pay-link.png" },
  { key: "swap", label: "Swap", icon: "/dashboard-button/swap.png" },
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
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => trigger(a.key)}
              className="flex items-center justify-between gap-2 whitespace-nowrap rounded-2xl bg-muted/70 px-4 py-4 text-[17px] font-medium text-foreground shadow-sm ring-1 ring-black/[0.03] transition-colors hover:bg-muted"
            >
              {a.label}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.icon}
                alt=""
                aria-hidden
                className="size-7 shrink-0 object-contain"
              />
            </button>
          ))}
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
