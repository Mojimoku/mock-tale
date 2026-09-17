import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../data/supabaseClient";
import { AuthContext, type AuthResult, type AuthStatus } from "./auth-context-types";

/**
 * Tracks the Supabase auth session and exposes sign-in/up/out. Mounted once
 * at the app root so every page can read auth state via `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setStatus(data.session ? "signed-in" : "signed-out");
    });

    // Keeps state in sync across sign-in/out, token refresh, and other tabs.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setStatus(newSession ? "signed-in" : "signed-out");
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<AuthResult> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function signUp(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // If the project requires email confirmation, signUp succeeds but no
    // session is issued yet.
    if (!data.session) return { needsConfirmation: true };
    return {};
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ status, user: session?.user ?? null, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
