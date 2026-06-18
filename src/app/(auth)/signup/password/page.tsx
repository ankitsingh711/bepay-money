"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const passed = RULES.filter((r) => r.test(password)).length;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (passed < RULES.length) {
      setError("Password doesn’t meet all requirements");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don’t match");
      return;
    }
    router.push("/signup/business");
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
          Create a password
        </h1>
        <p className="text-sm text-muted-foreground">
          Secure your account with a strong password.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        {/* strength meter */}
        <div className="flex gap-1.5">
          {RULES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < passed
                  ? passed <= 2
                    ? "bg-warning"
                    : passed === 3
                      ? "bg-chart-4"
                      : "bg-success"
                  : "bg-muted",
              )}
            />
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-1.5">
          {RULES.map((r) => {
            const ok = r.test(password);
            return (
              <li
                key={r.label}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  ok ? "text-success-fg" : "text-muted-foreground",
                )}
              >
                <Check className={cn("size-3.5", !ok && "opacity-30")} />
                {r.label}
              </li>
            );
          })}
        </ul>

        <Field label="Confirm password" htmlFor="confirm" error={error}>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={confirm}
            invalid={!!error}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
