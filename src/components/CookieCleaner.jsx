'use client';

import { useEffect } from 'react';

/**
 * Componente de Limpeza de Cookies
 * 
 * Este componente limpa cookies excessivos automaticamente
 * para prevenir o erro 431 (Request Header Fields Too Large)
 */
export default function CookieCleaner() {
  useEffect(() => {
    const cookieString = document.cookie;
    const cookieSize = new Blob([cookieString]).size;
    
    if (cookieSize > 4000) {
      console.warn(`⚠️ Cookies muito grandes detectados: ${cookieSize} bytes. Iniciando limpeza seletiva...`);
      
      const cookies = document.cookie.split(';');
      const host = window.location.hostname;
      const domains = ['', host, `.${host}`];
      const paths = ['/', '/pt-br', '/en', '/pt-BR'];
      
      cookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        if (!cookieName) return;
        
        // Priorizar limpeza de cookies que não são do Supabase
        // Se o tamanho for extremo (> 8000), limpa tudo.
        const isSupabase = cookieName.startsWith('sb-') || cookieName.includes('supabase');

        if (cookieSize > 8000 || !isSupabase) {
          paths.forEach(path => {
            domains.forEach(domain => {
              const domainPart = domain ? `; domain=${domain}` : '';
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainPart}`;
              document.cookie = `${cookieName}=; Max-Age=0; path=${path}${domainPart}`;
            });
          });
        }
      });
      
      const newCookieSize = new Blob([document.cookie]).size;
      console.log(`✅ Cookies limpos: ${cookieSize} → ${newCookieSize} bytes`);
      
      if (newCookieSize > 4000) {
        console.error('🚨 Cookies ainda muito grandes, limpando TUDO');
        document.cookie.split(';').forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          if (!cookieName) return;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        window.location.reload();
      }
    }
  }, []);
  
  return null;
}
