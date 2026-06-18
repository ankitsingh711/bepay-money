"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useBrand } from "@/hooks/use-brand";
import { saveBrand, type Brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#0b0e14",
  "#16a34a",
  "#6366f1",
  "#f59e0b",
  "#06b6d4",
  "#db2777",
];

export default function AppearancePage() {
  const brand = useBrand();
  const [draft, setDraft] = React.useState<Brand>(brand);

  function set<K extends keyof Brand>(key: K, value: Brand[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save() {
    saveBrand(draft);
    toast.success("Appearance saved");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Brand & appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field label="Business name" htmlFor="bizname">
            <Input
              id="bizname"
              value={draft.businessName}
              onChange={(e) => set("businessName", e.target.value)}
            />
          </Field>
          <Field
            label="Tagline"
            htmlFor="tagline"
            hint="Shown on your public payment page"
          >
            <Input
              id="tagline"
              value={draft.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </Field>
          <Field label="Brand color">
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("color", c)}
                  className={cn(
                    "size-8 rounded-full ring-offset-2 ring-offset-card transition-shadow",
                    draft.color === c && "ring-2 ring-ring",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Use ${c}`}
                />
              ))}
              <label className="ml-1 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="size-8 cursor-pointer rounded-full border border-border bg-transparent p-0"
                  aria-label="Custom color"
                />
                Custom
              </label>
            </div>
          </Field>
          <Button onClick={save}>Save changes</Button>
        </CardContent>
      </Card>

      {/* live preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-sidebar p-5">
            <div className="rounded-2xl bg-card p-5 text-center">
              <p className="text-base font-semibold tracking-tight">
                {draft.tagline || "Your tagline"}
              </p>
              <p className="text-sm text-muted-foreground">
                Pay {draft.businessName || "your business"}
              </p>
              <div className="my-4 rounded-xl bg-muted/60 p-4">
                <p className="text-2xl font-semibold">49.99 USDC</p>
              </div>
              <button
                type="button"
                className="w-full rounded-full py-2.5 text-sm font-medium text-white"
                style={{ backgroundColor: draft.color }}
              >
                Pay 49.99 USDC
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            This is how customers see your payment links.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
