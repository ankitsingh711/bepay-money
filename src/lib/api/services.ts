// Service layer: one function per endpoint in the API contract. UI/hooks call
// these — they never construct URLs or parse responses themselves.

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
import { apiClient, buildQuery } from "./client";

/** Payment link detail includes the associated transaction once paid. */
export type PaymentLinkDetail = PaymentLink & {
  transaction?: Transaction;
};

export const dashboardService = {
  getSummary: () => apiClient.get<DashboardSummary>("/api/dashboard/summary"),
};

export const walletService = {
  get: () => apiClient.get<Wallet>("/api/wallet"),
};

export const transactionsService = {
  list: (query: TransactionQuery = {}) =>
    apiClient.get<Paginated<Transaction>>(
      `/api/transactions${buildQuery({ ...query })}`,
    ),
  get: (id: string) => apiClient.get<Transaction>(`/api/transactions/${id}`),
};

export const paymentLinksService = {
  list: (query: PaymentLinkQuery = {}) =>
    apiClient.get<Paginated<PaymentLink>>(
      `/api/payment-links${buildQuery({ ...query })}`,
    ),
  get: (id: string) =>
    apiClient.get<PaymentLinkDetail>(`/api/payment-links/${id}`),
  create: (input: CreatePaymentLinkInput) =>
    apiClient.post<PaymentLink>("/api/payment-links", input),
};
