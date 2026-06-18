import { Coins, Gift, Smartphone } from "lucide-react";

const PROMOS = [
  { icon: Gift, gradient: "from-violet-500 to-fuchsia-600" },
  { icon: Smartphone, gradient: "from-sky-600 to-indigo-700" },
  { icon: Coins, gradient: "from-rose-500 to-red-700" },
];

export function PromoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PROMOS.map((p, i) => {
        const Icon = p.icon;
        return (
          <div key={i} className="space-y-2">
            <div
              className={`flex aspect-[1.5/1] items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient}`}
            >
              <Icon className="size-10 text-white/90" strokeWidth={1.4} />
            </div>
            <p className="text-sm font-semibold leading-snug">
              Loyalty program coming soon for the merchants
            </p>
            <p className="text-xs text-muted-foreground">
              Soon launching the loyalty program
            </p>
          </div>
        );
      })}
    </div>
  );
}
