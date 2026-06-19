import { Brand } from "@/components/layout/brand";

/**
 * Black "Premium Card" matching the supplied artwork: a faint world-map dot
 * texture, a silver EMV chip + contactless glyph, the centred bepay lockup and
 * a "Premium Card" tag.
 */
export function PremiumCard() {
  return (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#23272f] via-[#0d1016] to-black p-5 text-white shadow-lg">
      {/* world-map dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1.4px)",
          backgroundSize: "9px 9px",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 82%)",
        }}
      />

      {/* chip + contactless */}
      <div className="relative flex items-center gap-2.5">
        <span className="relative h-7 w-9 overflow-hidden rounded-[6px] bg-gradient-to-br from-[#e8e8ec] via-[#b9bcc4] to-[#8d909a] shadow-inner">
          <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-black/25" />
          <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-black/25" />
          <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-black/25" />
        </span>
        <svg viewBox="0 0 24 24" className="size-4 text-white/55" fill="none">
          <path
            d="M8.5 8.5a5 5 0 0 1 0 7M11 6a8 8 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* centred lockup */}
      <div className="relative mt-5 flex items-center justify-center sm:mt-7">
        <Brand className="size-20" />
      </div>

      {/* premium tag */}
      <div className="absolute bottom-5 right-5">
        <span className="text-sm font-semibold tracking-wide text-white/85">
          Premium Card
        </span>
      </div>
    </div>
  );
}
