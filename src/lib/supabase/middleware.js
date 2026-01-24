import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname // e.g. /pt-br/calculadora or /sign-in

  // Normalize path by removing locale
  const segments = pathname.split('/')
  // segments[0] is empty, segments[1] is locale (en/pt-br)
  const hasLocale = segments.length > 1 && (segments[1] === 'en' || segments[1] === 'pt-br')
  const pathWithoutLocale = hasLocale 
    ? '/' + segments.slice(2).join('/')
    : pathname

  // Public routes (add more as needed)
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/auth/callback']
  const isPublic = publicRoutes.some(route => pathWithoutLocale.startsWith(route) || pathWithoutLocale === route)

  if (
    !user &&
    !isPublic &&
    !pathWithoutLocale.startsWith('/api') &&
    !pathWithoutLocale.startsWith('/_next') &&
    !pathWithoutLocale.includes('.') // Static files
  ) {
    // Redirect to sign-in
    // Preserve locale if present, otherwise default to pt-br
    const locale = hasLocale ? segments[1] : 'pt-br'
    url.pathname = `/${locale}/sign-in`
    return NextResponse.redirect(url)
  }

  // If logged in and trying to access public auth routes, redirect to dashboard
  if (user && isPublic) {
     const locale = hasLocale ? segments[1] : 'pt-br'
     url.pathname = `/${locale}`
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}
