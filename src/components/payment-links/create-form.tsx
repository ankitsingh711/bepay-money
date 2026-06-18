"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPaymentLinkSchema,
  type CreatePaymentLinkForm,
} from "@/lib/validation";
import {
  NETWORKS,
  NETWORK_LABELS,
  TOKENS,
  type CreatePaymentLinkInput,
} from "@/lib/types";

// default expiry: 7 days out, formatted for datetime-local input
function defaultExpiry(): string {
  const d = new Date(Date.now() + 7 * 24 * 3600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function CreatePaymentLinkForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (input: CreatePaymentLinkInput) => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePaymentLinkForm>({
    resolver: zodResolver(createPaymentLinkSchema),
    defaultValues: {
      title: "",
      amount: "",
      currency: "USDC",
      network: "polygon",
      description: "",
      expiresAt: defaultExpiry(),
      externalReference: "",
    },
  });

  function submit(values: CreatePaymentLinkForm) {
    onSubmit({
      title: values.title,
      amount: values.amount,
      currency: values.currency as CreatePaymentLinkInput["currency"],
      network: values.network as CreatePaymentLinkInput["network"],
      description: values.description || undefined,
      expiresAt: new Date(values.expiresAt).toISOString(),
      externalReference: values.externalReference || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <Field
        label="Payment title"
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder="e.g. Order #1024"
          invalid={!!errors.title}
          {...register("title")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Amount"
          htmlFor="amount"
          required
          error={errors.amount?.message}
        >
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="49.99"
            invalid={!!errors.amount}
            {...register("amount")}
          />
        </Field>

        <Field label="Token" required error={errors.currency?.message}>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger invalid={!!errors.currency}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field label="Network" required error={errors.network?.message}>
        <Controller
          control={control}
          name="network"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger invalid={!!errors.network}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NETWORKS.map((n) => (
                  <SelectItem key={n} value={n}>
                    {NETWORK_LABELS[n]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        optional
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          placeholder="What is this payment for?"
          invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Expiry date & time"
          htmlFor="expiresAt"
          required
          error={errors.expiresAt?.message}
        >
          <Input
            id="expiresAt"
            type="datetime-local"
            invalid={!!errors.expiresAt}
            {...register("expiresAt")}
          />
        </Field>

        <Field
          label="Order / reference ID"
          htmlFor="externalReference"
          optional
          error={errors.externalReference?.message}
        >
          <Input
            id="externalReference"
            placeholder="ORD-1024"
            invalid={!!errors.externalReference}
            {...register("externalReference")}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? "Creating link…" : "Create payment link"}
      </Button>
    </form>
  );
}
