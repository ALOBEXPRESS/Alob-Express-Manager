'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { clearAuthStorage } from '@/lib/supabase/client'

export default function ResetAuthPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'clearing' | 'done'>('idle')

  const redirectTo = searchParams.get('redirectTo') ?? ''
  const locale = useMemo(() => {
    const candidate = redirectTo.split('/')[1]
    return candidate === 'en' || candidate === 'es' || candidate === 'pt-br' ? candidate : 'pt-br'
  }, [redirectTo])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setStatus('clearing')
      try {
        clearAuthStorage()
        window.localStorage.clear()
        window.sessionStorage.clear()
      } catch {}

      if (cancelled) return
      setStatus('done')

      const safeTarget =
        redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : `/${locale}`
      window.location.replace(safeTarget)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [locale, redirectTo])

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', padding: 24 }}>
      <h1>Restaurando acesso…</h1>
      <p>{status === 'clearing' ? 'Limpando dados locais.' : 'Redirecionando.'}</p>
    </main>
  )
}
