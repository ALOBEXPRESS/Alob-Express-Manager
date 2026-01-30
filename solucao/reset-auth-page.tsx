import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Limpeza de Sessão - Alob Express',
  description: 'Corrigindo problema de autenticação',
}

/**
 * Página de reset de autenticação
 * Esta página redireciona para a versão HTML estática
 */
export default function ResetAuthPage() {
  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="refresh" content="0; url=/reset-auth.html" />
      </head>
      <body>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h1>Redirecionando para limpeza de sessão...</h1>
            <p>Se não for redirecionado automaticamente, <a href="/reset-auth.html" style={{ color: 'white', textDecoration: 'underline' }}>clique aqui</a>.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
