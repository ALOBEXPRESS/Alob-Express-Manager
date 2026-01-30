import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['pt-br', 'en', 'es', 'pt-BR'],
  defaultLocale: 'pt-br',
  localePrefix: 'always',
  localeDetection: false
})

export async function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || ''
  const acceptHeader = request.headers.get('accept') || ''
  const pathname = request.nextUrl.pathname
  const locale = pathname.split('/')[1] || 'pt-br'

  if (
    cookieHeader.length > 6000 &&
    acceptHeader.includes('text/html') &&
    !pathname.includes('/reset-auth.html')
  ) {
    const redirectUrl = new URL('/reset-auth.html', request.url)
    redirectUrl.searchParams.set('redirect', `/${locale}`)
    return NextResponse.redirect(redirectUrl)
  }

  let response = intlMiddleware(request)

  // Criar Supabase client para verificar autenticação
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
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession()

  // Se não tiver sessão e não estiver na página de login, redirecionar
  if (!session && !request.nextUrl.pathname.includes('/sign-in')) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'pt-br'
    // Evitar loop de redirecionamento se já estiver indo para sign-in
    if (!request.nextUrl.pathname.endsWith('/sign-in')) {
       return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url))
    }
  }

  // Se tiver sessão e estiver na página de login, redirecionar para dashboard
  if (session && request.nextUrl.pathname.includes('/sign-in')) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'pt-br'
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
