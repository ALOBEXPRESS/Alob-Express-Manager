import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        // IMPORTANTE: Usar cookies para persistência (não apenas sessionStorage)
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Deixar o Supabase gerenciar o storage automaticamente
      },
    }
  )
}

// Singleton instance for backward compatibility with existing components
export const supabase = createClient();

export const getSafeUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return { user: null, error };
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};
