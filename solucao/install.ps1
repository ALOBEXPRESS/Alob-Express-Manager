# Script de Instalação da Solução para Erro 431 - Windows
# Alob Express Manager

$ErrorActionPreference = "Stop"

Write-Host "🚀 Instalando Solução para Erro 431..." -ForegroundColor Cyan
Write-Host ""

# Funções para output colorido
function Print-Success {
    param($message)
    Write-Host "✓ $message" -ForegroundColor Green
}

function Print-Warning {
    param($message)
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

function Print-Error {
    param($message)
    Write-Host "✗ $message" -ForegroundColor Red
}

# Verifica se está no diretório correto
if (-not (Test-Path "package.json")) {
    Print-Error "Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
}

Print-Success "Diretório do projeto encontrado"

# Backup de arquivos existentes
Write-Host ""
Write-Host "📦 Fazendo backup de arquivos existentes..." -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (Test-Path "src/middleware.ts") {
    Copy-Item "src/middleware.ts" "src/middleware.ts.backup.$timestamp"
    Print-Success "Backup do middleware criado"
}

if (Test-Path "next.config.js") {
    Copy-Item "next.config.js" "next.config.js.backup.$timestamp"
    Print-Success "Backup do next.config.js criado"
}

# Cria estrutura de diretórios
Write-Host ""
Write-Host "📁 Criando estrutura de diretórios..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "src/lib" | Out-Null
New-Item -ItemType Directory -Force -Path "src/components" | Out-Null
New-Item -ItemType Directory -Force -Path "src/app/reset-auth" | Out-Null
New-Item -ItemType Directory -Force -Path "public" | Out-Null

Print-Success "Diretórios criados"

# Verifica se os arquivos da solução existem
Write-Host ""
Write-Host "🔍 Verificando arquivos da solução..." -ForegroundColor Cyan

$required_files = @(
    "middleware.ts",
    "supabase-cookie-manager.ts",
    "SupabaseCookieGuard.tsx",
    "reset-auth.html",
    "reset-auth-page.tsx",
    "next.config.js"
)

$missing_files = @()
foreach ($file in $required_files) {
    if (-not (Test-Path $file)) {
        $missing_files += $file
    }
}

if ($missing_files.Count -gt 0) {
    Print-Error "Arquivos da solução não encontrados:"
    foreach ($file in $missing_files) {
        Write-Host "  - $file"
    }
    Write-Host ""
    Print-Warning "Por favor, certifique-se de ter todos os arquivos da solução no diretório atual."
    exit 1
}

Print-Success "Todos os arquivos da solução encontrados"

# Copia arquivos para as localizações corretas
Write-Host ""
Write-Host "📋 Copiando arquivos..." -ForegroundColor Cyan

Copy-Item "middleware.ts" "src/middleware.ts" -Force
Print-Success "Middleware copiado"

Copy-Item "supabase-cookie-manager.ts" "src/lib/supabase-cookie-manager.ts" -Force
Print-Success "Cookie manager copiado"

Copy-Item "SupabaseCookieGuard.tsx" "src/components/SupabaseCookieGuard.tsx" -Force
Print-Success "Cookie guard copiado"

Copy-Item "reset-auth.html" "public/reset-auth.html" -Force
Print-Success "Página de reset copiada"

Copy-Item "reset-auth-page.tsx" "src/app/reset-auth/page.tsx" -Force
Print-Success "Fallback de reset copiado"

# Atualiza next.config.js
if (Test-Path "next.config.js") {
    Print-Warning "next.config.js existente será substituído (backup criado)"
}
Copy-Item "next.config.js" "./" -Force
Print-Success "Configuração do Next.js atualizada"

# Atualiza package.json
Write-Host ""
Write-Host "📝 Atualizando package.json..." -ForegroundColor Cyan

# Cria backup
Copy-Item "package.json" "package.json.backup.$timestamp"

try {
    $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if (-not $pkg.scripts) {
        $pkg | Add-Member -MemberType NoteProperty -Name "scripts" -Value @{} -Force
    }
    
    $pkg.scripts.dev = "cross-env NODE_OPTIONS=--max-http-header-size=240000 next dev -p 3001"
    $pkg.scripts.start = "cross-env NODE_OPTIONS=--max-http-header-size=240000 next start -p 3001"
    
    $pkg | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    
    Print-Success "package.json atualizado"
    Print-Warning "Instale cross-env: npm install --save-dev cross-env"
} catch {
    Print-Warning "Não foi possível atualizar package.json automaticamente"
    Print-Warning "Por favor, adicione manualmente NODE_OPTIONS aos scripts dev e start"
}

# Limpa cache do Next.js
Write-Host ""
Write-Host "🧹 Limpando cache do Next.js..." -ForegroundColor Cyan

if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Print-Success "Cache limpo"
} else {
    Print-Warning "Diretório .next não encontrado"
}

# Verifica variáveis de ambiente
Write-Host ""
Write-Host "🔑 Verificando variáveis de ambiente..." -ForegroundColor Cyan

if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL" -and $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        Print-Success "Variáveis do Supabase encontradas"
    } else {
        Print-Error "Variáveis do Supabase não encontradas no .env.local"
        Write-Host ""
        Write-Host "Adicione as seguintes variáveis ao .env.local:"
        Write-Host "  NEXT_PUBLIC_SUPABASE_URL=sua-url"
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave"
    }
} else {
    Print-Warning ".env.local não encontrado"
    Write-Host "Crie um arquivo .env.local com as variáveis do Supabase"
}

# Instruções finais
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Print-Success "Instalação concluída!"
Write-Host ""
Write-Host "📚 Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Instale cross-env para Windows:"
Write-Host "   npm install --save-dev cross-env"
Write-Host ""
Write-Host "2. Integre o SupabaseCookieGuard no seu layout:"
Write-Host "   src/app/layout.tsx:"
Write-Host "   import { SupabaseCookieGuard } from '@/components/SupabaseCookieGuard'"
Write-Host "   // Adicione <SupabaseCookieGuard /> no body"
Write-Host ""
Write-Host "3. Teste a solução:"
Write-Host "   npm run dev"
Write-Host "   # Acesse http://localhost:3001/reset-auth.html"
Write-Host ""
Write-Host "4. Leia a documentação completa:"
Write-Host "   SOLUCAO_ERRO_431.md"
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Print-Warning "Lembre-se de reiniciar o servidor de desenvolvimento!"
Write-Host ""
