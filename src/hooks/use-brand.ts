"use client";

import { useSyncExternalStore } from "react";
import {
  getBrandSnapshot,
  getServerBrand,
  subscribeBrand,
} from "@/lib/brand";

/** Reactive read of the merchant brand settings, SSR-safe. */
export function useBrand() {
  return useSyncExternalStore(subscribeBrand, getBrandSnapshot, getServerBrand);
}
