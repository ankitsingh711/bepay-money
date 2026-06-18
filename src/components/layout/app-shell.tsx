"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarNav } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

function deriveTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  if (pathname === "/payment-links/new") return "Create Payment Link";
  if (pathname.startsWith("/payment-links")) return "Payment Links";
  if (pathname.startsWith("/payments")) return "Payment History";
  if (pathname.startsWith("/settings")) return "Settings";
  return "bepay";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = deriveTitle(pathname);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-sidebar">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarNav collapsed={collapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />

        {/* white content panel */}
        <main className="relative flex-1 px-2 pb-2 sm:px-3 sm:pb-3">
          {/* collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute left-0 top-6 z-20 hidden size-7 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>

          <div className="min-h-[calc(100vh-5rem)] rounded-3xl bg-card px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
