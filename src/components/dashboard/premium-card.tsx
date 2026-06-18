import { Brand } from "@/components/layout/brand";

/** Black "Premium Card" with a faint world-map dot texture and a chip. */
export function PremiumCard() {
  return (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1f27] via-[#0b0e14] to-black p-5 text-white shadow-lg">
      {/* world-map dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1.4px)",
          backgroundSize: "10px 10px",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 80%)",
        }}
      />
      {/* chip + contactless */}
      <div className="relative flex items-center gap-2">
        <span className="h-6 w-8 rounded-md bg-gradient-to-br from-yellow-200/80 to-yellow-500/60" />
        <svg viewBox="0 0 24 24" className="size-4 text-white/60" fill="none">
          <path
            d="M8.5 8.5a5 5 0 0 1 0 7M11 6a8 8 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <Brand className="size-16" />
      </div>

      <div className="relative mt-4 flex items-end justify-end">
        <span className="text-xs font-medium text-white/70">Premium Card</span>
      </div>
    </div>
  );
}
