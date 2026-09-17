import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthStatus = "loading" | "signed-in" | "signed-out";

export interface AuthResult {
  error?: string;
  /** true when sign-up succeeded but the account needs email confirmation before it can sign in. */
  needsConfirmation?: boolean;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
