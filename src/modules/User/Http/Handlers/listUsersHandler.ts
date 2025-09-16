import { FastifyRequest, FastifyReply } from "fastify";
import { AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { ListUsersService } from "../../Services/ListUsersService";

export async function listUsersHandler(
  _request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply
) {
  try {
    const listUsersService = container.resolve<ListUsersService>('listUsersService');

    const result = await listUsersService.execute();

    return reply.status(200).send({
      success: true,
      data: result,
      message: "Users listed successfully"
    });
  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
}

export async function getUserByIdHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const listUsersService = container.resolve<ListUsersService>('listUsersService');

    const result = await listUsersService.executeById(id);

    return reply.status(200).send({
      success: true,
      data: result,
      message: "User found successfully"
    });
  } catch (error: any) {
    if (error.message.includes('User not found')) {
      return reply.status(404).send({
        success: false,
        message: "User not found",
        data: null
      });
    }

    return reply.status(500).send({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
}