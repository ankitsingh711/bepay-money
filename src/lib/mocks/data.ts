// Deterministic seed data for the mock API.
// Deterministic (seeded) so demos and tests are reproducible.

import type {
  Network,
  PaymentLink,
  PaymentLinkStatus,
  Token,
  Transaction,
  TransactionStatus,
} from "@/lib/types";

// --- tiny seeded PRNG (mulberry32) for reproducible data ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260619);
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)];

const TOKENS: Token[] = ["USDC", "USDT", "DAI", "ETH"];
const NETWORKS: Network[] = ["polygon", "ethereum", "base", "arbitrum"];
const TX_STATUSES: TransactionStatus[] = [
  "confirmed",
  "confirmed",
  "confirmed",
  "pending",
  "failed",
  "expired",
];
const LINK_STATUSES: PaymentLinkStatus[] = [
  "active",
  "active",
  "paid",
  "paid",
  "expired",
];

const TITLES = [
  "Order",
  "Invoice",
  "Subscription",
  "Consultation",
  "Design retainer",
  "Hardware bundle",
  "Course access",
  "Donation",
  "Pro plan",
  "Custom quote",
];

const CUSTOMERS = [
  "acme.eth",
  "0x71C…3A2f",
  "globex.eth",
  "0x9aB…E41c",
  "initech.eth",
  "0x4Df…77B0",
  "umbrella.eth",
  "0xC2e…91Ad",
];

// Fixed "now" so the generated relative timestamps are stable for the demo.
const NOW = new Date("2026-06-19T10:00:00Z").getTime();
const HOUR = 3600_000;
const DAY = 24 * HOUR;

function isoOffset(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

function amount(): string {
  // values between 5.00 and 4999.99
  const cents = 500 + Math.floor(rand() * (500000 - 500));
  return (cents / 100).toFixed(2);
}

function txHash(): string {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(rand() * 16)];
  return h;
}

export function buildSeed(): {
  paymentLinks: PaymentLink[];
  transactions: Transaction[];
} {
  const paymentLinks: PaymentLink[] = [];
  const transactions: Transaction[] = [];

  for (let i = 0; i < 18; i++) {
    const num = 1000 + i;
    const token = pick(TOKENS);
    const network = pick(NETWORKS);
    const status = LINK_STATUSES[i % LINK_STATUSES.length];
    const createdMs = (i + 1) * DAY + Math.floor(rand() * HOUR * 12);
    const expiresFromNow = status === "expired" ? -2 * DAY : (3 + (i % 7)) * DAY;
    const amt = amount();
    const title = `${pick(TITLES)} #${num}`;
    const link: PaymentLink = {
      id: `pl_${num}`,
      title,
      amount: amt,
      currency: token,
      network,
      status,
      paymentUrl: `https://pay.bepay.app/pl_${num}`,
      description:
        rand() > 0.5 ? `Payment for ${title.toLowerCase()}.` : undefined,
      externalReference: rand() > 0.4 ? `ORD-${num}` : undefined,
      createdAt: isoOffset(createdMs),
      expiresAt: isoOffset(-expiresFromNow),
    };
    paymentLinks.push(link);

    // Paid links get an associated confirmed transaction.
    if (status === "paid") {
      transactions.push({
        id: `tx_${num}`,
        paymentLinkId: link.id,
        paymentLinkTitle: link.title,
        customerReference: pick(CUSTOMERS),
        externalReference: link.externalReference,
        amount: amt,
        currency: token,
        network,
        status: "confirmed",
        txHash: txHash(),
        createdAt: isoOffset(createdMs - HOUR),
        paidAt: isoOffset(createdMs - HOUR + 30 * 60_000),
      });
    }
  }

  // A spread of standalone transactions across all statuses.
  // A transaction may reference a non-paid link (active/expired) — when it does
  // it inherits the link's amount/token/network so the data stays coherent.
  // Each link gets at most one associated transaction.
  const linkedAlready = new Set<string>();
  for (let i = 0; i < 36; i++) {
    const num = 2000 + i;
    const status = TX_STATUSES[i % TX_STATUSES.length];
    const createdMs = Math.floor(rand() * 30 * DAY);
    const candidate = rand() > 0.4 ? pick(paymentLinks) : undefined;
    const linkRef =
      candidate &&
      candidate.status !== "paid" &&
      !linkedAlready.has(candidate.id)
        ? candidate
        : undefined;
    if (linkRef) linkedAlready.add(linkRef.id);
    const token = linkRef ? linkRef.currency : pick(TOKENS);
    const network = linkRef ? linkRef.network : pick(NETWORKS);
    const amt = linkRef ? linkRef.amount : amount();
    transactions.push({
      id: `tx_${num}`,
      paymentLinkId: linkRef?.id,
      paymentLinkTitle: linkRef?.title,
      customerReference: pick(CUSTOMERS),
      externalReference: linkRef?.externalReference,
      amount: amt,
      currency: token,
      network,
      status,
      txHash: status === "pending" ? undefined : txHash(),
      createdAt: isoOffset(createdMs),
      paidAt: status === "confirmed" ? isoOffset(createdMs - HOUR) : undefined,
    });
  }

  // newest first
  transactions.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  paymentLinks.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  return { paymentLinks, transactions };
}
