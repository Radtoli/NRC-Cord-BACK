import { FastifyReply, FastifyRequest } from "fastify";
import { ObjectId } from "mongodb";
import { CreateUserBodyType } from "../Schemas/body/createUserBodySchema";
import { AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { CreateUserService } from "../../Services/CreateUserService";
import { UserAlreadyExistsError, InvalidUserDataError } from "../../Errors/UserErrors";

interface IRequest extends FastifyRequest {
  Body: CreateUserBodyType;
  Headers: AuthorizationHeadersType;
}

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserBodyType;
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply
) {
  try {
    const body = request.body;
    const currentUser = request.user; // Usuário autenticado vem do middleware

    if (!currentUser) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const createUserService = container.resolve<CreateUserService>('createUserService');

    // Converter body para DTO usando dados do usuário autenticado
    const createUserData = {
      name: body.name,
      email: body.email,
      password: body.password,
      demolayId: body.demolayId,
      roles: body.roles,
      permissions: body.permissions,
      settings: body.settings,
      createdBy: currentUser._id
    };

    const user = await createUserService.execute(createUserData, currentUser._id);

    return reply.status(201).send({
      success: true,
      data: user,
      message: 'User created successfully'
    });

  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        success: false,
        error: 'Conflict',
        message: error.message
      });
    }

    if (error instanceof InvalidUserDataError) {
      return reply.status(400).send({
        success: false,
        error: 'Bad Request',
        message: error.message
      });
    }

    // Erro interno do servidor
    console.error('CreateUserHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
}