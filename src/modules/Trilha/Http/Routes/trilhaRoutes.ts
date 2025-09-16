import { FastifyInstance } from "fastify";
import {
  createTrilhaHandler,
  listTrilhasHandler,
  getTrilhaByIdHandler,
  updateTrilhaHandler,
  deleteTrilhaHandler
} from "../Handlers/TrilhaHandlers";
import {
  createTrilhaBodySchema,
  updateTrilhaBodySchema,
  trilhaIdParamSchema
} from "../Schemas/TrilhaSchemas";
import { authorizationHeadersSchema } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { checkAuthMiddleware, requireRoles } from "../../../User/Http/Middlewares/checkAuthMiddleware";
import {
  trilhaResponseSchema,
  trilhaListResponseSchema,
  trilhaDeleteResponseSchema
} from "../Schemas/response/trilhaResponseSchema";

export async function trilhaRoutes(fastify: FastifyInstance) {
  // Criar trilha (apenas managers)
  fastify.post<{
    Body: any;
    Headers: any;
  }>('/', {
    schema: {
      body: createTrilhaBodySchema,
      headers: authorizationHeadersSchema,
      response: trilhaResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, createTrilhaHandler);

  // Listar trilhas (todos os usuários autenticados)
  fastify.get<{
    Headers: any;
  }>('/', {
    schema: {
      headers: authorizationHeadersSchema,
      response: trilhaListResponseSchema
    },
    preHandler: [checkAuthMiddleware]
  }, listTrilhasHandler);

  // Buscar trilha por ID (todos os usuários autenticados)
  fastify.get<{
    Params: any;
    Headers: any;
  }>('/:id', {
    schema: {
      params: trilhaIdParamSchema,
      headers: authorizationHeadersSchema,
      response: trilhaResponseSchema
    },
    preHandler: [checkAuthMiddleware]
  }, getTrilhaByIdHandler);

  // Atualizar trilha (apenas managers)
  fastify.put<{
    Params: any;
    Body: any;
    Headers: any;
  }>('/:id', {
    schema: {
      params: trilhaIdParamSchema,
      body: updateTrilhaBodySchema,
      headers: authorizationHeadersSchema,
      response: trilhaResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, updateTrilhaHandler);

  // Deletar trilha (apenas managers)
  fastify.delete<{
    Headers: any;
    Params: any;
  }>('/:id', {
    schema: {
      params: trilhaIdParamSchema,
      headers: authorizationHeadersSchema,
      response: trilhaDeleteResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, deleteTrilhaHandler);
}