"use client";

// React Query hooks. Components consume these — they encapsulate query keys,
// caching, and the service calls.

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  dashboardService,
  paymentLinksService,
  transactionsService,
} from "@/lib/api/services";
import type {
  CreatePaymentLinkInput,
  PaymentLinkQuery,
  TransactionQuery,
} from "@/lib/types";

export const queryKeys = {
  dashboard: ["dashboard", "summary"] as const,
  transactions: (q: TransactionQuery) => ["transactions", q] as const,
  transaction: (id: string) => ["transaction", id] as const,
  paymentLinks: (q: PaymentLinkQuery) => ["payment-links", q] as const,
  paymentLink: (id: string) => ["payment-link", id] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => dashboardService.getSummary(),
  });
}

export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: queryKeys.transactions(query),
    queryFn: () => transactionsService.list(query),
    placeholderData: (prev) => prev, // keep prior page while fetching next
  });
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transaction(id ?? ""),
    queryFn: () => transactionsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function usePaymentLinks(query: PaymentLinkQuery) {
  return useQuery({
    queryKey: queryKeys.paymentLinks(query),
    queryFn: () => paymentLinksService.list(query),
    placeholderData: (prev) => prev,
  });
}

export function usePaymentLink(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.paymentLink(id ?? ""),
    queryFn: () => paymentLinksService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePaymentLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentLinkInput) =>
      paymentLinksService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment-links"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
