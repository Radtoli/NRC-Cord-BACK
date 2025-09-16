import { FastifyRequest, FastifyReply } from "fastify";
import { LoginBodyType } from "../Schemas/body/loginBodySchema";
import { container } from "../../../../shared/infra/containers";
import { LoginUserService } from "../../Services/LoginUserService";
import { InvalidCredentialsError } from "../../Errors/UserErrors";

export async function loginUserHandler(
  request: FastifyRequest<{ Body: LoginBodyType }>,
  reply: FastifyReply
) {
  try {
    const loginUserService = container.resolve<LoginUserService>('loginUserService');

    const loginData = {
      email: request.body.email,
      password: request.body.password
    };

    const result = await loginUserService.execute(loginData);

    return reply.status(200).send({
      success: true,
      data: result,
      message: 'Login successful'
    });

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: error.message
      });
    }

    console.error('LoginUserHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Login failed'
    });
  }
}