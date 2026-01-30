/**
 * Utilitário para gerenciamento seguro de cookies do Supabase
 * Previne o acúmulo de cookies duplicados que causam erro 431
 */

/**
 * Padrões de cookies do Supabase
 */
const SUPABASE_COOKIE_PATTERNS = {
  AUTH_TOKEN: /^sb-[a-z0-9]{20}-auth-token$/,
  AUTH_TOKEN_CODE_VERIFIER: /^sb-[a-z0-9]{20}-auth-token-code-verifier$/,
  AUTH_TOKEN_REFRESH: /^sb-[a-z0-9]{20}-auth-token\.(\d+)$/,
  LEGACY: /^sb-.*$/
}

/**
 * Interface para informações de cookie
 */
interface CookieInfo {
  name: string
  value: string
  isValid: boolean
  isLegacy: boolean
  type: 'auth' | 'verifier' | 'refresh' | 'legacy' | 'unknown'
}

/**
 * Analisa um cookie e retorna suas informações
 */
function analyzeCookie(name: string, value: string): CookieInfo {
  let type: CookieInfo['type'] = 'unknown'
  let isValid = false
  let isLegacy = false

  if (SUPABASE_COOKIE_PATTERNS.AUTH_TOKEN.test(name)) {
    type = 'auth'
    isValid = value.length > 0
  } else if (SUPABASE_COOKIE_PATTERNS.AUTH_TOKEN_CODE_VERIFIER.test(name)) {
    type = 'verifier'
    isValid = value.length > 0
  } else if (SUPABASE_COOKIE_PATTERNS.AUTH_TOKEN_REFRESH.test(name)) {
    type = 'refresh'
    isLegacy = true
  } else if (SUPABASE_COOKIE_PATTERNS.LEGACY.test(name)) {
    type = 'legacy'
    isLegacy = true
  }

  return { name, value, isValid, isLegacy, type }
}

/**
 * Obtém todos os cookies do Supabase do navegador
 */
export function getSupabaseCookies(): CookieInfo[] {
  if (typeof document === 'undefined') return []

  const cookies: CookieInfo[] = []
  const cookieString = document.cookie

  cookieString.split(';').forEach(cookie => {
    const [name, ...valueParts] = cookie.trim().split('=')
    const value = valueParts.join('=')

    if (name.startsWith('sb-')) {
      cookies.push(analyzeCookie(name, value))
    }
  })

  return cookies
}

/**
 * Remove um cookie específico
 */
function deleteCookie(name: string, path: string = '/'): void {
  const domains = [
    window.location.hostname,
    `.${window.location.hostname}`,
  ]

  domains.forEach(domain => {
    // Tenta todas as combinações de SameSite
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Strict`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=None; Secure`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
  })
}

/**
 * Limpa cookies legados e duplicados, mantendo apenas o necessário
 */
export function cleanupSupabaseCookies(): {
  removed: string[]
  kept: string[]
  totalSize: number
} {
  const cookies = getSupabaseCookies()
  const removed: string[] = []
  const kept: string[] = []

  // Identifica o cookie de autenticação atual
  const authCookie = cookies.find(c => c.type === 'auth' && c.isValid)
  const verifierCookie = cookies.find(c => c.type === 'verifier' && c.isValid)

  cookies.forEach(cookie => {
    // Remove cookies legados
    if (cookie.isLegacy) {
      deleteCookie(cookie.name)
      removed.push(cookie.name)
      return
    }

    // Remove cookies duplicados (mantém apenas o mais recente)
    if (cookie.type === 'auth' && cookie.name !== authCookie?.name) {
      deleteCookie(cookie.name)
      removed.push(cookie.name)
      return
    }

    if (cookie.type === 'verifier' && cookie.name !== verifierCookie?.name) {
      deleteCookie(cookie.name)
      removed.push(cookie.name)
      return
    }

    // Remove cookies inválidos
    if (!cookie.isValid) {
      deleteCookie(cookie.name)
      removed.push(cookie.name)
      return
    }

    kept.push(cookie.name)
  })

  // Calcula tamanho total dos cookies mantidos
  const totalSize = kept.reduce((sum, name) => {
    const cookie = cookies.find(c => c.name === name)
    return sum + (cookie ? name.length + cookie.value.length : 0)
  }, 0)

  return { removed, kept, totalSize }
}

/**
 * Verifica se os cookies estão próximos do limite
 */
export function checkCookieSize(): {
  size: number
  isNearLimit: boolean
  isOverLimit: boolean
} {
  const cookies = getSupabaseCookies()
  
  const size = cookies.reduce((sum, cookie) => {
    return sum + cookie.name.length + cookie.value.length + 4 // +4 para "; " e "="
  }, 0)

  return {
    size,
    isNearLimit: size > 4000, // 4KB
    isOverLimit: size > 6000  // 6KB
  }
}

/**
 * Hook para limpeza automática após login
 */
export function setupAutoCleanup(): void {
  if (typeof window === 'undefined') return

  // Executa limpeza ao carregar a página
  const cleanup = () => {
    const { size, isNearLimit } = checkCookieSize()
    
    if (isNearLimit) {
      console.warn(`[Cookie Manager] Cookie size near limit: ${size} bytes. Cleaning up...`)
      const result = cleanupSupabaseCookies()
      console.log(`[Cookie Manager] Removed ${result.removed.length} cookies, kept ${result.kept.length}`)
    }
  }

  // Executa imediatamente
  cleanup()

  // Executa a cada 30 segundos
  const interval = setInterval(cleanup, 30000)

  // Limpa ao descarregar a página
  window.addEventListener('beforeunload', () => {
    clearInterval(interval)
  })
}

/**
 * Força limpeza completa de todos os cookies do Supabase
 */
export function forceCleanupAllSupabaseCookies(): void {
  const cookies = getSupabaseCookies()
  
  cookies.forEach(cookie => {
    deleteCookie(cookie.name)
  })
  
  console.log(`[Cookie Manager] Force cleanup: removed ${cookies.length} cookies`)
}

/**
 * Debug: mostra informações sobre os cookies atuais
 */
export function debugCookies(): void {
  const cookies = getSupabaseCookies()
  const { size, isNearLimit, isOverLimit } = checkCookieSize()
  
  console.group('🍪 Supabase Cookies Debug')
  console.log('Total cookies:', cookies.length)
  console.log('Total size:', size, 'bytes')
  console.log('Near limit:', isNearLimit)
  console.log('Over limit:', isOverLimit)
  console.table(cookies)
  console.groupEnd()
}

// Exporta tudo como default também
const supabaseCookieManager = {
  getSupabaseCookies,
  cleanupSupabaseCookies,
  checkCookieSize,
  setupAutoCleanup,
  forceCleanupAllSupabaseCookies,
  debugCookies
}

export default supabaseCookieManager
