# Solução para Erro HTTP 431 (Request Header Fields Too Large)

Este documento descreve as causas e soluções definitivas para o erro 431 que ocorre frequentemente no ambiente de desenvolvimento local com múltiplas aplicações rodando no `localhost`.

## 1. Por que o problema ocorre?

O erro **HTTP 431** acontece quando o cabeçalho da requisição (geralmente os Cookies) é maior do que o limite permitido pelo servidor (Node.js/Next.js).

No desenvolvimento local, todas as aplicações rodando em portas diferentes (ex: `localhost:3001` e `localhost:5174`) **compartilham o mesmo domínio `localhost`**. Isso significa que:
- Cookies definidos pela calculadora (Vite) são enviados para o Dashboard (Next.js).
- Cookies do Supabase de diferentes projetos se acumulam.
- O navegador envia TODOS esses cookies em cada requisição, excedendo rapidamente o limite padrão de 16KB.

## 2. Soluções Implementadas

### A. Aumento do Limite no Servidor
Atualizamos o `package.json` para iniciar o Node com o parâmetro `--max-http-header-size=1000000` (1MB).
```json
"dev": "node --max-http-header-size=1000000 node_modules/next/dist/bin/next dev"
```

### B. Uso de SessionStorage para Supabase
O Supabase foi configurado em `src/lib/supabase/client.js` para usar `sessionStorage` em vez de cookies. Isso evita que o token de autenticação seja enviado no cabeçalho de todas as requisições HTTP, reduzindo drasticamente o tamanho do header.

### C. Limpeza Seletiva de Cookies
Implementamos o `CookieCleaner` e `CookieMonitor` que monitoram o tamanho total dos cookies. Se excederem 4000 bytes, eles limpam automaticamente cookies não essenciais, preservando a sessão quando possível.

### D. Correção no Fluxo de Login
O componente `SignInLayer.jsx` agora limpa cookies de forma exaustiva antes do redirecionamento, mas preserva o `sessionStorage`, garantindo que você não seja deslogado imediatamente após entrar.

## 3. Soluções Complementares (Recomendado)

Se o erro persistir mesmo após as correções, siga estas recomendações:

### Use 127.0.0.1 em vez de localhost
Em vez de acessar `http://localhost:3001`, use **`http://127.0.0.1:3001`**.
Para o navegador, `localhost` e `127.0.0.1` são domínios diferentes. Isso isolará os cookies de cada aplicação.

### Configure Hostnames Customizados
Você pode editar seu arquivo `hosts` para criar domínios locais:
1. No Windows (`C:\Windows\System32\drivers\etc\hosts`) ou Linux/Mac (`/etc/hosts`), adicione:
   ```
   127.0.0.1 manager.local
   127.0.0.1 calculator.local
   ```
2. Acesse suas aplicações via `http://manager.local:3001` e `http://calculator.local:5174`.
3. Isso garante isolamento total de cookies.

### Limpeza Manual de Emergência
Se ficar preso em um erro 431 e a página não carregar:
1. Abra o Console do Desenvolvedor (F12).
2. Vá em **Application** -> **Storage** -> **Clear site data**.
3. Ou execute no console:
   ```javascript
   document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
   ```
