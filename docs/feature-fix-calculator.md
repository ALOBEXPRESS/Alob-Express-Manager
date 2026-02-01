# Diagnóstico de Falhas: Calculadora e Conexão
## 🔍 Análise por Camada
### Layer 1: Servidor Next.js (Erro 500)
Problema: Mismatch de Roteamento (URL Incorreta). Evidências:

- Configuração: O next.config.js define um rewrite apenas para /__calc (um underscore).
- Requisição: O erro relatado ocorre em /__calc__ (dois underscores).
- Comportamento: Ao acessar /__calc__ , o Next.js não encontra regra de rewrite correspondente e tenta tratar como uma rota de página ( src/app/__calc__/page.jsx ). Como ela não existe, ele aciona o tratamento de 404 Not Found .
- O Erro 500: A renderização da página de erro ( not-found.jsx ) provavelmente está falhando no servidor devido ao contexto de autenticação ( MasterLayout + AuthProvider ) tentar inicializar com cookies corrompidos ou excessivos, gerando um estouro de pilha ou erro de renderização que se manifesta como 500.
Impacto: O endpoint retorna erro fatal, impedindo o carregamento inicial do iframe.

### Layer 2: Headers HTTP (Erro 431)
Problema: Cookies de Sessão Supabase Excedendo Limites. Evidências:

- Tamanho: Sessões do Supabase (JWT + Refresh + Metadata) frequentemente excedem 4KB, podendo chegar a 8KB+.
- Falha no Middleware: Embora src/middleware.ts tenha lógica para limpar cookies ( requestHeaders.delete('cookie') ), ele depende da correspondência do pathname . Se a rota for /__calc__ e cair no limbo do roteamento (ou se o servidor rejeitar antes do middleware executar), os cookies chegam ao Node.js.
- Node.js Limit: O servidor Node.js padrão tem limite de headers de 8KB ou 16KB. Mesmo com a flag --max-http-header-size=1000000 no script dev , se o usuário estiver rodando o Next.js diretamente ou se o proxy não estiver sanitizando corretamente, o limite é atingido.
Impacto: O servidor rejeita a requisição com 431 Request Header Fields Too Large ou fecha a conexão abruptamente.

### Layer 3: Conexão de Rede (CONNECTION_RESET)
Problema: Rejeição Abrupta de Socket pelo Servidor. Evidências:

- Padrão: Ocorre em POST /api/calculator .
- Causa: É o sintoma de rede do erro 431. Quando o Node.js recebe headers maiores que seu buffer de entrada permitido, ele destrói o socket TCP sem enviar uma resposta HTTP graciosa, resultando em net::ERR_CONNECTION_RESET no navegador.
Impacto: Falhas intermitentes na API, confundindo a lógica de retry do frontend.

### Layer 4: Iframe e Client-Side
Problema: Loop de Retry e Configuração de URL. Evidências:

- Código: src/components/CalculatorEmbed.jsx define a URL via process.env.NEXT_PUBLIC_CALCULATOR_URL (default /__calc ). Se o ambiente estiver configurado com /__calc__ , o iframe aponta para o lugar errado.
- Retry: A função startSyncLoop (linhas 185-224) implementa backoff exponencial. Como a API retorna 431/Reset, o cliente entra em loop de tentativas, gerando ruído no console.
Impacto: UX degradada (tela branca ou loader infinito) e sobrecarga de requisições falhas.

### Layer 5: Integração Supabase
Problema: Cancelamento de Requisições (Client-Side). Evidências:

- Erro: net::ERR_CONNECTION_RESET ou ERR_ABORTED em supabase.co .
- Causa: Provavelmente um efeito colateral da instabilidade da página principal. Se o Next.js ou o Iframe forçarem um reload ou se o navegador detectar consumo excessivo de recursos (devido aos loops de erro), ele cancela requisições pendentes. Não há evidência de falha no serviço Supabase em si.
Impacto: Falha no carregamento de preferências do usuário ( theme_color ).

## 🎯 Root Cause Analysis
### Causa Primária
Erro de Configuração de URL ( /__calc__ vs /__calc ) .
A aplicação está tentando acessar /__calc__ (duplo underscore), mas a infraestrutura (Next.js rewrites e Proxy) está configurada para /__calc (simples underscore). Isso faz com que a requisição caia no tratamento de rota padrão do Next.js em vez de ser proxyada para a calculadora (Vite), desencadeando erros 404/500 e expondo o servidor aos cookies grandes que deveriam ter sido filtrados pelo proxy.

### Causas Secundárias
1. Cookies Supabase Não Filtrados: A ausência de limpeza efetiva dos cookies (devido à falha de roteamento ou bypass do proxy) causa os erros 431 e Connection Reset.
2. Middleware Permissivo: O middleware atual tenta limpar cookies, mas pode não estar cobrindo a variante da URL incorreta ou falhando silenciosamente.
## 🏗️ Proposta de Arquitetura de Solução
1. Padronização de Rota: Corrigir a variável de ambiente NEXT_PUBLIC_CALCULATOR_URL para /__calc e garantir que o next.config.js mantenha o rewrite correto.
2. Blindagem do Middleware: Ajustar o src/middleware.ts para capturar padrões abrangentes (ex: /__calc* ) e forçar a remoção do header Cookie antes de qualquer processamento de rota.
3. Reforço no Proxy: Garantir que o proxy-server.js (se utilizado) normalize a URL (removendo underscores extras se necessário) e aplique a sanitização de headers para todas as rotas que não sejam da aplicação principal.
4. Resiliência no Client: Adicionar tratamento de erro no CalculatorEmbed.jsx para parar o loop de retry imediatamente ao detectar erros 431 ou 500, evitando spam de rede.