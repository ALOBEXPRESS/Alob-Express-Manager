# 🔧 Solução para Erro 431 - Guia Rápido

## ⚡ Instalação Automática

### Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

### Windows (PowerShell como Administrador)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

## 📦 Instalação Manual

Se preferir instalar manualmente:

### 1. Copie os arquivos

```bash
# Middleware
cp middleware.ts src/middleware.ts

# Utilitário de cookies
cp supabase-cookie-manager.ts src/lib/

# Componente de proteção
cp SupabaseCookieGuard.tsx src/components/

# Página de reset
cp reset-auth.html public/
cp reset-auth-page.tsx src/app/reset-auth/page.tsx

# Configurações
cp next.config.js ./
```

### 2. Atualize package.json

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-http-header-size=240000' next dev -p 3001",
    "start": "NODE_OPTIONS='--max-http-header-size=240000' next start -p 3001"
  }
}
```

**Windows**: Use `cross-env`
```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--max-http-header-size=240000 next dev -p 3001"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

### 3. Integre o componente de proteção

Em `src/app/layout.tsx`:

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

### 4. Limpe e reinicie

```bash
rm -rf .next
npm run dev
```

## 🧪 Teste a Solução

1. **Teste a página de reset**:
   ```
   http://localhost:3001/reset-auth.html
   ```

2. **Debug de cookies** (Console do navegador):
   ```javascript
   import { debugCookies } from '@/lib/supabase-cookie-manager'
   debugCookies()
   ```

3. **Force limpeza**:
   ```javascript
   import { cleanupSupabaseCookies } from '@/lib/supabase-cookie-manager'
   cleanupSupabaseCookies()
   ```

## 🎯 Como Funciona

A solução implementa **5 camadas de proteção**:

1. **Detecção**: Monitora tamanho dos headers
2. **Limpeza Preventiva**: Remove cookies duplicados antes do limite
3. **Gestão SSR**: Otimiza cookies do Supabase no servidor
4. **Limpeza Client-Side**: Auto-limpeza a cada 30 segundos
5. **Recuperação**: Página estática para casos extremos

## 🐛 Resolução de Problemas

### Ainda recebo erro 431

**Windows**:
```bash
npm install --save-dev cross-env
```

**Limpe completamente**:
```bash
# Navegador
Ctrl+Shift+Delete > Limpar cookies

# Projeto
rm -rf .next node_modules
npm install
npm run dev
```

### Redirecionamento infinito

Verifique o matcher no `middleware.ts`:
```typescript
matcher: [
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|reset-auth\\.html).*)',
]
```

### Cookies não são removidos

No DevTools do navegador:
1. Application > Storage > Clear site data
2. Recarregue a página

## 📚 Documentação Completa

Leia `SOLUCAO_ERRO_431.md` para:
- Explicação detalhada da arquitetura
- Troubleshooting avançado
- Monitoramento e logs
- Otimizações de segurança

## ✅ Checklist

- [ ] Scripts do package.json atualizados
- [ ] Middleware copiado e configurado
- [ ] Componente integrado no layout
- [ ] Página de reset funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Cache limpo
- [ ] Teste realizado com sucesso

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Execute `debugCookies()` no console
3. Teste acesso direto a `/reset-auth.html`
4. Verifique que NODE_OPTIONS está sendo aplicado:
   ```bash
   # No terminal, deve aparecer:
   # --max-http-header-size=240000
   ```

---

**Versão**: 1.0.0  
**Data**: Janeiro 2026
