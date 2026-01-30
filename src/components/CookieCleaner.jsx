'use client';

import { useEffect } from 'react';
import { clearAllCookies } from '@/lib/cookie-cleaner';

export default function CookieCleaner({ children }) {
  useEffect(() => {
    // NÃO limpar na montagem inicial para não destruir sessão ativa
    // Apenas monitorar e limpar cookies problemáticos
    
    const interval = setInterval(() => {
      const cookies = document.cookie.split(';').filter(c => c.trim());
      const totalSize = document.cookie.length;
      
      // Só limpar se os cookies estiverem MUITO grandes (próximo ao limite)
      if (totalSize > 6000) {
        console.warn(`⚠️ Cookies grandes (${totalSize} bytes). Limpando cookies não essenciais...`);
        clearAllCookies();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
