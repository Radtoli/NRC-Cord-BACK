import { FastifyRequest, FastifyReply } from "fastify";
import { AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { DeleteUserService } from "../../Services/DeleteUserService";

export async function deleteUserHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const deleteUserService = container.resolve<DeleteUserService>('deleteUserService');

    await deleteUserService.execute(id);

    return reply.status(200).send({
      success: true,
      message: "User deleted successfully"
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