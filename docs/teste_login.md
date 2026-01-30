# 🧪 Teste de Login - Instruções Detalhadas

## Objetivo
Verificar se o login com credenciais de admin está funcionando corretamente após as correções implementadas.

## Credenciais de Teste
- **Email**: `empresaalob@gmail.com`
- **Senha**: `n2qyvsj7sw47zbqy`

## Passos para Teste

### 1. Limpar Estado do Navegador
Antes de testar, limpe completamente o estado:
1. Abra o DevTools (F12)
2. Vá para Application > Storage
3. Clique em "Clear site data"
4. Feche e reabra a aba

### 2. Acessar Página de Login
1. Navegue para: `http://localhost:3000/pt-br/sign-in`
2. Aguarde a página carregar completamente

### 3. Monitorar Console
Abra o Console do DevTools e observe os logs. Você deve ver:
```
Clearing all cookies to prevent 431 error...
Cookies cleared. Remaining: [vazio ou quase vazio]
Bootstrap result: { ok: true, created: false }
```

### 4. Preencher Formulário
1. **Campo Email**: Digite `empresaalob@gmail.com`
2. **Campo Senha**: Digite `n2qyvsj7sw47zbqy`
3. Clique no botão "Entrar"

### 5. Logs Esperados (Sucesso)
Após clicar em "Entrar", você deve ver no console:
```javascript
Login successful, user: 70be52a6-06c0-4987-99d9-09708cba4163
Post-login bootstrap: { ok: true, created: false }
Waiting for session to propagate to RLS...
Checking admin status for user: 70be52a6-06c0-4987-99d9-09708cba4163
Admin check result: { 
  adminRow: { user_id: "70be52a6-06c0-4987-99d9-09708cba4163" }, 
  adminError: null, 
  userId: "70be52a6-06c0-4987-99d9-09708cba4163" 
}
Is admin: true
Login efetuado com sucesso.
```

### 6. Resultado Esperado
✅ **Sucesso**: Você deve ser redirecionado para a página inicial/dashboard
❌ **Falha**: Permanece na página de login com mensagem de erro

## Mudanças Implementadas

1. ✅ Removida chamada `setSession` que estava falhando
2. ✅ Usa diretamente a sessão configurada por `signInWithPassword`
3. ✅ Delay de 300ms para propagação de sessão
4. ✅ Retry automático com 500ms de delay
5. ✅ Logs detalhados para debug
