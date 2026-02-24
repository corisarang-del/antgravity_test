type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function toApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem("ant_auth_session_v1");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { accessToken?: string; user?: { id?: string } };
        if (parsed.user?.id) headers["x-user-id"] = parsed.user.id;
        if (parsed.accessToken) headers.Authorization = `Bearer ${parsed.accessToken}`;
      } catch {
        // ignore parse error and continue with unauthenticated request
      }
    }
  }

  const response = await fetch(toApiUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "";
    try {
      const json = (await response.json()) as { detail?: string };
      detail = json.detail ? ` (${json.detail})` : "";
    } catch {
      detail = "";
    }
    throw new Error(`API request failed: ${response.status}${detail}`);
  }

  return (await response.json()) as T;
}
