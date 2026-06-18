import {
  LayoutGrid,
  Link2,
  Receipt,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** match nested routes too */
  match?: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutGrid },
  {
    label: "Payment History",
    href: "/payments",
    icon: Receipt,
    match: (p) => p.startsWith("/payments"),
  },
  {
    label: "Payment Links",
    href: "/payment-links",
    icon: Link2,
    match: (p) => p.startsWith("/payment-links"),
  },
  { label: "Settings", href: "/settings", icon: Settings },
];
