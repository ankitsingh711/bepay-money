"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ShopAddressPage() {
  const router = useRouter();
  const [values, setValues] = React.useState({
    line1: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.line1.trim()) next.line1 = "Street address is required";
    if (!values.city.trim()) next.city = "City is required";
    setErrors(next);
    if (Object.keys(next).length) return;
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

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Enter address</h1>
        <p className="text-sm text-muted-foreground">
          Where is your shop located?
        </p>
      </div>

      {/* map placeholder */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(11,14,20,0.04)_25%,rgba(11,14,20,0.04)_26%,transparent_27%,transparent_74%,rgba(11,14,20,0.04)_75%,rgba(11,14,20,0.04)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(11,14,20,0.04)_25%,rgba(11,14,20,0.04)_26%,transparent_27%,transparent_74%,rgba(11,14,20,0.04)_75%,rgba(11,14,20,0.04)_76%,transparent_77%)] bg-[length:32px_32px]" />
        <div className="relative flex flex-col items-center gap-1 text-muted-foreground">
          <MapPin className="size-6" />
          <span className="text-xs">Map preview</span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Street address" htmlFor="line1" error={errors.line1}>
          <Input
            id="line1"
            placeholder="123 Market Street"
            value={values.line1}
            invalid={!!errors.line1}
            onChange={(e) => set("line1", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" htmlFor="city" error={errors.city}>
            <Input
              id="city"
              placeholder="City"
              value={values.city}
              invalid={!!errors.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </Field>
          <Field label="Postcode" htmlFor="postcode" optional>
            <Input
              id="postcode"
              placeholder="Postcode"
              value={values.postcode}
              onChange={(e) => set("postcode", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Country" htmlFor="country" optional>
          <Input
            id="country"
            placeholder="Country"
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Confirm address
        </Button>
      </form>
    </div>
  );
}
