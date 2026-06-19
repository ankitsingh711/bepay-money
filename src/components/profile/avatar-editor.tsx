"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AVATAR_COUNT, ProfileAvatar } from "./avatars";

export type Avatar =
  | { kind: "illustration"; index: number }
  | { kind: "photo"; url: string }
  | { kind: "none" };

type Step = "menu" | "grid" | "success";

export function AvatarEditor({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onApply: (avatar: Avatar) => void;
}) {
  const [step, setStep] = React.useState<Step>("menu");
  const [selected, setSelected] = React.useState<number | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function close(o: boolean) {
    onOpenChange(o);
    if (!o)
      setTimeout(() => {
        setStep("menu");
        setSelected(null);
      }, 200);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onApply({ kind: "photo", url });
    toast.success("Profile photo updated");
    close(false);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
      <DialogContent className="max-w-lg">
        {step === "menu" && (
          <>
            <DialogTitle className="sr-only">Update profile photo</DialogTitle>
            <ul className="divide-y divide-border">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Camera isn’t available in this demo")
                  }
                  className="w-full py-4 text-[15px] font-medium transition-colors hover:text-foreground/70"
                >
                  Take photo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-4 text-[15px] font-medium transition-colors hover:text-foreground/70"
                >
                  Upload from album
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setStep("grid")}
                  className="w-full py-4 text-[15px] font-medium transition-colors hover:text-foreground/70"
                >
                  Select an avatar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onApply({ kind: "none" });
                    toast.success("Profile photo removed");
                    close(false);
                  }}
                  className="w-full py-4 text-[15px] font-medium transition-colors hover:text-foreground/70"
                >
                  Remove photo
                </button>
              </li>
            </ul>
          </>
        )}

        {step === "grid" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Select a profile avatar
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 py-2">
              {Array.from({ length: AVATAR_COUNT }).map((_, i) => {
                const isSel = selected === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={isSel}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-full border-2 bg-white transition-colors",
                      isSel ? "border-foreground" : "border-border hover:border-foreground/40",
                    )}
                  >
                    <ProfileAvatar index={i} />
                    {isSel && (
                      <span className="absolute right-0 top-0 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <Button
              className="mt-2 w-full"
              size="lg"
              disabled={selected === null}
              onClick={() => {
                if (selected !== null)
                  onApply({ kind: "illustration", index: selected });
                setStep("success");
              }}
            >
              Select Avatar
            </Button>
          </>
        )}

        {step === "success" && selected !== null && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="size-32 overflow-hidden rounded-full border-2 border-foreground bg-white">
              <ProfileAvatar index={selected} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold">Avatar is updated</p>
              <p className="text-sm text-muted-foreground">
                Your avatar profile has been updated
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
