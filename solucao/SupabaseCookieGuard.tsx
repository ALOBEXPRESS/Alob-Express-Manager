'use client'

import { useEffect } from 'react'
import { setupAutoCleanup, checkCookieSize, cleanupSupabaseCookies } from '@/lib/supabase-cookie-manager'

/**
 * Componente para gerenciamento automático de cookies do Supabase
 * Deve ser incluído no layout raiz da aplicação
 */
export function SupabaseCookieGuard() {
  useEffect(() => {
    // Verifica se está no navegador
    if (typeof window === 'undefined') return

    // Verifica o tamanho dos cookies ao montar
    const { size, isOverLimit, isNearLimit } = checkCookieSize()

    if (isOverLimit) {
      console.error(`[Cookie Guard] Cookie size over limit: ${size} bytes. Redirecting to cleanup...`)
      window.location.href = '/reset-auth.html'
      return
    }

    if (isNearLimit) {
      console.warn(`[Cookie Guard] Cookie size near limit: ${size} bytes. Cleaning up...`)
      cleanupSupabaseCookies()
    }

    // Configura limpeza automática
    setupAutoCleanup()

    // Monitora mudanças de rota
    const handleRouteChange = () => {
      const { size, isOverLimit } = checkCookieSize()
      
      if (isOverLimit) {
        console.error(`[Cookie Guard] Cookie size over limit after navigation: ${size} bytes`)
        window.location.href = '/reset-auth.html'
      }
    }

    // Monitora eventos de navegação (Next.js)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}

/**
 * Hook para usar o gerenciador de cookies em componentes
 */
export function useSupabaseCookieManager() {
  useEffect(() => {
    const { size, isNearLimit } = checkCookieSize()
    
    if (isNearLimit) {
      cleanupSupabaseCookies()
    }
  }, [])

  return {
    cleanup: cleanupSupabaseCookies,
    checkSize: checkCookieSize
  }
}
