import { describe, expect, it } from "vitest";
import {
  createPaymentLink,
  getDashboardSummary,
  listTransactions,
} from "./store";

describe("mock store — transactions", () => {
  it("paginates with correct metadata", () => {
    const page1 = listTransactions({ page: 1, limit: 10 });
    expect(page1.data.length).toBeLessThanOrEqual(10);
    expect(page1.page).toBe(1);
    expect(page1.totalPages).toBe(Math.ceil(page1.total / 10));
  });

  it("filters by status", () => {
    const result = listTransactions({ status: "confirmed", limit: 100 });
    expect(result.data.every((t) => t.status === "confirmed")).toBe(true);
  });

  it("searches by id and reference", () => {
    const all = listTransactions({ limit: 1 });
    const id = all.data[0].id;
    const result = listTransactions({ search: id });
    expect(result.data.some((t) => t.id === id)).toBe(true);
  });

  it("clamps out-of-range page to the last page", () => {
    const result = listTransactions({ page: 9999, limit: 10 });
    expect(result.page).toBe(result.totalPages);
  });
});

describe("mock store — create payment link", () => {
  it("creates an active link with a generated url", () => {
    const link = createPaymentLink({
      title: "Test",
      amount: "10.00",
      currency: "USDC",
      network: "polygon",
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    });
    expect(link.status).toBe("active");
    expect(link.paymentUrl).toContain(link.id);
  });
});

describe("mock store — dashboard summary", () => {
  it("returns coherent counts and a numeric total", () => {
    const summary = getDashboardSummary();
    expect(summary.successfulCount).toBeGreaterThanOrEqual(0);
    expect(summary.recentTransactions.length).toBeGreaterThan(0);
    expect(summary.totalReceived).toMatch(/^\d+\.\d{2}$/);
  });
});
