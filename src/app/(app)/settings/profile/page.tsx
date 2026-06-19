"use client";

import * as React from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/avatars";
import { AvatarEditor, type Avatar } from "@/components/profile/avatar-editor";
import { ChangePhoneDialog } from "@/components/profile/change-phone";
import { cn } from "@/lib/utils";

function ReadField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex h-14 items-center rounded-2xl bg-muted/50 px-4 text-[15px]">
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [avatar, setAvatar] = React.useState<Avatar>({ kind: "none" });
  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [phone, setPhone] = React.useState("9834576821");

  return (
    <div className="mx-auto max-w-4xl">
      {/* header */}
      <div className="flex items-start gap-5">
        <div className="relative">
          <div className="size-24 overflow-hidden rounded-3xl bg-muted">
            {avatar.kind === "illustration" ? (
              <div className="size-full bg-white">
                <ProfileAvatar index={avatar.index} />
              </div>
            ) : avatar.kind === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar.url}
                alt="Profile"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-chart-3 to-chart-1 text-3xl font-semibold text-white">
                D
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAvatarOpen(true)}
            aria-label="Edit profile photo"
            className="absolute -bottom-2 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight">Drake</h2>
          <p className="text-muted-foreground">Drake_feild@gmail.com</p>
        </div>
      </div>

      {/* basic info */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold tracking-tight">Basic info</h3>
        <p className="mt-1 text-muted-foreground">
          This information has been provided by you, while setting up your
          business
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <ReadField label="Business Name">XYZ Shop</ReadField>
          <ReadField label="Email/phone number">arukshdggy@gmail.com</ReadField>

          <div className="space-y-2 md:col-span-2 md:max-w-[calc(50%-1rem)]">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <div className="flex gap-2">
              <span className="flex h-14 items-center gap-1.5 rounded-2xl bg-muted/50 px-3 text-[15px] font-medium">
                <span aria-hidden>🇮🇳</span> +91
                <ChevronDown className="size-4 text-muted-foreground" />
              </span>
              <button
                type="button"
                onClick={() => setPhoneOpen(true)}
                className="flex h-14 flex-1 items-center justify-between rounded-2xl bg-muted/50 px-4 text-left text-[15px] transition-colors hover:bg-muted"
              >
                {phone}
                <Pencil className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <ReadField label="My referrer">
            <span className="text-muted-foreground">
              bepay ID:&nbsp;<span className="font-semibold text-foreground">20416729</span>
            </span>
          </ReadField>
          <ReadField label="Referrer’s referral code">TEEFZR</ReadField>
        </div>
      </div>

      <AvatarEditor
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        onApply={setAvatar}
      />
      <ChangePhoneDialog
        open={phoneOpen}
        onOpenChange={setPhoneOpen}
        current={phone}
        onChanged={setPhone}
      />
    </div>
  );
}
