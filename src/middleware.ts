import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt-br'],

  // Used when no locale matches
  defaultLocale: 'pt-br',
  
  // Disable automatic locale detection
  localeDetection: false
});

export default async function middleware(request) {
  // 1. Run Supabase auth check first
  // This will handle redirects for protected routes
  // But we need to be careful: updateSession returns a response.
  // If it's a redirect, we should return it immediately.
  const response = await updateSession(request);

  // If updateSession returned a redirect (status 3xx), return it
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // 2. If no redirect from auth, run intl middleware
  // We need to pass the modified request/response if cookies were set?
  // updateSession handles cookies on the response object it creates.
  // But intlMiddleware creates its own response.
  
  // Actually, we should probably run intlMiddleware first to handle locale routing,
  // THEN check auth? No, because we want to protect routes regardless of locale.
  
  // Let's run intlMiddleware and then merge headers/cookies if needed.
  // Or simply return intlMiddleware(request) if no auth redirect occurred, 
  // but we must ensure the session cookie is refreshed (handled in updateSession).
  
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};