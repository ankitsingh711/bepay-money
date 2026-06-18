import { describe, expect, it } from "vitest";
import { createPaymentLinkSchema } from "./validation";

const future = new Date(Date.now() + 86_400_000).toISOString();
const past = new Date(Date.now() - 86_400_000).toISOString();

const base = {
  title: "Order #1024",
  amount: "49.99",
  currency: "USDC",
  network: "polygon",
  expiresAt: future,
};

describe("createPaymentLinkSchema", () => {
  it("accepts a valid payload", () => {
    expect(createPaymentLinkSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a too-short title", () => {
    const r = createPaymentLinkSchema.safeParse({ ...base, title: "a" });
    expect(r.success).toBe(false);
  });

  it("rejects non-numeric or non-positive amounts", () => {
    expect(
      createPaymentLinkSchema.safeParse({ ...base, amount: "abc" }).success,
    ).toBe(false);
    expect(
      createPaymentLinkSchema.safeParse({ ...base, amount: "0" }).success,
    ).toBe(false);
    expect(
      createPaymentLinkSchema.safeParse({ ...base, amount: "-5" }).success,
    ).toBe(false);
  });

  it("accepts decimal amounts within precision", () => {
    expect(
      createPaymentLinkSchema.safeParse({ ...base, amount: "0.01" }).success,
    ).toBe(true);
  });

  it("rejects an expiry in the past", () => {
    const r = createPaymentLinkSchema.safeParse({ ...base, expiresAt: past });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown network", () => {
    const r = createPaymentLinkSchema.safeParse({ ...base, network: "solana" });
    expect(r.success).toBe(false);
  });
});
