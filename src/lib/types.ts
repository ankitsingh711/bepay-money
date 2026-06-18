// Domain types for the bepay merchant app.
// These mirror the suggested API contract in the assignment brief.

export type TransactionStatus = "pending" | "confirmed" | "failed" | "expired";

export type PaymentLinkStatus = "active" | "paid" | "expired";

export type Token = "USDC" | "USDT" | "DAI" | "ETH";

export type Network = "polygon" | "ethereum" | "base" | "arbitrum";

export interface PaymentLink {
  id: string;
  title: string;
  /** Decimal string to avoid float precision loss, e.g. "49.99". */
  amount: string;
  currency: Token;
  network: Network;
  status: PaymentLinkStatus;
  paymentUrl: string;
  description?: string;
  externalReference?: string;
  createdAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
}

export interface Transaction {
  id: string;
  /** Reference to the originating payment link, if any. */
  paymentLinkId?: string;
  paymentLinkTitle?: string;
  customerReference?: string;
  externalReference?: string;
  /** Decimal string, e.g. "49.99". */
  amount: string;
  currency: Token;
  network: Network;
  status: TransactionStatus;
  /** On-chain tx hash, present once broadcast. */
  txHash?: string;
  createdAt: string; // ISO 8601
  /** Timestamp the payment settled/confirmed, if applicable. */
  paidAt?: string; // ISO 8601
}

export interface DashboardSummary {
  /** Aggregated received amount as a decimal string. */
  totalReceived: string;
  currency: Token;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
  /** Period-over-period deltas, as signed percentages. */
  deltas: {
    totalReceived: number;
    successful: number;
    pending: number;
    failed: number;
  };
  recentTransactions: Transaction[];
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---- Request payloads ----

export interface CreatePaymentLinkInput {
  title: string;
  amount: string;
  currency: Token;
  network: Network;
  description?: string;
  expiresAt: string; // ISO 8601
  externalReference?: string;
}

// ---- Query params ----

export interface TransactionQuery {
  status?: TransactionStatus | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaymentLinkQuery {
  status?: PaymentLinkStatus | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export const NETWORK_LABELS: Record<Network, string> = {
  polygon: "Polygon",
  ethereum: "Ethereum",
  base: "Base",
  arbitrum: "Arbitrum",
};

export const TOKENS: Token[] = ["USDC", "USDT", "DAI", "ETH"];
export const NETWORKS: Network[] = ["polygon", "ethereum", "base", "arbitrum"];
