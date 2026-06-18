// Merchant brand settings for the public payment page. Persisted in
// localStorage so the "Appearance" settings screen drives the /pay page.

export interface Brand {
  businessName: string;
  tagline: string;
  /** Accent colour (hex) used on the public payment page. */
  color: string;
}

export const DEFAULT_BRAND: Brand = {
  businessName: "bepay business",
  tagline: "A bank that unites finance",
  color: "#0b0e14",
};

const KEY = "bepay.brand";
const EVENT = "bepay:brand-change";

export function getBrand(): Brand {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_BRAND, ...JSON.parse(raw) } : DEFAULT_BRAND;
  } catch {
    return DEFAULT_BRAND;
  }
}

export function saveBrand(brand: Brand) {
  localStorage.setItem(KEY, JSON.stringify(brand));
  window.dispatchEvent(new Event(EVENT));
}

// ---- stable snapshot for useSyncExternalStore ----
let cachedRaw: string | null = null;
let cachedBrand: Brand = DEFAULT_BRAND;

export function getBrandSnapshot(): Brand {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedBrand = raw
        ? { ...DEFAULT_BRAND, ...JSON.parse(raw) }
        : DEFAULT_BRAND;
    } catch {
      cachedBrand = DEFAULT_BRAND;
    }
  }
  return cachedBrand;
}

export function getServerBrand(): Brand {
  return DEFAULT_BRAND;
}

export function subscribeBrand(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
