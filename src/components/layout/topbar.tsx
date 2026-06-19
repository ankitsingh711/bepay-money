"use client";

import * as React from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar";
import { WithdrawDialog } from "@/components/wallet/withdraw-dialog";

export function Topbar({ title }: { title: string }) {
  const [sandbox, setSandbox] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-sidebar px-4 text-white sm:px-6">
      {/* mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 max-w-[80vw] bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="shrink-0 text-2xl font-bold tracking-tight">{title}</h1>

      <div className="ml-4 hidden max-w-xl flex-1 md:block">
        <input
          type="search"
          placeholder="Search for anything"
          className="h-12 w-full rounded-full border border-white/15 bg-transparent px-6 text-[15px] text-white placeholder:text-white/45 focus-visible:border-white/35 focus-visible:outline-none"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <label className="hidden items-center gap-2.5 text-[15px] font-semibold text-white sm:flex">
          <span>Sandbox</span>
          <Switch
            checked={sandbox}
            onCheckedChange={setSandbox}
            aria-label="Toggle sandbox mode"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <Bell className="size-6" />
          <span className="absolute right-2 top-2 size-2.5 rounded-full bg-warning ring-2 ring-sidebar" />
        </button>

        <Button
          variant="secondary"
          size="lg"
          className="hidden rounded-full border-0 bg-white px-6 text-foreground hover:bg-white/90 sm:inline-flex"
          onClick={() => setWithdrawOpen(true)}
        >
          <WithdrawIcon />
          Withdraw
        </Button>
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </header>
  );
}

/** Banknote with an up-arrow — the withdraw / cash-out glyph. */
function WithdrawIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="6"
        width="19"
        height="12"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 14.5V9.5M12 9.5 9.8 11.7M12 9.5l2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
