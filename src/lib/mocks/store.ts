// In-memory store backing the mock API. Holds mutable state for the session
// and encapsulates all query/filter/paginate/create logic so the handlers
// stay thin.

import { sumAmounts, tokenDecimals } from "@/lib/money";
import type {
  CreatePaymentLinkInput,
  DashboardSummary,
  Paginated,
  PaymentLink,
  PaymentLinkQuery,
  Transaction,
  TransactionQuery,
  Wallet,
} from "@/lib/types";
import { buildSeed } from "./data";

const seed = buildSeed();
const state = {
  paymentLinks: [...seed.paymentLinks],
  transactions: [...seed.transactions],
};

function paginate<T>(items: T[], page = 1, limit = 10): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    page: safePage,
    limit,
    total,
    totalPages,
  };
}

export function listTransactions(q: TransactionQuery): Paginated<Transaction> {
  let items = state.transactions;
  if (q.status && q.status !== "all") {
    items = items.filter((t) => t.status === q.status);
  }
  if (q.search) {
    const s = q.search.toLowerCase();
    items = items.filter(
      (t) =>
        t.id.toLowerCase().includes(s) ||
        t.paymentLinkTitle?.toLowerCase().includes(s) ||
        t.customerReference?.toLowerCase().includes(s) ||
        t.externalReference?.toLowerCase().includes(s),
    );
  }
  if (q.state && q.state !== "all") {
    items = items.filter((t) => t.paymentState === q.state);
  }
  if (q.outcomeCurrency && q.outcomeCurrency !== "all") {
    items = items.filter(
      (t) =>
        t.received.token === q.outcomeCurrency ||
        t.sent.token === q.outcomeCurrency,
    );
  }
  if (q.network && q.network !== "all") {
    items = items.filter((t) => t.network === q.network);
  }
  if (q.from) {
    const fromMs = new Date(q.from).getTime();
    items = items.filter((t) => +new Date(t.createdAt) >= fromMs);
  }
  if (q.to) {
    // inclusive end-of-day
    const toMs = new Date(q.to).getTime() + 24 * 3600_000;
    items = items.filter((t) => +new Date(t.createdAt) <= toMs);
  }
  return paginate(items, q.page, q.limit);
}

export function getTransaction(id: string): Transaction | undefined {
  return state.transactions.find((t) => t.id === id);
}

export function listPaymentLinks(q: PaymentLinkQuery): Paginated<PaymentLink> {
  let items = state.paymentLinks;
  if (q.status && q.status !== "all") {
    items = items.filter((l) => l.status === q.status);
  }
  if (q.search) {
    const s = q.search.toLowerCase();
    items = items.filter(
      (l) =>
        l.id.toLowerCase().includes(s) ||
        l.title.toLowerCase().includes(s) ||
        l.externalReference?.toLowerCase().includes(s),
    );
  }
  return paginate(items, q.page, q.limit);
}

export function getPaymentLink(id: string): PaymentLink | undefined {
  return state.paymentLinks.find((l) => l.id === id);
}

export function getTransactionForLink(
  linkId: string,
): Transaction | undefined {
  return state.transactions.find((t) => t.paymentLinkId === linkId);
}

export function createPaymentLink(input: CreatePaymentLinkInput): PaymentLink {
  const num = 1000 + state.paymentLinks.length + 1;
  const id = `pl_${num}`;
  const link: PaymentLink = {
    id,
    title: input.title,
    amount: input.amount,
    currency: input.currency,
    network: input.network,
    status: "active",
    paymentUrl: `https://pay.bepay.app/${id}`,
    description: input.description,
    externalReference: input.externalReference,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
  };
  state.paymentLinks.unshift(link);
  return link;
}

export function getDashboardSummary(): DashboardSummary {
  const currency = "USDC" as const;
  const decimals = tokenDecimals(currency);
  const confirmed = state.transactions.filter((t) => t.status === "confirmed");
  // For the headline total we only sum confirmed amounts (normalised display
  // currency for demo purposes — a real API would FX-convert per token).
  const totalReceived = confirmed.length
    ? sumAmounts(
        confirmed.map((t) => t.amount),
        decimals,
      )
    : "0.00";

  return {
    totalReceived,
    currency,
    successfulCount: confirmed.length,
    pendingCount: state.transactions.filter((t) => t.status === "pending")
      .length,
    failedCount: state.transactions.filter(
      (t) => t.status === "failed" || t.status === "expired",
    ).length,
    deltas: {
      totalReceived: 12.4,
      successful: 8.1,
      pending: -3.2,
      failed: 1.5,
    },
    recentTransactions: state.transactions.slice(0, 6),
  };
}

const wallet: Wallet = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  balance: "653877.09",
  currency: "USDC",
  holdings: [
    { token: "USDC", amount: "300783.46", fiatValue: "300783.46" },
    { token: "ETH", amount: "61.4820", fiatValue: "183092.18" },
    { token: "USDT", amount: "104620.10", fiatValue: "104620.10" },
    { token: "DAI", amount: "65381.35", fiatValue: "65381.35" },
  ],
};

export function getWallet(): Wallet {
  return wallet;
}
