# Documentação do Projeto Wowdash (Versão Next.js)

Esta é a documentação para rodar e utilizar o template administrativo **Wowdash** configurado com **Next.js**.
Esta versão é ideal para sua integração com **WooCommerce** e **Bling**, pois permite criar rotas de API seguras e oferece melhor performance.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter o **Node.js** instalado em sua máquina.
Você pode verificar se ele está instalado abrindo seu terminal e digitando:

```bash
node -v
npm -v
```

Se não estiver instalado, baixe-o em [nodejs.org](https://nodejs.org/).

## 🚀 Como Instalar

1. Abra o terminal na pasta raiz do projeto.
2. Execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

## ▶️ Como Rodar a Aplicação

Para iniciar o servidor de desenvolvimento local:

```bash
npm run dev
```

Este comando irá:
1. Iniciar o servidor Next.js.
2. Disponibilizar a aplicação em `http://localhost:3000`.
3. Habilitar o "Fast Refresh" (atualização instantânea ao editar arquivos).

## 📂 Estrutura do Projeto (App Router)

Esta versão utiliza o **App Router** do Next.js, que é a estrutura mais moderna.

*   **`src/app/`**: Aqui ficam as **páginas** e **rotas** da sua aplicação.
    *   `page.jsx`: É a página inicial (`/`).
    *   Pastas como `dashboard/page.jsx` criam rotas automáticas (ex: `/dashboard`).
    *   `layout.jsx`: Define o layout principal (cabeçalho, menu lateral) que envolve todas as páginas.
*   **`src/components/`**: Contém os componentes reutilizáveis (botões, tabelas, gráficos, etc.).
*   **`public/`**: Arquivos estáticos como imagens, fontes e ícones.
*   **`next.config.js`**: Arquivo de configuração do Next.js.

## 💡 Dicas de Desenvolvimento

*   **Imagens e Assets**: Ao usar imagens na pasta `public`, sempre use caminhos absolutos começando com `/`.
    *   ❌ Errado: `src="assets/images/logo.png"`
    *   ✅ Certo: `src="/assets/images/logo.png"`
*   **Bibliotecas de Terceiros**: Se alguma biblioteca (como mapas ou gráficos) der erro de `window is not defined`, use `useEffect` ou `dynamic import` para garantir que ela só carregue no navegador (cliente).

## 🔗 Integrações (WooCommerce & Bling)

Como você escolheu Next.js, você tem uma grande vantagem: **API Routes**.

Para conectar com o Bling ou WooCommerce sem expor suas senhas:
1. Crie arquivos dentro de `src/app/api/`.
2. Exemplo: `src/app/api/bling/route.js`.
3. Dentro desse arquivo, você fará as chamadas para o Bling usando suas chaves secretas.
4. O seu front-end chamará essa sua API interna (`/api/bling`) em vez de chamar o Bling diretamente.

## ☁️ Como Publicar (Deploy)

A forma mais fácil e recomendada é usar a **Vercel** (criadora do Next.js).

1. Crie uma conta na [Vercel](https://vercel.com/).
2. Instale a Vercel CLI: `npm i -g vercel`
3. Rode o comando `vercel` no terminal e siga os passos.

Ou conecte seu repositório GitHub à Vercel para deploys automáticos a cada alteração.

## 📊 Modelagem de Dados (Proposta - CRM & E-commerce)

## 💡 Estratégia de Dados Reais (Checklist)

Para garantir que a modelagem de dados reflita as necessidades reais do projeto, siga este checklist:

- [x] Analisar UI da página "Criptomoeda" para novas tabelas ✅
- [x] Analisar UI da página "NFT e Jogos" para novas tabelas ✅
- [x] Analisar UI da página "Médico" para novas tabelas ✅
- [x] Analisar UI da página "Analytics" para novas tabelas ✅
- [x] Analisar UI da página "PDV e Estoque" para novas tabelas ✅
- [x] Analisar UI da página "Finanças e Bancário" para novas tabelas ✅
- [x] Atualizar ERD com TODAS as entidades (Financeiro, PDV, Médico, etc) ✅
- [x] Documentar integração de Email (Gmail/Titan), WhatsApp e Google Calendar ✅

Abaixo está o diagrama de entidade-relacionamento (ERD) proposto, baseado na análise dos componentes de interface das páginas de CRM e E-commerce.

```mermaid
erDiagram
    %% Entidades Principais
    Users ||--o{ Orders : "realiza"
    Users ||--o{ Transactions : "gera"
    Users ||--o{ Tasks : "atribuido_a"
    Users ||--o{ UserAssets : "possui_portfolio"
    Users ||--o{ InvestmentTransactions : "executa_investimento"
    Users {
        uuid id PK
        string name "Nome completo"
        string email
        string phone
        string image_url
        string status "active, inactive"
        uuid role_id FK "Ligacao com Tabela Roles"
        string department "HR, Design, Development"
        string designation "Manager, Developer"
        string description "Bio ou notas"
        string country "Para mapa e stats"
        string gender "male, female"
        string agent_id "ID legivel se for agente"
        timestamp created_at "Join Date"
        timestamp last_active_at
    }

    Roles {
        uuid id PK
        string name "Admin, Manager, Waiter"
        string description
        string status "active, inactive"
        timestamp created_at
    }
    Users }o--|| Roles : "possui_permissao"

    Products ||--o{ OrderItems : "contem"
    Products {
        uuid id PK
        string name
        decimal price
        string category "fashion, electronics, etc"
        int stock_quantity
        string stock_status "in_stock, low_stock, out_of_stock"
        string image_url
        string discount_percentage
        int sold_count "Total vendido"
    }

    Orders ||--o{ OrderItems : "possui"
    Orders ||--o{ Transactions : "paga_por"
    Orders {
        uuid id PK
        string invoice_number
        uuid user_id FK
        timestamp date "Suporta filtro: Pedidos (Hoje/Semana/Mes/Ano)"
        string status "pending, paid, shipped, canceled"
        decimal total_amount
    }

    OrderItems {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
        decimal total_price
    }

    Transactions {
        uuid id PK
        uuid order_id FK
        uuid user_id FK
        decimal amount
        string status "pending, completed, rejected"
        timestamp date "Suporta filtro: Receita/Transacoes (Hoje/Semana/Mes/Ano)"
        string payment_method "stripe, paypal, razorpay"
    }

    %% Dados CRM Especificos
    Tasks {
        uuid id PK
        string title
        uuid assigned_to_user_id FK
        date due_date
        string status "active, completed, pending"
        string priority
    }

    %% Dados Financeiros / Analíticos
    Expenses {
        uuid id PK
        string title
        decimal amount
        string category
        timestamp date "Suporta filtro: Despesas (Hoje/Semana/Mes/Ano)"
    }

    Campaigns ||--o{ CampaignAnalytics : "possui_metricas"
    Campaigns {
        uuid id PK
        string name
        string channel "email, website, facebook"
        timestamp start_date
        timestamp end_date
    }

    CampaignAnalytics {
        %% Tabela para suportar graficos de campanha com filtro de tempo
        uuid id PK
        uuid campaign_id FK
        date date "Data da metrica"
        int reach_count
        int conversion_count
        int clicks_count
        decimal cost_spent
    }

    %% Dados de Investimentos (NOVO)
    Assets {
        uuid id PK
        string name "Gold, Dollars, Bitcoin"
        string symbol "XAU, USD, BTC"
        string category "commodity, currency, stock"
        decimal current_price
        string image_url
    }

    UserAssets {
        uuid id PK
        uuid user_id FK
        uuid asset_id FK
        decimal quantity_owned
        decimal average_buy_price
        decimal total_value_current
    }
    UserAssets }o--|| Assets : "referencia"

    InvestmentTransactions {
        uuid id PK
        uuid user_id FK
        uuid asset_id FK
        string type "buy, sell"
        decimal quantity
        decimal price_at_transaction
        decimal total_amount
        string status "completed, in_progress"
        timestamp date "Suporta filtro: Investimentos (Hoje/Semana/Mes/Ano)"
    }
    InvestmentTransactions }o--|| Assets : "envolve"

    Notices {
        uuid id PK
        string title
        string content
        string author_name "Pode ser FK para Users tb"
        string author_image_url
        timestamp date
    }

    InvestmentProjects {
        uuid id PK
        uuid asset_id FK
        string name "Nome do projeto ou ativo"
        int duration_months
        decimal stock_level_percentage "Para progress bar"
        string status
    }
    InvestmentProjects }o--|| Assets : "baseado_em"

    ClientPaymentStatus {
        %% Tabela agregadora para relatorios (pode ser view)
        uuid id PK
        uuid user_id FK
        int paid_count
        int pending_count
        int overdue_count
        date report_week
    }

    %% Dados Criptomoedas (NOVO)
    CryptoWallets {
        uuid id PK
        uuid user_id FK
        string currency "BTC, ETH, etc"
        string address "Endereco publico da carteira"
        decimal balance
        string status "active, inactive"
    }

    CryptoTransactions {
        uuid id PK
        uuid wallet_id FK
        string type "send, receive, swap_buy, swap_sell"
        decimal amount_crypto
        decimal amount_fiat
        string transaction_hash
        string counterparty_address
        string status "completed, pending, terminated"
        timestamp date "Suporta filtro: Transacoes Cripto (Hoje/Semana/Mes/Ano)"
    }
    CryptoTransactions }o--|| CryptoWallets : "afeta_saldo"

    CreditCards {
        uuid id PK
        uuid user_id FK
        string card_alias "Master Card"
        string last_four "Digitos finais"
        string holder_name
        date expiry_date
        string card_bg_style "Para UI (gradiente/imagem)"
    }
    Users ||--o{ CreditCards : "possui"
    Users ||--o{ CryptoWallets : "possui_carteira"

    %% Dados NFT (NOVO)
    NFTCollections {
        uuid id PK
        string name "Nome da colecao (ex: Bored Ape)"
        string creator_name "Proprietario ou Artista"
        string cover_image_url
        int items_count
    }

    NFTItems {
        uuid id PK
        uuid collection_id FK
        uuid owner_id FK
        string name "Nome do item (ex: Fantastic Alien)"
        string image_url "URL IPFS ou HTTP"
        decimal price_eth
        decimal price_usd
        string category "art, music, utility, fashion"
        int likes_count
        timestamp created_at
    }
    NFTCollections ||--o{ NFTItems : "contem"

    NFTBids {
        uuid id PK
        uuid nft_item_id FK
        uuid bidder_user_id FK
        decimal bid_amount_eth
        timestamp bid_time
        timestamp expires_at
        string status "active, accepted, rejected"
    }
    NFTItems ||--o{ NFTBids : "recebe_lances"

    NFTCreators {
        uuid id PK
        uuid user_id FK
        string bio
        decimal total_sales_value
        int followers_count
        string cover_image_url
    }
    Users ||--o{ NFTCreators : "pode_ser"

    %% Dados Médicos (NOVO)
    MedicalDepartments {
        uuid id PK
        string name "Cardiologia, Psiquiatria, Pediatria"
        int head_doctor_id FK
    }

    Doctors {
        uuid id PK
        uuid user_id FK
        uuid department_id FK
        string specialization
        timestamp joined_at
        string status "active, on_vacation"
    }
    MedicalDepartments ||--o{ Doctors : "tem_equipe"

    Patients {
        uuid id PK
        string name
        date date_of_birth
        string gender "Masculino, Feminino"
        string phone
        string address
        timestamp admitted_at
        uuid last_visited_dept_id FK
    }

    MedicalAppointments {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        uuid department_id FK
        timestamp appointment_date
        decimal fee
        string status "completed, canceled, pending"
        string type "General Checkup, Vaccination"
    }
    Patients ||--o{ MedicalAppointments : "agendas"
    Doctors ||--o{ MedicalAppointments : "atende"

    Medicines {
        uuid id PK
        string name
        int stock_quantity
        decimal price
        date expiry_date
    }

    %% Analytics & Support (NOVO)
    AnalyticsDailyMetrics {
        uuid id PK
        date date
        decimal total_revenue
        decimal total_sales
        decimal profit
        decimal loss
        int total_visitors
        int refunded_count
    }

    TrafficSources {
        uuid id PK
        string source_name "tiktok, instagram, facebook, site"
        int visitor_count
        timestamp date "Para filtro: Mes Passado, Ano Passado"
    }

    SupportTickets {
        uuid id PK
        uuid user_id FK
        string subject
        string status "new, open, resolved, closed"
        timestamp created_at
        timestamp resolved_at
        int response_time_minutes
    }

    PaymentTransactions {
        uuid id PK
        uuid user_id FK
        string provider "wallet, paypal, credit_card, bank"
        string type "payment, bill_payment"
        decimal amount
        string direction "credit, debit"
        timestamp date
    }
    Users ||--o{ SupportTickets : "abre"
    Users ||--o{ PaymentTransactions : "realiza"

    %% PDV & Estoque (NOVO)
    Suppliers {
        uuid id PK
        string name
        string contact_info
        decimal total_supplied_value
    }

    PurchaseOrders {
        uuid id PK
        uuid supplier_id FK
        timestamp date
        decimal total_amount
        string status "pending, completed, canceled"
    }
    Suppliers ||--o{ PurchaseOrders : "fornece"

    InventoryTransactions {
        uuid id PK
        uuid product_id FK
        uuid order_id FK "Se venda"
        uuid purchase_order_id FK "Se compra"
        string type "in, out"
        int quantity
        timestamp date
    }

    POSSales {
        uuid id PK
        uuid user_id FK "Vendedor"
        uuid customer_id FK "Cliente (opcional)"
        decimal total_amount
        decimal discount
        timestamp date
        string payment_method "cash, card, split"
    }

    DebtRecords {
        uuid id PK
        uuid user_id FK "Devedor (Cliente)"
        uuid purchase_order_id FK "Se divida com fornecedor"
        decimal total_amount
        decimal paid_amount
        decimal due_amount
        date due_date
        string status "paid, partial, overdue"
    }

    %% Finanças e Bancário (NOVO)
    FinancialBeneficiaries {
        uuid id PK
        uuid user_id FK "Quem cadastrou"
        string name "Mr. Bin"
        string role "Insurance Officer"
        string image_url
        string account_details
    }

    RecurringBills {
        uuid id PK
        uuid user_id FK
        string name "Electricity, Internet"
        decimal amount
        date due_date
        string frequency "monthly, yearly"
        string status "active, inactive"
    }

    SavingGoals {
        uuid id PK
        uuid user_id FK
        string name "Digital Assets, Side Project"
        decimal target_amount
        decimal current_amount
        string icon_url
        string bg_color
    }

    ExpenseCategories {
        uuid id PK
        string name "Health, Education, Food"
        string color_code
    }
    
    Expenses {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        string title
        decimal amount
        timestamp date
    }
    ExpenseCategories ||--o{ Expenses : "classifica"

    %% Relacionamento Cruzado
    Users ||--o{ FinancialBeneficiaries : "tem_contatos"
    Users ||--o{ RecurringBills : "paga"

    %% Faturas & Invoices (NOVO - Detalhado)
    Invoices {
        uuid id PK
        string invoice_number "#526534"
        uuid user_id FK "Cliente (opcional)"
        string client_name "Se nao tiver user_id"
        string client_address
        string client_phone
        timestamp issued_date
        timestamp due_date
        decimal subtotal
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
        string status "paid, pending, draft"
        uuid sales_agent_id FK "Vendedor responsavel"
    }

    InvoiceItems {
        uuid id PK
        uuid invoice_id FK
        string item_name
        string unit "PC, KG"
        int quantity
        decimal unit_price
        decimal total_price
    }
    Invoices ||--o{ InvoiceItems : "contem"
    Users ||--o{ Invoices : "emite_como_agente"


## 🔌 Guia de Integrações Externas

### 1. Email (Gmail ou Titan) 📧
Para carregar emails na página `Email`, você **não pode** conectar diretamente via POP/IMAP pelo navegador (frontend) por limitações de segurança.
*   **Arquitetura**:
    *   **Backend (API Route)**: Crie uma rota `/api/email/sync`.
    *   **Protocolo**: Use **IMAP** para ler e **SMTP** para enviar.
*   **Bibliotecas Node.js Recomendadas**:
    *   Leitura: `imap-simple` ou `node-imap`.
    *   Envio: `nodemailer`.
*   **Segurança**:
    *   **Gmail**: É obrigatório gerar uma "Senha de App" (App Password) no painel do Google. Não use sua senha pessoal.
    *   **Titan**: Use as credenciais SMTP/IMAP padrão fornecidas no painel Titan.
*   **Exemplo de Fluxo**:
    1.  Frontend chama `GET /api/email/inbox`.
    2.  Next.js conecta no IMAP do Gmail.
    3.  Baixa os headers dos últimos 50 emails.
    4.  Retorna JSON para o frontend renderizar a lista.

### 2. WhatsApp (Chat Message) 💬
Para carregar mensagens do WhatsApp, você precisa de uma API Intermediária (Gateway), pois o WhatsApp não tem protocolo público aberto como email.
*   **Opções de API**:
    *   **Oficial (Meta)**: WhatsApp Cloud API (Gratuito até certo limite, requer verificação de negócio).
    *   **Não-Oficial (Z-API, WPPConnect)**: Mais fácil de implementar, scaneia QR Code.
*   **Fluxo de Dados (Webhook)**:
    1.  O cliente envia mensagem no WhatsApp.
    2.  A API (Meta/Z-API) envia um POST para seu Webhook (`/api/webhooks/whatsapp`).
    3.  Seu backend salva a mensagem na tabela `ChatMessages` do Supabase.
    4.  O Frontend usa **Supabase Realtime** para receber a mensagem instantaneamente na tela, sem recarregar.

### 3. Google Calendar (Calendário) 📅
Para sincronizar eventos na página `Calendar`.
*   **API**: [Google Calendar API v3](https://developers.google.com/calendar/api/v3/reference).
*   **Autenticação (OAuth2)**:
    *   Crie um projeto no Google Cloud Console.
    *   Habilite a API Calendar.
    *   Baixe o arquivo de credenciais (Service Account ou OAuth Client).
*   **Biblioteca**: `googleapis` (oficial do Google para Node.js).
*   **Integração**:
    *   Use `google.calendar('v3').events.list` para puxar eventos.
    *   Mapeie os campos do Google (`summary`, `start.dateTime`, `end.dateTime`) para o formato esperado pelo componente de calendário do seu template (geralmente FullCalendar).



```

## 🌐 Estratégia para Dados Reais (Cripto & NFT)

Para tornar o sistema funcional com dados reais de mercado sem comprometer a performance, recomenda-se a seguinte arquitetura:

### 1. Backend como Proxy (Middleman)
Não consulte APIs externas diretamente do navegador (frontend). Isso expõe chaves de API e causa erros de CORS.
*   **Fluxo**: Frontend -> Seu Backend (Next.js API Route) -> API Externa (CoinGecko/OpenSea).

### 2. Caching (Essencial)
APIs gratuitas têm limites restritos (Rate Limits). Salve as respostas no seu banco ou memória por um tempo determinado.
*   **Exemplo**: Se o usuário A acessa o dashboard, busque o preço do BTC na API externa e salve com timestamp. Se o usuário B acessar 10 segundos depois, entregue o dado salvo. Atualize apenas após 2-5 minutos.

### 3. APIs Recomendadas
*   **Preços de Cripto**: [CoinGecko API](https://www.coingecko.com/en/api) (Gratuita / Pro) ou [Binance API](https://binance-docs.github.io/apidocs/).
*   **NFTs**: [OpenSea API](https://docs.opensea.io/reference/api-overview) ou [Alchemy NFT API](https://www.alchemy.com/nft-api).
*   **Imagens**: Para NFTs, as imagens geralmente estão no IPFS. Use gateways públicos (ex: `https://ipfs.io/ipfs/HASH`) ou dedicados para carregar rapidamente.

## 📊 Estratégia para Analytics e Transações

### 1. Origem dos Visitantes (TikTok, Instagram, Facebook)
Para popular a tabela `TrafficSources`, você não deve depender de APIs dessas redes (que são limitadas para dados públicos).
*   **Aferição no Frontend**: Use parâmetros UTM na URL (`?utm_source=tiktok`) ou `document.referrer` no JavaScript do cliente.
*   **Armazenamento**: Quando o usuário acessa o site, o backend registra o acesso na tabela `TrafficSources` incrementando o contador do dia/mês.

### 2. Captura de Transações (PayPal, Stripe, Banco)
Para ter o status em tempo real mostrado na imagem "Transações":
*   **Webhooks**: Configure Webhooks no painel do PayPal/Stripe apontando para sua API (`/api/webhooks/payment`).
*   **Fluxo**:
    1.  Cliente paga no PayPal.
    2.  PayPal avisa seu servidor (Webhook).
    3.  Seu servidor insere na tabela `PaymentTransactions` e atualiza o saldo da carteira (`CryptoWallets` ou `UserAssets`).

