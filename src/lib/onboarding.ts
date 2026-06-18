// Lightweight draft state for the multi-step onboarding flow, persisted in
// sessionStorage so a refresh mid-flow doesn't lose progress.

export interface OnboardingDraft {
  email?: string;
  businessName?: string;
  shopName?: string;
}

const KEY = "bepay.onboarding";

export function getDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as OnboardingDraft;
  } catch {
    return {};
  }
}

export function updateDraft(patch: Partial<OnboardingDraft>) {
  const next = { ...getDraft(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearDraft() {
  sessionStorage.removeItem(KEY);
}
