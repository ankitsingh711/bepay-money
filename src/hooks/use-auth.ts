"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSession,
  getSession,
  signIn as signInFn,
  signOut as signOutFn,
  subscribe,
} from "@/lib/auth";

const noopSubscribe = () => () => {};

export function useAuth() {
  const session = useSyncExternalStore(subscribe, getSession, getServerSession);
  // `ready` is false during SSR / first paint, true once hydrated — so guards
  // don't redirect before the client has read the persisted session.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return {
    session,
    ready,
    isAuthenticated: Boolean(session),
    signIn: signInFn,
    signOut: signOutFn,
  };
}
