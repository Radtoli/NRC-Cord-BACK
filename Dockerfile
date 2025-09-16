# Use uma imagem Node.js baseada em Alpine Linux (mais leve)
FROM node:18-alpine AS builder

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar dependências do sistema necessárias para compilação nativa
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar o código fonte
COPY . .

# Compilar o TypeScript
RUN npm run build

# Stage de produção
FROM node:18-alpine AS production

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar arquivos necessários do stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Criar um usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Alterar a propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor a porta da aplicação
EXPOSE 3001

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001

# Comando healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Comando para iniciar a aplicação
CMD ["npm", "start"]