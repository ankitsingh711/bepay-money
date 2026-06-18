import { cn } from "@/lib/utils";

/** Pixel-tile bepay glyph (approximation of the logo mark). */
function Glyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 grid-cols-3 grid-rows-3 gap-[2px] rounded-md bg-white/10 p-1",
        className,
      )}
      aria-hidden
    >
      {[1, 1, 0, 1, 0, 1, 0, 1, 1].map((on, i) => (
        <span
          key={i}
          className={cn("rounded-[1px]", on ? "bg-white" : "bg-transparent")}
        />
      ))}
    </span>
  );
}

/** bepay wordmark with the tile glyph. */
export function Brand({
  className,
  variant = "light",
  compact = false,
}: {
  className?: string;
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  if (compact) {
    return <Glyph />;
  }
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Glyph className={variant === "dark" ? "bg-foreground/10" : undefined} />
      <span
        className={cn(
          "text-[13px] font-semibold tracking-tight",
          variant === "light" ? "text-white" : "text-foreground",
        )}
      >
        bepay{" "}
        <span
          className={cn(
            "text-[11px] font-normal",
            variant === "light" ? "text-white/55" : "text-muted-foreground",
          )}
        >
          business
        </span>
      </span>
    </div>
  );
}
