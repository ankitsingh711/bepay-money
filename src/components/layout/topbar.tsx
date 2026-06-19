"use client";

import * as React from "react";
import { Bell, Menu, Search, Wallet } from "lucide-react";
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

      <h1 className="shrink-0 text-xl font-semibold tracking-tight">{title}</h1>

      <div className="relative ml-3 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          placeholder="Search for anything"
          className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/25 focus-visible:outline-none"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <label className="hidden items-center gap-2 text-sm text-white/70 sm:flex">
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
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-warning" />
        </button>

        <Button
          variant="secondary"
          className="hidden rounded-full bg-white text-foreground hover:bg-white/90 sm:inline-flex"
          onClick={() => setWithdrawOpen(true)}
        >
          <Wallet />
          Withdraw
        </Button>
      </div>

      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </header>
  );
}
