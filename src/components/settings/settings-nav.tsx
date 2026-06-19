"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/profile", label: "My Profile", icon: User },
  {
    href: "/settings/wallet-security",
    label: "Wallet Security",
    icon: ShieldCheck,
  },
  {
    href: "/settings/bepay-channels",
    label: "Bepay Official Channels",
    icon: Users,
  },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="relative shrink-0 overflow-hidden bg-gradient-to-b from-[#11161f] to-[#0b0e14] p-4 md:w-72"
      aria-label="Settings sections"
    >
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_80%_at_30%_0%,rgba(56,116,160,0.25),transparent)]" />
      <div className="relative flex gap-2 overflow-x-auto md:mt-4 md:flex-col md:gap-1.5 md:overflow-visible">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-[#3a3f7d] to-[#1b1f33] text-white shadow-sm"
                  : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="whitespace-nowrap">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
