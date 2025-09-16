import { FastifyInstance } from "fastify";
import { createDocumentBodySchema, CreateDocumentBodyType } from "../Schemas/body/createDocumentBodySchema";
import { updateDocumentBodySchema, UpdateDocumentBodyType } from "../Schemas/body/updateDocumentBodySchema";
import { authorizationHeadersSchema, AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { documentIdParamSchema, DocumentIdParamType } from "../Schemas/params/documentIdParamSchema";
import { requireRoles } from "../../../User/Http/Middlewares/checkAuthMiddleware";
import { createDocumentHandler } from "../Handlers/createDocumentHandler";
import { updateDocumentHandler } from "../Handlers/updateDocumentHandler";
import { deleteDocumentHandler } from "../Handlers/deleteDocumentHandler";
import { listDocumentsHandler, getDocumentByIdHandler } from "../Handlers/listDocumentsHandler";
import { documentListResponseSchema, documentResponseSchema, documentDeleteResponseSchema } from "../Schemas/response/documentResponseSchema";


export async function documentRouter(app: FastifyInstance) {

  // Listar todos os documentos (apenas managers)
  app.get<{
    Headers: AuthorizationHeadersType;
  }>('/', {
    schema: {
      description: 'List all documents',
      tags: ['Documents'],
      summary: 'List documents (Admin only)',
      headers: authorizationHeadersSchema,
      response: documentListResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, listDocumentsHandler);

  // Buscar documento por ID (apenas managers)
  app.get<{
    Headers: AuthorizationHeadersType;
    Params: DocumentIdParamType;
  }>('/:id', {
    schema: {
      description: 'Get document by ID',
      tags: ['Documents'],
      summary: 'Get document (Admin only)',
      headers: authorizationHeadersSchema,
      params: documentIdParamSchema,
      response: documentResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, getDocumentByIdHandler);

  // Criar documento (apenas managers)
  app.post<{
    Body: CreateDocumentBodyType;
    Headers: AuthorizationHeadersType;
  }>('/', {
    schema: {
      description: 'Create a new document',
      tags: ['Documents'],
      summary: 'Create document (Admin only)',
      body: createDocumentBodySchema,
      headers: authorizationHeadersSchema,
      response: documentResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, createDocumentHandler);

  // Atualizar documento (apenas managers)
  app.put<{
    Body: UpdateDocumentBodyType;
    Headers: AuthorizationHeadersType;
    Params: DocumentIdParamType;
  }>('/:id', {
    schema: {
      description: 'Update document',
      tags: ['Documents'],
      summary: 'Update document (Admin only)',
      body: updateDocumentBodySchema,
      headers: authorizationHeadersSchema,
      params: documentIdParamSchema,
      response: documentResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, updateDocumentHandler);

  // Deletar documento (apenas managers)
  app.delete<{
    Headers: AuthorizationHeadersType;
    Params: DocumentIdParamType;
  }>('/:id', {
    schema: {
      description: 'Delete document',
      tags: ['Documents'],
      summary: 'Delete document (Admin only)',
      headers: authorizationHeadersSchema,
      params: documentIdParamSchema,
      response: documentDeleteResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, deleteDocumentHandler);

}