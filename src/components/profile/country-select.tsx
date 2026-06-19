"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, type Country } from "@/lib/countries";

export function CountrySelect({
  value,
  onChange,
}: {
  value: Country;
  onChange: (c: Country) => void;
}) {
  return (
    <Select
      value={value.code}
      onValueChange={(code) => {
        const next = COUNTRIES.find((c) => c.code === code);
        if (next) onChange(next);
      }}
    >
      <SelectTrigger className="h-12 w-[110px] shrink-0 rounded-xl bg-muted/60">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span aria-hidden>{value.flag}</span> {value.dial}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="flex items-center gap-2">
              <span aria-hidden>{c.flag}</span>
              <span>{c.name}</span>
              <span className="text-muted-foreground">{c.dial}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
