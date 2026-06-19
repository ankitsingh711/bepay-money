import { Brand } from "@/components/layout/brand";

/**
 * Black "Premium Card" rendered in CSS/SVG so it stays razor-sharp at any size:
 * a faint world-map dot texture, a silver EMV chip + contactless glyph, the
 * centred bepay lockup and a "Premium Card" tag.
 */
export function PremiumCard() {
  return (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#23272f] via-[#0d1016] to-black text-white shadow-xl ring-1 ring-white/5">
      {/* world-map dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1.4px)",
          backgroundSize: "9px 9px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at center, black 50%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at center, black 50%, transparent 85%)",
        }}
      />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* chip + contactless */}
        <div className="flex items-center gap-2.5">
          <span className="relative h-7 w-9 overflow-hidden rounded-[6px] bg-gradient-to-br from-[#eceef2] via-[#bcc0c8] to-[#8a8d97] shadow-inner sm:h-8 sm:w-11">
            <span className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-black/25" />
            <span className="absolute inset-y-1.5 left-1/2 w-px -translate-x-1/2 bg-black/25" />
            <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-black/30 sm:size-3.5" />
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
        <div className="flex flex-1 items-center justify-center">
          <Brand className="size-20 sm:size-24" />
        </div>

        {/* premium tag */}
        <div className="flex justify-end">
          <span className="text-sm font-semibold tracking-wide text-white/85">
            Premium Card
          </span>
        </div>
      </div>
    </div>
  );
}
