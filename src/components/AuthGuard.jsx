'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Rotas públicas que não precisam de auth
    const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset.html', '/clear-cookies.html'];
    const isPublic = publicPaths.some(path => pathname.includes(path));

    if (isPublic) {
      setAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Obter locale da URL ou default pt-br
        const locale = pathname.split('/')[1] || 'pt-br';
        const loginPath = `/${locale}/sign-in`;
        console.log('[AuthGuard] Redirecting to:', loginPath);
        router.push(loginPath);
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
    
    // Validar mudanças de sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (!isPublic) { // Só redirecionar se não estiver em pública
             const locale = pathname.split('/')[1] || 'pt-br';
             router.replace(`/${locale}/sign-in`);
             setAuthorized(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (!authorized) {
    return null; 
  }

  return children;
}
