'use client';

import { useEffect } from 'react';

export default function CookieKiller() {
  useEffect(() => {
    // Executar apenas na primeira montagem
    const hasCleared = sessionStorage.getItem('cookies-cleared');
    
    if (!hasCleared) {
      // Limpar tudo
      if (typeof document !== 'undefined') {
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      }
      
      try {
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem('cookies-cleared', 'true');
      } catch (e) {
        console.warn('Erro ao limpar storage:', e);
      }
      
      console.log('🧹 Cookies limpos!');
    }
    
    // Limpar periodicamente
    const interval = setInterval(() => {
      if (typeof document !== 'undefined') {
        const cookieCount = document.cookie.split(';').length;
        if (cookieCount > 5) {
          console.warn(`⚠️ ${cookieCount} cookies detectados! Limpando...`);
          document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        }
      }
    }, 10000); // a cada 10s
    
    return () => clearInterval(interval);
  }, []);

  return null; // Não renderiza nada
}
