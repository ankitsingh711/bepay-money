"use client";

import { useSyncExternalStore } from "react";
import {
  getDraftSnapshot,
  getServerDraft,
  subscribeDraft,
} from "@/lib/onboarding";

/** Reactive read of the onboarding draft, SSR-safe. */
export function useDraft() {
  return useSyncExternalStore(subscribeDraft, getDraftSnapshot, getServerDraft);
}
