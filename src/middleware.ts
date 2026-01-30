import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'pt-br', 'pt-BR'],
  defaultLocale: 'pt-br',
  localeDetection: false
});

export default async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const intlResponse = intlMiddleware(request);

  response.cookies.getAll().forEach(({ name, value }) => {
    intlResponse.cookies.set(name, value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|clear-cookies|.*\\..*).*)']
};
