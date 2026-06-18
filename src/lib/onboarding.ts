// Lightweight draft state for the multi-step onboarding flow, persisted in
// sessionStorage so a refresh mid-flow doesn't lose progress.

export interface OnboardingDraft {
  email?: string;
  businessName?: string;
  shopName?: string;
}

const KEY = "bepay.onboarding";
const EVENT = "bepay:draft-change";
const EMPTY: OnboardingDraft = {};

export function getDraft(): OnboardingDraft {
  if (typeof window === "undefined") return EMPTY;
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as OnboardingDraft;
  } catch {
    return EMPTY;
  }
}

export function updateDraft(patch: Partial<OnboardingDraft>) {
  const next = { ...getDraft(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function clearDraft() {
  sessionStorage.removeItem(KEY);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

// ---- stable snapshot for useSyncExternalStore ----
let cachedRaw = "{}";
let cachedDraft: OnboardingDraft = EMPTY;

export function getDraftSnapshot(): OnboardingDraft {
  if (typeof window === "undefined") return EMPTY;
  const raw = sessionStorage.getItem(KEY) || "{}";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedDraft = JSON.parse(raw) as OnboardingDraft;
    } catch {
      cachedDraft = EMPTY;
    }
  }
  return cachedDraft;
}

export function getServerDraft(): OnboardingDraft {
  return EMPTY;
}

export function subscribeDraft(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
