// Safe money handling for crypto/fiat token amounts.
//
// We store amounts as decimal strings and operate on them via integer minor
// units (BigInt) to avoid IEEE-754 floating-point rounding errors. Never do
// `Number(a) + Number(b)` on currency values.

import type { Token } from "./types";

/** Display precision per token. Stablecoins use 2dp; ETH uses 4dp. */
const TOKEN_DECIMALS: Record<Token, number> = {
  USDC: 2,
  USDT: 2,
  DAI: 2,
  ETH: 4,
};

export function tokenDecimals(token: Token): number {
  return TOKEN_DECIMALS[token] ?? 2;
}

/**
 * Parse a decimal string into integer minor units for a given precision.
 * "49.99" with 2dp -> 4999n. Throws on malformed input.
 */
export function toMinorUnits(amount: string, decimals: number): bigint {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error(`Invalid amount: "${amount}"`);
  }
  const [whole, frac = ""] = trimmed.split(".");
  const paddedFrac = frac.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFrac);
}

/** Convert integer minor units back to a decimal string. */
export function fromMinorUnits(minor: bigint, decimals: number): string {
  const negative = minor < 0n;
  const abs = negative ? -minor : minor;
  const s = abs.toString().padStart(decimals + 1, "0");
  const whole = s.slice(0, s.length - decimals);
  const frac = decimals > 0 ? "." + s.slice(s.length - decimals) : "";
  return `${negative ? "-" : ""}${whole}${frac}`;
}

/** Sum a list of decimal-string amounts safely. All must share `decimals`. */
export function sumAmounts(amounts: string[], decimals: number): string {
  const total = amounts.reduce(
    (acc, a) => acc + toMinorUnits(a, decimals),
    0n,
  );
  return fromMinorUnits(total, decimals);
}

/**
 * Format an amount for display with thousands separators and the token symbol.
 * e.g. formatMoney("1234.5", "USDC") -> "1,234.50 USDC"
 */
export function formatMoney(
  amount: string,
  token: Token,
  options: { withSymbol?: boolean } = {},
): string {
  const { withSymbol = true } = options;
  const decimals = tokenDecimals(token);
  // Normalise through minor units so we always render fixed precision.
  const normalized = fromMinorUnits(toMinorUnits(amount, decimals), decimals);
  const [whole, frac] = normalized.split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = frac ? `${groupedWhole}.${frac}` : groupedWhole;
  return withSymbol ? `${body} ${token}` : body;
}

/** Compact, human display for large totals on dashboard cards. */
export function formatCompactMoney(amount: string, token: Token): string {
  const decimals = tokenDecimals(token);
  const minor = toMinorUnits(amount, decimals);
  const major = Number(minor) / 10 ** decimals;
  if (major >= 1_000_000) {
    return `${(major / 1_000_000).toFixed(2)}M ${token}`;
  }
  if (major >= 10_000) {
    return `${(major / 1_000).toFixed(1)}K ${token}`;
  }
  return formatMoney(amount, token);
}
