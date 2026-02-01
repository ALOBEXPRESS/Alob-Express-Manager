import { NextResponse, type NextRequest } from 'next/server'

const MAX_COOKIE_SIZE = 4000
const SUPABASE_COOKIE_NAMES = new Set(['supabase-auth-token'])
const SUPPORTED_LOCALES = new Set(['pt-br', 'en', 'es'])
const DEFAULT_LOCALE = 'pt-br'

/**
 * Middleware principal
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const cookieHeader = request.headers.get('cookie') ?? ''

  if (pathname.startsWith('/api/calculator')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('cookie')
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  const supabaseCookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separatorIndex = cookie.indexOf('=')
      const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie
      return { name, raw: cookie }
    })
    .filter(({ name }) => name.startsWith('sb-') || SUPABASE_COOKIE_NAMES.has(name))

  const supabaseCookieSize = supabaseCookies.reduce((size, cookie) => size + cookie.raw.length, 0)

  if (supabaseCookieSize > MAX_COOKIE_SIZE) {
    // PROTECT API: If this is the calculator API, strip cookies and proceed
    // The API uses Bearer token, so cookies are not needed, and they are causing 431 errors.
    if (pathname.startsWith('/api/calculator')) {
      console.warn(`[Middleware] Stripping huge cookies (${supabaseCookieSize} bytes) from /api/calculator`);
      
      // Create a response that clears cookies
      const requestHeaders = new Headers(request.headers);
      requestHeaders.delete('cookie');
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Also set headers to clear them in the browser to prevent future loops
      supabaseCookies.forEach(({ name }) => {
        response.cookies.set({
          name,
          value: '',
          maxAge: 0,
          path: '/',
          httpOnly: true,
        });
      });

      return response;
    }

    if (pathname === '/reset-auth.html') {
      return NextResponse.next()
    }

    const redirectUrl = new URL('/reset-auth.html', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    const response = NextResponse.redirect(redirectUrl)
    supabaseCookies.forEach(({ name }) => {
      response.cookies.set({
        name,
        value: '',
        maxAge: 0,
        path: '/',
        httpOnly: true,
      })
    })
    return response
  }

  if (pathname !== '/reset-auth' && pathname !== '/reset-auth.html') {
    if (pathname.startsWith('/__calc')) {
      return NextResponse.next()
    }

    if (pathname === '/') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${DEFAULT_LOCALE}/sign-in`
      return NextResponse.redirect(redirectUrl)
    }

    const firstSegment = pathname.split('/')[1] ?? ''
    if (!SUPPORTED_LOCALES.has(firstSegment)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return NextResponse.next()
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
     * - api routes (EXCEPT /api/calculator which we want to process to strip cookies)
     * - __calc (calculator micro-frontend)
     */
    '/((?!api(?!/calculator)|_next/static|_next/image|favicon.ico|.*\\..*|reset-auth\\.html).*)',
  ],
}
