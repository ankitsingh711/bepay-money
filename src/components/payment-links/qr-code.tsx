"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export function QrCode({
  value,
  size = 168,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-border bg-white p-3",
        className,
      )}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#0b0e14"
      />
    </div>
  );
}
