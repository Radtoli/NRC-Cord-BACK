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

export async function videoRoutes(fastify: FastifyInstance) {
  // Aplicar middleware de autenticação e autorização para todas as rotas
  fastify.addHook('preHandler', checkAuthMiddleware);
  fastify.addHook('preHandler', requireRoles(['manager'])); // Apenas admin/manager

  // Criar vídeo
  fastify.post('/', {
    schema: {
      body: createVideoBodySchema,
      headers: authorizationHeadersSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                youtubeId: { type: 'string' },
                duration: { type: 'string' },
                trilha: { type: 'string' },
                documents: {
                  type: 'array',
                  items: { type: 'string' }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, createVideoHandler);

  // Listar vídeos
  fastify.get('/', {
    schema: {
      headers: authorizationHeadersSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  youtubeId: { type: 'string' },
                  duration: { type: 'string' },
                  trilha: { type: 'string' },
                  documents: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, listVideosHandler);

  // Buscar vídeo por ID
  fastify.get('/:id', {
    schema: {
      params: videoIdParamSchema,
      headers: authorizationHeadersSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                youtubeId: { type: 'string' },
                duration: { type: 'string' },
                trilha: { type: 'string' },
                documents: {
                  type: 'array',
                  items: { type: 'string' }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, getVideoByIdHandler);

  // Atualizar vídeo
  fastify.put('/:id', {
    schema: {
      params: videoIdParamSchema,
      body: updateVideoBodySchema,
      headers: authorizationHeadersSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                youtubeId: { type: 'string' },
                duration: { type: 'string' },
                trilha: { type: 'string' },
                documents: {
                  type: 'array',
                  items: { type: 'string' }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, updateVideoHandler);

  // Deletar vídeo
  fastify.delete('/:id', {
    schema: {
      params: videoIdParamSchema,
      headers: authorizationHeadersSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, deleteVideoHandler);
}