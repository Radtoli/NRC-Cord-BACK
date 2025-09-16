import { FastifyInstance } from "fastify";
import {
  createVideoHandler,
  listVideosHandler,
  getVideoByIdHandler,
  updateVideoHandler,
  deleteVideoHandler
} from "../Handlers/VideoHandlers";
import {
  createVideoBodySchema,
  updateVideoBodySchema,
  videoIdParamSchema
} from "../Schemas/VideoSchemas";
import { authorizationHeadersSchema } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { checkAuthMiddleware, requireRoles } from "../../../User/Http/Middlewares/checkAuthMiddleware";
import {
  videoResponseSchema,
  videoListResponseSchema,
  videoDeleteResponseSchema
} from "../Schemas/response/videoResponseSchema";

export async function videoRoutes(fastify: FastifyInstance) {
  // Criar vídeo (apenas managers)
  fastify.post<{
    Body: any;
    Headers: any;
  }>('/', {
    schema: {
      body: createVideoBodySchema,
      headers: authorizationHeadersSchema,
      response: videoResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, createVideoHandler);

  // Listar vídeos (todos os usuários autenticados)
  fastify.get<{
    Headers: any;
  }>('/', {
    schema: {
      headers: authorizationHeadersSchema,
      response: videoListResponseSchema
    },
    preHandler: [checkAuthMiddleware]
  }, listVideosHandler);

  // Buscar vídeo por ID (todos os usuários autenticados)
  fastify.get<{
    Params: any;
    Headers: any;
  }>('/:id', {
    schema: {
      params: videoIdParamSchema,
      headers: authorizationHeadersSchema,
      response: videoResponseSchema
    },
    preHandler: [checkAuthMiddleware]
  }, getVideoByIdHandler);

  // Atualizar vídeo (apenas managers)
  fastify.put<{
    Params: any;
    Body: any;
    Headers: any;
  }>('/:id', {
    schema: {
      params: videoIdParamSchema,
      body: updateVideoBodySchema,
      headers: authorizationHeadersSchema,
      response: videoResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, updateVideoHandler);

  // Deletar vídeo (apenas managers)
  fastify.delete<{
    Headers: any;
    Params: any;
  }>('/:id', {
    schema: {
      params: videoIdParamSchema,
      headers: authorizationHeadersSchema,
      response: videoDeleteResponseSchema
    },
    preHandler: [checkAuthMiddleware, requireRoles(['manager'])]
  }, deleteVideoHandler);
}