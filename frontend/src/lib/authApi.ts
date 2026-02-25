import { supabase } from "@/lib/supabaseClient";

import { apiClient } from "@/lib/apiClient";

type AuthUser = {
  id: string;
  email: string;
};

export type LoginResponse = {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number | null;
  user: AuthUser;
};

export type SignupResponse = {
  ok: boolean;
  needsEmailConfirm: boolean;
  user: Partial<AuthUser>;
};

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function signupWithPassword(email: string, password: string): Promise<SignupResponse> {
  return apiClient<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: { email, password },
  });
}

export async function resendSignupEmail(email: string): Promise<{ ok: boolean }> {
  return apiClient<{ ok: boolean }>("/api/auth/resend-signup", {
    method: "POST",
    body: { email },
  });
}

async function signInWithOAuthProvider(provider: "kakao" | "google"): Promise<void> {
  const redirectTo = typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "/auth/callback";

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  if (error) throw new Error(error.message);
}

export async function signInWithKakao(): Promise<void> {
  return signInWithOAuthProvider("kakao");
}

export async function signInWithGoogle(): Promise<void> {
  return signInWithOAuthProvider("google");
}
