"use client";

import * as React from "react";
import { Coins } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    title: "Sign Up and Get Rewarded Instantly",
    body: "Sign up now and enjoy exciting rewards the moment you join. It’s quick, easy, and rewarding from the start!",
  },
  {
    title: "Turn Your Friends into Earnings",
    body: "Refer your friends and watch the passive income roll in. No effort, just earnings.",
  },
  {
    title: "Fast & Borderless Payments",
    body: "Easily send or receive money across the globe — no delays, no barriers. Pay or get paid anytime, anywhere.",
  },
  {
    title: "Create a Shop, Cash In Every Day",
    body: "Set up your store, list your products, and watch the income roll in.",
  },
];

export function OnboardingCarousel() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-sidebar p-10 text-white">
      <Brand />

      {/* decorative illustration */}
      <div className="relative flex flex-1 items-center justify-center">
        <div className="absolute size-72 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
        <div className="relative flex size-44 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur">
          <Coins className="size-20 text-white/90" strokeWidth={1.2} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold leading-tight">{slide.title}</h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            {slide.body}
          </p>
        </div>
        <div className="flex gap-1.5" aria-label="Onboarding slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/30",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
