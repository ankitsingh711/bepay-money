import type { LucideIcon } from "lucide-react";

/** Small "Payouts" / "Turnover" card with a dark icon tile. */
export function StatCard({
  icon: Icon,
  title,
  subtitle,
  value,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-muted/60 p-4">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <p className="mt-2 text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}
