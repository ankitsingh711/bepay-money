"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StepProgress } from "@/components/auth/step-progress";
import { getDraft, updateDraft } from "@/lib/onboarding";

export default function BusinessAccountPage() {
  const router = useRouter();
  const [values, setValues] = React.useState({
    businessName: "",
    license: "",
    phone: "",
    email: "",
    referral: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const draft = getDraft();
    if (draft.email) setValues((v) => ({ ...v, email: draft.email! }));
  }, []);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (values.businessName.trim().length < 2)
      next.businessName = "Business name is required";
    if (values.license.trim().length < 2)
      next.license = "Business license is required";
    if (values.phone.trim().length < 6) next.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length) return;

    updateDraft({ businessName: values.businessName });
    router.push("/signup/success");
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

      <StepProgress current={2} total={3} label="Business details" />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Business Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Please provide a few details about your business so we can get your
          shop set up smoothly.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Business name" htmlFor="businessName" error={errors.businessName}>
          <Input
            id="businessName"
            placeholder="e.g. Acme Store"
            value={values.businessName}
            invalid={!!errors.businessName}
            onChange={(e) => set("businessName", e.target.value)}
          />
        </Field>
        <Field label="Business license" htmlFor="license" error={errors.license}>
          <Input
            id="license"
            placeholder="License number"
            value={values.license}
            invalid={!!errors.license}
            onChange={(e) => set("license", e.target.value)}
          />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone}>
          <Input
            id="phone"
            placeholder="Enter phone number"
            value={values.phone}
            invalid={!!errors.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="bemail" error={errors.email}>
          <Input
            id="bemail"
            type="email"
            placeholder="you@business.com"
            value={values.email}
            invalid={!!errors.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Referral code" htmlFor="bref" optional>
          <Input
            id="bref"
            placeholder="Enter referral code (optional)"
            value={values.referral}
            onChange={(e) => set("referral", e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Next
        </Button>
      </form>
    </div>
  );
}
