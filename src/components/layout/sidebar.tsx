"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "./brand";
import { NAV_ITEMS } from "./nav-config";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function isActive(pathname: string, item: (typeof NAV_ITEMS)[number]) {
  if (item.match) return item.match(pathname);
  return pathname === item.href;
}

export function SidebarNav({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useAuth();

  function handleLogout() {
    signOut();
    onNavigate?.();
    toast.success("Logged out");
    router.replace("/login");
  }

  return (
    <div className="flex h-full flex-col text-sidebar-foreground">
      <div className={cn("px-5 py-6", collapsed && "px-0 flex justify-center")}>
        <Brand compact={collapsed} />
      </div>

      <nav
        className={cn("flex-1 space-y-1", collapsed ? "px-2" : "px-3")}
        aria-label="Primary"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "px-3",
                active
                  ? "bg-white text-sidebar"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* profile */}
      <div className={cn("p-3", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2",
            collapsed && "justify-center",
          )}
        >
          <span
            className="size-9 shrink-0 rounded-full bg-gradient-to-br from-chart-3 to-chart-1 ring-2 ring-white/10"
            aria-hidden
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {session?.businessName ? "Arshi Kohli" : "Arshi Kohli"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground">
                Berlin, Germany
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="rounded-lg p-1.5 text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
