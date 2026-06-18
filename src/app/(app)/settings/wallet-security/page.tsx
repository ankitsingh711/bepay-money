"use client";

import * as React from "react";
import {
  Eye,
  KeyRound,
  Loader2,
  Plus,
  ShieldAlert,
  Wallet as WalletIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/common/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { truncateMiddle } from "@/lib/format";

const WORDS = [
  "anchor", "ribbon", "ladder", "puzzle", "garden", "velvet", "mirror", "harbor",
  "copper", "meadow", "signal", "orbit", "pencil", "summit", "willow", "cobalt",
];

function makePhrase(seed: number): string[] {
  // deterministic-ish 12 words for the demo
  const out: string[] = [];
  let s = seed;
  for (let i = 0; i < 12; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out.push(WORDS[s % WORDS.length]);
  }
  return out;
}

interface WalletItem {
  id: string;
  name: string;
  address: string;
  primary?: boolean;
}

export default function WalletSecurityPage() {
  const [wallets, setWallets] = React.useState<WalletItem[]>([
    {
      id: "w1",
      name: "Primary wallet",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      primary: true,
    },
    {
      id: "w2",
      name: "Payouts wallet",
      address: "0x9aB3F2c4D5e6789012345678E41cB0a1d2e3F456",
    },
  ]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [phraseOpen, setPhraseOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Manage wallets</CardTitle>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            New wallet
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <WalletIcon className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{w.name}</p>
                    {w.primary && <Badge variant="success">Primary</Badge>}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {truncateMiddle(w.address, 10, 8)}
                  </p>
                </div>
              </div>
              <CopyButton value={w.address} size="icon" variant="ghost" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery phrase</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-warning-bg text-warning-fg">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="font-medium">Back up your wallet</p>
              <p className="text-sm text-muted-foreground">
                Your 12-word phrase is the only way to recover your funds.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setPhraseOpen(true)}>
            <Eye />
            Reveal
          </Button>
        </CardContent>
      </Card>

      <CreateWalletDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(name, address) => {
          setWallets((w) => [...w, { id: `w${w.length + 1}`, name, address }]);
          toast.success("Wallet created");
        }}
      />
      <PhraseDialog open={phraseOpen} onOpenChange={setPhraseOpen} seed={42} />
    </>
  );
}

function PhraseDialog({
  open,
  onOpenChange,
  seed,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  seed: number;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const phrase = React.useMemo(() => makePhrase(seed), [seed]);

  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(() => setRevealed(false), 200);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recovery phrase</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-2 rounded-xl bg-warning-bg p-3 text-warning-fg">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs">
            Never share this phrase. Anyone with it can access your funds. This
            is mocked demo data.
          </p>
        </div>
        <div className="relative">
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
          {!revealed && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                <Eye className="size-4" />
                Tap to reveal
              </span>
            </button>
          )}
        </div>
        {revealed && (
          <CopyButton
            value={phrase.join(" ")}
            label="Copy phrase"
            className="w-full"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateWalletDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (name: string, address: string) => void;
}) {
  const [step, setStep] = React.useState<"name" | "backup">("name");
  const [name, setName] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const phrase = React.useMemo(() => makePhrase(name.length + 7), [name.length]);
  const address = React.useMemo(
    () =>
      "0x" +
      Array.from({ length: 40 }, (_, i) =>
        "0123456789abcdef".charAt((i * 7 + name.length) % 16),
      ).join(""),
    [name.length],
  );

  function close(o: boolean) {
    onOpenChange(o);
    if (!o)
      setTimeout(() => {
        setStep("name");
        setName("");
      }, 200);
  }

  function generate(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setStep("backup");
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "name" ? "Create a new wallet" : "Back up your wallet"}
          </DialogTitle>
        </DialogHeader>

        {step === "name" ? (
          <form onSubmit={generate} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="wname" className="text-sm font-medium">
                Wallet name
              </label>
              <input
                id="wname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Savings wallet"
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
              />
            </div>
            <Button type="submit" className="w-full" disabled={creating}>
              {creating && <Loader2 className="animate-spin" />}
              {creating ? "Generating…" : "Generate wallet"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Write down these 12 words and store them safely. You’ll need them
              to recover this wallet.
            </p>
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
            <Button
              className="w-full"
              onClick={() => {
                onCreated(name, address);
                close(false);
              }}
            >
              I’ve saved my phrase
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
