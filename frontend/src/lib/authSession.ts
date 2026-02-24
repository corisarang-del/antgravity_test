export const authStorageKey = "ant_auth_session_v1";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number | null;
  user: {
    id: string;
    email: string;
  };
};

export function getStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(authStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setStoredAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export function clearStoredAuthSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(authStorageKey);
}
