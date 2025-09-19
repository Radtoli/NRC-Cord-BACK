import { FastifyInstance } from 'fastify';
import {
  addDocumentHandler,
  searchDocumentHandler,
} from '../Handlers/EmbeddingHandlers';
import {
  addDocumentBodySchema,
  searchDocumentBodySchema,
  AddDocumentBodyType,
  SearchDocumentBodyType,
} from '../Schemas/EmbeddingSchemas';
import {
  authorizationHeadersSchema,
  AuthorizationHeadersType,
} from '../../../User/Http/Schemas/Header/authorizationHeadersSchema';
import {
  checkAuthMiddleware,
  requireRoles,
} from '../../../User/Http/Middlewares/checkAuthMiddleware';
import {
  addDocumentResponseSchema,
  searchDocumentResponseSchema,
} from '../Schemas/response/embeddingResponseSchema';

export async function embeddingRoutes(fastify: FastifyInstance) {
  // Adicionar documento ao vector database (apenas managers)
  fastify.post<{
    Body: AddDocumentBodyType;
    Headers: AuthorizationHeadersType;
  }>(
    '/add-document',
    {
      schema: {
        body: addDocumentBodySchema,
        headers: authorizationHeadersSchema,
        response: addDocumentResponseSchema,
      },
      preHandler: [checkAuthMiddleware, requireRoles(['manager'])],
    },
    addDocumentHandler,
  );

  // Buscar documentos similares no vector database (todos os usuários autenticados)
  fastify.post<{
    Body: SearchDocumentBodyType;
    Headers: AuthorizationHeadersType;
  }>(
    '/search-documents',
    {
      schema: {
        body: searchDocumentBodySchema,
        headers: authorizationHeadersSchema,
        response: searchDocumentResponseSchema,
      },
      preHandler: [checkAuthMiddleware],
    },
    searchDocumentHandler,
  );
}
