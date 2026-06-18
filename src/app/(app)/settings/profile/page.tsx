"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtpInput } from "@/components/ui/otp-input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const AVATARS = [
  "from-chart-3 to-chart-1",
  "from-chart-2 to-chart-5",
  "from-chart-4 to-danger",
  "from-chart-5 to-chart-3",
  "from-success to-chart-2",
  "from-danger to-chart-4",
  "from-chart-1 to-chart-3",
  "from-warning to-chart-4",
];

export default function ProfilePage() {
  const { session } = useAuth();
  const [avatar, setAvatar] = React.useState(0);
  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [name, setName] = React.useState("Anshi Kohli");
  const [phone, setPhone] = React.useState("+1 555 0142");
  const [saving, setSaving] = React.useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 700);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* avatar */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-semibold text-white",
                AVATARS[avatar],
              )}
            >
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.email ?? "merchant@bepay.app"}
              </p>
              <button
                type="button"
                onClick={() => setAvatarOpen(true)}
                className="mt-1 text-sm font-medium text-foreground hover:underline"
              >
                Change avatar
              </button>
            </div>
          </div>

          <form onSubmit={save} className="space-y-4">
            <Field label="Full name" htmlFor="name">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email" hint="Email can’t be changed">
              <Input
                id="email"
                value={session?.email ?? "merchant@bepay.app"}
                readOnly
                className="bg-muted/40"
              />
            </Field>
            <Field label="Business name" htmlFor="business">
              <Input
                id="business"
                defaultValue={session?.businessName ?? "Acme Store"}
              />
            </Field>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone number</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">{phone}</p>
            <p className="text-sm text-muted-foreground">
              Used for sign-in and withdrawal verification.
            </p>
          </div>
          <Button variant="outline" onClick={() => setPhoneOpen(true)}>
            Change
          </Button>
        </CardContent>
      </Card>

      <AvatarDialog
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        avatars={AVATARS}
        selected={avatar}
        onSelect={(i) => {
          setAvatar(i);
          setAvatarOpen(false);
          toast.success("Avatar updated");
        }}
      />

      <ChangePhoneDialog
        open={phoneOpen}
        onOpenChange={setPhoneOpen}
        onChanged={(p) => {
          setPhone(p);
          toast.success("Phone number changed");
        }}
      />
    </>
  );
}

function AvatarDialog({
  open,
  onOpenChange,
  avatars,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  avatars: string[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3">
          {avatars.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                "aspect-square rounded-full bg-gradient-to-br ring-offset-2 ring-offset-card transition-shadow",
                a,
                i === selected && "ring-2 ring-ring",
              )}
              aria-label={`Avatar ${i + 1}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChangePhoneDialog({
  open,
  onOpenChange,
  onChanged,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChanged: (phone: string) => void;
}) {
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string>();

  function close(o: boolean) {
    onOpenChange(o);
    if (!o)
      setTimeout(() => {
        setStep("phone");
        setPhone("");
        setCode("");
        setError(undefined);
      }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change phone number</DialogTitle>
        </DialogHeader>
        {step === "phone" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.trim().length < 6) {
                setError("Enter a valid phone number");
                return;
              }
              setStep("otp");
            }}
          >
            <Field label="New phone number" htmlFor="newphone" error={error}>
              <Input
                id="newphone"
                placeholder="+1 555 0199"
                value={phone}
                invalid={!!error}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full">
              Send code
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to {phone}. (Demo: any 6 digits.)
            </p>
            <OtpInput value={code} onChange={setCode} />
            <Button
              className="w-full"
              onClick={() => {
                if (code.length < 6) {
                  toast.error("Enter the 6-digit code");
                  return;
                }
                onChanged(phone);
                close(false);
              }}
            >
              Verify & update
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
