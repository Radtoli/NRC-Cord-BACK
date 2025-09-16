import { FastifyInstance } from "fastify";
import { createUserBodySchema, CreateUserBodyType } from "../Schemas/body/createUserBodySchema";
import { loginBodySchema, LoginBodyType } from "../Schemas/body/loginBodySchema";
import { changePasswordBodySchema, ChangePasswordBodyType } from "../Schemas/body/changePasswordBodySchema";
import { updateUserBodySchema, UpdateUserBodyType } from "../Schemas/body/updateUserBodySchema";
import { authorizationHeadersSchema, AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { userIdParamSchema, UserIdParamType } from "../Schemas/params/userIdParamSchema";
import { loginResponseSchema } from "../Schemas/response/loginResponseSchema";
import {
  userResponseSchema,
  changePasswordResponseSchema
} from "../Schemas/response/userResponseSchema";
import { checkAuthMiddleware, requireRoles } from "../Middlewares/checkAuthMiddleware";
import { createUserHandler } from "../Handlers/createUserHandler";
import { loginUserHandler } from "../Handlers/loginUserHandler";
import { changePasswordHandler } from "../Handlers/changePasswordHandler";
import { updateUserHandler } from "../Handlers/updateUserHandler";
import { listUsersHandler, getUserByIdHandler } from "../Handlers/listUsersHandler";
import { deleteUserHandler } from "../Handlers/deleteUserHandler";

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
      response: loginResponseSchema
    }
  }, loginUserHandler);

  // Listar todos os usuários (apenas managers)
  app.get<{
    Headers: AuthorizationHeadersType;
  }>('/', {
    schema: {
      description: 'List all users',
      tags: ['User'],
      summary: 'List users (Admin only)',
      headers: authorizationHeadersSchema,
    },
    preHandler: [requireRoles(['manager'])]
  }, listUsersHandler);

  // Buscar usuário por ID (apenas managers)
  app.get<{
    Headers: AuthorizationHeadersType;
    Params: UserIdParamType;
  }>('/:id', {
    schema: {
      description: 'Get user by ID',
      tags: ['User'],
      summary: 'Get user (Admin only)',
      headers: authorizationHeadersSchema,
      params: userIdParamSchema,
    },
    preHandler: [requireRoles(['manager'])]
  }, getUserByIdHandler);

  // Criar usuário (requer autenticação e role manager)
  app.post<{
    Body: CreateUserBodyType;
    Headers: AuthorizationHeadersType
  }>('/', {
    schema: {
      description: 'Create a new user',
      tags: ['User'],
      summary: 'Create user (Admin only)',
      body: createUserBodySchema,
      headers: authorizationHeadersSchema,
      response: userResponseSchema
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
      response: changePasswordResponseSchema
    },
    preHandler: [checkAuthMiddleware]
  }, changePasswordHandler);

  // Atualizar usuário (requer autenticação e role manager)
  app.put<{
    Body: UpdateUserBodyType;
    Headers: AuthorizationHeadersType;
    Params: UserIdParamType;
  }>('/:id', {
    schema: {
      description: 'Update user information',
      tags: ['User'],
      summary: 'Update user (Admin only)',
      body: updateUserBodySchema,
      headers: authorizationHeadersSchema,
      params: userIdParamSchema,
      response: userResponseSchema
    },
    preHandler: [requireRoles(['manager'])]
  }, updateUserHandler);

  // Deletar usuário (requer autenticação e role manager)
  app.delete<{
    Headers: AuthorizationHeadersType;
    Params: UserIdParamType;
  }>('/:id', {
    schema: {
      description: 'Delete user',
      tags: ['User'],
      summary: 'Delete user (Admin only)',
      headers: authorizationHeadersSchema,
      params: userIdParamSchema,
    },
    preHandler: [requireRoles(['manager'])]
  }, deleteUserHandler);

}