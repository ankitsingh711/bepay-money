"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { updateDraft } from "@/lib/onboarding";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [referral, setReferral] = React.useState("");
  const [error, setError] = React.useState<string>();

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email or phone number");
      return;
    }
    updateDraft({ email });
    router.push("/signup/verify");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join bepay and start accepting crypto payments.
        </p>
      </div>

      <form onSubmit={next} className="space-y-4" noValidate>
        <Field label="Email / phone number" htmlFor="email" error={error}>
          <Input
            id="email"
            placeholder="Email/phone (without country code)"
            value={email}
            invalid={!!error}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Referral code" htmlFor="referral" optional>
          <Input
            id="referral"
            placeholder="Enter referral code (optional)"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Next
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <SocialButtons />

      <p className="text-center text-xs text-muted-foreground">
        By proceeding, you agree and consent to our{" "}
        <span className="font-semibold text-foreground">Terms of service</span>{" "}
        and{" "}
        <span className="font-semibold text-foreground">Privacy policy</span>.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
