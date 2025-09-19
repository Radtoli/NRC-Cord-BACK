# Módulo de Embedding

Este módulo fornece funcionalidades de busca semântica utilizando embeddings e Qdrant como vector database.

## Funcionalidades

### 1. Adicionar Documento (POST /embedding/add-document)

Adiciona um documento ao vector database gerando seu embedding e armazenando no Qdrant.

**Acesso:** Apenas managers

**Body:**
```json
{
  "text": "Texto do documento a ser indexado",
  "provaId": "ID da prova",
  "tipoProva": "tipo da prova (ex: enem, vestibular, etc)",
  "numeroQuestao": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prova_123_1734567890000",
    "success": true
  },
  "message": "Document added successfully to vector database"
}
```

### 2. Buscar Documentos (POST /embedding/search-documents)

Busca documentos similares no vector database baseado em uma query e **salva a consulta** como um novo documento.

**Acesso:** Todos os usuários autenticados

**Body:**
```json
{
  "query": "Texto da consulta para busca semântica",
  "provaId": "ID da prova que está sendo consultada",
  "tipoProva": "tipo da prova",
  "numeroQuestao": 1,
  "limit": 10 // opcional, padrão é 10
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prova_123_1734567890000",
      "score": 0.95,
      "payload": {
        "provaId": "123",
        "tipoProva": "enem",
        "numeroQuestao": 1,
        "text": "Conteúdo do documento...",
        "createdAt": "2024-12-19T10:30:00.000Z"
      }
    }
  ],
  "message": "Found 1 similar documents"
}
```

## Estrutura de Coleções

O Qdrant organiza os documentos em coleções seguindo o padrão:
`{tipoProva}_q{numeroQuestao}`

Exemplo: `enem_q1`, `vestibular_q15`

## Configuração

Adicione as seguintes variáveis ao seu `.env`:

```env
# ===== CONFIGURAÇÃO EMBEDDING API =====
EMBEDDING_API_URL='http://localhost:8000'

# ===== CONFIGURAÇÃO QDRANT =====
QDRANT_HOST='localhost'
QDRANT_PORT='6333'
QDRANT_API_KEY=''
```

## Dependências

- Microserviço de embedding Python (deve estar rodando na URL configurada)
- Qdrant vector database
- Provider Qdrant configurado

## Fluxo de Funcionamento

### Adicionar Documento:
1. Recebe os dados do documento
2. Faz chamada para API de embedding para gerar vetor
3. Cria/verifica coleção no Qdrant
4. Insere documento com embedding na coleção apropriada

### Buscar Documentos:
1. Recebe query de busca e provaId
2. Gera embedding da query via API
3. **Salva a consulta como documento na coleção apropriada**
4. Busca documentos similares na coleção específica
5. Retorna resultados ordenados por similaridade