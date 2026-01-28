import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars are missing");
}

const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);

const normalizeUrl = (input) => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (input && typeof input.url === "string") return input.url;
  return "";
};

const resolveMethod = (input, init) => {
  if (init?.method) return init.method;
  if (input && typeof input.method === "string") return input.method;
  return "GET";
};

const isAuthTokenRequest = (input, init) => {
  const url = normalizeUrl(input);
  if (!url.includes("/auth/v1/token")) return false;
  const method = resolveMethod(input, init).toUpperCase();
  return method === "POST";
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (input, init) => {
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(input, init);
      if (
        !isAuthTokenRequest(input, init) ||
        !RETRYABLE_STATUS.has(response.status) ||
        attempt === maxAttempts - 1
      ) {
        return response;
      }
      await wait(300 * (attempt + 1));
    } catch (error) {
      if (!isAuthTokenRequest(input, init) || attempt === maxAttempts - 1) {
        throw error;
      }
      await wait(300 * (attempt + 1));
    }
  }
  return fetch(input, init);
};

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
    fetch: fetchWithRetry,
  },
});

export const getSafeUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      const message = error?.message || "";
      if (
        message.includes("Refresh Token Not Found") ||
        message.includes("Invalid Refresh Token")
      ) {
        await supabase.auth.signOut();
      }
      return { user: null, error };
    }
    return { user: data?.user ?? null, error: null };
  } catch (error) {
    const message = error?.message || "";
    if (
      message.includes("Refresh Token Not Found") ||
      message.includes("Invalid Refresh Token")
    ) {
      try {
        await supabase.auth.signOut();
      } catch {
        return { user: null, error };
      }
    }
    return { user: null, error };
  }
};
