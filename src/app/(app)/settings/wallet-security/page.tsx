"use client";

import * as React from "react";
import {
  Cloud,
  KeyRound,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/common/copy-button";
import { cn } from "@/lib/utils";

const WORDS = [
  "anchor", "ribbon", "ladder", "puzzle", "garden", "velvet", "mirror", "harbor",
  "copper", "meadow", "signal", "orbit", "pencil", "summit", "willow", "cobalt",
];

function makePhrase(seed: number): string[] {
  const out: string[] = [];
  let s = (seed >>> 0) || 1;
  for (let i = 0; i < 12; i++) {
    s = Math.imul(s ^ (i + 1), 2654435761) >>> 0;
    out.push(WORDS[(s >>> 8) % WORDS.length]);
  }
  return out;
}

function OptionCard({
  icon: Icon,
  title,
  status,
  statusTone = "muted",
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  status: string;
  statusTone?: "muted" | "success" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-left transition-colors hover:bg-muted/60"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-foreground shadow-sm">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p
          className={cn(
            "text-sm",
            statusTone === "success" && "text-success-fg",
            statusTone === "danger" && "text-danger-fg",
            statusTone === "muted" && "text-muted-foreground",
          )}
        >
          {status}
        </p>
      </div>
    </button>
  );
}

export default function WalletSecurityPage() {
  const [icloudBacked, setIcloudBacked] = React.useState(false);
  const [manualBacked, setManualBacked] = React.useState(false);
  const [warnFor, setWarnFor] = React.useState<"phrase" | "keys" | null>(null);
  const [phraseOpen, setPhraseOpen] = React.useState(false);
  const [keysOpen, setKeysOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [networkOpen, setNetworkOpen] = React.useState(false);

  function proceedFromWarning() {
    const intent = warnFor;
    setWarnFor(null);
    if (intent === "phrase") {
      setManualBacked(true);
      setPhraseOpen(true);
    } else if (intent === "keys") {
      setKeysOpen(true);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h3 className="text-2xl font-bold tracking-tight">Manage Wallets</h3>
      <p className="mt-1 text-muted-foreground">Backup options</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionCard
          icon={Pencil}
          title="Back up manually"
          status={manualBacked ? "Backed up" : "Recommended"}
          statusTone={manualBacked ? "success" : "muted"}
          onClick={() => setWarnFor("phrase")}
        />
        <OptionCard
          icon={Cloud}
          title="Back up on iCloud"
          status={icloudBacked ? "Backed up" : "Not backed"}
          statusTone={icloudBacked ? "success" : "danger"}
          onClick={() => {
            setIcloudBacked(true);
            toast.success("Backed up to iCloud");
          }}
        />
        <OptionCard
          icon={ScrollText}
          title="View secret phrase"
          status="12-word recovery phrase"
          onClick={() => setWarnFor("phrase")}
        />
        <OptionCard
          icon={KeyRound}
          title="View private keys"
          status="Per-network keys"
          onClick={() => setWarnFor("keys")}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1 border-danger/40 text-danger-fg hover:bg-danger-bg"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete wallet from this device
        </Button>
        <Button className="flex-1" onClick={() => setNetworkOpen(true)}>
          <Plus />
          Add Network
        </Button>
      </div>

      <SecretWarningDialog
        open={warnFor !== null}
        onOpenChange={(o) => !o && setWarnFor(null)}
        onProceed={proceedFromWarning}
      />
      <PhraseDialog open={phraseOpen} onOpenChange={setPhraseOpen} />
      <PrivateKeysDialog open={keysOpen} onOpenChange={setKeysOpen} />
      <DeleteWalletDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
      <AddNetworkDialog open={networkOpen} onOpenChange={setNetworkOpen} />
    </div>
  );
}

function SecretWarningDialog({
  open,
  onOpenChange,
  onProceed,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onProceed: () => void;
}) {
  const POINTS = [
    "Your 12-word secret phrase is the master key to your wallet. Anyone that has your secret phrase can access and take your crypto.",
    "Bepay does not keep a copy of your secret phrase.",
    "Saving this digitally is not recommended. For example screenshots, text files, whatsapp yourself or emailing yourself.",
    "Write down your secret phrase, and store it in a secure offline location.",
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <div className="flex justify-center">
          <MoneyArt />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">
            Never share your secret phrase with anyone
          </DialogTitle>
        </DialogHeader>
        <ol className="space-y-4">
          {POINTS.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{i + 1}.</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <Button size="lg" className="mt-2 w-full" onClick={onProceed}>
          Got It
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PhraseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const phrase = React.useMemo(() => makePhrase(42), []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Your secret phrase</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Write these 12 words down in order and store them safely.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          {phrase.map((word, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
            >
              <span className="mr-1 text-muted-foreground">{i + 1}.</span>
              {word}
            </div>
          ))}
        </div>
        <CopyButton
          value={phrase.join(" ")}
          label="Copy phrase"
          className="w-full"
        />
      </DialogContent>
    </Dialog>
  );
}

function PrivateKeysDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const key =
    "0x" +
    Array.from({ length: 64 }, (_, i) =>
      "0123456789abcdef".charAt((i * 7 + 3) % 16),
    ).join("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Private key</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Never share your private key. Anyone with it controls your funds.
          </p>
        </DialogHeader>
        <div className="break-all rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs">
          {key}
        </div>
        <CopyButton value={key} label="Copy private key" className="w-full" />
      </DialogContent>
    </Dialog>
  );
}

function DeleteWalletDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle>Delete wallet from this device?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            You can only restore it with your 12-word secret phrase. Make sure
            you’ve backed it up.
          </p>
        </DialogHeader>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              toast.success("Wallet removed from this device");
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const NETWORKS = ["Polygon", "Ethereum", "Base", "Arbitrum", "Optimism"];

function AddNetworkDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a network</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose a network to enable for this wallet.
          </p>
        </DialogHeader>
        <ul className="space-y-2">
          {NETWORKS.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  toast.success(`${n} network added`);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left text-sm font-medium transition-colors hover:bg-muted"
              >
                {n}
                <Plus className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function MoneyArt() {
  return (
    <svg viewBox="0 0 120 90" className="h-20" fill="none">
      <rect x="14" y="20" width="74" height="42" rx="6" transform="rotate(-6 51 41)" fill="#fff" stroke="#0b0e14" strokeWidth="3" />
      <circle cx="51" cy="40" r="11" transform="rotate(-6 51 40)" fill="#fff" stroke="#0b0e14" strokeWidth="3" />
      <path d="M51 35v10M48 38h4.5a2 2 0 0 1 0 4H50a2 2 0 0 0 0 4h5" stroke="#0b0e14" strokeWidth="2" strokeLinecap="round" />
      <circle cx="84" cy="60" r="14" fill="#fff" stroke="#0b0e14" strokeWidth="3" />
      <path d="M94 70l10 10" stroke="#0b0e14" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
