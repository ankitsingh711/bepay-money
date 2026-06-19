import { cn } from "@/lib/utils";

/** Segmented progress bar for the onboarding stages. */
export function StepProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < current ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{current}</span> of{" "}
        {total}
        {label ? ` — ${label}` : ""}
      </p>
    </div>
  );
}
