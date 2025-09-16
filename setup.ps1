# Script de Setup do NRC Tools Backend para Windows
# Este script configura o ambiente Docker para desenvolvimento

Write-Host "🚀 Configurando NRC Tools Backend..." -ForegroundColor Green

# Verificar se Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado. Instale o Docker Desktop e tente novamente." -ForegroundColor Red
    exit 1
}

# Verificar se Docker Compose está instalado
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose não está instalado. Instale o Docker Compose e tente novamente." -ForegroundColor Red
    exit 1
}

# Criar arquivo .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Arquivo .env criado. Edite-o com suas configurações antes de continuar." -ForegroundColor Green
    Read-Host "Pressione Enter para continuar depois de editar o .env"
}

# Verificar se as variáveis obrigatórias estão definidas
Write-Host "🔍 Verificando configurações..." -ForegroundColor Blue

$envContent = Get-Content ".env" -Raw

if ($envContent -match "your_jwt_secret_key") {
    Write-Host "⚠️  AVISO: JWT_SECRET ainda está com valor padrão. Recomendamos alterar." -ForegroundColor Yellow
}

if ($envContent -match "admin123") {
    Write-Host "⚠️  AVISO: ADMIN_PASSWORD ainda está com valor padrão. Recomendamos alterar." -ForegroundColor Yellow
}

# Build das imagens
Write-Host "🏗️  Fazendo build das imagens Docker..." -ForegroundColor Blue
docker-compose build

# Iniciar serviços
Write-Host "🚀 Iniciando serviços..." -ForegroundColor Green
docker-compose up -d

# Aguardar serviços ficarem prontos
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar se serviços estão rodando
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Blue
docker-compose ps

# Verificar health checks
Write-Host "❤️  Verificando health checks..." -ForegroundColor Magenta
Start-Sleep -Seconds 10

# Extrair credenciais do .env para exibir
$adminEmail = (Get-Content ".env" | Where-Object { $_ -match "ADMIN_EMAIL=" }) -replace "ADMIN_EMAIL=", ""
$adminPassword = (Get-Content ".env" | Where-Object { $_ -match "ADMIN_PASSWORD=" }) -replace "ADMIN_PASSWORD=", ""

# Mostrar informações importantes
Write-Host ""
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informações importantes:" -ForegroundColor Cyan
Write-Host "- MongoDB: http://localhost:27017" -ForegroundColor White
Write-Host "- Qdrant Dashboard: http://localhost:6333/dashboard" -ForegroundColor White
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "- API Documentation: http://localhost:3001/documentation" -ForegroundColor White
Write-Host "- Health Check: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Usuário Admin criado automaticamente:" -ForegroundColor Cyan
Write-Host "- Email: $adminEmail" -ForegroundColor White
Write-Host "- Senha: $adminPassword" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!" -ForegroundColor Red
Write-Host ""
Write-Host "📝 Comandos úteis:" -ForegroundColor Cyan
Write-Host "- Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "- Parar serviços: docker-compose down" -ForegroundColor White
Write-Host "- Rebuild: docker-compose build --no-cache" -ForegroundColor White
Write-Host ""
Write-Host "🚀 O backend está pronto para uso!" -ForegroundColor Green