"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NETWORKS, NETWORK_LABELS, type Network } from "@/lib/types";

export interface AdvancedFilters {
  network: Network | "all";
  from: string;
  to: string;
}

export const EMPTY_FILTERS: AdvancedFilters = {
  network: "all",
  from: "",
  to: "",
};

export function FiltersSheet({
  value,
  onApply,
}: {
  value: AdvancedFilters;
  onApply: (next: AdvancedFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<AdvancedFilters>(value);

  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const activeCount =
    (value.network !== "all" ? 1 : 0) +
    (value.from ? 1 : 0) +
    (value.to ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <SlidersHorizontal />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Apply filters</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Refine the transaction list.
          </p>
        </SheetHeader>
        <SheetBody className="space-y-5">
          <Field label="Network">
            <Select
              value={draft.network}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, network: v as Network | "all" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All networks</SelectItem>
                {NETWORKS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {NETWORK_LABELS[n]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="From date">
              <Input
                type="date"
                value={draft.from}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, from: e.target.value }))
                }
              />
            </Field>
            <Field label="To date">
              <Input
                type="date"
                value={draft.to}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, to: e.target.value }))
                }
              />
            </Field>
          </div>
        </SheetBody>
        <SheetFooter className="justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(EMPTY_FILTERS);
              onApply(EMPTY_FILTERS);
              setOpen(false);
            }}
          >
            Clear all
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
