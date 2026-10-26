import { createContext, useContext } from "react";
import type { SignUpInput, User } from "../../services/auth";

export type AuthStatus = "checking" | "authenticated" | "guest";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<User>;
  /** Creates the account and logs in right away. */
  signUp: (data: SignUpInput) => Promise<User>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  }
  return value;
}
