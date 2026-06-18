"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { getDraft } from "@/lib/onboarding";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [email, setEmail] = React.useState("your email");
  const [seconds, setSeconds] = React.useState(30);

  React.useEffect(() => {
    setEmail(getDraft().email || "your email");
  }, []);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    router.push("/signup/password");
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          A 6-digit code has been sent to{" "}
          <span className="font-medium text-foreground">{email}</span>. Enter it
          within the next 30 minutes.
        </p>
        <p className="text-xs text-muted-foreground">
          Demo tip: enter any 6 digits.
        </p>
      </div>

      <form onSubmit={verify} className="space-y-5">
        <OtpInput value={code} onChange={setCode} />
        <Button type="submit" size="lg" className="w-full">
          Next
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Didn’t receive the code?{" "}
        {seconds > 0 ? (
          <span>Resend code in {seconds}s</span>
        ) : (
          <button
            type="button"
            className="font-semibold text-foreground hover:underline"
            onClick={() => {
              setSeconds(30);
              toast.success("Code resent");
            }}
          >
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
