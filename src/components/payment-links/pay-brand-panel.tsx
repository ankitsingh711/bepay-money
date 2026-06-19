import Image from "next/image";
import type { Brand } from "@/lib/brand";

/**
 * The dark, branded left panel of the public payment page — a glossy orb over a
 * notched panel, the merchant logo, tagline and supporting copy. Driven entirely
 * by {@link Brand} so the admin customizer and the live `/pay` page stay in sync.
 */
export function PayBrandPanel({ brand }: { brand: Brand }) {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-8 sm:p-12"
      style={{ filter: `brightness(${brand.brightness}%)` }}
    >
      {/* logo lockup */}
      <div className="relative z-10 flex items-center gap-2.5">
        {brand.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo}
            alt={brand.businessName}
            className="size-12 rounded-xl object-contain"
          />
        ) : (
          <Image
            src="/logo.png"
            alt={brand.businessName}
            width={56}
            height={56}
            priority
            className="size-12 object-contain"
          />
        )}
      </div>

      {/* decorative art — notched panel + glossy orb */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image
          src="/payment-link-rectangle.png"
          alt=""
          aria-hidden
          width={700}
          height={460}
          className="absolute w-[78%] max-w-[460px] opacity-40"
        />
        <Image
          src="/payment-link-ellipse.png"
          alt=""
          aria-hidden
          width={360}
          height={360}
          priority
          className="relative w-[46%] max-w-[300px] drop-shadow-2xl"
          style={{ mixBlendMode: "screen" }}
        />
      </div>

      {/* headline */}
      <div
        className="relative z-10 max-w-md space-y-4"
        style={{ fontSize: `${brand.textSize}%` }}
      >
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {brand.tagline}
        </h1>
        <p className="text-sm leading-relaxed text-white/55">
          {brand.description}
        </p>
      </div>
    </div>
  );
}
