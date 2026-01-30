const getProjectRef = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const match = supabaseUrl.match(/^https?:\/\/([^.]+)\./)
  return match?.[1] || null
}

export function clearAllCookies() {
  if (typeof document === 'undefined') return;

  const cookies = document.cookie.split(';');
  
  const projectRef = getProjectRef()
  const preserveCookies = projectRef
    ? [
        `sb-${projectRef}-`,
        'supabase-auth-token',
        '__Secure-next-auth',
        'next-auth',
        'NEXT_LOCALE',
      ]
    : [
        'sb-',
        'supabase-auth-token',
        '__Secure-next-auth',
        'next-auth',
        'NEXT_LOCALE',
      ];

  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    const trimmedName = name?.trim();
    
    if (!trimmedName) continue;

    // NÃO deletar cookies importantes
    const shouldPreserve = preserveCookies.some(prefix => 
      trimmedName.startsWith(prefix)
    );

    if (shouldPreserve) {
      console.log(`🔒 Preservando cookie: ${trimmedName}`);
      continue;
    }

    // Deletar apenas cookies não essenciais
    const deletionStrings = [
      `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
      `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`,
      `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`,
      `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=127.0.0.1;`,
    ];

    deletionStrings.forEach(str => {
      document.cookie = str;
    });
  }

  // NÃO limpar sessionStorage se estiver usando para auth
  // Apenas limpar itens não relacionados ao auth
  try {
    const keysToPreserve = [];
    const storageKeys = Object.keys(sessionStorage);
    
    storageKeys.forEach(key => {
      const shouldPreserve = projectRef
        ? key.startsWith(`sb-${projectRef}-`) || key.includes('supabase')
        : key.startsWith('sb-') || key.includes('supabase')
      if (shouldPreserve) {
        keysToPreserve.push({ key, value: sessionStorage.getItem(key) });
      }
    });

    // Limpar tudo
    sessionStorage.clear();

    // Restaurar itens importantes
    keysToPreserve.forEach(({ key, value }) => {
      if (value) sessionStorage.setItem(key, value);
    });

  } catch (e) {
    console.warn('Erro ao limpar storage:', e);
  }
}

export function useClearCookiesOnMount() {
  // Deprecated: use CookieCleaner component instead for safer cleaning
  // Keeping for backward compatibility but making it no-op or safer if needed
  // For now, we'll just leave it empty or log a warning to migrate
  if (typeof window === 'undefined') return;
  // Intentionally doing nothing here to avoid aggressive logout
}
