import { createBrowserClient } from "@supabase/ssr";

const resolveSupabaseUrl = (value) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

const supabaseUrl = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
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

const getProjectRef = () => {
  try {
    const url = new URL(supabaseUrl);
    return url.hostname.split(".")[0];
  } catch {
    return "";
  }
};

const clearSupabaseAuth = () => {
  if (typeof window === "undefined") return;
  const projectRef = getProjectRef();
  const keysToRemove = [];
  
  // Clear SessionStorage
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (!key) continue;
    // Remove Supabase keys and any large keys that might be causing issues
    if (
      (projectRef && key.includes(projectRef)) ||
      key.includes("supabase") || 
      key.includes("auth-token") || 
      key.startsWith("sb-")
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));

  // Clear Cookies aggressively
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (!name) return;
    
    // Clear all Supabase related cookies and potentially problematic ones
    if (
      name.startsWith("sb-") || 
      name.includes("supabase") ||
      name.includes("auth") ||
      // If we are getting 431, we might want to clear everything on localhost to be safe
      (window.location.hostname === "localhost" && cookies.length > 10) 
    ) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
};

const fetchWithRetry = async (input, init) => {
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(input, init);
      if (response.status === 431) {
        clearSupabaseAuth();
        if (attempt < maxAttempts - 1) {
          await wait(300 * (attempt + 1));
          continue;
        }
      }
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

const customStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('[Supabase] Failed to save to sessionStorage:', e);
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    storageKey: 'supabase-auth',
    persistSession: true,
    detectSessionInUrl: true,
  },
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
