"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRightLeft,
  Contact as ContactIcon,
  History,
  Pencil,
  Plus,
  Scan,
  Search,
  SendHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ---- local catalog (UI mock — independent of the strict domain Token type) ----
interface Asset {
  sym: string;
  label: string;
  network: string;
  chain: string;
  balance: string;
  fiat: string;
  color: string;
  glyph: string;
}

const ASSETS: Asset[] = [
  { sym: "BTC", label: "BTC", network: "Bitcoin network", chain: "Bitcoin", balance: "0.25", fiat: "$1190", color: "#f7931a", glyph: "₿" },
  { sym: "USDT", label: "USDT (ERC 20)", network: "Ethereum network", chain: "Ethereum", balance: "200", fiat: "$200", color: "#26a17b", glyph: "₮" },
  { sym: "ETH", label: "Etherium", network: "Ethereum network", chain: "Ethereum", balance: "0.08", fiat: "$1190", color: "#1f1f1f", glyph: "Ξ" },
  { sym: "TON", label: "TON", network: "TON network", chain: "TON", balance: "0.25", fiat: "$1190", color: "#0098ea", glyph: "T" },
  { sym: "XRP", label: "XRP", network: "XRPL network", chain: "XRPL", balance: "0.25", fiat: "$1190", color: "#111111", glyph: "✕" },
  { sym: "USDC", label: "USDC", network: "Solana network", chain: "Solana", balance: "0.25", fiat: "$1190", color: "#2775ca", glyph: "$" },
  { sym: "HBAR", label: "HBAR", network: "Hedera hashgraph", chain: "Hedera", balance: "0.25", fiat: "$1190", color: "#000000", glyph: "ℏ" },
];

const CHAINS = ["All", "Bitcoin", "Ethereum", "Solana", "TON"];

const PAYEE_TABS = ["Wallet address", "UID", "Phone", "Email"] as const;

interface SavedAddress {
  id: string;
  name: string;
  address: string;
}

const INITIAL_SAVED: SavedAddress[] = [
  { id: "a1", name: "BTC Binance address", address: "0xde2b741duif4839hf4394f48735tyw98dnvcvreb75c3ee52493" },
  { id: "a2", name: "BTC Weex exchange address", address: "0xde2b741duif4839hf4394f48735tyw98dnvcvreb75c3ee52493" },
];

interface Contact {
  id: string;
  name: string;
  phone: string;
  invited: boolean;
}

const CONTACTS: Contact[] = [
  { id: "c1", name: "Aakash Sharma", phone: "(+91) 9953790289", invited: true },
  { id: "c2", name: "Aakash Sharma", phone: "(+91) 9953790289", invited: false },
  { id: "c3", name: "Aakash Sharma", phone: "(+91) 9953790289", invited: false },
  { id: "c4", name: "Bineet Khurana", phone: "(+91) 9953790289", invited: false },
  { id: "c5", name: "Bineet Khurana", phone: "(+91) 9953790289", invited: false },
  { id: "c6", name: "Bineet Khurana", phone: "(+91) 9953790289", invited: false },
];

const HISTORY = [
  {
    date: "Tue, Jul 8",
    items: [{ kind: "Sent", time: "16:26:56", in: "+0.01 BTC", out: "-10.00 USDT" }],
  },
  {
    date: "Fri, June 29",
    items: [{ kind: "Sent", time: "16:26:56", in: "+0.01 BTC", out: "-10.00 USDT" }],
  },
];

function shortAddr(a: string) {
  return a.length > 16 ? `${a.slice(0, 7)}…${a.slice(-7)}` : a;
}

function AssetIcon({ asset, size = 40 }: { asset: Asset; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ backgroundColor: asset.color, width: size, height: size, fontSize: size * 0.45 }}
    >
      {asset.glyph}
    </span>
  );
}

type View = "form" | "tokens" | "history" | "addresses" | "addAddress";

export function SendSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [view, setView] = React.useState<View>("form");
  const [payeeTab, setPayeeTab] = React.useState<(typeof PAYEE_TABS)[number]>(
    "Wallet address",
  );
  const [asset, setAsset] = React.useState<Asset | null>(null);
  const [address, setAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const [tokenSearch, setTokenSearch] = React.useState("");
  const [chain, setChain] = React.useState("All");
  const [contactSearch, setContactSearch] = React.useState("");
  const [saved, setSaved] = React.useState<SavedAddress[]>(INITIAL_SAVED);

  // new-address form
  const [newAddr, setNewAddr] = React.useState("");
  const [newName, setNewName] = React.useState("");

  // overlay dialogs
  const [confirmSend, setConfirmSend] = React.useState(false);
  const [security, setSecurity] = React.useState<null | "send" | "addAddress">(null);
  const [passcode, setPasscode] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<SavedAddress | null>(null);
  const [inviteTarget, setInviteTarget] = React.useState<Contact | null>(null);
  const [discardOpen, setDiscardOpen] = React.useState(false);

  const dirty = Boolean(asset || address || amount);
  // A nested centered dialog is open — its overlay must not be treated as an
  // "interact outside" that closes the slide-over.
  const childOpen =
    confirmSend ||
    security !== null ||
    deleteTarget !== null ||
    inviteTarget !== null ||
    discardOpen;
  const fee = "0.00005";
  const canSend =
    !!asset && address.trim().length > 4 && Number(amount) > 0;

  function reset() {
    setView("form");
    setPayeeTab("Wallet address");
    setAsset(null);
    setAddress("");
    setAmount("");
    setTokenSearch("");
    setChain("All");
    setContactSearch("");
    setNewAddr("");
    setNewName("");
    setConfirmSend(false);
    setSecurity(null);
    setPasscode("");
  }

  function reallyClose() {
    onOpenChange(false);
    setTimeout(reset, 250);
  }

  // Intercept close: warn if the form has unsaved input and we're on the root view.
  function requestClose() {
    if (dirty && view === "form") {
      setDiscardOpen(true);
    } else if (view !== "form") {
      setView("form");
    } else {
      reallyClose();
    }
  }

  function finishSend() {
    setSecurity(null);
    setPasscode("");
    toast.success("Executed successfully!");
    reset();
  }

  const filteredTokens = ASSETS.filter(
    (a) =>
      (chain === "All" || a.chain === chain) &&
      (a.sym.toLowerCase().includes(tokenSearch.toLowerCase()) ||
        a.label.toLowerCase().includes(tokenSearch.toLowerCase())),
  );

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()),
  );

  return (
    <>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) requestClose();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onInteractOutside={(e) => {
              e.preventDefault();
              if (!childOpen) requestClose();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              if (!childOpen) requestClose();
            }}
            className="fixed inset-y-0 right-0 z-40 flex h-full w-full max-w-md flex-col rounded-l-[2rem] bg-card shadow-2xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right"
          >
            <DialogPrimitive.Title className="sr-only">
              Send assets
            </DialogPrimitive.Title>

            {view === "form" && (
              <FormView
                payeeTab={payeeTab}
                onPayeeTab={setPayeeTab}
                asset={asset}
                address={address}
                amount={amount}
                onAddress={setAddress}
                onAmount={setAmount}
                fee={fee}
                canSend={canSend}
                onPickToken={() => setView("tokens")}
                onOpenAddresses={() => setView("addresses")}
                onHistory={() => setView("history")}
                onAll={() => asset && setAmount(asset.balance)}
                onSend={() => setConfirmSend(true)}
              />
            )}

            {view === "tokens" && (
              <TokensView
                search={tokenSearch}
                onSearch={setTokenSearch}
                chain={chain}
                onChain={setChain}
                tokens={filteredTokens}
                onBack={() => setView("form")}
                onSelect={(a) => {
                  setAsset(a);
                  setView("form");
                }}
              />
            )}

            {view === "history" && <HistoryView onBack={() => setView("form")} />}

            {view === "addresses" && (
              <AddressesView
                asset={asset}
                saved={saved}
                contacts={filteredContacts}
                contactSearch={contactSearch}
                onContactSearch={setContactSearch}
                onBack={() => setView("form")}
                onSelect={(a) => {
                  setAddress(a.address);
                  setView("form");
                }}
                onDelete={(a) => setDeleteTarget(a)}
                onInvite={(c) => setInviteTarget(c)}
                onAdd={() => setView("addAddress")}
              />
            )}

            {view === "addAddress" && (
              <AddAddressView
                asset={asset}
                addr={newAddr}
                name={newName}
                onAddr={setNewAddr}
                onName={setNewName}
                onBack={() => setView("addresses")}
                onSave={() => setSecurity("addAddress")}
              />
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* ---- confirm send ---- */}
      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="px-2 text-center text-base font-semibold leading-relaxed">
              Are you sure you want to send{" "}
              <span className="font-bold">
                {amount || "0"} {asset?.sym}
              </span>{" "}
              to{" "}
              <span className="break-all font-bold">{address}</span>?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">
                {fee} {asset?.sym}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. receiving amount</span>
              <span className="font-medium">
                {Math.max(Number(amount) - Number(fee), 0).toFixed(5)}
                {asset?.sym}
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="text-sm font-semibold">Reminder</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Please ensure that the receiving address supports this specific
              cryptocurrency (and network). Sending assets to incompatible
              addresses may result in permanent loss of funds.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmSend(false)}
              className="h-12 flex-1 rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmSend(false);
                setSecurity("send");
              }}
              className="h-12 flex-1 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Send
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- security verification ---- */}
      <Dialog
        open={security !== null}
        onOpenChange={(o) => {
          if (!o) {
            setSecurity(null);
            setPasscode("");
          }
        }}
      >
        <DialogContent className="max-w-sm gap-5">
          <DialogHeader className="text-left">
            <DialogTitle>Security verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="passcode" className="text-sm font-medium">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              inputMode="numeric"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-card px-3 text-base focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
            />
          </div>
          <button
            type="button"
            disabled={passcode.length < 4}
            onClick={() => {
              if (security === "addAddress") {
                setSaved((s) => [
                  ...s,
                  {
                    id: `a${s.length + 1}`,
                    name: newName || "New address",
                    address: newAddr,
                  },
                ]);
                setNewAddr("");
                setNewName("");
                setSecurity(null);
                setPasscode("");
                setView("addresses");
                toast.success("Address added");
              } else {
                finishSend();
              }
            }}
            className="h-12 w-full rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
          >
            Save
          </button>
        </DialogContent>
      </Dialog>

      {/* ---- delete saved address ---- */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm" hideClose>
          <p className="px-2 text-center text-base font-semibold leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold">{deleteTarget?.name}</span>{" "}
            {deleteTarget && shortAddr(deleteTarget.address)}?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-12 flex-1 rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setSaved((s) => s.filter((a) => a.id !== deleteTarget?.id));
                setDeleteTarget(null);
              }}
              className="h-12 flex-1 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- invite / new message ---- */}
      <Dialog
        open={inviteTarget !== null}
        onOpenChange={(o) => !o && setInviteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>New message</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-border pb-3 text-sm">
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium">{inviteTarget?.name}</span>
          </div>
          <div className="space-y-3 rounded-2xl bg-muted/50 p-4">
            <p className="text-sm leading-relaxed">
              Hey, I&apos;d like to send you crypto. Join me at bepay money using
              this link below-
            </p>
            <div className="space-y-2 rounded-xl bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" className="size-5" />
                bepay money
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" className="size-5 invert" />
                <span>
                  Download bepay money
                  <span className="block text-background/60">
                    Use crypto like cash
                  </span>
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setInviteTarget(null);
              toast.success("Invite sent");
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <SendHorizontal className="size-4" />
            Send invite
          </button>
        </DialogContent>
      </Dialog>

      {/* ---- discard confirm ---- */}
      <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <DialogContent className="max-w-md" hideClose>
          <div className="flex flex-col items-center gap-6 py-2 text-center">
            <DialogTitle className="max-w-[16rem] text-xl font-bold leading-snug">
              Are you sure you don&apos;t want to send money
            </DialogTitle>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => {
                  setDiscardOpen(false);
                  reallyClose();
                }}
                className="h-12 flex-1 rounded-full border border-danger text-sm font-medium text-danger transition-colors hover:bg-danger/5"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setDiscardOpen(false)}
                className="h-12 flex-1 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                No
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function SheetHead({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-7 pb-2 pt-7">
      <div className="flex items-start gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 mt-1 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function FormView({
  payeeTab,
  onPayeeTab,
  asset,
  address,
  amount,
  onAddress,
  onAmount,
  fee,
  canSend,
  onPickToken,
  onOpenAddresses,
  onHistory,
  onAll,
  onSend,
}: {
  payeeTab: (typeof PAYEE_TABS)[number];
  onPayeeTab: (t: (typeof PAYEE_TABS)[number]) => void;
  asset: Asset | null;
  address: string;
  amount: string;
  onAddress: (v: string) => void;
  onAmount: (v: string) => void;
  fee: string;
  canSend: boolean;
  onPickToken: () => void;
  onOpenAddresses: () => void;
  onHistory: () => void;
  onAll: () => void;
  onSend: () => void;
}) {
  async function paste() {
    try {
      const t = await navigator.clipboard.readText();
      if (t) onAddress(t);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <>
      <SheetHead
        title="Send Assets To"
        subtitle="Send your assets quicky and effortlessly"
        right={
          <button
            type="button"
            onClick={onHistory}
            aria-label="History"
            className="mt-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <History className="size-5" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-7 py-4">
        <div className="rounded-3xl bg-muted/40 p-5">
          {/* payee header + tabs */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-semibold">New payee</span>
            <Scan className="size-5 text-muted-foreground" />
          </div>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {PAYEE_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onPayeeTab(t)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  payeeTab === t
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* token & network */}
          <p className="mb-2 text-sm font-semibold">Token &amp; network</p>
          <button
            type="button"
            onClick={onPickToken}
            className="mb-5 flex h-14 w-full items-center rounded-2xl bg-card px-4 text-left"
          >
            {asset ? (
              <span className="flex items-center gap-2.5 font-medium">
                <AssetIcon asset={asset} size={28} />
                {asset.sym} ({asset.network})
              </span>
            ) : (
              <span className="text-muted-foreground">Select a token to send</span>
            )}
          </button>

          {/* address */}
          <p className="mb-2 text-sm font-semibold">Address</p>
          <div className="mb-1 flex h-14 items-center gap-2 rounded-2xl bg-card px-4">
            <input
              value={address}
              onChange={(e) => onAddress(e.target.value)}
              placeholder={
                payeeTab === "Wallet address"
                  ? "Enter receiving wallet address"
                  : `Enter ${payeeTab.toLowerCase()}`
              }
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={paste}
              className="shrink-0 text-sm font-medium text-foreground"
            >
              Paste
            </button>
            <button
              type="button"
              onClick={onOpenAddresses}
              aria-label="Choose from address book"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ContactIcon className="size-5" />
            </button>
          </div>

          {/* amount */}
          <p className="mb-2 mt-5 text-sm font-semibold">Amount</p>
          <div className="flex h-14 items-center gap-2 rounded-2xl bg-card px-4">
            <input
              value={amount}
              inputMode="decimal"
              onChange={(e) => onAmount(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.00"
              className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              {asset?.sym ?? "BTC"}
            </span>
            <button
              type="button"
              onClick={onAll}
              className="shrink-0 text-sm font-semibold underline-offset-2 hover:underline"
            >
              All
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Available:{" "}
            <span className="font-medium text-foreground">
              {asset ? `${asset.balance} ${asset.sym}` : "1450.00 USDT"}
            </span>
          </p>

          {/* fee summary */}
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">{Number(amount) > 0 ? fee : "0.000"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Received amount</span>
              <span className="font-medium">
                {Number(amount) > 0
                  ? `${Math.max(Number(amount) - Number(fee), 0).toFixed(5)} ${asset?.sym ?? ""}`
                  : `0 ${asset?.sym ?? "BTC"}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-7 pb-8 pt-2">
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
        >
          Send
        </button>
      </div>
    </>
  );
}

function TokensView({
  search,
  onSearch,
  chain,
  onChain,
  tokens,
  onBack,
  onSelect,
}: {
  search: string;
  onSearch: (v: string) => void;
  chain: string;
  onChain: (c: string) => void;
  tokens: Asset[];
  onBack: () => void;
  onSelect: (a: Asset) => void;
}) {
  return (
    <>
      <SheetHead title="Send Assets To" onBack={onBack} />
      <div className="px-7 pb-3">
        <div className="flex h-12 items-center gap-2 rounded-full border border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or contract address"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {CHAINS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChain(c)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  chain === c
                    ? "border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <ArrowRightLeft className="size-5 shrink-0 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-7 pb-8">
        {tokens.map((a) => (
          <button
            key={a.sym}
            type="button"
            onClick={() => onSelect(a)}
            className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-0 hover:bg-muted/40"
          >
            <AssetIcon asset={a} />
            <span className="flex-1">
              <span className="block font-semibold">{a.label}</span>
              <span className="block text-sm text-muted-foreground">
                {a.chain}
              </span>
            </span>
            <span className="text-right">
              <span className="block font-semibold">{a.balance}</span>
              <span className="block text-sm text-muted-foreground">{a.fiat}</span>
            </span>
          </button>
        ))}
        {tokens.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No tokens found
          </p>
        )}
      </div>
    </>
  );
}

function HistoryView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <SheetHead title="History" onBack={onBack} />
      <div className="flex gap-2 px-7 pb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background">
          Send <X className="size-3.5" />
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground">
          All currencies
        </span>
        <span className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground">
          Date
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-7 pb-8">
        {HISTORY.map((group) => (
          <div key={group.date} className="mt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {group.date}
            </p>
            {group.items.map((it, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-border p-4"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ArrowRightLeft className="size-4" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{it.kind}</span>
                  <span className="block text-xs text-muted-foreground">
                    {it.time}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold text-success">{it.in}</span>
                  <span className="block text-xs text-muted-foreground">
                    {it.out}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function AddressesView({
  asset,
  saved,
  contacts,
  contactSearch,
  onContactSearch,
  onBack,
  onSelect,
  onDelete,
  onInvite,
  onAdd,
}: {
  asset: Asset | null;
  saved: SavedAddress[];
  contacts: Contact[];
  contactSearch: string;
  onContactSearch: (v: string) => void;
  onBack: () => void;
  onSelect: (a: SavedAddress) => void;
  onDelete: (a: SavedAddress) => void;
  onInvite: (c: Contact) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <SheetHead
        title="Select Address"
        onBack={onBack}
        right={<Pencil className="mt-1.5 size-5 text-muted-foreground" />}
      />
      <div className="flex gap-2 px-7 pb-3">
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
          {asset?.sym ?? "BTC"}
        </span>
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          {asset?.chain ?? "Bitcoin"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-7">
        {/* saved addresses */}
        {saved.map((a) => (
          <div
            key={a.id}
            className="flex items-start gap-2 border-b border-border py-4"
          >
            <button
              type="button"
              onClick={() => onSelect(a)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block font-medium">{a.name}</span>
              <span className="block break-all text-xs text-muted-foreground">
                {a.address}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(a)}
              aria-label={`Delete ${a.name}`}
              className="shrink-0 text-muted-foreground hover:text-danger"
            >
              <Trash2 className="size-5" />
            </button>
          </div>
        ))}
        <p className="py-3 text-center text-xs text-muted-foreground">
          No more addresses
        </p>

        {/* contacts */}
        <p className="mb-3 mt-2 text-base font-semibold">Contacts</p>
        <div className="mb-3 flex h-11 items-center gap-2 rounded-full border border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={contactSearch}
            onChange={(e) => onContactSearch(e.target.value)}
            placeholder="Search contact"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center gap-3 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {c.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <span className="flex-1">
              <span className="block font-medium">{c.name}</span>
              <span className="block text-xs text-muted-foreground">
                {c.phone}
              </span>
            </span>
            {c.invited ? (
              <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                Invited
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onInvite(c)}
                className="text-sm font-medium text-foreground hover:underline"
              >
                Invite
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="px-7 pb-8 pt-3">
        <button
          type="button"
          onClick={onAdd}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="size-5" />
          Add New Address
        </button>
      </div>
    </>
  );
}

function AddAddressView({
  asset,
  addr,
  name,
  onAddr,
  onName,
  onBack,
  onSave,
}: {
  asset: Asset | null;
  addr: string;
  name: string;
  onAddr: (v: string) => void;
  onName: (v: string) => void;
  onBack: () => void;
  onSave: () => void;
}) {
  async function paste() {
    try {
      const t = await navigator.clipboard.readText();
      if (t) onAddr(t);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <>
      <SheetHead title="Add New Address" onBack={onBack} />
      <div className="flex gap-2 px-7 pb-4">
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
          {asset?.sym ?? "BTC"}
        </span>
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          {asset?.chain ?? "Bitcoin"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-7">
        <p className="mb-2 text-sm font-semibold">Address</p>
        <div className="mb-5 flex h-14 items-center gap-2 rounded-2xl border border-border px-4">
          <input
            value={addr}
            onChange={(e) => onAddr(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={paste}
            className="shrink-0 text-sm font-medium"
          >
            Paste
          </button>
          <Scan className="size-5 shrink-0 text-muted-foreground" />
        </div>
        <p className="mb-2 text-sm font-semibold">Address name (Optional)</p>
        <div className="flex h-14 items-center rounded-2xl border border-border px-4">
          <input
            value={name}
            maxLength={68}
            onChange={(e) => onName(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {name.length}/68
        </p>
      </div>
      <div className="px-7 pb-8 pt-3">
        <button
          type="button"
          disabled={addr.trim().length < 4}
          onClick={onSave}
          className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
        >
          Save
        </button>
      </div>
    </>
  );
}
