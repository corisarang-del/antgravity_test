"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginWithPassword, resendSignupEmail, signInWithGoogle, signInWithKakao, signupWithPassword } from "@/lib/authApi";
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
  signInWithKakao: () => Promise<{ errorMessage?: string }>;
  signInWithGoogle: () => Promise<{ errorMessage?: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ errorMessage?: string; needsEmailConfirm?: boolean }>;
  resendSignupConfirmEmail: (email: string) => Promise<{ errorMessage?: string }>;
  signOut: () => Promise<void>;
};

type AuthState = {
  session: AuthSession | null;
  user: AuthSession["user"] | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
  });
  const { session, user, isLoading } = authState;

  useEffect(() => {
    const storedSession = getStoredAuthSession();
    // Hydration mismatch 방지를 위해 클라이언트 마운트 이후에만 세션을 복원한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthState({
      session: storedSession,
      user: storedSession?.user ?? null,
      isLoading: false,
    });
  }, []);

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
          setAuthState({
            session: nextSession,
            user: nextSession.user,
            isLoading: false,
          });
          return {};
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "로그인 실패" };
        }
      },
      signInWithKakao: async () => {
        try {
          await signInWithKakao();
          return {};
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "카카오 로그인 실패" };
        }
      },
      signInWithGoogle: async () => {
        try {
          await signInWithGoogle();
          return {};
        } catch (error) {
          return { errorMessage: error instanceof Error ? error.message : "구글 로그인 실패" };
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
        setAuthState({
          session: null,
          user: null,
          isLoading: false,
        });
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
