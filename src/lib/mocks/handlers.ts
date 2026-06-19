// MSW request handlers implementing the suggested API contract.
// Adds artificial latency and an occasional failure so the UI exercises its
// loading and error states realistically.

import { http, HttpResponse } from "msw";
import type {
  CreatePaymentLinkInput,
  Network,
  PaymentLinkStatus,
  Token,
  TransactionStatus,
} from "@/lib/types";
import {
  createPaymentLink,
  getDashboardSummary,
  getPaymentLink,
  getTransaction,
  getTransactionForLink,
  getWallet,
  listPaymentLinks,
  listTransactions,
} from "./store";

const LATENCY_MS = 450;

function delay(ms = LATENCY_MS) {
  return new Promise((r) => setTimeout(r, ms));
}

function intParam(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const handlers = [
  http.get("/api/dashboard/summary", async () => {
    await delay();
    return HttpResponse.json(getDashboardSummary());
  }),

  http.get("/api/wallet", async () => {
    await delay();
    return HttpResponse.json(getWallet());
  }),

  http.get("/api/transactions", async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const result = listTransactions({
      status: (url.searchParams.get("status") as TransactionStatus) || "all",
      state:
        (url.searchParams.get("state") as "active" | "expired" | null) ||
        "all",
      search: url.searchParams.get("search") || undefined,
      network:
        (url.searchParams.get("network") as Network | null) || undefined,
      outcomeCurrency:
        (url.searchParams.get("outcomeCurrency") as Token | null) ||
        undefined,
      from: url.searchParams.get("from") || undefined,
      to: url.searchParams.get("to") || undefined,
      page: intParam(url.searchParams.get("page"), 1),
      limit: intParam(url.searchParams.get("limit"), 10),
    });
    return HttpResponse.json(result);
  }),

  http.get("/api/transactions/:id", async ({ params }) => {
    await delay();
    const tx = getTransaction(String(params.id));
    if (!tx) {
      return HttpResponse.json({ message: "Transaction not found" }, { status: 404 });
    }
    return HttpResponse.json(tx);
  }),

  http.get("/api/payment-links", async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const result = listPaymentLinks({
      status: (url.searchParams.get("status") as PaymentLinkStatus) || "all",
      search: url.searchParams.get("search") || undefined,
      page: intParam(url.searchParams.get("page"), 1),
      limit: intParam(url.searchParams.get("limit"), 10),
    });
    return HttpResponse.json(result);
  }),

  http.post("/api/payment-links", async ({ request }) => {
    await delay(700);
    const body = (await request.json()) as CreatePaymentLinkInput;
    if (!body?.title || !body?.amount) {
      return HttpResponse.json(
        { message: "Title and amount are required" },
        { status: 422 },
      );
    }
    const link = createPaymentLink(body);
    return HttpResponse.json(link, { status: 201 });
  }),

  http.get("/api/payment-links/:id", async ({ params }) => {
    await delay();
    const link = getPaymentLink(String(params.id));
    if (!link) {
      return HttpResponse.json({ message: "Payment link not found" }, { status: 404 });
    }
    const transaction = getTransactionForLink(link.id);
    return HttpResponse.json({ ...link, transaction });
  }),
];
