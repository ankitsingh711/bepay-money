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
  if (pathname.startsWith("/wallet")) return "Dashboard";
  return "bepay";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = deriveTitle(pathname);
  const [collapsed, setCollapsed] = React.useState(false);
  // Settings owns its own surface (dark sub-nav + white content), so render it
  // edge-to-edge inside the rounded panel.
  const fullBleed =
    pathname.startsWith("/settings") || pathname.startsWith("/wallet");

  return (
    <div className="flex min-h-screen bg-sidebar">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarNav collapsed={collapsed} />

        {/* collapse toggle — anchored to the sidebar's right edge */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-1/2 z-40 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />

        {/* white content panel */}
        <main className="flex-1 px-2 pb-2 sm:px-3 sm:pb-3">
          <div
            className={cn(
              "min-h-[calc(100vh-5rem)] overflow-hidden rounded-3xl bg-card",
              !fullBleed && "px-4 py-6 sm:px-6 lg:px-8",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
