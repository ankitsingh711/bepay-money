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
import { TOKENS, type Token } from "@/lib/types";

export interface PaymentFilters {
  state: "all" | "active" | "expired";
  fixedRate: string;
  feePaidBy: string;
  payinAddress: string;
  payingHash: string;
  outcomeCurrency: "all" | Token;
}

export const EMPTY_FILTERS: PaymentFilters = {
  state: "all",
  fixedRate: "any",
  feePaidBy: "any",
  payinAddress: "",
  payingHash: "",
  outcomeCurrency: "all",
};

export function activeFilterCount(f: PaymentFilters): number {
  return (
    (f.state !== "all" ? 1 : 0) +
    (f.fixedRate !== "any" ? 1 : 0) +
    (f.feePaidBy !== "any" ? 1 : 0) +
    (f.payinAddress ? 1 : 0) +
    (f.payingHash ? 1 : 0) +
    (f.outcomeCurrency !== "all" ? 1 : 0)
  );
}

function ChooseSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-12 bg-muted/40">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FiltersSheet({
  value,
  onApply,
}: {
  value: PaymentFilters;
  onApply: (next: PaymentFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<PaymentFilters>(value);
  const count = activeFilterCount(value);

  function handleOpenChange(next: boolean) {
    if (next) setDraft(value);
    setOpen(next);
  }

  function set<K extends keyof PaymentFilters>(
    key: K,
    v: PaymentFilters[K],
  ) {
    setDraft((d) => ({ ...d, [key]: v }));
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative h-11">
          <SlidersHorizontal />
          Filters
          {count > 0 && (
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-success ring-2 ring-card" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Apply Filters</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Filter table data and save filters.
          </p>
        </SheetHeader>
        <SheetBody className="space-y-5">
          <Field label="Payment Status">
            <ChooseSelect
              value={draft.state}
              onChange={(v) => set("state", v as PaymentFilters["state"])}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
              ]}
            />
          </Field>
          <Field label="Fixed Rate">
            <ChooseSelect
              value={draft.fixedRate}
              onChange={(v) => set("fixedRate", v)}
              options={[
                { value: "any", label: "Any" },
                { value: "fixed", label: "Fixed" },
                { value: "floating", label: "Floating" },
              ]}
            />
          </Field>
          <Field label="Fee Paid By User">
            <ChooseSelect
              value={draft.feePaidBy}
              onChange={(v) => set("feePaidBy", v)}
              options={[
                { value: "any", label: "Any" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Field>
          <Field label="Payin address">
            <Input
              placeholder="Enter Address"
              className="h-12 bg-muted/40"
              value={draft.payinAddress}
              onChange={(e) => set("payinAddress", e.target.value)}
            />
          </Field>
          <Field label="Paying hash">
            <Input
              placeholder="Enter hash"
              className="h-12 bg-muted/40"
              value={draft.payingHash}
              onChange={(e) => set("payingHash", e.target.value)}
            />
          </Field>
          <Field label="Outcome currency">
            <ChooseSelect
              value={draft.outcomeCurrency}
              onChange={(v) =>
                set("outcomeCurrency", v as PaymentFilters["outcomeCurrency"])
              }
              options={[
                { value: "all", label: "All" },
                ...TOKENS.map((t) => ({ value: t, label: t })),
              ]}
            />
          </Field>
        </SheetBody>
        <SheetFooter className="flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Apply Filter
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => {
              setDraft(EMPTY_FILTERS);
              onApply(EMPTY_FILTERS);
              setOpen(false);
            }}
          >
            Clear All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
