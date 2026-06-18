"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar";
import { Topbar } from "./topbar";

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

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
