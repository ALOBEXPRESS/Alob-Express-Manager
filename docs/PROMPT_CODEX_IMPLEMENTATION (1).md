# PROMPT PARA CHATGPT-5.2 CODEX - MODO EXECUÇÃO

## INPUTS QUE VOCÊ RECEBERÁ

1. **Documento de Planejamento** gerado por você aqui no chat
2. **Contexto do Sistema**: Calculadora de dropshipping migrada com problemas de CSS
3. **Screenshots** do estado atual (quebrado) vs estado esperado (correto)
4. **ANÁLISE VISUAL DETALHADA** com evidências fotográficas dos problemas

## ⚠️ PROBLEMAS CRÍTICOS IDENTIFICADOS VISUALMENTE

### PRIORIDADE MÁXIMA:

1. **Layout 100% Width SEM Controle**
   - Formulário ocupando TODA a largura da tela
   - Não há grid 50/50 (deveria ter formulário à esquerda, resultados à direita)
   - Cards sem max-width definido

2. **Tipografia COMPLETAMENTE Errada**
   - Fonte atual: Arial/Helvetica genérica
   - Fonte esperada: **DM Sans** (Google Font)
   - Pesos incorretos, tamanhos inconsistentes

3. **Background Perdido**
   - Atual: Branco #FFFFFF
   - Esperado: Preto #0a0a0a com gradiente rosa/verde

4. **Cores ALOB Ausentes**
   - Rosa característico #E91E63 não está aplicado
   - Cards deveriam ser semi-transparentes rgba(255,255,255,0.05)
   - Falta gradiente nos botões

## SUA MISSÃO

Você é um **Senior Frontend Engineer** especializado em:
- Debugging de CSS em aplicações React
- Material-UI (MUI) theming e customização  
- Resolução de conflitos de estilos em sistemas integrados
- Isolamento de estilos em micro-frontends

**OBJETIVO**: Implementar as correções identificadas no plano de diagnóstico para restaurar a calculadora ao estado funcional original.

## SKILL OBRIGATÓRIA

**VOCÊ DEVE LER ESTA SKILL ANTES DE COMEÇAR**:
```
/.agent/skills/frontend-design/SKILL.md
```

Esta skill contém:
- Padrões de debugging CSS em produção
- Técnicas de isolamento de estilos
- Best practices para integração de componentes
- Estratégias de resolução de conflitos de CSS

## WORKFLOW OBRIGATÓRIO

### FASE 1: COMPREENSÃO DO PLANO

**ANTES DE TUDO: Leia a ANALISE_VISUAL_DETALHADA.md**

```markdown
1. [ ] Ler completamente o documento de planejamento do Gemini no chat
2. [ ] Ler ANALISE_VISUAL_DETALHADA.md para ver problemas visuais
3. [ ] Identificar a estratégia de correção recomendada (Isolamento Total)
4. [ ] Listar todos os arquivos que precisam ser modificados
5. [ ] Confirmar comigo se entendeu o plano antes de começar
```

**⚠️ ESTRATÉGIA OBRIGATÓRIA: CSS-in-JS + ThemeProvider Isolado**

Você DEVE usar:
- `styled-components` da @emotion/styled
- Container com `all: initial` para reset total
- ThemeProvider próprio da calculadora
- Tema customizado com cores ALOB Express

**NÃO use**:
- ❌ CSS Modules (não resolve problema de fonte/tema)
- ❌ Modificações no CSS global
- ❌ Shadow DOM (incompatível com MUI)
- ❌ Apenas namespace CSS (insuficiente)

**CHECKPOINT**: Me pergunte se alguma parte do plano está ambígua.

### FASE 2: AUDITORIA INICIAL
```markdown
1. [ ] Inspecionar estrutura de diretórios src/
2. [ ] Mapear imports de CSS no arquivo principal
3. [ ] Identificar ThemeProvider e configuração de tema
4. [ ] Localizar componente/página da calculadora
5. [ ] Listar todos os arquivos .css/.scss/.styled.ts relacionados
```

**OUTPUT ESPERADO**: Árvore de arquivos relevantes com descrição

### FASE 3: IMPLEMENTAÇÃO INCREMENTAL

**NÃO FAÇA TUDO DE UMA VEZ**. Implemente em pequenas iterações:

#### Iteração 1: Isolamento Total com Styled Components

**CÓDIGO OBRIGATÓRIO:**

```typescript
// src/features/calculator/CalculatorPage.tsx
import styled from '@emotion/styled';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// CRÍTICO: Container que reseta TODOS os estilos herdados
const CalculatorContainer = styled.div`
  all: initial; /* Reset total - remove herança do sistema */
  
  * {
    box-sizing: border-box;
  }
  
  /* Reaplica display e layout */
  display: block;
  min-height: 100vh;
  
  /* Background ALOB Express */
  background: #0a0a0a;
  background-image: 
    radial-gradient(at 40% 20%, rgba(233, 30, 99, 0.2) 0px, transparent 50%),
    radial-gradient(at 80% 80%, rgba(0, 255, 135, 0.15) 0px, transparent 50%);
  
  padding: 40px 20px;
`;

const CalculatorInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Tema ISOLADO da calculadora
const calculatorTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E91E63' }, // Rosa ALOB
    background: {
      default: '#0a0a0a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export function CalculatorPage() {
  return (
    <CalculatorContainer>
      <ThemeProvider theme={calculatorTheme}>
        <CssBaseline />
        <CalculatorInner>
          {/* Conteúdo da calculadora */}
        </CalculatorInner>
      </ThemeProvider>
    </CalculatorContainer>
  );
}
```

**TESTE**: 
1. Background deve ficar PRETO com gradiente
2. Fonte deve mudar para DM Sans
3. Nenhum estilo do sistema principal deve vazar

**⚠️ IMPORTANTE**: Adicione antes no `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

#### Iteração 2: Correção de Cards
```typescript
// Forçar propriedades de Card que podem estar sendo sobrescritas
<Card 
  variant="outlined"
  sx={{
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    boxShadow: 1,
    backgroundColor: 'background.paper',
    '& .MuiCardContent-root': {
      padding: 3
    }
  }}
>
```

**TESTE**: Card deve aparecer com borda visível.

#### Iteração 3: Correção de Inputs
```typescript
<TextField
  fullWidth={false} // Importante!
  sx={{
    maxWidth: 400,
    '& .MuiInputBase-root': {
      backgroundColor: 'background.default'
    }
  }}
/>
```

**TESTE**: Inputs devem ter largura controlada.

#### Iteração 4: Grid Layout 50/50 com Max-Width

**CÓDIGO OBRIGATÓRIO:**

```typescript
import { Grid, Card, CardContent, Typography } from '@mui/material';

function CalculatorForm() {
  return (
    <Grid container spacing={3}>
      {/* Coluna Esquerda - Formulário (50%) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          maxWidth: 600, // CRÍTICO: Limita largura
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <CardContent sx={{ p: 3 }}> {/* Padding 24px */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              📋 Dados do Produto
            </Typography>
            
            <TextField 
              fullWidth 
              label="Nome do Produto"
              sx={{ 
                mb: 2,
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            />
            {/* ... outros campos */}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Coluna Direita - Resultados (50%) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          maxWidth: 600,
          background: 'linear-gradient(135deg, #E91E63 0%, #F50057 100%)',
          boxShadow: '0 8px 30px rgba(233, 30, 99, 0.4)',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              💰 Resultados
            </Typography>
            {/* Resultados */}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
```

**TESTE**: 
- Desktop: 2 colunas lado a lado (50% cada)
- Mobile: 2 colunas empilhadas (100% cada)
- Cards não devem ultrapassar 600px de largura

### FASE 4: DEBUGGING SISTEMÁTICO

Se algo não funcionar:

```markdown
1. [ ] Abrir DevTools → Elements
2. [ ] Inspecionar elemento problemático
3. [ ] Verificar "Computed" tab para estilos finais
4. [ ] Identificar qual regra CSS está vencendo
5. [ ] Anotar arquivo:linha da regra conflitante
6. [ ] Aumentar especificidade OU usar !important temporariamente
7. [ ] Documentar o conflito encontrado
```

**IMPORTANTE**: Nunca use `!important` como solução final, apenas para diagnóstico.

### FASE 5: CSS SCOPING STRATEGY

Se a estratégia escolhida for CSS Scoping:

```css
/* calculator.scoped.css */

/* Namespace tudo dentro de .calculator-root */
.calculator-root {
  /* Variáveis CSS locais */
  --calc-primary: #1976d2;
  --calc-background: #121212;
  --calc-card-border: rgba(255, 255, 255, 0.12);
}

.calculator-root .MuiCard-root {
  border: 1px solid var(--calc-card-border) !important;
  background: var(--calc-background);
}

.calculator-root .MuiTextField-root {
  max-width: 400px;
}

/* Aumentar especificidade para vencer estilos globais */
.calculator-root .MuiInputBase-input {
  /* estilos específicos */
}
```

### FASE 6: TESTES DE REGRESSÃO

Após cada mudança:

```markdown
1. [ ] npm run dev
2. [ ] Navegar para http://localhost:3001/pt-br
3. [ ] Abrir calculadora
4. [ ] Comparar visualmente com screenshot correto
5. [ ] Testar responsividade (resize browser)
6. [ ] Verificar console para warnings
7. [ ] Testar interações (preencher formulário, calcular)
```

## REGRAS DE OURO

### ✅ FAÇA
- Usar `sx` prop do MUI para estilos inline quando possível
- Criar ThemeProvider isolado para a calculadora
- Aumentar especificidade CSS quando necessário
- Comentar TODOS os hacks/workarounds no código
- Fazer commits pequenos e testáveis
- Documentar cada mudança no código

### ❌ NÃO FAÇA
- Modificar CSS global do sistema principal
- Usar `!important` indiscriminadamente
- Refatorar código funcional sem necessidade
- Mudar estrutura de componentes sem motivo
- Fazer alterações que quebrem outras páginas
- Commitar código não testado

## ESTRUTURA DE RESPOSTA ESPERADA

Para cada iteração, forneça:

```markdown
## Iteração N: [Nome da Correção]

### Diagnóstico
- Problema identificado: [descrição]
- Causa raiz: [explicação]
- Arquivos afetados: [lista]

### Solução Implementada
```typescript
// Código com comentários explicativos
```

### Teste Realizado
- Comando: `npm run dev`
- URL testada: http://localhost:3001/pt-br
- Resultado: ✅ Funcionou / ❌ Ainda com problemas
- Screenshot: [se necessário]

### Próximos Passos
- [ ] Tarefa 1
- [ ] Tarefa 2
```

## TEMA COMPLETO ALOB EXPRESS

**Crie o arquivo: `src/features/calculator/theme.ts`**

```typescript
import { createTheme } from '@mui/material/styles';

export const calculatorTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E91E63', // Rosa ALOB
      light: '#F50057',
      dark: '#C2185B',
    },
    secondary: {
      main: '#00FF87', // Verde neon
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(233, 30, 99, 0.3)',
            borderColor: 'rgba(233, 30, 99, 0.5)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #E91E63 0%, #F50057 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F50057 0%, #E91E63 100%)',
            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
          },
        },
      },
    },
  },
});
```

**Use assim:**

```typescript
import { calculatorTheme } from './theme';

<ThemeProvider theme={calculatorTheme}>
  {/* ... */}
</ThemeProvider>
```

**TypeScript/JSX**:
```typescript
// ✅ BOM: Código limpo, comentado, tipado
interface CalculatorProps {
  /** Configuração inicial da calculadora */
  initialValues?: FormValues;
}

export function Calculator({ initialValues }: CalculatorProps) {
  // Implementação
}
```

**CSS**:
```css
/* ✅ BOM: Seletores específicos, variáveis claras */
.calculator-root .result-card {
  /* Forçar borda mesmo com estilos globais */
  border: 1px solid var(--calc-border-color) !important;
  
  /* Explicação do !important:
   * Necessário para sobrescrever reset global do sistema principal
   * que define border: none em todos os cards
   */
}
```

## CRITÉRIOS DE SUCESSO (CHECKLIST VISUAL)

Compare com o screenshot correto (localhost:5173). A tarefa está completa quando:

### Visual (OBRIGATÓRIO)
1. ✅ **Background PRETO** (#0a0a0a) com gradiente rosa/verde
2. ✅ **Fonte DM Sans** em todos os textos (não Arial/Helvetica)
3. ✅ **Layout 50/50**: Formulário esquerda | Resultados direita
4. ✅ **Cards max-width 600px** (não ocupando 100% da tela)
5. ✅ **Cards semi-transparentes** rgba(255,255,255,0.05) com blur
6. ✅ **Bordas visíveis** rgba(255,255,255,0.12)
7. ✅ **Botão rosa** #E91E63 com gradiente
8. ✅ **Inputs com background escuro** semi-transparente
9. ✅ **Espaçamento 24px** entre elementos (padding interno dos cards)
10. ✅ **Border-radius 12px** em cards e 8px em inputs

### Técnico
11. ✅ Nenhum erro no console
12. ✅ Responsivo (mobile = 100% width, desktop = 50/50)
13. ✅ Nenhuma regressão em outras páginas do sistema
14. ✅ Código comentado explicando `all: initial` e isolamento

### Performance
15. ✅ Google Font DM Sans carregada do CDN
16. ✅ ThemeProvider não causa re-renders desnecessários
17. ✅ Transições suaves (0.3s ease)

## DELIVERABLES FINAIS

Ao concluir, forneça:

1. **Lista de arquivos modificados** com descrição das mudanças
2. **Diff principal** dos arquivos mais importantes
3. **Comandos de teste** para eu validar
4. **Checklist de verificação visual**
5. **Documentação inline** nos arquivos alterados
6. **README.md** da calculadora atualizado (se aplicável)

## EXEMPLO DE ENTREGA

```markdown
## ✅ TAREFA CONCLUÍDA

### Arquivos Modificados

1. `src/features/calculator/Calculator.tsx`
   - Adicionado ThemeProvider isolado
   - Namespace CSS `.calculator-root`
   - Props `sx` forçadas em Cards e TextFields

2. `src/features/calculator/calculator.scoped.css`
   - Novo arquivo criado
   - Variáveis CSS locais
   - Seletores com alta especificidade

3. `src/features/calculator/theme.ts`
   - Novo arquivo criado
   - Tema MUI isolado para calculadora

### Como Testar

```bash
# 1. Instalar dependências (se houver novas)
npm install

# 2. Rodar dev server
npm run dev

# 3. Abrir no navegador
# http://localhost:3001/pt-br

# 4. Verificar visualmente:
# - Cards com bordas ✅
# - Inputs com max-width ✅
# - Layout em 2 colunas ✅
# - Espaçamento correto ✅
```

### Checklist Visual

- [ ] Abrir calculadora em http://localhost:3001/pt-br
- [ ] Comparar com screenshot correto
- [ ] Verificar bordas nos Cards
- [ ] Testar responsividade (resize navegador)
- [ ] Preencher e enviar formulário
- [ ] Verificar console (sem erros)
- [ ] Navegar para outra página e voltar

### Observações

- Todo código foi comentado explicando workarounds
- ThemeProvider isolado evita conflitos futuros
- CSS scoping previne vazamento de estilos
- Nenhuma mudança no sistema principal
```

---

**AGORA VOCÊ PODE COMEÇAR**. 

Leia o documento de planejamento que vou te passar, leia a skill obrigatória, e comece a implementação seguindo o workflow acima.

**BOA SORTE, CODEX!** 🚀
