import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const createStorageAdapter = () => ({
  getItem: (key) => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  },
})

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: createStorageAdapter(),
      },
    }
  )
}

export const supabase = createClient();

export const getSafeUser = async () => {
  try {
    const { data } = await supabase.auth.getSession()
    const sessionUser = data?.session?.user ?? null
    if (sessionUser) return { user: sessionUser, error: null }
  } catch (error) {
    return { user: null, error }
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return { user: null, error }
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return
  const keys = Object.keys(window.localStorage)
  keys.forEach((key) => {
    if (key.startsWith('sb-') || key === 'supabase.auth.token') {
      window.localStorage.removeItem(key)
    }
  })
  const sessionKeys = Object.keys(window.sessionStorage)
  sessionKeys.forEach((key) => {
    if (key.startsWith('sb-') || key === 'supabase.auth.token') {
      window.sessionStorage.removeItem(key)
    }
  })
}
