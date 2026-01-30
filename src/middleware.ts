import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const MAX_HEADER_SIZE = 6000 // 6KB - limite seguro antes do erro 431
const COOKIE_CLEANUP_THRESHOLD = 4000 // 4KB - inicia limpeza preventiva

/**
 * Calcula o tamanho aproximado dos headers da requisição
 */
function getHeadersSize(request: NextRequest): number {
  let size = 0
  request.headers.forEach((value, key) => {
    size += key.length + value.length + 4 // +4 para ": " e "\r\n"
  })
  return size
}

/**
 * Extrai todos os cookies do Supabase da requisição
 */
function getSupabaseCookies(request: NextRequest): Map<string, string> {
  const cookies = new Map<string, string>()
  const cookieHeader = request.headers.get('cookie') || ''
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...valueParts] = cookie.trim().split('=')
    const value = valueParts.join('=')
    
    if (name.startsWith('sb-')) {
      cookies.set(name, value)
    }
  })
  
  return cookies
}

/**
 * Identifica o cookie de autenticação atual e válido
 */
function getCurrentAuthCookie(cookies: Map<string, string>): [string, string] | null {
  // Padrão: sb-[project-ref]-auth-token
  for (const [name, value] of cookies.entries()) {
    if (name.match(/^sb-[a-z0-9]{20}-auth-token$/)) {
      return [name, value]
    }
  }
  return null
}

/**
 * Remove cookies duplicados e legados, mantendo apenas o atual
 */
function cleanupSupabaseCookies(request: NextRequest, response: NextResponse): void {
  const cookies = getSupabaseCookies(request)
  const currentAuth = getCurrentAuthCookie(cookies)
  
  // Remove todos os cookies do Supabase
  cookies.forEach((_, name) => {
    response.cookies.delete(name)
  })
  
  // Restaura apenas o cookie de autenticação atual
  if (currentAuth) {
    const [name, value] = currentAuth
    response.cookies.set(name, value, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })
  }
}

/**
 * Middleware principal
 */
export async function middleware(request: NextRequest) {
  const headersSize = getHeadersSize(request)
  const pathname = request.nextUrl.pathname
  
  // 🚨 CAMADA 1: Detecção de Header Gigante
  // Se o header já está muito grande, redireciona para página de reset
  if (headersSize > MAX_HEADER_SIZE) {
    console.error(`[MIDDLEWARE] Header size exceeded: ${headersSize} bytes on ${pathname}`)
    
    // Evita loop infinito na página de reset
    if (pathname === '/reset-auth') {
      return NextResponse.next()
    }

    const redirectUrl = new URL('/reset-auth', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // 🔄 CAMADA 2: Limpeza Preventiva
  // Se está próximo do limite, faz limpeza preventiva
  const needsCleanup = headersSize > COOKIE_CLEANUP_THRESHOLD
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  
  if (needsCleanup) {
    console.warn(`[MIDDLEWARE] Preventive cleanup triggered: ${headersSize} bytes`)
    cleanupSupabaseCookies(request, response)
  }
  
  // 🔐 CAMADA 3: Atualização de Sessão do Supabase
  // Configura o cliente Supabase para SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const safeOptions = { ...options }
            if (typeof options?.maxAge === 'number') {
              safeOptions.maxAge = Math.min(options.maxAge, 60 * 60 * 24 * 7)
            }
            response.cookies.set(name, value, safeOptions)
          })
        },
      },
    }
  )
  
  // Atualiza a sessão (isso pode criar novos cookies)
  const { data: { user } } = await supabase.auth.getUser()
  
  // 🛡️ CAMADA 5: Proteção de Rotas
  const locale = pathname.split('/')[1] || 'pt-br'
  const supportedLocales = new Set(['pt-br', 'en', 'es'])
  const isLocaleRoute = supportedLocales.has(locale)
  const isPublicAuthRoute =
    pathname === `/${locale}/sign-in` ||
    pathname === `/${locale}/sign-up` ||
    pathname === `/${locale}/forgot-password`
  const isResetRoute = pathname === '/reset-auth' || pathname === '/reset-auth.html'
  const isProtectedRoute = isLocaleRoute && !isPublicAuthRoute && !isResetRoute

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL(`/${locale}/sign-in`, request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Log para monitoramento
  const finalHeadersSize = getHeadersSize(request)
  if (finalHeadersSize !== headersSize) {
    console.log(`[MIDDLEWARE] Headers size reduced: ${headersSize} -> ${finalHeadersSize} bytes`)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - reset-auth.html (página de reset estática)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|reset-auth\\.html).*)',
  ],
}
