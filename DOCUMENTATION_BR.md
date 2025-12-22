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
