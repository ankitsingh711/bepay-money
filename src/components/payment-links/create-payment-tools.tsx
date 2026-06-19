"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Contact,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useCreatePaymentLink } from "@/hooks/queries";
import { cn } from "@/lib/utils";

interface PayCurrency {
  id: string;
  label: string;
  network?: string;
  sub?: string;
  glyph?: string;
  color?: string;
}

const PAY_CURRENCIES: PayCurrency[] = [
  {
    id: "all",
    label: "All currencies",
    sub: "Please choose any supported crypto for payment",
  },
  { id: "BTC", label: "BTC", network: "Bitcoin network", glyph: "₿", color: "#f7931a" },
  { id: "ETH", label: "Etherium", network: "Ethereum network", glyph: "Ξ", color: "#1f1f1f" },
  { id: "SOL", label: "Solana", network: "Solana network", glyph: "◎", color: "#000000" },
  { id: "TON", label: "TON", network: "TON network", glyph: "T", color: "#0098ea" },
];

const CREATED_LINK = "0xdwdhwhdwhysuwyhduhwhxbhjabvxhsaghxahw827w8";

export function CreatePaymentTools({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated?: () => void;
}) {
  const createLink = useCreatePaymentLink();

  const [ccy, setCcy] = React.useState<PayCurrency>(PAY_CURRENCIES[0]);
  const [ccyOpen, setCcyOpen] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [reason, setReason] = React.useState("");

  const [moreOpen, setMoreOpen] = React.useState(false);
  const [partial, setPartial] = React.useState(false);
  const [referenceId, setReferenceId] = React.useState<string | null>(null);
  const [expiry, setExpiry] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<string | null>(null);

  const [customer, setCustomer] = React.useState<{
    name: string;
    mobile: string;
    email: string;
  } | null>(null);

  const [created, setCreated] = React.useState(false);

  const canCreate = Number(price) > 0 && reason.trim().length > 0;

  function reset() {
    setCcy(PAY_CURRENCIES[0]);
    setCcyOpen(false);
    setPrice("");
    setReason("");
    setMoreOpen(false);
    setPartial(false);
    setReferenceId(null);
    setExpiry(null);
    setNotes(null);
    setCustomer(null);
    setCreated(false);
  }

  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  }

  function submit() {
    if (!canCreate) return;
    createLink.mutate(
      {
        title: reason,
        amount: price,
        currency: "USDC",
        network: "polygon",
        description: reason,
        expiresAt: new Date(Date.now() + 7 * 864e5).toISOString(),
        externalReference: referenceId ?? undefined,
      },
      {
        onSuccess: () => {
          onCreated?.();
          setCreated(true);
        },
      },
    );
  }

  const token = ccy.id === "all" ? "USDC" : ccy.id;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-8">
        {!created ? (
          <>
            <DialogTitle className="text-3xl font-bold">
              Create Payment Tools
            </DialogTitle>

            {/* pay currency */}
            <div className="space-y-2">
              <p className="text-base font-semibold">Pay Currency</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCcyOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-2xl bg-muted px-4 py-4 text-left"
                >
                  {ccy.id === "all" ? (
                    <span>
                      <span className="block font-medium">{ccy.label}</span>
                      <span className="block text-sm text-muted-foreground">
                        {ccy.sub}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2.5 font-medium">
                      <CcyIcon ccy={ccy} />
                      {ccy.label} ({ccy.network})
                    </span>
                  )}
                  {ccyOpen ? (
                    <ChevronUp className="size-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-5 text-muted-foreground" />
                  )}
                </button>
                {ccyOpen && (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-xl">
                    {PAY_CURRENCIES.filter((c) => c.id !== "all").map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCcy(c);
                          setCcyOpen(false);
                        }}
                        className="flex w-full items-center gap-3 border-b border-border px-3 py-4 text-left font-medium last:border-0 hover:bg-muted/50"
                      >
                        <CcyIcon ccy={c} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* price */}
            <div className="space-y-2">
              <p className="text-base font-semibold">Price</p>
              <div className="flex items-center rounded-2xl bg-muted px-4 py-4">
                <input
                  value={price}
                  inputMode="decimal"
                  onChange={(e) =>
                    setPrice(e.target.value.replace(/[^\d.]/g, ""))
                  }
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                <span className="font-medium text-muted-foreground">USD</span>
              </div>
            </div>

            {/* link for */}
            <div className="space-y-2">
              <p className="text-base font-semibold">Link For?</p>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for this link"
                className="w-full rounded-2xl bg-muted px-4 py-4 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* additional settings */}
            <div>
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className="flex w-full items-center justify-between py-1 text-base font-semibold"
              >
                Additional Settings
                {moreOpen ? (
                  <ChevronUp className="size-5" />
                ) : (
                  <ChevronDown className="size-5" />
                )}
              </button>
              {moreOpen && (
                <div className="mt-3 space-y-4 rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Partial Payments</span>
                    <Switch checked={partial} onCheckedChange={setPartial} />
                  </div>
                  <AddableRow
                    label="Reference ID"
                    value={referenceId}
                    onAdd={() => setReferenceId("")}
                    onRemove={() => setReferenceId(null)}
                    onChange={setReferenceId}
                    placeholder="ORD-1024"
                  />
                  <AddableRow
                    label="Expiry Date"
                    value={expiry}
                    onAdd={() => setExpiry("")}
                    onRemove={() => setExpiry(null)}
                    onChange={setExpiry}
                    type="date"
                  />
                  <AddableRow
                    label="Internal Notes"
                    value={notes}
                    onAdd={() => setNotes("")}
                    onRemove={() => setNotes(null)}
                    onChange={setNotes}
                    placeholder="Visible only to your team"
                  />
                </div>
              )}
            </div>

            {/* customer details */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Customer Details</span>
                {customer ? (
                  <button
                    type="button"
                    onClick={() => setCustomer(null)}
                    className="text-sm font-medium text-danger"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCustomer({ name: "", mobile: "", email: "" })
                    }
                    className="text-base font-semibold"
                  >
                    + Add
                  </button>
                )}
              </div>
              {customer && (
                <div className="mt-3 space-y-4 rounded-2xl border border-border p-4">
                  <div className="space-y-1.5">
                    <label className="font-medium">Name</label>
                    <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                      <input
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                      />
                      <Contact className="size-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium">Mobile Number</label>
                    <input
                      value={customer.mobile}
                      inputMode="tel"
                      onChange={(e) =>
                        setCustomer({ ...customer, mobile: e.target.value })
                      }
                      className="w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium">Email</label>
                    <input
                      value={customer.email}
                      type="email"
                      onChange={(e) =>
                        setCustomer({ ...customer, email: e.target.value })
                      }
                      className="w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={!canCreate || createLink.isPending}
              onClick={submit}
              className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {createLink.isPending ? "Creating…" : "Create"}
            </button>
          </>
        ) : (
          <SuccessView amount={`0.000005678 ${token}`} onClose={() => close(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CcyIcon({ ccy }: { ccy: PayCurrency }) {
  return (
    <span
      className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: ccy.color }}
    >
      {ccy.glyph}
    </span>
  );
}

function AddableRow({
  label,
  value,
  onAdd,
  onRemove,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | null;
  onAdd: () => void;
  onRemove: () => void;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        {value === null ? (
          <button type="button" onClick={onAdd} className="font-semibold">
            + Add
          </button>
        ) : (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-danger"
          >
            Remove
          </button>
        )}
      </div>
      {value !== null && (
        <input
          type={type}
          value={value}
          autoFocus
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none"
        />
      )}
    </div>
  );
}

function SuccessView({
  amount,
  onClose,
}: {
  amount: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  function copy() {
    navigator.clipboard?.writeText(CREATED_LINK);
    setCopied(true);
    toast.success("Copied to Clipboard");
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="space-y-6 py-2 text-center">
      <div className="flex justify-center">
        <CashArt />
      </div>
      <DialogTitle className="text-2xl font-bold">
        Payment Link Created!
      </DialogTitle>
      <div className="space-y-4 text-left">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Amount</span>
            <span>-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight">{amount}</span>
            <span className="text-sm text-muted-foreground">2 Sept. 2025</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Link</p>
          <div className="flex items-start justify-between gap-2">
            <span className="break-all font-medium">{CREATED_LINK}</span>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy link"
              className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Copy className={cn("size-5", copied && "text-success")} />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            copy();
            toast.success("Ready to share");
          }}
          className="h-14 w-full rounded-full bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90"
        >
          Share Via Other Apps
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-base font-medium text-muted-foreground hover:text-foreground"
        >
          I&apos;ll do it later
        </button>
      </div>
    </div>
  );
}

function CashArt() {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-20 text-foreground"
      aria-hidden
    >
      <rect x="22" y="26" width="76" height="44" rx="4" />
      <circle cx="60" cy="48" r="13" />
      <path d="M60 42v12M56 45h5a2.5 2.5 0 0 1 0 5h-3a2.5 2.5 0 0 0 0 5h5" strokeWidth={2.4} />
      <path d="M30 20l-4-6M60 18l0-7M90 20l4-6M104 40l7-3M104 56l7 3M16 40l-7-3M16 56l-7 3" strokeWidth={2.2} />
    </svg>
  );
}
