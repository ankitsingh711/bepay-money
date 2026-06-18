"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/common/copy-button";
import { QrCode } from "@/components/payment-links/qr-code";
import { useWallet } from "@/hooks/queries";
import { Skeleton } from "@/components/ui/skeleton";

export function ReceiveDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { data: wallet, isLoading } = useWallet();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive crypto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5">
          <p className="text-center text-sm text-muted-foreground">
            Scan this QR or share your wallet address to receive funds.
          </p>
          {isLoading || !wallet ? (
            <Skeleton className="size-44 rounded-2xl" />
          ) : (
            <>
              <QrCode value={wallet.address} size={180} />
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium">
                  Wallet address
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={wallet.address}
                    className="font-mono text-xs"
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <CopyButton
                    value={wallet.address}
                    label="Copy"
                    toastMessage="Address copied"
                    className="shrink-0"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
