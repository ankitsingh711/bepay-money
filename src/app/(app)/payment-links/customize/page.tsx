"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ImageUp, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PayBrandPanel } from "@/components/payment-links/pay-brand-panel";
import { useBrand } from "@/hooks/use-brand";
import { saveBrand, DEFAULT_BRAND, type Brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#0b0e14",
  "#16a34a",
  "#6366f1",
  "#f59e0b",
  "#06b6d4",
  "#db2777",
];

export default function CustomizePayPage() {
  const brand = useBrand();
  const [draft, setDraft] = React.useState<Brand>(brand);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function set<K extends keyof Brand>(key: K, value: Brand[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function onPickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      toast.error("Please choose an image under 1 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result as string);
    reader.readAsDataURL(file);
  }

  function save() {
    saveBrand(draft);
    toast.success("Payment page updated");
  }

  function reset() {
    setDraft(DEFAULT_BRAND);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/payment-links">
              <ArrowLeft />
              Back to payment links
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">
            Customize payment page
          </h1>
          <p className="text-sm text-muted-foreground">
            Brand the page your customers see when they open a payment link.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcw />
            Reset
          </Button>
          <Button onClick={save}>Save changes</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* preferences */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* logo */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Logo</p>
              <div className="flex items-center gap-3">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/50">
                  {draft.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={draft.logo}
                      alt="Logo preview"
                      className="size-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/logo.png"
                      alt="Default logo"
                      className="size-10 object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageUp />
                    Upload
                  </Button>
                  {draft.logo && (
                    <button
                      type="button"
                      onClick={() => set("logo", null)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-danger-fg hover:underline"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickLogo}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                PNG or SVG, transparent background, up to 1 MB.
              </p>
            </div>

            {/* theme color */}
            <Field label="Theme color">
              <div className="flex flex-wrap items-center gap-2">
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

            {/* text size */}
            <SliderField
              label="Text size"
              value={draft.textSize}
              min={85}
              max={120}
              suffix="%"
              onChange={(v) => set("textSize", v)}
            />

            {/* brightness */}
            <SliderField
              label="Brightness"
              value={draft.brightness}
              min={55}
              max={110}
              suffix="%"
              onChange={(v) => set("brightness", v)}
            />

            {/* copy */}
            <Field label="Business name" htmlFor="bizname">
              <Input
                id="bizname"
                value={draft.businessName}
                onChange={(e) => set("businessName", e.target.value)}
              />
            </Field>
            <Field label="Tagline" htmlFor="tagline">
              <Input
                id="tagline"
                value={draft.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
            <Field
              label="Description"
              htmlFor="description"
              hint="Supporting copy under the tagline"
            >
              <textarea
                id="description"
                rows={3}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                className="w-full resize-none rounded-xl border border-input bg-card px-3 py-2 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
              />
            </Field>
          </CardContent>
        </Card>

        {/* live preview */}
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Live preview</CardTitle>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              /pay/your-link
            </span>
          </CardHeader>
          <CardContent>
            <PayPagePreview brand={draft} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        aria-label={label}
      />
    </div>
  );
}

/** Miniature of the public pay page split layout, driven by the draft brand. */
function PayPagePreview({ brand }: { brand: Brand }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#15181f] to-black">
      <div className="grid lg:grid-cols-2">
        <div className="min-h-[360px]">
          <PayBrandPanel brand={brand} />
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-xs space-y-3">
            <div className="rounded-2xl bg-card p-4 text-center text-xs font-medium text-muted-foreground shadow-lg">
              STEP 1 · STEP 2 · STEP 3
            </div>
            <div className="space-y-4 rounded-2xl bg-card p-5 shadow-xl">
              <div className="flex h-12 items-center justify-between rounded-xl border border-border px-3 text-sm font-medium">
                BTC (Bitcoin network)
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount to pay</p>
                <p className="text-xl font-bold">0.000005678 USDC</p>
              </div>
              <button
                type="button"
                style={{ backgroundColor: brand.color }}
                className="h-11 w-full rounded-full text-sm font-medium text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
