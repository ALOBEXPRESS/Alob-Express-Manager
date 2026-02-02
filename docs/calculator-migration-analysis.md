# Análise de Migração da Calculadora Dropshipping

Este documento detalha as discrepâncias encontradas entre a aplicação standalone (`dropshipping-calculator-app`) e a integração no Next.js (`Alob Express Manager`), bem como as correções aplicadas.

## 1. Conflito de Temas (Shadcn UI)

### Problema
A aplicação standalone foi desenhada com um tema claro (Light Mode) nativo, onde as variáveis CSS (`--background`, `--card`, etc.) assumem valores de cores claras (branco).
No projeto Next.js, o `globals.css` possui definições de tema que forçam o Dark Mode ou aplicam variáveis globais que conflitam com o design esperado da calculadora, resultando em cards transparentes ou escuros.

### Análise Técnica
*   **Standalone (`index.css`):** Define variáveis `:root` com valores claros.
*   **Next.js (`globals.css`):** Possui classes `.dark` e uma hierarquia de CSS que sobrescrevia as variáveis da calculadora quando renderizada dentro do layout principal.

### Solução Aplicada
Criada uma classe de isolamento `.calculator-theme-wrapper` em `src/app/globals.css` que força a redefinição das variáveis CSS para os valores do tema claro (Light Mode) especificamente dentro do container da calculadora.

```css
/* src/app/globals.css */
.calculator-theme-wrapper {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  /* ... demais variáveis forçando light mode */
}
```

Esta classe foi aplicada ao container principal em `src/features/calculator/components/DropshippingCalculator.tsx`.

## 2. Conflito de Z-Index (Menu de Logout)

### Problema
O usuário relatou impossibilidade de clicar no botão "Sair" do menu de perfil.
O container da calculadora possui `z-index` e posicionamento relativo/absoluto para o background de vídeo, criando um contexto de empilhamento que cobria o dropdown do menu superior.

### Solução Aplicada
Adicionada uma regra global para garantir que os dropdowns do sistema tenham prioridade sobre o conteúdo da página.

```css
/* src/app/globals.css */
.dropdown-menu {
  z-index: 1050 !important;
}
```

## 3. Estrutura de Arquivos e Assets

### Discrepâncias Identificadas
*   **Assets de Imagem/Vídeo:**
    *   *Standalone:* Importados via JS de `../imgs/` e `../video/`.
    *   *Next.js:* Devem ser servidos da pasta `public/`.
    *   *Ação:* Os caminhos foram ajustados para `/images/calculator/` e `/videos/calculator/`.
*   **Estrutura de Componentes:**
    *   *Standalone:* Componentes auxiliares (`TrafficConfig`, `ShopeeConfig`) em pastas aninhadas.
    *   *Next.js:* Componentes "flat" ou organizados em `src/features/calculator/components/`.
    *   *Observação:* A lógica interna dos componentes parece preservada, mas a estrutura de diretórios difere.

## 4. Diferenças de Autenticação

*   **Standalone:** Usa `supabase.auth.getSession()` diretamente no componente.
*   **Next.js:** Aceita um `accessToken` via props (para suporte a SSR/Server Components) mas mantém fallback para `supabase.auth.getSession()` no cliente (`internalToken`).

## 5. Recomendações Futuras

1.  **Manutenção do Wrapper:** Qualquer novo componente de UI adicionado à calculadora deve estar dentro do `calculator-theme-wrapper` para garantir a consistência visual.
2.  **Testes de Regressão:** Ao atualizar o Shadcn UI ou o Tailwind no projeto principal, verificar se as variáveis do wrapper não foram afetadas.
3.  **Logs de Erro:** Monitorar o console do navegador para erros de *Hydration* (comuns ao migrar apps React puros para Next.js), especialmente relacionados a `window` ou `localStorage` sendo acessados no lado do servidor.

---
*Documento gerado em 02/02/2026.*
