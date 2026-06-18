"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M16.37 12.6c.02 2.5 2.2 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.1-2.63-2.11-1.42-2.07-2.51-5.85-1.05-8.4a4.07 4.07 0 0 1 3.44-2.1c1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.2-.77.55.02 2.08.22 3.07 1.67-.08.05-1.83 1.07-1.81 3.2M14.3 4.36c.58-.7.97-1.68.86-2.66-.84.04-1.85.56-2.45 1.26-.53.62-1 1.62-.88 2.58.94.07 1.89-.48 2.47-1.18" />
    </svg>
  );
}

export function SocialButtons() {
  function notImplemented(provider: string) {
    toast.info(`${provider} sign-in is mocked in this demo`);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => notImplemented("Google")}
      >
        <GoogleIcon />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => notImplemented("Apple")}
      >
        <AppleIcon />
        Apple
      </Button>
    </div>
  );
}
