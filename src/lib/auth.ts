// Mocked, client-side auth session. Persisted in localStorage so a refresh
// keeps you "signed in". No real backend — this is a UI shell only.

export interface Session {
  email: string;
  businessName?: string;
}

const KEY = "bepay.session";
const EVENT = "bepay:auth-change";

// Cache the parsed session keyed by the raw string so getSession() returns a
// stable reference between reads — required for useSyncExternalStore.
let cachedRaw: string | null = null;
let cachedSession: Session | null = null;

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSession = raw ? (JSON.parse(raw) as Session) : null;
    }
    return cachedSession;
  } catch {
    return null;
  }
}

/** Server snapshot for useSyncExternalStore (no session during SSR). */
export function getServerSession(): Session | null {
  return null;
}

export function signIn(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
