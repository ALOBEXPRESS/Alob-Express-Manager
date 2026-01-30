# 🔧 Solução Definitiva para Erro 431 - Alob Express Manager

## 📋 Resumo do Problema

O erro `431 Request Header Fields Too Large` ocorre quando os cookies de sessão do Supabase acumulam além do limite de 8KB do Node.js, causando falha no carregamento de rotas protegidas.

## 🛡️ Solução Implementada (Arquitetura em 5 Camadas)

### 1️⃣ **Camada de Detecção (Middleware)**
**Arquivo**: `src/middleware.ts`

- Monitora tamanho dos headers em cada requisição
- Redireciona para `/reset-auth` se exceder 6KB
- Previne loops infinitos

### 2️⃣ **Camada de Limpeza Preventiva (Middleware)**
**Arquivo**: `src/middleware.ts`

- Ativa limpeza automática ao atingir 4KB
- Remove cookies duplicados e legados
- Mantém apenas o token de autenticação atual

### 3️⃣ **Camada de Gestão SSR (Middleware)**
**Arquivo**: `src/middleware.ts`

- Configura cliente Supabase com cookies otimizados
- Limita `maxAge` dos cookies para 7 dias
- Previne criação de cookies duplicados

### 4️⃣ **Camada de Limpeza Client-Side (Utilitário)**
**Arquivo**: `src/lib/supabase-cookie-manager.ts`

- Analisa e categoriza cookies do Supabase
- Remove cookies inválidos e legados
- Monitora tamanho total dos cookies
- Auto-limpeza a cada 30 segundos

### 5️⃣ **Camada de Recuperação (Página Estática)**
**Arquivo**: `public/reset-auth.html`

- Limpeza agressiva sem passar pelo servidor
- Remove todos os cookies e storage
- Redireciona para login após conclusão

## 📁 Estrutura de Arquivos

```
alob-express-manager/
├── src/
│   ├── middleware.ts                    # Middleware principal com 5 camadas
│   ├── lib/
│   │   └── supabase-cookie-manager.ts  # Utilitário de gestão de cookies
│   ├── components/
│   │   └── SupabaseCookieGuard.tsx     # Componente de proteção React
│   └── app/
│       └── reset-auth/
│           └── page.tsx                 # Fallback da página de reset
├── public/
│   └── reset-auth.html                  # Página estática de limpeza
├── next.config.js                       # Configuração otimizada do Next.js
└── package.json                         # Scripts com NODE_OPTIONS
```

## 🚀 Implementação Passo a Passo

### Passo 1: Atualizar o Middleware

Substitua o conteúdo de `src/middleware.ts` pelo novo código:

```bash
# Faça backup do middleware atual
cp src/middleware.ts src/middleware.ts.backup

# Copie o novo middleware
cp middleware.ts src/middleware.ts
```

**Verifique**:
- ✅ Importações do `@supabase/ssr`
- ✅ Variáveis de ambiente configuradas
- ✅ Matcher de rotas atualizado

### Passo 2: Adicionar o Utilitário de Cookies

Crie o arquivo de gerenciamento:

```bash
# Crie o diretório se não existir
mkdir -p src/lib

# Copie o utilitário
cp supabase-cookie-manager.ts src/lib/
```

### Passo 3: Adicionar Página Estática de Reset

```bash
# Copie para a pasta public
cp reset-auth.html public/
```

**Teste**: Acesse `http://localhost:3001/reset-auth.html` diretamente

### Passo 4: Criar Página Next.js de Fallback

```bash
# Crie a estrutura
mkdir -p src/app/reset-auth

# Copie a página
cp reset-auth-page.tsx src/app/reset-auth/page.tsx
```

### Passo 5: Adicionar Componente de Proteção

```bash
# Crie o diretório de componentes
mkdir -p src/components

# Copie o componente
cp SupabaseCookieGuard.tsx src/components/
```

**Integre no layout raiz** (`src/app/layout.tsx`):

```tsx
import { SupabaseCookieGuard } from '@/components/SupabaseCookieGuard'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SupabaseCookieGuard />
        {children}
      </body>
    </html>
  )
}
```

### Passo 6: Atualizar Configurações

```bash
# Atualize o package.json (mantenha suas dependências)
# Certifique-se que os scripts tenham NODE_OPTIONS

# Atualize o next.config.js
cp next.config.js ./
```

### Passo 7: Limpar e Reinstalar

```bash
# Limpe cache do Next.js
rm -rf .next

# Limpe node_modules (opcional, mas recomendado)
rm -rf node_modules
npm install

# Ou use pnpm/yarn se preferir
```

## 🧪 Testando a Solução

### Teste 1: Limpeza Automática

```bash
# Inicie o servidor
npm run dev

# No DevTools do navegador:
# 1. Abra Application > Cookies
# 2. Crie múltiplos cookies sb-* manualmente
# 3. Recarregue a página
# 4. Verifique que apenas 1-2 cookies permanecem
```

### Teste 2: Página de Reset

```bash
# Acesse diretamente
http://localhost:3001/reset-auth.html

# Verifique que:
# - Todos os cookies são removidos
# - localStorage é limpo
# - Redireciona para /auth/login
```

### Teste 3: Middleware de Proteção

```bash
# No console do navegador, force cookies gigantes:
document.cookie = 'sb-test-large=' + 'x'.repeat(10000)

# Tente acessar:
http://localhost:3001/pt-br

# Deve redirecionar para /reset-auth
```

### Teste 4: Debug de Cookies

```tsx
// Em qualquer componente client-side:
import { debugCookies } from '@/lib/supabase-cookie-manager'

// No useEffect ou onClick:
debugCookies()
// Verifique o console para informações detalhadas
```

## 🐛 Troubleshooting

### Problema: Ainda recebo erro 431

**Soluções**:

1. **Verifique NODE_OPTIONS**:
```bash
# Windows (PowerShell)
$env:NODE_OPTIONS='--max-http-header-size=240000'
npm run dev

# Linux/Mac
NODE_OPTIONS='--max-http-header-size=240000' npm run dev
```

2. **Force limpeza completa**:
```typescript
import { forceCleanupAllSupabaseCookies } from '@/lib/supabase-cookie-manager'
forceCleanupAllSupabaseCookies()
```

3. **Limpe o cache do navegador**:
   - Chrome: Ctrl+Shift+Delete > Cookies e outros dados
   - Firefox: Ctrl+Shift+Delete > Cookies

### Problema: Redirecionamento infinito

**Causa**: Middleware interceptando a própria página de reset

**Solução**: Verifique o `matcher` no middleware:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|reset-auth\\.html).*)',
  ],
}
```

### Problema: Cookies não são removidos

**Soluções**:

1. **Verifique domínios**:
```typescript
// No supabase-cookie-manager.ts
const domains = [
  window.location.hostname,
  `.${window.location.hostname}`,
  'localhost',           // Adicione se necessário
  '.localhost'           // Adicione se necessário
]
```

2. **Teste diferentes caminhos**:
```typescript
const paths = ['/', '/pt-br', '/en', '/es', '/auth']
```

### Problema: Erro ao fazer login

**Causa**: Limpeza agressiva removendo cookies necessários

**Solução**: Ajuste o threshold no middleware:
```typescript
const COOKIE_CLEANUP_THRESHOLD = 5000 // Aumentar para 5KB
```

## 📊 Monitoramento

### Logs do Middleware

Ative logs detalhados adicionando ao `.env.local`:
```
NEXT_PUBLIC_DEBUG_COOKIES=true
```

Então no middleware:
```typescript
if (process.env.NEXT_PUBLIC_DEBUG_COOKIES === 'true') {
  console.log(`[MIDDLEWARE] Headers size: ${headersSize} bytes on ${pathname}`)
}
```

### Métricas de Performance

Monitore o tamanho dos cookies:
```typescript
import { checkCookieSize } from '@/lib/supabase-cookie-manager'

setInterval(() => {
  const { size, isNearLimit } = checkCookieSize()
  console.log(`Cookie size: ${size} bytes, Near limit: ${isNearLimit}`)
}, 10000) // A cada 10 segundos
```

## 🔒 Segurança

### Cookies Seguros em Produção

No middleware, certifique-se que:
```typescript
response.cookies.set(name, value, {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ HTTPS apenas
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7
})
```

### CSP Headers

Adicione ao `next.config.js`:
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
}
```

## 📈 Otimizações Futuras

1. **Rate Limiting**: Adicionar limite de tentativas de login
2. **Token Rotation**: Implementar rotação automática de tokens
3. **Session Storage**: Migrar dados não-sensíveis para sessionStorage
4. **Redis Cache**: Armazenar sessões no Redis em vez de cookies

## 🎯 Checklist de Implementação

- [ ] Middleware atualizado com 5 camadas
- [ ] Utilitário de cookies adicionado
- [ ] Página estática de reset criada
- [ ] Componente de proteção integrado
- [ ] package.json com NODE_OPTIONS
- [ ] next.config.js otimizado
- [ ] Testes realizados
- [ ] Logs de monitoramento configurados
- [ ] Documentação da equipe atualizada

## 📞 Suporte

Se o problema persistir:

1. Exporte logs do navegador (DevTools > Console)
2. Verifique logs do servidor Next.js
3. Execute `debugCookies()` e envie o output
4. Verifique headers com: `curl -I http://localhost:3001/pt-br`

## 🏆 Resultado Esperado

Após implementação completa:

✅ **Sem erro 431** em nenhuma rota  
✅ **Login funcional** sem redirecionamentos  
✅ **Cookies otimizados** (< 2KB total)  
✅ **Auto-recuperação** em caso de problema  
✅ **Performance estável** sem acúmulo de dados  

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0  
**Autor**: Claude AI Assistant
