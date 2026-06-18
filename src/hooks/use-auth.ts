"use client";

import * as React from "react";
import {
  getSession,
  signIn as signInFn,
  signOut as signOutFn,
  subscribe,
  type Session,
} from "@/lib/auth";

export function useAuth() {
  const [session, setSession] = React.useState<Session | null>(null);
  // `ready` flips true after the first client read, so guards don't act on SSR.
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setSession(getSession());
    setReady(true);
    return subscribe(() => setSession(getSession()));
  }, []);

  return {
    session,
    ready,
    isAuthenticated: Boolean(session),
    signIn: signInFn,
    signOut: signOutFn,
  };
}
