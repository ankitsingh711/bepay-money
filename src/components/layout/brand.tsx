import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * bepay logo lockup. Uses the official logo asset (public/logo.png), which
 * already contains the glyph + "bepay business" wordmark.
 */
export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  /** show only the glyph portion (collapsed sidebar / tight spaces) */
  compact?: boolean;
  /** kept for API compatibility with prior callers */
  variant?: "light" | "dark";
}) {
  return (
    <Image
      src="/logo.png"
      alt="bepay business"
      width={71}
      height={71}
      priority
      className={cn(
        "select-none object-contain",
        compact ? "size-9" : "size-14",
        className,
      )}
    />
  );
}
