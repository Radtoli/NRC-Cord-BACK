import { FastifyInstance } from "fastify";
import { createUserBodySchema, CreateUserBodyType } from "../Schemas/body/createUserBodySchema";
import { loginBodySchema, LoginBodyType } from "../Schemas/body/loginBodySchema";
import { changePasswordBodySchema, ChangePasswordBodyType } from "../Schemas/body/changePasswordBodySchema";
import { updateUserBodySchema, UpdateUserBodyType } from "../Schemas/body/updateUserBodySchema";
import { authorizationHeadersSchema, AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { userIdParamSchema, UserIdParamType } from "../Schemas/params/userIdParamSchema";
import { checkAuthMiddleware, requireRoles } from "../Middlewares/checkAuthMiddleware";
import { createUserHandler } from "../Handlers/createUserHandler";
import { loginUserHandler } from "../Handlers/loginUserHandler";
import { changePasswordHandler } from "../Handlers/changePasswordHandler";
import { updateUserHandler } from "../Handlers/updateUserHandler";

export async function userRouter(app: FastifyInstance) {
  // Health check
  app.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['Health'],
      summary: 'Check if the server is running',
    }
  }, async (_request, reply) => {
    return reply.status(200).send({ status: 'OK' });
  });

  // Login (público)
  app.post<{ Body: LoginBodyType }>('/auth/login', {
    schema: {
      description: 'User login',
      tags: ['Authentication'],
      summary: 'Login user',
      body: loginBodySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                token: { type: 'string' },
                expiresIn: { type: 'string' }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    }
  }, loginUserHandler);

  // Criar usuário (requer autenticação e role manager)
  app.post<{
    Body: CreateUserBodyType;
    Headers: AuthorizationHeadersType
  }>('/users', {
    schema: {
      description: 'Create a new user',
      tags: ['User'],
      summary: 'Create user (Admin only)',
      body: createUserBodySchema,
      headers: authorizationHeadersSchema,
    },
    preHandler: [requireRoles(['manager'])]
  }, createUserHandler);

  // Trocar senha (requer autenticação)
  app.patch<{
    Body: ChangePasswordBodyType;
    Headers: AuthorizationHeadersType
  }>('/auth/change-password', {
    schema: {
      description: 'Change user password',
      tags: ['Authentication'],
      summary: 'Change password',
      body: changePasswordBodySchema,
      headers: authorizationHeadersSchema,
    },
    preHandler: [checkAuthMiddleware]
  }, changePasswordHandler);

  // Atualizar usuário (requer autenticação e role manager)
  app.put<{
    Body: UpdateUserBodyType;
    Headers: AuthorizationHeadersType;
    Params: UserIdParamType;
  }>('/users/:id', {
    schema: {
      description: 'Update user information',
      tags: ['User'],
      summary: 'Update user (Admin only)',
      body: updateUserBodySchema,
      headers: authorizationHeadersSchema,
      params: userIdParamSchema,
    },
    preHandler: [requireRoles(['manager'])]
  }, updateUserHandler);

}