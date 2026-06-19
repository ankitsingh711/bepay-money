"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StepProgress } from "@/components/auth/step-progress";
import { LocationPicker } from "@/components/auth/location-picker";
import { updateDraft } from "@/lib/onboarding";

export default function CreateShopPage() {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    shopName: "",
    shopAddress: "",
    dob: "",
    from: "",
    till: "",
    openDays: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const isValid =
    values.shopName.trim().length >= 2 && values.shopAddress.trim().length >= 3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (values.shopName.trim().length < 2)
      next.shopName = "Shop name is required";
    if (values.shopAddress.trim().length < 3)
      next.shopAddress = "Shop address is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    updateDraft({ shopName: values.shopName });
    router.push("/onboarding/done");
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <StepProgress current={2} total={2} />

      <h1 className="text-center text-3xl font-bold tracking-tight">
        Create Shop
      </h1>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field label="Shop name" htmlFor="shopName" error={errors.shopName}>
          <Input
            id="shopName"
            placeholder="Enter Shop name"
            className="h-14 bg-muted/50"
            value={values.shopName}
            invalid={!!errors.shopName}
            onChange={(e) => set("shopName", e.target.value)}
          />
        </Field>

        <Field
          label="Shop Address"
          htmlFor="shopAddress"
          error={errors.shopAddress}
        >
          <div className="relative">
            <Input
              id="shopAddress"
              placeholder="Enter Shop Address"
              className="h-14 bg-muted/50 pr-11"
              value={values.shopAddress}
              invalid={!!errors.shopAddress}
              onChange={(e) => set("shopAddress", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label="Pick location on map"
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LocateFixed className="size-5" />
            </button>
          </div>
        </Field>

        <Field label="Date of birth" htmlFor="dob">
          <div className="relative">
            <Input
              id="dob"
              type="date"
              className="h-14 bg-muted/50 pr-11"
              value={values.dob}
              onChange={(e) => set("dob", e.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="From" htmlFor="from">
            <div className="relative">
              <Input
                id="from"
                type="time"
                className="h-14 bg-muted/50 pr-11"
                value={values.from}
                onChange={(e) => set("from", e.target.value)}
              />
              <Clock className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>
          <Field label="Till" htmlFor="till">
            <div className="relative">
              <Input
                id="till"
                type="time"
                className="h-14 bg-muted/50 pr-11"
                value={values.till}
                onChange={(e) => set("till", e.target.value)}
              />
              <Clock className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>
        </div>

        <Field label="Open Days" htmlFor="openDays">
          <Input
            id="openDays"
            placeholder="Days your shop is open"
            className="h-14 bg-muted/50"
            value={values.openDays}
            onChange={(e) => set("openDays", e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={!isValid}>
          Next
        </Button>
      </form>

      <LocationPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onConfirm={(addr) => set("shopAddress", addr)}
      />
    </div>
  );
}

