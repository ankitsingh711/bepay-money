"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

// Boots the MSW worker on the client before rendering the app, then provides
// the React Query client and global toaster.

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Gate render until MSW is ready so the first fetches are intercepted.
  const [mockReady, setMockReady] = useState(
    process.env.NODE_ENV === "test",
  );

  useEffect(() => {
    let active = true;
    async function start() {
      const { worker } = await import("@/lib/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        quiet: true,
      });
      if (active) setMockReady(true);
    }
    start();
    return () => {
      active = false;
    };
  }, []);

  if (!mockReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
