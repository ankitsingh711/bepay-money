"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/profile", label: "My Profile", icon: User },
  {
    href: "/settings/wallet-security",
    label: "Wallet Security",
    icon: ShieldCheck,
  },
  { href: "/settings/appearance", label: "Appearance", icon: Palette },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav
      className="flex gap-1 overflow-x-auto rounded-full border border-border bg-card p-1"
      aria-label="Settings sections"
    >
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
