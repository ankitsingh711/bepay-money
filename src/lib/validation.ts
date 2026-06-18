import { z } from "zod";
import { NETWORKS, TOKENS } from "./types";

// Validation schema for the create-payment-link form.
// Amount is kept as a string and validated as a positive decimal to preserve
// precision (no float coercion).

export const createPaymentLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(80, "Title must be 80 characters or fewer"),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((v) => /^\d+(\.\d{1,8})?$/.test(v), "Enter a valid amount")
    .refine((v) => Number(v) > 0, "Amount must be greater than zero"),
  currency: z.enum(TOKENS as [string, ...string[]]),
  network: z.enum(NETWORKS as [string, ...string[]]),
  description: z
    .string()
    .trim()
    .max(280, "Description must be 280 characters or fewer")
    .optional()
    .or(z.literal("")),
  expiresAt: z
    .string()
    .min(1, "Expiry date is required")
    .refine(
      (v) => new Date(v).getTime() > Date.now(),
      "Expiry must be in the future",
    ),
  externalReference: z
    .string()
    .trim()
    .max(60, "Reference must be 60 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type CreatePaymentLinkForm = z.infer<typeof createPaymentLinkSchema>;
