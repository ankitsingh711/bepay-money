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

export function Topbar({ title }: { title: string }) {
  const [sandbox, setSandbox] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 max-w-[80vw] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="shrink-0 text-lg font-semibold tracking-tight">{title}</h1>

      <div className="relative ml-2 hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search for anything"
          className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <label className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <span>Sandbox</span>
          <Switch
            checked={sandbox}
            onCheckedChange={setSandbox}
            aria-label="Toggle sandbox mode"
          />
        </label>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-danger" />
        </Button>

        <Button className="hidden sm:inline-flex" size="sm">
          <Wallet />
          Withdraw
        </Button>

        <div
          className="size-9 shrink-0 rounded-full bg-gradient-to-br from-chart-3 to-chart-1"
          aria-hidden
        />
      </div>
    </header>
  );
}
