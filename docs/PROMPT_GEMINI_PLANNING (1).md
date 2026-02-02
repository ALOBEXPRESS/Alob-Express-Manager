# PROMPT PARA GOOGLE GEMINI PRO 3 200K - MODO PLANEJAMENTO

## CONTEXTO DO PROBLEMA

Recentemente migrei uma calculadora de dropshipping que rodava em `http://localhost:5173/__calc/` para dentro do meu sistema principal em `http://localhost:3001/pt-br` movendo os arquivos para dentro do diretório `src/`. 

Após a migração, a calculadora apresentou sérios problemas de estilo e layout. Compare:

### ESTADO ATUAL (QUEBRADO)
- Interface completamente desorganizada
- Cards sem bordas definidas/visíveis
- Campos de formulário ocupando 100% da largura sem controle
- Espaçamento irregular e inconsistente
- Elementos sobrepostos pelo fundo escuro
- Perda total da hierarquia visual
- Botões e inputs sem definição clara
- Seções colapsadas e sem separação

### ESTADO ESPERADO (CORRETO)
- Cards bem definidos com bordas visíveis e sombras sutis
- Layout em grid organizado (esquerda: formulário | direita: resultados)
- Campos de input proporcionais com max-width apropriado
- Espaçamento consistente entre elementos
- Cores e contrastes preservados
- Hierarquia visual clara
- Componentes MUI renderizados corretamente

## ARQUITETURA DO SISTEMA

**Sistema Principal (ALOB Express Manager)**:
- Framework: React + Vite
- Routing: React Router
- UI: Material-UI (MUI)
- Estado: Context API / useState
- Estilo: CSS Modules + Styled Components
- Estrutura: Feature-based (`src/features/`, `src/components/`)

**Calculadora Migrada**:
- Originalmente: Aplicação standalone em porta separada (5173)
- Atual: Integrada no sistema principal via iframe
- Problema: Conflitos de CSS global, variáveis CSS, resets e tema

## HIPÓTESES DE CAUSA

1. **Conflito de CSS Global**: O sistema principal pode ter um CSS reset/normalize que sobrescreve os estilos da calculadora
2. **Variáveis CSS Perdidas**: A calculadora pode depender de custom properties CSS (`--var-name`) que não existem no contexto do sistema principal
3. **Tema MUI Desconfigurado**: A calculadora pode ter seu próprio ThemeProvider MUI que conflita com o tema global
4. **Especificidade CSS**: Estilos do sistema principal com maior especificidade sobrescrevem os da calculadora
5. **Box-sizing Global**: Mudança no `box-sizing` global afetando o cálculo de dimensões
6. **Import de Fontes**: Google Fonts ou fontes customizadas não carregando corretamente
7. **Z-index Conflicts**: Camadas de empilhamento conflitantes entre sistemas

## SKILL RECOMENDADA

Utilize a skill **frontend-design** do repositório antigravity-awesome-skills:
- **Localização**: `skills/frontend-design/SKILL.md`
- **Expertise**: Diagnóstico de problemas de CSS, isolamento de estilos, debugging de layouts quebrados
- **Aplicação**: Análise de conflitos de CSS em aplicações migradas/integradas

## SUA MISSÃO - MODO PLAN

Você deve criar um **plano de diagnóstico e correção** completo e detalhado que:

### 1. FASE DE INVESTIGAÇÃO
```markdown
- [ ] Mapear TODOS os arquivos CSS/SCSS do sistema principal
- [ ] Identificar resets CSS e normalize.css ativos
- [ ] Listar todas as variáveis CSS globais (`:root { --* }`)
- [ ] Verificar configuração do ThemeProvider MUI no sistema principal
- [ ] Analisar imports de CSS no ponto de entrada da calculadora
- [ ] Identificar uso de CSS Modules vs Global CSS
- [ ] Verificar ordem de importação dos estilos
- [ ] Mapear uso de styled-components vs inline styles
```

### 2. ANÁLISE COMPARATIVA
```markdown
- [ ] Comparar DOM renderizado antes (porta 5173) vs depois (porta 3001)
- [ ] Inspecionar computed styles dos elementos quebrados
- [ ] Identificar estilos sobrescritos (crossed-out no DevTools)
- [ ] Listar classes CSS ausentes ou não aplicadas
- [ ] Verificar carregamento de fontes (Network tab)
- [ ] Analisar console para erros de CSS
```

### 3. ESTRATÉGIAS DE ISOLAMENTO
Propor pelo menos 3 estratégias diferentes:

**Opção A - Shadow DOM**
```markdown
- Encapsular calculadora em Web Component
- Pros/Cons
- Nível de esforço
```

**Opção B - CSS Scoping**
```markdown
- Prefixar todas as classes da calculadora
- Usar CSS Modules forçado
- Pros/Cons
```

**Opção C - iFrame com Sandbox**
```markdown
- Manter iframe mas com controle total do contexto
- Definir CSP específico
- Pros/Cons
```

**Opção D - Namespace CSS**
```markdown
- Criar wrapper com namespace `.calc-app { }`
- Aumentar especificidade de todos os seletores
- Pros/Cons
```

### 4. PLANO DE CORREÇÃO PRIORIZADO
Para cada problema identificado, criar um checklist:

```markdown
## Problema 1: Cards sem borda
- [ ] Localizar componente Card
- [ ] Verificar propriedade `variant="outlined"`
- [ ] Conferir variável CSS `--mui-palette-divider`
- [ ] Testar border inline: `border: 1px solid rgba(255,255,255,0.12)`
- [ ] Verificar classe `.MuiCard-root` no DevTools

## Problema 2: Inputs sem max-width
- [ ] Encontrar componente TextField/Input
- [ ] Adicionar `sx={{ maxWidth: 300 }}`
- [ ] Verificar container parent com `width: 100%`
- [ ] Testar Grid item com `xs={12} sm={6}`
```

### 5. TESTES DE VALIDAÇÃO
```markdown
- [ ] Comparar screenshot antes/depois lado a lado
- [ ] Verificar responsividade (mobile, tablet, desktop)
- [ ] Testar dark mode se aplicável
- [ ] Validar acessibilidade (contrast ratio)
- [ ] Verificar performance (Lighthouse)
```

### 6. DOCUMENTAÇÃO
```markdown
- [ ] Criar README.md explicando a arquitetura de estilos
- [ ] Documentar variáveis CSS customizadas necessárias
- [ ] Listar dependências de tema MUI
- [ ] Criar guia de troubleshooting para futuros problemas
```

## FORMATO DA RESPOSTA

Estruture sua resposta em Markdown com:

1. **Executive Summary** (2-3 parágrafos)
2. **Root Cause Analysis** (hipóteses priorizadas por probabilidade)
3. **Detailed Investigation Plan** (checklist completo)
4. **Solution Strategies** (mínimo 3 opções com trade-offs)
5. **Implementation Roadmap** (fases, dependências, riscos)
6. **Success Criteria** (métricas quantificáveis)
7. **Rollback Plan** (se algo der errado)

## CONSTRAINTS

- Não sugerir refatoração completa da calculadora
- Priorizar soluções que NÃO quebrem o sistema principal
- Manter compatibilidade com MUI v5+
- Código deve funcionar em navegadores modernos (últimas 2 versões)
- Considerar performance (não aumentar bundle em >50KB)

## ENTREGÁVEIS ESPERADOS

1. Documento de planejamento estruturado
2. Lista de arquivos que precisam ser modificados
3. Checklist de testes pré/pós implementação
4. Diagrama de fluxo de estilos (ASCII art aceitável)
5. Estimativa de esforço (em horas de desenvolvimento)

---

**IMPORTANTE**: Você está em modo PLANNING. Não escreva código ainda. Apenas planeje, analise e documente. O próximo agente (ChatGPT-5.2 Codex) executará baseado no seu plano.

**GENERATE THE PLAN NOW.**
