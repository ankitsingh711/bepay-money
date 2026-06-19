"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { CountrySelect } from "./country-select";
import {
  DEFAULT_COUNTRY,
  validatePhone,
  type Country,
} from "@/lib/countries";

type Step = "phone" | "otp" | "success";

export function ChangePhoneDialog({
  open,
  onOpenChange,
  current,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  current: string;
  onChanged: (phone: string) => void;
}) {
  const [step, setStep] = React.useState<Step>("phone");
  const [country, setCountry] = React.useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [seconds, setSeconds] = React.useState(57);
  const [resent, setResent] = React.useState(false);

  const phoneError = validatePhone(phone, country);

  function close(o: boolean) {
    onOpenChange(o);
    if (!o)
      setTimeout(() => {
        setStep("phone");
        setCountry(DEFAULT_COUNTRY);
        setPhone("");
        setTouched(false);
        setCode("");
        setSeconds(57);
        setResent(false);
      }, 200);
  }

  React.useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, seconds]);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-lg">
        {step === "phone" && (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl">Change Phone number</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Please enter your new phone number
              </p>
            </DialogHeader>
            <Field
              label="Phone Number"
              htmlFor="newphone"
              error={touched ? phoneError ?? undefined : undefined}
            >
              <div className="flex gap-2">
                <CountrySelect value={country} onChange={setCountry} />
                <div className="relative flex-1">
                  <Input
                    id="newphone"
                    inputMode="tel"
                    placeholder={current}
                    value={phone}
                    invalid={touched && !!phoneError}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 14))
                    }
                    onBlur={() => setTouched(true)}
                    className="h-12 bg-muted/60 pr-10"
                  />
                  <Pencil className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </Field>
            <Button
              size="lg"
              className="mt-2 w-full"
              disabled={!!phoneError}
              onClick={() => {
                setTouched(true);
                if (phoneError) return;
                setStep("otp");
                setSeconds(57);
              }}
            >
              Update
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl">
                Verify your phone number
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                A 6 digit code has been sent to{" "}
                <span className="font-semibold text-foreground">
                  {country.dial} {phone}
                </span>
                . Please enter it within the next 30 minutes.
              </p>
            </DialogHeader>
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification code
              </label>
              <Input
                id="otp"
                inputMode="numeric"
                placeholder="Code sent"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-12 bg-muted/60 tracking-widest"
              />
            </div>
            <Button
              size="lg"
              className="w-full"
              disabled={code.length < 6}
              onClick={() => {
                onChanged(phone);
                setStep("success");
              }}
            >
              Next
            </Button>
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Didn’t receive the code?{" "}
                {seconds > 0 ? (
                  <>
                    <span className="text-muted-foreground/70 underline">
                      Resend code
                    </span>{" "}
                    ({seconds}s)
                  </>
                ) : (
                  <button
                    type="button"
                    className="font-medium text-foreground underline"
                    onClick={() => {
                      setSeconds(57);
                      setResent(true);
                    }}
                  >
                    Resend code
                  </button>
                )}
              </p>
              {resent && (
                <p className="flex items-center justify-center gap-1.5 text-sm font-semibold">
                  Code resent
                  <span className="flex size-4 items-center justify-center rounded-full border border-success text-success">
                    ✓
                  </span>
                </p>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <PhoneArt />
            <div className="space-y-1">
              <p className="text-2xl font-bold">Phone Number Changed</p>
              <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                Congrats! Your phone number has been updated successfully.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 120 120" className="size-28" fill="none">
      <rect
        x="44"
        y="20"
        width="46"
        height="78"
        rx="8"
        transform="rotate(12 67 59)"
        stroke="#0b0e14"
        strokeWidth="3"
        fill="#fff"
      />
      <rect
        x="52"
        y="30"
        width="14"
        height="5"
        rx="2.5"
        transform="rotate(12 59 32)"
        fill="#0b0e14"
      />
      <path
        d="M18 92c6-10 18-14 30-12"
        stroke="#0b0e14"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 78c4-2 9-2 13 0"
        stroke="#0b0e14"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
