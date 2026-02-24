"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { loginWithPassword, resendSignupEmail, signupWithPassword } from "@/lib/authApi";
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
  type AuthSession,
} from "@/lib/authSession";

type AuthContextValue = {
  user: AuthSession["user"] | null;
  session: AuthSession | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ errorMessage?: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ errorMessage?: string; needsEmailConfirm?: boolean }>;
  resendSignupConfirmEmail: (email: string) => Promise<{ errorMessage?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredAuthSession());
  const [user, setUser] = useState<AuthSession["user"] | null>(() => getStoredAuthSession()?.user ?? null);
  const isLoading = false;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isLoggedIn: !!user,
      signInWithPassword: async (email, password) => {
        try {
          const result = await loginWithPassword(email, password);
          const nextSession: AuthSession = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
            user: result.user,
          };
          setStoredAuthSession(nextSession);
          setSession(nextSession);
          setUser(nextSession.user);
          return {};
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "로그인 실패" };
        }
      },
      signUpWithPassword: async (email, password) => {
        try {
          const result = await signupWithPassword(email, password);
          return { needsEmailConfirm: result.needsEmailConfirm };
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "회원가입 실패" };
        }
      },
      resendSignupConfirmEmail: async (email) => {
        try {
          await resendSignupEmail(email);
          return {};
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "인증 메일 재전송 실패" };
        }
      },
      signOut: async () => {
        clearStoredAuthSession();
        setSession(null);
        setUser(null);
      },
    }),
    [isLoading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 호출해야 해.");
  }
  return context;
}
