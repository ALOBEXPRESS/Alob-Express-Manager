# 🧮 Documentação de Integração: Dropshipping Calculator

Este documento detalha a integração da **Dropshipping Calculator** (React 19 + Vite) ao **Alob Express Manager** (Next.js + React 18).

---

## 1. Visão Geral da Solução

Para integrar a aplicação de calculadora (que utiliza React 19) ao dashboard principal (que utiliza React 18), optou-se por uma estratégia de **Micro-Frontends via Iframe**.

### 🧩 Diagrama de Arquitetura

```mermaid
graph TD
    User[Usuário] --> NextApp[Alob Express Manager (Next.js)]
    
    subgraph "Next.js App (Porta 3000)"
        MasterLayout[MasterLayout.jsx]
        Menu[Menu Lateral]
        CalcPage[Page.jsx (/calculadora)]
    end
    
    subgraph "Vite App (Porta 5173)"
        CalcApp[Dropshipping Calculator]
    end
    
    NextApp --> Menu
    Menu -->|Link /calculadora| CalcPage
    CalcPage -->|Iframe src=NEXT_PUBLIC_CALCULATOR_URL| CalcApp
```

### 🚀 Benefícios da Abordagem
1.  **Isolamento de Versões**: Permite que o Dashboard continue em React 18 enquanto a Calculadora usa React 19, evitando conflitos de dependências.
2.  **Estilo Independente**: O CSS do Tailwind da calculadora não interfere nos estilos globais do Dashboard.
3.  **Deploy Flexível**: A calculadora pode ser hospedada independentemente (ex: Vercel, Netlify, S3) e apenas referenciada via URL.

---

## 2. Alterações Implementadas

### 📂 Nova Rota e Página
Foi criado o arquivo `src/app/[locale]/calculadora/page.jsx` que renderiza o iframe.

```jsx
// src/app/[locale]/calculadora/page.jsx
const calculatorUrl = process.env.NEXT_PUBLIC_CALCULATOR_URL || "http://localhost:5173";

<iframe
  src={calculatorUrl}
  title={t("calculator")}
  className="w-100 h-100 border-0 radius-8"
/>
```

### 🧭 Menu Lateral
O arquivo `src/masterLayout/MasterLayout.jsx` foi atualizado para incluir o link **Calculadora** logo acima da opção **IA**.

```jsx
// src/masterLayout/MasterLayout.jsx
<li>
  <Link href='/calculadora' ...>
    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
    {t('calculator')}
  </Link>
</li>
```

### 🌍 Internacionalização
As chaves de tradução foram adicionadas aos arquivos de mensagens:
-   `src/messages/pt-BR.json`: `"calculator": "Calculadora"`
-   `src/messages/en.json`: `"calculator": "Calculator"`

---

## 3. Guia de Execução

Para que a integração funcione localmente, ambas as aplicações devem estar rodando.

### Passo 1: Iniciar a Calculadora
```bash
cd dropshipping-calculator-app
pnpm install
pnpm dev
# Deve rodar em http://localhost:5173
```

### Passo 2: Iniciar o Dashboard
```bash
# Na raiz do projeto
pnpm install
pnpm dev
# Deve rodar em http://localhost:3000
```

### Passo 3: Acessar
Navegue para `http://localhost:3000/pt-br/calculadora`.

---

## 4. Configuração de Produção

Em produção, defina a variável de ambiente `NEXT_PUBLIC_CALCULATOR_URL` com a URL onde a calculadora está hospedada.

---

## 5. Novas Funcionalidades e Regras de Negócio

### ✅ Validação de Dados
Para garantir a integridade dos dados, a ação de "Adicionar" produto agora exige o preenchimento obrigatório de:
- Nome do Produto
- Imagem do Produto (URL)
- Preço de Custo
- Preço de Venda
- Fornecedor

### 🚚 Gestão de Fornecedores
Foi implementado um seletor de fornecedores com regras de taxas pré-definidas:

| Fornecedor | Taxa (%) | Taxa Fixa (R$) |
|------------|----------|----------------|
| **Dogama** | 6%       | R$ 1,00        |
| **Yeizidrop (TYR)** | 0% | R$ 0,00 |
| **Dsers** | 0% | R$ 0,00 |

A seleção ajusta automaticamente os cálculos de margem e lucro.
