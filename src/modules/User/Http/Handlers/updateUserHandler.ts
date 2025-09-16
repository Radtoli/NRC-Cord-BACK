import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { UpdateUserBodyType } from "../Schemas/body/updateUserBodySchema";
import { AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { UserIdParamType } from "../Schemas/params/userIdParamSchema";
import { container } from "../../../../shared/infra/containers";
import { UpdateUserService } from "../../Services/UpdateUserService";
import { UserNotFoundError, UserAlreadyExistsError, InvalidUserDataError } from "../../Errors/UserErrors";

export async function updateUserHandler(
  request: FastifyRequest<{
    Body: UpdateUserBodyType;
    Headers: AuthorizationHeadersType;
    Params: UserIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const currentUser = request.user;

    if (!currentUser) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const updateUserService = container.resolve<UpdateUserService>('updateUserService');

    const userId = new ObjectId(request.params.id);
    const updateData = {
      ...request.body,
      updatedBy: currentUser._id
    };

    const updatedUser = await updateUserService.execute(userId, updateData);

    return reply.status(200).send({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        message: error.message
      });
    }

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

    console.error('UpdateUserHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'User update failed'
    });
  }
}