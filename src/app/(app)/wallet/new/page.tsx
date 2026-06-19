"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Apple, ChevronRight, Copy, Info, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Step =
  | "network"
  | "passcode"
  | "confirm"
  | "biometrics"
  | "notifications"
  | "ready"
  | "backup"
  | "icloudName"
  | "icloudCustomise"
  | "encryption";

const NETWORKS = [
  { name: "Bitcoin", glyph: "₿", color: "#f7931a" },
  { name: "Ethereum", glyph: "Ξ", color: "#627eea" },
  { name: "Solana", glyph: "◎", color: "#000000" },
  { name: "Polygon", glyph: "⬡", color: "#8247e5" },
  { name: "XRPL", glyph: "✕", color: "#111111" },
  { name: "TRON", glyph: "T", color: "#e50914" },
  { name: "SUI", glyph: "💧", color: "#4da2ff" },
  { name: "TON", glyph: "T", color: "#0098ea" },
];

const SEED = [
  "Enemy", "vicious", "vicious", "Enemy", "vicious", "Notice",
  "vicious", "vicious", "Enemy", "Enemy", "vicious", "vicious",
];

const QUIZ = [
  { word: 1, answer: "Notice" },
  { word: 4, answer: "Enemy" },
  { word: 6, answer: "Notice" },
  { word: 10, answer: "Enemy" },
];
const QUIZ_OPTS = ["Notice", "Enemy", "lamp"];

export default function CreateWalletPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("network");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [passError, setPassError] = React.useState(false);

  const [manualBacked, setManualBacked] = React.useState(false);
  const [warnOpen, setWarnOpen] = React.useState(false);
  const [manualOpen, setManualOpen] = React.useState(false);
  const [quizOpen, setQuizOpen] = React.useState(false);

  const [encPass, setEncPass] = React.useState("");

  function finish() {
    toast.success("Wallet created");
    router.push("/");
  }

  function onPasscode(v: string) {
    setPass(v);
    if (v.length === 6) setStep("confirm");
  }

  function onConfirm(v: string) {
    setPassError(false);
    setConfirmPass(v);
    if (v.length === 6) {
      if (v === pass) setStep("biometrics");
      else setPassError(true);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-10">
      {/* ---------- SELECT NETWORK ---------- */}
      {step === "network" && (
        <div className="w-full max-w-2xl rounded-3xl border border-border/60 p-8">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Select network
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl bg-muted px-4 py-4 text-left text-sm font-medium text-muted-foreground"
            >
              Create or import a wallet to continue
            </button>
            {NETWORKS.map((n) => (
              <button
                key={n.name}
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-3 rounded-2xl border border-border px-4 py-4 text-left font-medium transition-colors hover:bg-muted/50"
              >
                <span
                  className="flex size-7 items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: n.color }}
                >
                  {n.glyph}
                </span>
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- PASSCODE (create) ---------- */}
      {step === "passcode" && (
        <CardShell>
          <h2 className="text-center text-2xl font-bold">Passcode</h2>
          <ChainLockArt />
          <StepCopy
            title="Create your passcode"
            body="Enter your passcode above. It will be required to unlock your wallet, be sure to remember it."
          />
          <PasscodeInput value={pass} onChange={onPasscode} />
        </CardShell>
      )}

      {/* ---------- PASSCODE (confirm) ---------- */}
      {step === "confirm" && (
        <CardShell>
          <h2 className="text-center text-2xl font-bold">Passcode</h2>
          <ChainLockArt />
          <StepCopy
            title="Confirm your passcode"
            body="Re-enter your passcode to confirm. Be sure both entries match."
          />
          <PasscodeInput
            value={confirmPass}
            invalid={passError}
            onChange={onConfirm}
          />
          {passError && (
            <p className="text-center text-sm font-medium text-danger">
              Passcodes don&apos;t match. Try again.
            </p>
          )}
        </CardShell>
      )}

      {/* ---------- BIOMETRICS ---------- */}
      {step === "biometrics" && (
        <CardShell>
          <h2 className="text-center text-2xl font-bold">Biometrics</h2>
          <FaceScanArt />
          <StepCopy
            title="Your wallet is ready!"
            body="Turn on Face ID for security."
          />
          <PrimaryStack
            primary="Enable Face ID"
            onPrimary={() => {
              toast.success("Face ID enabled");
              setStep("notifications");
            }}
            onSkip={() => setStep("notifications")}
          />
        </CardShell>
      )}

      {/* ---------- NOTIFICATIONS ---------- */}
      {step === "notifications" && (
        <CardShell>
          <h2 className="text-center text-2xl font-bold">Notifications</h2>
          <BellArt />
          <StepCopy
            title="Keep up with the market!"
            body="Turn on notifications to keep track of market movements and receive transaction updates."
          />
          <PrimaryStack
            primary="Enable Notifications"
            onPrimary={() => {
              toast.success("Notifications enabled");
              setStep("ready");
            }}
            onSkip={() => setStep("ready")}
          />
        </CardShell>
      )}

      {/* ---------- AWESOME / READY ---------- */}
      {step === "ready" && (
        <CardShell>
          <h2 className="text-center text-2xl font-bold">Awesome !</h2>
          <WalletReadyArt />
          <StepCopy
            title="Your wallet is ready"
            body="Back up your wallet to secure it. Then buy or receive crypto to get started."
          />
          <PrimaryStack
            primary="Backup Wallet"
            onPrimary={() => setStep("backup")}
            onSkip={finish}
          />
        </CardShell>
      )}

      {/* ---------- BACK UP YOUR WALLET ---------- */}
      {step === "backup" && (
        <BackupShell title="Back up your wallet">
          <BackupOptions
            manualBacked={manualBacked}
            onManual={() => setWarnOpen(true)}
            onIcloud={() => setStep("icloudName")}
          />
          <SkipLink onClick={finish} />
        </BackupShell>
      )}

      {/* ---------- NAME YOUR ICLOUD BACKUP (find) ---------- */}
      {step === "icloudName" && (
        <BackupShell title="Name your iCloud backup">
          <BackupOptions
            manualBacked={manualBacked}
            onManual={() => setWarnOpen(true)}
            onIcloud={() => setStep("icloudCustomise")}
          />
          <button
            type="button"
            onClick={() => setStep("icloudCustomise")}
            className="mx-auto mt-2 block h-14 w-full max-w-sm rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            Find your Wallet
          </button>
          <SkipLink label="I'll do later" onClick={finish} />
        </BackupShell>
      )}

      {/* ---------- CUSTOMISE ICLOUD NAME ---------- */}
      {step === "icloudCustomise" && (
        <BackupShell title="Name your iCloud backup">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Customise your iCloud backup name, so you can easily identify it
            later.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Backup name</label>
            <input
              defaultValue="Main wallet iCloud backup"
              className="h-14 w-full rounded-2xl bg-muted px-4 text-sm outline-none"
            />
          </div>
          <p className="flex items-center gap-2 text-sm text-[#c98a00]">
            <Info className="size-4 shrink-0" />
            Do not delete this backup file on iCloud, or you risk losing all your
            assets.
          </p>
          <button
            type="button"
            onClick={() => setStep("encryption")}
            className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            Continue
          </button>
        </BackupShell>
      )}

      {/* ---------- SET ENCRYPTION PASSWORD ---------- */}
      {step === "encryption" && (
        <EncryptionStep value={encPass} onChange={setEncPass} onDone={finish} />
      )}

      {/* ============ MODALS ============ */}

      {/* create a new wallet */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-center text-xl font-bold">
            Create a new wallet
          </DialogTitle>
          <button
            type="button"
            onClick={() => {
              setCreateOpen(false);
              setStep("passcode");
            }}
            className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:bg-muted/50"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted">
              <SeedIcon />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">Seed phrase wallet</span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                Secured by 12 word seed phrase. One click setup. Linked to your
                virtual debit card.
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </button>
        </DialogContent>
      </Dialog>

      {/* never share warning */}
      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-center text-xl font-bold leading-snug">
            Never share your secret phrase with anyone
          </DialogTitle>
          <div className="flex justify-center">
            <MagnifierArt />
          </div>
          <ol className="space-y-4 text-sm text-muted-foreground">
            {[
              "Your 12-word secret phrase is the master key to your wallet. Anyone that has your secret phrase can access and take your crypto.",
              "Bepay does not keep a copy of your secret phrase.",
              "Saving this digitally is not recommended. For example screenshots, text files, whatsapp yourself or emailing yourself.",
              "Write down your secret phrase, and store it in a secure offline location.",
            ].map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-medium text-foreground">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setWarnOpen(false);
              setManualOpen(true);
            }}
            className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            Got it
          </button>
        </DialogContent>
      </Dialog>

      {/* manual backup — seed phrase */}
      <ManualBackupDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        onContinue={() => {
          setManualOpen(false);
          setQuizOpen(true);
        }}
      />

      {/* confirm seed quiz */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-center text-xl font-bold">
            Confirm seed phrase
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Please tap on the correct answer that matches the order of word from
            below seed phrases
          </p>
          <QuizBody
            onConfirm={() => {
              setQuizOpen(false);
              setManualBacked(true);
              setStep("backup");
              toast.success("Wallet backed up");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared shells
// ---------------------------------------------------------------------------

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-border/60 p-8 shadow-sm">
      {children}
    </div>
  );
}

function StepCopy({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1.5 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function PrimaryStack({
  primary,
  onPrimary,
  onSkip,
}: {
  primary: string;
  onPrimary: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="w-full space-y-3 pt-1 text-center">
      <button
        type="button"
        onClick={onPrimary}
        className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
      >
        {primary}
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Skip, I&apos;ll do later
      </button>
    </div>
  );
}

function BackupShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-xl space-y-5">
      <h2 className="text-center text-2xl font-bold tracking-tight">{title}</h2>
      <div className="border-t border-border" />
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function BackupOptions({
  manualBacked,
  onManual,
  onIcloud,
}: {
  manualBacked: boolean;
  onManual: () => void;
  onIcloud: () => void;
}) {
  return (
    <>
      <div className="rounded-2xl bg-muted px-4 py-4 text-sm text-muted-foreground">
        Main wallet
      </div>
      <p className="text-sm font-semibold text-muted-foreground">Backup options</p>
      <button
        type="button"
        onClick={onManual}
        className="flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
          <Pencil className="size-5" />
        </span>
        <span>
          <span className="block font-semibold">Back up manually</span>
          <span
            className={cn(
              "block text-sm",
              manualBacked ? "text-success-fg" : "text-danger-fg",
            )}
          >
            {manualBacked ? "Active" : "Not backed"}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onIcloud}
        className="flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
          <Apple className="size-5" />
        </span>
        <span>
          <span className="block font-semibold">Back up on iCloud</span>
          <span className="block text-sm text-danger-fg">Not backed</span>
        </span>
      </button>
    </>
  );
}

function SkipLink({
  label = "Skip, I'll do later",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto block text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Passcode input (masked, 6 boxes)
// ---------------------------------------------------------------------------

function PasscodeInput({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <div
      className="relative"
      onClick={() => ref.current?.focus()}
      role="presentation"
    >
      <div className="flex gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex size-12 items-center justify-center rounded-xl border sm:size-14",
              invalid ? "border-danger" : "border-input",
            )}
          >
            {value[i] && (
              <span className="size-2.5 rounded-full bg-foreground/70" />
            )}
          </div>
        ))}
      </div>
      <input
        ref={ref}
        value={value}
        inputMode="numeric"
        autoFocus
        maxLength={6}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        aria-label="Passcode"
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Encryption password step
// ---------------------------------------------------------------------------

function EncryptionStep({
  value,
  onChange,
  onDone,
}: {
  value: string;
  onChange: (v: string) => void;
  onDone: () => void;
}) {
  const checks = {
    length: value.length >= 8,
    lower: /[a-z]/.test(value),
    upper: /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
  const valid = Object.values(checks).every(Boolean);
  const tone = (ok: boolean) => (ok ? "text-foreground" : "text-danger");

  return (
    <div className="w-full max-w-xl space-y-5">
      <h2 className="text-center text-2xl font-bold tracking-tight">
        Set encryption password
      </h2>
      <div className="border-t border-border" />
      <p className="text-sm text-muted-foreground">
        A password is required to encrypt your seed phrase on iCloud.
      </p>
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">Password</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full rounded-2xl bg-muted px-4 text-sm outline-none"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Password must contain{" "}
        <span className={tone(checks.length)}>8 or more characters</span> with at
        least <span className={tone(checks.lower)}>one lower-case letter</span>,{" "}
        <span className={tone(checks.upper)}>one upper-case letter</span>,{" "}
        <span className={tone(checks.number)}>one number</span>, and{" "}
        <span className={tone(checks.symbol)}>one symbol.</span>
      </p>
      <button
        type="button"
        disabled={!valid}
        onClick={onDone}
        className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
      >
        Set encryption password
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manual backup + quiz
// ---------------------------------------------------------------------------

function ManualBackupDialog({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onContinue: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const [ack, setAck] = React.useState(false);

  function copy() {
    navigator.clipboard?.writeText(SEED.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setAck(false);
          setCopied(false);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogTitle className="text-center text-xl font-bold">
          Manual backup
        </DialogTitle>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Info className="size-4" />
          Write down your seed phrase
        </p>
        <div className="rounded-2xl border border-border p-5">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
            {SEED.map((w, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="text-muted-foreground">{i + 1}</span>
                <span className="font-semibold">{w}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70"
          >
            <Copy className="size-4" />
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-foreground"
          />
          <span>
            I&apos;ve written down my recovery phrase safely and I am aware of the
            risk of losing it.
          </span>
        </label>
        <button
          type="button"
          disabled={!ack}
          onClick={onContinue}
          className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
        >
          Confirm Backup
        </button>
      </DialogContent>
    </Dialog>
  );
}

function QuizBody({ onConfirm }: { onConfirm: () => void }) {
  const [picks, setPicks] = React.useState<Record<number, string>>({});
  return (
    <div className="space-y-5">
      {QUIZ.map((q) => (
        <div key={q.word} className="space-y-2">
          <p className="text-sm font-semibold">Word #{q.word}</p>
          <div className="grid grid-cols-3 gap-2">
            {QUIZ_OPTS.map((opt) => {
              const active = picks[q.word] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPicks((p) => ({ ...p, [q.word]: opt }))}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground hover:bg-muted/70",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onConfirm}
        className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
      >
        Confirm Backup
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Illustrations
// ---------------------------------------------------------------------------

const artProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ChainLockArt() {
  return (
    <svg viewBox="0 0 160 120" className="h-24 text-foreground" {...artProps} aria-hidden>
      <path d="M40 30h90v50H40z" />
      <circle cx="50" cy="22" r="2" fill="currentColor" />
      <circle cx="58" cy="22" r="2" fill="currentColor" />
      <circle cx="66" cy="22" r="2" fill="currentColor" />
      <ellipse cx="46" cy="58" rx="9" ry="13" transform="rotate(-35 46 58)" />
      <ellipse cx="64" cy="72" rx="9" ry="13" transform="rotate(-35 64 72)" />
      <path d="M104 64l8 8m-8 0l8-8m6 14l6 6m-6 0l6-6" strokeWidth={2.2} />
    </svg>
  );
}

function FaceScanArt() {
  return (
    <svg viewBox="0 0 170 120" className="h-24 text-foreground" {...artProps} aria-hidden>
      <path d="M44 24h96v56H44z" transform="rotate(4 92 52)" />
      <circle cx="92" cy="52" r="16" />
      <circle cx="92" cy="52" r="6" />
      <path d="M40 96c10-2 18 2 24 8M120 30l8-6M132 42l9-2" strokeWidth={2.4} />
    </svg>
  );
}

function BellArt() {
  return (
    <svg viewBox="0 0 140 120" className="h-24 text-foreground" {...artProps} aria-hidden>
      <path d="M40 84c0-26 6-44 30-44s30 18 30 44z" transform="rotate(-8 70 70)" />
      <path d="M34 86h72" transform="rotate(-8 70 86)" />
      <path d="M62 96a8 8 0 0 0 16 0" />
      <path d="M44 40l6-6M104 44l8-4M50 30l-2-8" strokeWidth={2.4} />
    </svg>
  );
}

function WalletReadyArt() {
  return (
    <svg viewBox="0 0 150 120" className="h-24 text-foreground" {...artProps} aria-hidden>
      <path d="M30 48l70-18a4 4 0 0 1 5 3l3 13" />
      <rect x="26" y="46" width="92" height="56" rx="8" />
      <path d="M118 70h-22a8 8 0 0 0 0 16h22" />
      <circle cx="98" cy="78" r="2.5" fill="currentColor" />
      <text x="58" y="84" fontSize="20" fontWeight="bold" fill="currentColor" stroke="none">$</text>
    </svg>
  );
}

function MagnifierArt() {
  return (
    <svg viewBox="0 0 120 100" className="h-20 text-foreground" {...artProps} aria-hidden>
      <path d="M30 22l46-8 8 30-46 8z" transform="rotate(-6 53 32)" />
      <circle cx="60" cy="56" r="16" fill="white" />
      <circle cx="60" cy="56" r="16" />
      <circle cx="60" cy="56" r="6" />
      <path d="M72 68l14 14" strokeWidth={4} />
    </svg>
  );
}

function SeedIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-7 text-foreground" {...artProps} strokeWidth={2} aria-hidden>
      <path d="M16 6c6 4 6 10 0 16-6-6-6-12 0-16z" />
      <path d="M16 12v14" />
    </svg>
  );
}
