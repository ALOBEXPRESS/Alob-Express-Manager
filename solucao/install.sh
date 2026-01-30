#!/bin/bash

# Script de Instalação da Solução para Erro 431
# Alob Express Manager

set -e  # Para em caso de erro

echo "🚀 Instalando Solução para Erro 431..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verifica se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

print_success "Diretório do projeto encontrado"

# Backup de arquivos existentes
echo ""
echo "📦 Fazendo backup de arquivos existentes..."

if [ -f "src/middleware.ts" ]; then
    cp src/middleware.ts src/middleware.ts.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup do middleware criado"
fi

if [ -f "next.config.js" ]; then
    cp next.config.js next.config.js.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup do next.config.js criado"
fi

# Cria estrutura de diretórios
echo ""
echo "📁 Criando estrutura de diretórios..."

mkdir -p src/lib
mkdir -p src/components
mkdir -p src/app/reset-auth
mkdir -p public

print_success "Diretórios criados"

# Verifica se os arquivos da solução existem
echo ""
echo "🔍 Verificando arquivos da solução..."

required_files=(
    "middleware.ts"
    "supabase-cookie-manager.ts"
    "SupabaseCookieGuard.tsx"
    "reset-auth.html"
    "reset-auth-page.tsx"
    "next.config.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    print_error "Arquivos da solução não encontrados:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    print_warning "Por favor, certifique-se de ter todos os arquivos da solução no diretório atual."
    exit 1
fi

print_success "Todos os arquivos da solução encontrados"

# Copia arquivos para as localizações corretas
echo ""
echo "📋 Copiando arquivos..."

cp middleware.ts src/middleware.ts
print_success "Middleware copiado"

cp supabase-cookie-manager.ts src/lib/supabase-cookie-manager.ts
print_success "Cookie manager copiado"

cp SupabaseCookieGuard.tsx src/components/SupabaseCookieGuard.tsx
print_success "Cookie guard copiado"

cp reset-auth.html public/reset-auth.html
print_success "Página de reset copiada"

cp reset-auth-page.tsx src/app/reset-auth/page.tsx
print_success "Fallback de reset copiado"

# Atualiza next.config.js
if [ -f "next.config.js" ]; then
    print_warning "next.config.js existente será substituído (backup criado)"
fi
cp next.config.js ./
print_success "Configuração do Next.js atualizada"

# Atualiza package.json
echo ""
echo "📝 Atualizando package.json..."

# Cria backup
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)

# Atualiza scripts usando Node
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = \"NODE_OPTIONS='--max-http-header-size=240000' next dev -p 3001\";
pkg.scripts.start = \"NODE_OPTIONS='--max-http-header-size=240000' next start -p 3001\";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
" 2>/dev/null || {
    print_warning "Não foi possível atualizar package.json automaticamente"
    print_warning "Por favor, adicione manualmente NODE_OPTIONS aos scripts dev e start"
}

print_success "package.json atualizado"

# Limpa cache do Next.js
echo ""
echo "🧹 Limpando cache do Next.js..."

if [ -d ".next" ]; then
    rm -rf .next
    print_success "Cache limpo"
else
    print_warning "Diretório .next não encontrado"
fi

# Verifica variáveis de ambiente
echo ""
echo "🔑 Verificando variáveis de ambiente..."

if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        print_success "Variáveis do Supabase encontradas"
    else
        print_error "Variáveis do Supabase não encontradas no .env.local"
        echo ""
        echo "Adicione as seguintes variáveis ao .env.local:"
        echo "  NEXT_PUBLIC_SUPABASE_URL=sua-url"
        echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave"
    fi
else
    print_warning ".env.local não encontrado"
    echo "Crie um arquivo .env.local com as variáveis do Supabase"
fi

# Instruções finais
echo ""
echo "================================================"
echo ""
print_success "Instalação concluída!"
echo ""
echo "📚 Próximos passos:"
echo ""
echo "1. Integre o SupabaseCookieGuard no seu layout:"
echo "   src/app/layout.tsx:"
echo "   import { SupabaseCookieGuard } from '@/components/SupabaseCookieGuard'"
echo "   // Adicione <SupabaseCookieGuard /> no body"
echo ""
echo "2. Teste a solução:"
echo "   npm run dev"
echo "   # Acesse http://localhost:3001/reset-auth.html"
echo ""
echo "3. Leia a documentação completa:"
echo "   SOLUCAO_ERRO_431.md"
echo ""
echo "================================================"
echo ""
print_warning "Lembre-se de reiniciar o servidor de desenvolvimento!"
echo ""
