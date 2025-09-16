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

export async function trilhaRoutes(fastify: FastifyInstance) {
  // Aplicar middleware de autenticação e autorização para todas as rotas
  fastify.addHook('preHandler', checkAuthMiddleware);
  fastify.addHook('preHandler', requireRoles(['manager'])); // Apenas admin/manager

  // Criar trilha
  fastify.post('/', {
    schema: {
      body: createTrilhaBodySchema,
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
                videos: {
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
  }, createTrilhaHandler);

  // Listar trilhas
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
                  videos: {
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
  }, listTrilhasHandler);

  // Buscar trilha por ID
  fastify.get('/:id', {
    schema: {
      params: trilhaIdParamSchema,
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
                videos: {
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
  }, getTrilhaByIdHandler);

  // Atualizar trilha
  fastify.put('/:id', {
    schema: {
      params: trilhaIdParamSchema,
      body: updateTrilhaBodySchema,
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
                videos: {
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
  }, updateTrilhaHandler);

  // Deletar trilha
  fastify.delete('/:id', {
    schema: {
      params: trilhaIdParamSchema,
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
  }, deleteTrilhaHandler);
}