import { OnboardingCarousel } from "./onboarding-carousel";

/**
 * Split auth layout: the rotating onboarding panel on the left (desktop) and
 * the step content on the right. Used by every auth/onboarding screen.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:block">
        <OnboardingCarousel />
      </div>
      <div className="flex flex-col items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
