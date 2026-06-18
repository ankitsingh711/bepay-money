// Mocked, client-side auth session. Persisted in localStorage so a refresh
// keeps you "signed in". No real backend — this is a UI shell only.

export interface Session {
  email: string;
  businessName?: string;
}

const KEY = "bepay.session";
const EVENT = "bepay:auth-change";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
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
