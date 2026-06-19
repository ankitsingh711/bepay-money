import { DonutChart } from "@/components/charts/donut-chart";
import { formatUsd } from "@/lib/format";

const SEGMENTS = [
  { label: "Litecoin", value: 30, color: "#f3ba2f" },
  { label: "Ethereum Classic", value: 34, color: "#3b6fe0" },
  { label: "H0dlcoin", value: 20, color: "#2ea66b" },
  { label: "Others", value: 9, color: "#7c5cff" },
  { label: "Misc", value: 7, color: "#e0533b" },
];

const COINS = [
  { name: "Litecoin", color: "#345d9d", added: "Added 2 days ago", amount: "0.25", fiat: "$1190", up: false },
  { name: "Ethereum Classic", color: "#34a15a", added: "Added 5 days ago", amount: "0.25", fiat: "$1190", up: false },
  { name: "H0dlcoin", color: "#c9971f", added: "Added 6 days ago", amount: "0.25", fiat: "$1190", up: true },
];

export function TokensCard() {
  return (
    <div className="rounded-3xl border border-border p-5">
      <p className="text-center text-sm text-muted-foreground">
        Total Monthly Tokens
      </p>
      <p className="text-center text-3xl font-bold tracking-tight">
        {formatUsd(273937)}
      </p>

      <div className="mt-4 flex justify-center">
        <DonutChart
          size={150}
          thickness={16}
          segments={SEGMENTS}
          centervalue="46"
          centerLabel="Total Tokens"
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Coins</span>
        <span>Amount</span>
      </div>
      <ul className="divide-y divide-border">
        {COINS.map((c, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex size-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: c.color }}
              >
                {c.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.added}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{c.amount}</p>
              <p
                className={
                  c.up ? "text-xs text-success-fg" : "text-xs text-danger-fg"
                }
              >
                {c.fiat}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
