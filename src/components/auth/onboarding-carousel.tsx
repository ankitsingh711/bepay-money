"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { cn } from "@/lib/utils";

// Left panel for auth/onboarding screens. Most steps show the rotating intro
// carousel; specific onboarding pages show their own illustration (named in
// /public/auth-pages).

const SLIDES = [
  {
    img: "/auth-pages/slide-1.png",
    title: "Sign Up and Get Rewarded Instantly",
    body: "Sign up now and enjoy exciting rewards the moment you join. It’s quick, easy, and rewarding from the start!",
  },
  {
    img: "/auth-pages/slide-2.png",
    title: "Turn Your Friends into Earnings",
    body: "Refer your friends and watch the passive income roll in. No effort, just earnings.",
  },
  {
    img: "/auth-pages/slide-3.png",
    title: "Fast & Borderless Payments",
    body: "Easily send or receive money across the globe — no delays, no barriers. Pay or get paid anytime, anywhere.",
  },
  {
    img: "/auth-pages/slide-4.png",
    title: "Create a Shop, Cash In Every Day",
    body: "Set up your store, list your products, and watch the income roll in.",
  },
];

const STATIC: Record<string, { img: string; title: string; body: string }> = {
  "/signup/success": {
    img: "/auth-pages/business-created.png",
    title: "Business account ready",
    body: "Your details are all set. Just one more step — create your shop.",
  },
  "/onboarding/shop": {
    img: "/auth-pages/create-shop.png",
    title: "Create a Shop, Cash In Every Day",
    body: "Set up your store, list your products, and watch the income roll in.",
  },
  "/onboarding/shop-address": {
    img: "/auth-pages/create-shop.png",
    title: "Create a Shop, Cash In Every Day",
    body: "Set up your store, list your products, and watch the income roll in.",
  },
  "/onboarding/done": {
    img: "/auth-pages/shop-created.png",
    title: "Shop has been created",
    body: "Thanks for providing us the details. Your shop has been created successfully.",
  },
};

function Illustration({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="max-h-[clamp(220px,42vh,420px)] w-auto object-contain"
    />
  );
}

function Panel({
  img,
  title,
  body,
  dots,
  activeDot,
  onDot,
}: {
  img: string;
  title: string;
  body: string;
  dots?: number;
  activeDot?: number;
  onDot?: (i: number) => void;
}) {
  return (
    <div className="relative flex h-full flex-col bg-sidebar px-8 py-8 text-white">
      <Brand />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-4">
        <div className="flex w-full max-w-sm items-center justify-center">
          <Illustration src={img} />
        </div>
        <div className="space-y-3 text-center">
          <h2 className="mx-auto max-w-sm text-2xl font-bold leading-snug">
            {title}
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
            {body}
          </p>
          {dots ? (
            <div className="flex justify-center gap-2 pt-1">
              {Array.from({ length: dots }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === activeDot}
                  onClick={() => onDot?.(i)}
                  className={cn(
                    "size-2 rounded-full transition-all",
                    i === activeDot ? "bg-white" : "bg-white/30",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function OnboardingCarousel() {
  const pathname = usePathname();
  const stat = STATIC[pathname];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (stat) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(id);
  }, [stat]);

  if (stat) {
    return <Panel img={stat.img} title={stat.title} body={stat.body} />;
  }

  const slide = SLIDES[index];
  return (
    <Panel
      img={slide.img}
      title={slide.title}
      body={slide.body}
      dots={SLIDES.length}
      activeDot={index}
      onDot={setIndex}
    />
  );
}
