'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { supabase, clearAuthStorage } from '@/lib/supabase/client';

const AUTH_PENDING_KEY = 'alob-auth-pending';
const AUTH_PENDING_TTL = 10000;

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
});

const getLocaleFromPath = (pathname) => {
  if (!pathname) return 'pt-br';
  const segment = pathname.split('/')[1];
  return segment || 'pt-br';
};

const isPublicRoute = (pathname) => {
  if (!pathname) return false;
  if (pathname.startsWith('/reset-auth')) return true;
  const segments = pathname.split('/');
  const routeSegment = segments[2] || '';
  const publicSegments = new Set(['sign-in', 'sign-up', 'forgot-password']);
  return publicSegments.has(routeSegment);
};

const isAuthEntryRoute = (pathname) => {
  if (!pathname) return false;
  const segments = pathname.split('/');
  const routeSegment = segments[2] || '';
  return routeSegment === 'sign-in' || routeSegment === 'sign-up' || routeSegment === 'forgot-password';
};

const getAuthPending = () => {
  if (typeof window === 'undefined') return false;
  const raw = window.sessionStorage.getItem(AUTH_PENDING_KEY);
  if (!raw) return false;
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) {
    window.sessionStorage.removeItem(AUTH_PENDING_KEY);
    return false;
  }
  if (Date.now() - timestamp > AUTH_PENDING_TTL) {
    window.sessionStorage.removeItem(AUTH_PENDING_KEY);
    return false;
  }
  return true;
};

const clearAuthPending = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(AUTH_PENDING_KEY);
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState({
        user: data?.session?.user ?? null,
        session: data?.session ?? null,
        loading: false,
      });
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      });
      if (!session) {
        clearAuthStorage();
      } else {
        clearAuthPending();
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!pathname || state.loading) return;

    const locale = getLocaleFromPath(pathname);
    const publicRoute = isPublicRoute(pathname);
    const hasSession = !!state.session;

    if (!hasSession && !publicRoute) {
      const redirectTo = encodeURIComponent(pathname);
      if (getAuthPending()) {
        const timer = window.setTimeout(() => {
          if (!getAuthPending()) {
            console.log('[AuthProvider] Redirecting to sign-in (pending expired)', pathname);
            router.replace(`/${locale}/sign-in?redirectTo=${redirectTo}`);
          }
        }, 1200);
        return () => window.clearTimeout(timer);
      }
      console.log('[AuthProvider] Redirecting to sign-in (no session)', pathname);
      router.replace(`/${locale}/sign-in?redirectTo=${redirectTo}`);
      return;
    }

    if (hasSession && isAuthEntryRoute(pathname)) {
      clearAuthPending();
      const redirectTo = searchParams?.get('redirectTo');
      const safeTarget =
        redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : `/${locale}`;
      console.log('[AuthProvider] Redirecting after login', pathname, '->', safeTarget);
      router.replace(safeTarget);
    }
  }, [pathname, router, searchParams, state.loading, state.session]);

  const value = useMemo(
    () => ({
      user: state.user,
      session: state.session,
      loading: state.loading,
    }),
    [state.loading, state.session, state.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
