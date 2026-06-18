import { format, formatDistanceToNow, isPast } from "date-fns";

/** "19 Jun 2026, 10:00" */
export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, HH:mm");
}

/** "19 Jun 2026" */
export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy");
}

/** "2 hours ago" / "in 3 days" */
export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function isExpired(iso: string): boolean {
  return isPast(new Date(iso));
}

/**
 * Format a USD amount with the grouping used in the design ("$ 2,73,937").
 * Uses the en-IN lakh/crore grouping to match the reference visuals.
 */
export function formatUsd(value: number, decimals = 0): string {
  return `$ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Truncate a long id / hash: 0x1234…abcd */
export function truncateMiddle(value: string, lead = 6, tail = 4): string {
  if (value.length <= lead + tail + 1) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}
