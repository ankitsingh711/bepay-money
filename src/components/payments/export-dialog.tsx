"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { transactionsService } from "@/lib/api/services";
import { toCsv, downloadFile } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TransactionQuery } from "@/lib/types";

type Format = "PDF" | "CSV" | "XLS";

export function ExportDialog({ query }: { query: TransactionQuery }) {
  const [open, setOpen] = React.useState(false);
  const [format, setFormat] = React.useState<Format>("CSV");
  const [loading, setLoading] = React.useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const result = await transactionsService.list({
        ...query,
        page: 1,
        limit: 1000,
      });
      const rows = result.data.map((t) => ({
        paymentId: t.paymentId,
        orderId: t.externalReference ?? "",
        originalPrice: `${t.originalPrice} USD`,
        received: `${t.received.amount} ${t.received.token}`,
        sent: `${t.sent.amount} ${t.sent.token}`,
        status: t.paymentState,
        date: formatDate(t.createdAt),
      }));
      const columns = [
        { key: "paymentId" as const, header: "Payment ID" },
        { key: "orderId" as const, header: "Order ID" },
        { key: "originalPrice" as const, header: "Original Price" },
        { key: "received" as const, header: "Amount Received" },
        { key: "sent" as const, header: "Amount Sent" },
        { key: "status" as const, header: "Status" },
        { key: "date" as const, header: "Date" },
      ];
      const csv = toCsv(rows, columns);

      if (format === "CSV") {
        downloadFile(csv, "bepay-payments.csv", "text/csv");
      } else if (format === "XLS") {
        downloadFile(csv, "bepay-payments.xls", "application/vnd.ms-excel");
      } else {
        // PDF — open a printable view (browser "Save as PDF")
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(
            `<title>bepay payments</title><h2>Payments</h2><table border="1" cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:12px">` +
              `<tr>${columns.map((c) => `<th>${c.header}</th>`).join("")}</tr>` +
              rows
                .map(
                  (r) =>
                    `<tr>${columns
                      .map((c) => `<td>${r[c.key]}</td>`)
                      .join("")}</tr>`,
                )
                .join("") +
              `</table>`,
          );
          win.document.close();
          win.print();
        }
      }
      toast.success(`Exported ${rows.length} payments as ${format}`);
      setOpen(false);
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-11">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle className="sr-only">Choose the format to export</DialogTitle>
        <div className="flex flex-col items-center gap-6 py-2">
          <span className="flex size-20 items-center justify-center rounded-2xl text-foreground">
            <Download className="size-12" strokeWidth={1.3} />
          </span>
          <p className="text-xl font-bold">Choose the format to export</p>

          <div className="flex justify-center gap-3">
            {(["PDF", "CSV", "XLS"] as Format[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                className={cn(
                  "rounded-full border px-8 py-3 text-sm font-medium transition-colors",
                  format === f
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/30",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? "Exporting…" : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
