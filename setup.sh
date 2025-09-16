#!/bin/bash

# Script de Setup do NRC Tools Backend
# Este script configura o ambiente Docker para desenvolvimento

set -e

echo "🚀 Configurando NRC Tools Backend..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker e tente novamente."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose e tente novamente."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Edite-o com suas configurações antes de continuar."
    read -p "Pressione Enter para continuar depois de editar o .env..."
fi

# Verificar se as variáveis obrigatórias estão definidas
echo "🔍 Verificando configurações..."

if grep -q "your_jwt_secret_key" .env; then
    echo "⚠️  AVISO: JWT_SECRET ainda está com valor padrão. Recomendamos alterar."
fi

if grep -q "admin123" .env; then
    echo "⚠️  AVISO: ADMIN_PASSWORD ainda está com valor padrão. Recomendamos alterar."
fi

# Build das imagens
echo "🏗️  Fazendo build das imagens Docker..."
docker-compose build

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Verificar se serviços estão rodando
echo "🔍 Verificando status dos serviços..."
docker-compose ps

# Verificar health checks
echo "❤️  Verificando health checks..."
sleep 10

# Mostrar informações importantes
echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "- MongoDB: http://localhost:27017"
echo "- Qdrant Dashboard: http://localhost:6333/dashboard"
echo "- Backend API: http://localhost:3001"
echo "- API Documentation: http://localhost:3001/documentation"
echo "- Health Check: http://localhost:3001/health"
echo ""
echo "🔑 Usuário Admin criado automaticamente:"
echo "- Email: $(grep ADMIN_EMAIL .env | cut -d'=' -f2)"
echo "- Senha: $(grep ADMIN_PASSWORD .env | cut -d'=' -f2)"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!"
echo ""
echo "📝 Comandos úteis:"
echo "- Ver logs: docker-compose logs -f"
echo "- Parar serviços: docker-compose down"
echo "- Rebuild: docker-compose build --no-cache"
echo ""
echo "🚀 O backend está pronto para uso!"