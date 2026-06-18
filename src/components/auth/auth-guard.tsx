"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
    </div>
  );
}

/** Wraps protected (app) routes — redirects unauthenticated users to /login. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) return <FullScreenSpinner />;
  return <>{children}</>;
}

/** Wraps auth/onboarding routes — sends already-signed-in users to the app. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace("/");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) return <FullScreenSpinner />;
  return <>{children}</>;
}
