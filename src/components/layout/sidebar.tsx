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

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  function handleLogout() {
    signOut();
    onNavigate?.();
    toast.success("Logged out");
    router.replace("/login");
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <Brand />
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-active-bg text-sidebar-active"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-[18px]" />
          Log out
        </button>
      </div>
    </div>
  );
}
