import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MarketRow {
  name: string;
  symbol: string;
  color: string;
  lastPrice: string;
  change: number;
  marketCap: string;
}

const ROWS: MarketRow[] = [
  { name: "BNB", symbol: "BNB", color: "#f3ba2f", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Ethereum", symbol: "ETH", color: "#627eea", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Bitcoin", symbol: "BTC", color: "#f7931a", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Terra", symbol: "LUNA", color: "#172852", lastPrice: "$41.263,00", change: -35.74, marketCap: "$784,393M" },
  { name: "Cardano", symbol: "ADA", color: "#0033ad", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Cardano", symbol: "ADA", color: "#0033ad", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Cardano", symbol: "ADA", color: "#0033ad", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
  { name: "Solana", symbol: "SOL", color: "#14f195", lastPrice: "$41.263,00", change: 35.74, marketCap: "$784,393M" },
];

export function MarketTable() {
  return (
    <div className="rounded-3xl border border-border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Payments</h3>
        <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
          See all
        </button>
      </div>
      <Table className="mt-2">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Token</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Last Price</TableHead>
            <TableHead className="text-right">24H Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r, i) => {
            const up = r.change >= 0;
            return (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.symbol.slice(0, 1)}
                    </span>
                    <span className="font-medium">{r.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.symbol}</TableCell>
                <TableCell className="text-right">{r.lastPrice}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-medium",
                      up ? "text-success-fg" : "text-danger-fg",
                    )}
                  >
                    {up ? (
                      <ArrowUp className="size-3.5" />
                    ) : (
                      <ArrowDown className="size-3.5" />
                    )}
                    {Math.abs(r.change)}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {r.marketCap}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
