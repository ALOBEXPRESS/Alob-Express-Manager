'use client';

import { useEffect } from 'react';

/**
 * Cookie Monitor - Monitora e limpa cookies automaticamente
 * 
 * Este componente roda continuamente no client-side para garantir
 * que cookies nunca ultrapassem o limite seguro
 */
export default function CookieMonitor() {
  useEffect(() => {
    // Não executar na página de login
    if (typeof window !== 'undefined' && window.location.pathname.includes('/sign-in')) {
      console.log('[CookieMonitor] Desabilitado na página de login');
      return;
    }
    
    const cleanupExcessCookies = () => {
      if (typeof document === 'undefined') return;
      
      const cookieString = document.cookie;
      const cookieSize = new Blob([cookieString]).size;
      
      if (cookieSize > 2000) {
        console.warn(`[CookieMonitor] Cookies grandes: ${cookieSize} bytes. Limpando...`);
        
        const cookies = document.cookie.split(';');
        let deleted = 0;
        const host = window.location.hostname;
        const domains = ['', host, `.${host}`];
        const paths = ['/', '/pt-br', '/en'];
        
        cookies.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          
          if (!cookieName) return;

          paths.forEach(path => {
            domains.forEach(domain => {
              const domainPart = domain ? `; domain=${domain}` : '';
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainPart}`;
              document.cookie = `${cookieName}=; Max-Age=0; path=${path}${domainPart}`;
            });
          });
          deleted++;
        });
        
        const newSize = new Blob([document.cookie]).size;
        console.log(`[CookieMonitor] Limpeza: ${cookieSize} → ${newSize} bytes (${deleted} deletados)`);
      }
    };
    
    // Executar limpeza após 2 segundos (dar tempo para login completar)
    const initialTimeout = setTimeout(cleanupExcessCookies, 2000);
    
    // Monitorar a cada 10 segundos (menos agressivo)
    const interval = setInterval(cleanupExcessCookies, 10000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);
  
  return null;
}
