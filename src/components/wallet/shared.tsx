"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
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
import { formatMoney } from "@/lib/money";
import type { Token, WalletHolding } from "@/lib/types";

export function TokenSelect({
  value,
  onChange,
  holdings,
  label = "Token",
  exclude,
}: {
  value: Token;
  onChange: (t: Token) => void;
  holdings: WalletHolding[];
  label?: string;
  exclude?: Token;
}) {
  const options = holdings.filter((h) => h.token !== exclude);
  return (
    <Field label={label}>
      <Select value={value} onValueChange={(v) => onChange(v as Token)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((h) => (
            <SelectItem key={h.token} value={h.token}>
              {h.token} · {formatMoney(h.amount, h.token, { withSymbol: false })}{" "}
              available
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function AmountField({
  value,
  onChange,
  token,
  max,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  token: Token;
  max?: string;
  error?: string;
}) {
  return (
    <Field
      label="Amount"
      htmlFor="amount"
      error={error}
      hint={max ? `Available: ${formatMoney(max, token)}` : undefined}
    >
      <div className="relative">
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className="pr-16"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {token}
        </span>
      </div>
    </Field>
  );
}

export function ConfirmRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

export function SuccessView({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-success-bg text-success-fg">
        <CheckCircle2 className="size-7" />
      </span>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button className="w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}

/** Simple positive-decimal amount validator that respects an optional max. */
export function validateAmount(value: string, max?: string): string | undefined {
  if (!value.trim()) return "Amount is required";
  if (!/^\d+(\.\d{1,8})?$/.test(value)) return "Enter a valid amount";
  if (Number(value) <= 0) return "Amount must be greater than zero";
  if (max && Number(value) > Number(max)) return "Amount exceeds your balance";
  return undefined;
}
