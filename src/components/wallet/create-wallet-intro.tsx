"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/** Laptop + magnified Bitcoin line illustration shown on the Web3 intro. */
function LaptopBtcArt() {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-32 text-foreground"
      aria-hidden
    >
      {/* screen */}
      <path d="M48 36h104v66H48z" />
      {/* base */}
      <path d="M30 116h140l-10-14H40z" />
      {/* magnifier ring with BTC */}
      <circle cx="108" cy="62" r="26" fill="white" />
      <circle cx="108" cy="62" r="26" />
      <path d="M108 49v26M101 55h11a5 5 0 0 1 0 10h-9a5 5 0 0 0 0 10h11" />
      <path d="M127 81l16 16" strokeWidth={5} />
      {/* sparkle motion lines */}
      <path d="M140 44l8-4M142 54l9 0M138 34l6-6" strokeWidth={2.5} />
      {/* hand */}
      <path d="M150 104c8 2 18 4 22 12M156 100c6 0 12 2 14 8" strokeWidth={2.5} />
    </svg>
  );
}

export function CreateWalletIntro({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-6 p-8 text-center">
        <div className="flex justify-center pt-2">
          <LaptopBtcArt />
        </div>
        <div className="space-y-2">
          <DialogTitle className="text-2xl font-bold">
            Explore. Transact. Thrive in Web3
          </DialogTitle>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            Get started in seconds, create a brand-new wallet with full security,
            or seamlessly import your existing one to continue managing your
            assets with ease.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-14 flex-1 rounded-full border border-foreground text-base font-medium transition-colors hover:bg-muted"
          >
            Remind me Later
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              router.push("/wallet/new");
            }}
            className="h-14 flex-1 rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            Add Network
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
