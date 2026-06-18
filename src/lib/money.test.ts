import { describe, expect, it } from "vitest";
import {
  formatCompactMoney,
  formatMoney,
  fromMinorUnits,
  sumAmounts,
  toMinorUnits,
} from "./money";

describe("money — minor unit conversion", () => {
  it("parses decimal strings to integer minor units", () => {
    expect(toMinorUnits("49.99", 2)).toBe(4999n);
    expect(toMinorUnits("100", 2)).toBe(10000n);
    expect(toMinorUnits("0.5", 2)).toBe(50n);
  });

  it("truncates excess precision to the token's decimals", () => {
    expect(toMinorUnits("1.239", 2)).toBe(123n);
  });

  it("round-trips through minor units without loss", () => {
    expect(fromMinorUnits(toMinorUnits("12345.67", 2), 2)).toBe("12345.67");
  });

  it("throws on malformed input", () => {
    expect(() => toMinorUnits("abc", 2)).toThrow();
    expect(() => toMinorUnits("1.2.3", 2)).toThrow();
  });
});

describe("money — safe summation", () => {
  it("avoids floating point drift (0.1 + 0.2)", () => {
    // Number(0.1) + Number(0.2) === 0.30000000000000004
    expect(sumAmounts(["0.10", "0.20"], 2)).toBe("0.30");
  });

  it("sums a larger set correctly", () => {
    expect(sumAmounts(["49.99", "100.00", "0.01"], 2)).toBe("150.00");
  });
});

describe("money — formatting", () => {
  it("formats with thousands separators and token symbol", () => {
    expect(formatMoney("1234.5", "USDC")).toBe("1,234.50 USDC");
    expect(formatMoney("1000000", "USDC")).toBe("1,000,000.00 USDC");
  });

  it("respects per-token precision (ETH = 4dp)", () => {
    expect(formatMoney("1.5", "ETH")).toBe("1.5000 ETH");
  });

  it("can omit the symbol", () => {
    expect(formatMoney("10", "USDC", { withSymbol: false })).toBe("10.00");
  });

  it("compacts large totals", () => {
    expect(formatCompactMoney("2500000", "USDC")).toBe("2.50M USDC");
    expect(formatCompactMoney("15000", "USDC")).toBe("15.0K USDC");
  });
});
