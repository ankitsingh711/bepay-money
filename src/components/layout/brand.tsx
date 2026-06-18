import { cn } from "@/lib/utils";

/** bepay wordmark with the coin glyph, used in the sidebar. */
export function Brand({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-lg text-sm font-bold",
          variant === "light"
            ? "bg-white text-sidebar"
            : "bg-primary text-primary-foreground",
        )}
        aria-hidden
      >
        b
      </span>
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          variant === "light" ? "text-white" : "text-foreground",
        )}
      >
        bepay
        <span
          className={cn(
            "ml-1 text-[11px] font-normal",
            variant === "light" ? "text-white/55" : "text-muted-foreground",
          )}
        >
          business
        </span>
      </span>
    </div>
  );
}
