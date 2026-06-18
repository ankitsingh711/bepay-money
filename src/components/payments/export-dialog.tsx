"use client";

import * as React from "react";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { transactionsService } from "@/lib/api/services";
import { toCsv, downloadFile } from "@/lib/csv";
import { cn } from "@/lib/utils";
import type { TransactionQuery } from "@/lib/types";

type Format = "csv" | "json";

export function ExportDialog({ query }: { query: TransactionQuery }) {
  const [open, setOpen] = React.useState(false);
  const [format, setFormat] = React.useState<Format>("csv");
  const [loading, setLoading] = React.useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      // Pull the full (unpaginated) filtered set for export.
      const result = await transactionsService.list({
        ...query,
        page: 1,
        limit: 1000,
      });
      const stamp = "export";
      if (format === "json") {
        downloadFile(
          JSON.stringify(result.data, null, 2),
          `bepay-transactions-${stamp}.json`,
          "application/json",
        );
      } else {
        const csv = toCsv(result.data, [
          { key: "id", header: "Transaction ID" },
          { key: "paymentLinkTitle", header: "Title" },
          { key: "customerReference", header: "Customer" },
          { key: "amount", header: "Amount" },
          { key: "currency", header: "Token" },
          { key: "network", header: "Network" },
          { key: "status", header: "Status" },
          { key: "createdAt", header: "Created" },
        ]);
        downloadFile(
          csv,
          `bepay-transactions-${stamp}.csv`,
          "text/csv",
        );
      }
      toast.success(`Exported ${result.data.length} transactions`);
      setOpen(false);
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  const options: { value: Format; label: string; icon: typeof FileJson }[] = [
    { value: "csv", label: "CSV", icon: FileSpreadsheet },
    { value: "json", label: "JSON", icon: FileJson },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <Download />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose the format to export</DialogTitle>
          <DialogDescription>
            Download your filtered transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {options.map((o) => {
            const Icon = o.icon;
            const active = format === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setFormat(o.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-colors",
                  active
                    ? "border-primary bg-muted/50"
                    : "border-border hover:border-foreground/20",
                )}
                aria-pressed={active}
              >
                <Icon className="size-7" />
                <span className="text-sm font-medium">{o.label}</span>
              </button>
            );
          })}
        </div>
        <Button onClick={handleExport} disabled={loading} className="w-full">
          {loading ? "Exporting…" : "Export"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
