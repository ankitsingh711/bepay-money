"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
import { StepProgress } from "@/components/auth/step-progress";
import { updateDraft } from "@/lib/onboarding";

const CATEGORIES = [
  "Retail",
  "Food & Beverage",
  "Services",
  "Digital goods",
  "Other",
];

export default function CreateShopPage() {
  const router = useRouter();
  const [shopName, setShopName] = React.useState("");
  const [category, setCategory] = React.useState("Retail");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string>();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (shopName.trim().length < 2) {
      setError("Shop name is required");
      return;
    }
    updateDraft({ shopName });
    router.push("/onboarding/shop-address");
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

      <StepProgress current={3} total={3} label="Create your shop" />

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create Shop</h1>
        <p className="text-sm text-muted-foreground">
          Tell us about your shop so customers know who they’re paying.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Shop name" htmlFor="shopName" error={error}>
          <Input
            id="shopName"
            placeholder="e.g. Acme Store"
            value={shopName}
            invalid={!!error}
            onChange={(e) => setShopName(e.target.value)}
          />
        </Field>
        <Field label="Category">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Description" htmlFor="desc" optional>
          <Textarea
            id="desc"
            placeholder="What does your shop sell?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
