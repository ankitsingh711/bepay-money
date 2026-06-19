"use client";

import * as React from "react";
import { Brand } from "@/components/layout/brand";
import { cn } from "@/lib/utils";

// Rotating onboarding panel for the auth screens. Illustrations live in
// /public/auth-pages (provided design artwork); the headline, copy and dots
// are rendered as crisp text on top.

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
    <div className="relative flex h-full flex-col bg-sidebar px-8 py-8 text-white">
      <Brand />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-4">
        {/* illustration (each PNG has the arched backdrop baked in) */}
        <div className="flex w-full max-w-sm items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={slide.img}
            src={slide.img}
            alt=""
            className="max-h-[clamp(220px,42vh,420px)] w-auto object-contain"
          />
        </div>

        <div className="space-y-3 text-center">
          <h2 className="mx-auto max-w-sm text-2xl font-bold leading-snug">
            {slide.title}
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
            {slide.body}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-2 bg-white" : "w-2 bg-white/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
