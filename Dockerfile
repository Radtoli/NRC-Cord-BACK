# Use uma imagem Node.js baseada em Alpine Linux (mais leve)
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o código fonte
COPY . .

# Criar o diretório de build
RUN mkdir -p dist

# Compilar o TypeScript
RUN npm run build

# Criar um usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

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