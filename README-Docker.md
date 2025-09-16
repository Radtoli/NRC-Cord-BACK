# NRC Tools Backend - Docker Setup

Este repositório contém o backend da aplicação NRC Tools com configuração completa para Docker.

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### 1. Clone e Configure

```bash
git clone <repository-url>
cd NRCTools/Server
cp .env.example .env
```

### 2. Configure as Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```bash
# Configurações obrigatórias
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_NAME=Seu Nome
ADMIN_EMAIL=admin@suaempresa.com
ADMIN_PASSWORD=sua_senha_segura

# MongoDB e Qdrant são configurados automaticamente pelo Docker Compose
```

### 3. Execute com Docker Compose

```bash
# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f nrc-backend

# Parar todos os serviços
docker-compose down
```

## 📋 Serviços Incluídos

### 🗄️ MongoDB (Porta 27017)
- Base de dados principal
- Usuário admin configurado automaticamente
- Collections e índices criados automaticamente

### 🔍 Qdrant (Portas 6333/6334)
- Vector database para busca semântica
- Interface web disponível em http://localhost:6333/dashboard

### 🖥️ Backend API (Porta 3001)
- API RESTful completa
- Documentação Swagger em http://localhost:3001/documentation
- Health check em http://localhost:3001/health

## 🔧 Usuário Admin

Na primeira execução, será criado automaticamente um usuário administrador com as credenciais definidas no `.env`:

- **Email**: Valor da variável `ADMIN_EMAIL`
- **Senha**: Valor da variável `ADMIN_PASSWORD`
- **Role**: manager (administrador)

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 🏗️ Build e Deploy

### Build da Imagem

```bash
# Build apenas do backend
docker build -t nrc-backend .

# Build com Docker Compose
docker-compose build
```

### Deploy em Produção

1. Configure as variáveis de ambiente de produção
2. Use um arquivo `.env.production`
3. Configure volumes persistentes
4. Configure HTTPS/SSL
5. Configure backup automático do MongoDB

### Exemplo de `.env` para Produção

```bash
NODE_ENV=production
PORT=3001

# MongoDB em produção (exemplo Railway/Atlas)
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/nrc_database?retryWrites=true&w=majority

# Qdrant em produção
QDRANT_HOST=your-qdrant-host.com
QDRANT_PORT=6333
QDRANT_API_KEY=your-api-key

# JWT (use uma chave forte!)
JWT_SECRET=your_very_strong_jwt_secret_for_production
JWT_EXPIRES_IN=7d

# Admin padrão
ADMIN_NAME=Administrador Sistema
ADMIN_EMAIL=admin@suaempresa.com
ADMIN_PASSWORD=senha_muito_forte_aqui
```

## 🔍 Monitoramento

### Health Checks
- Backend: `http://localhost:3001/health`
- MongoDB: Verificação automática via Docker
- Qdrant: `http://localhost:6333/health`

### Logs
```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas do backend
docker-compose logs -f nrc-backend

# Logs do MongoDB
docker-compose logs -f mongodb
```

## 🛠️ Desenvolvimento

### Executar em Modo Desenvolvimento

```bash
# Subir apenas dependências (MongoDB + Qdrant)
docker-compose up -d mongodb qdrant

# Executar backend localmente
npm install
npm run dev
```

### Executar Testes

```bash
npm test
```

## 📚 Endpoints Principais

### Autenticação
- `POST /users/login` - Login
- `POST /users/register` - Registro (apenas managers)

### Trilhas
- `GET /trilhas` - Listar trilhas
- `POST /trilhas` - Criar trilha (admin)
- `PUT /trilhas/:id` - Atualizar trilha (admin)
- `DELETE /trilhas/:id` - Deletar trilha (admin)

### Vídeos
- `GET /videos` - Listar vídeos
- `POST /videos` - Criar vídeo (admin)
- `PUT /videos/:id` - Atualizar vídeo (admin)
- `DELETE /videos/:id` - Deletar vídeo (admin)

### Documentos
- `GET /documents` - Listar documentos
- `POST /documents` - Criar documento (admin)
- `PUT /documents/:id` - Atualizar documento (admin)
- `DELETE /documents/:id` - Deletar documento (admin)

### Usuários
- `GET /users` - Listar usuários (admin)
- `POST /users` - Criar usuário (admin)
- `PUT /users/:id` - Atualizar usuário (admin)
- `DELETE /users/:id` - Deletar usuário (admin)

## 🔒 Segurança

- JWT para autenticação
- Middleware de autorização por roles
- Validação de entrada com Typebox
- Headers de segurança configurados
- CORS configurado

## 📖 Documentação da API

Após executar o servidor, a documentação Swagger estará disponível em:
- **Desenvolvimento**: http://localhost:3001/documentation
- **Produção**: Configure conforme seu domínio

## ❓ Troubleshooting

### Container não inicia
```bash
# Verificar logs
docker-compose logs nrc-backend

# Rebuildar imagem
docker-compose build --no-cache nrc-backend
```

### Erro de conexão MongoDB
```bash
# Verificar se MongoDB está rodando
docker-compose ps mongodb

# Verificar logs do MongoDB
docker-compose logs mongodb
```

### Erro de conexão Qdrant
```bash
# Verificar se Qdrant está rodando
docker-compose ps qdrant

# Verificar logs do Qdrant
docker-compose logs qdrant
```

### Reset completo
```bash
# Parar tudo e remover volumes
docker-compose down -v

# Rebuild e restart
docker-compose up --build -d
```