'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-auth'];
    const isPublic = publicPaths.some(path => pathname.includes(path));

    if (isPublic) {
      setAuthorized(true);
      return;
    }

    if (!session) {
      const locale = pathname.split('/')[1] || 'pt-br';
      const loginPath = `/${locale}/sign-in`;
      router.replace(loginPath);
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
  }, [loading, pathname, router, session]);

  if (!authorized) {
    return null; 
  }

  return children;
}
