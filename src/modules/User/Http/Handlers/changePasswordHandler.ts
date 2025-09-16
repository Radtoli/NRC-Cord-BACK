import { FastifyRequest, FastifyReply } from "fastify";
import { ChangePasswordBodyType } from "../Schemas/body/changePasswordBodySchema";
import { AuthorizationHeadersType } from "../Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { ChangePasswordService } from "../../Services/ChangePasswordService";
import { InvalidPasswordError, UserNotFoundError, InvalidUserDataError } from "../../Errors/UserErrors";

export async function changePasswordHandler(
  request: FastifyRequest<{
    Body: ChangePasswordBodyType;
    Headers: AuthorizationHeadersType;
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

    const changePasswordService = container.resolve<ChangePasswordService>('changePasswordService');

    const changePasswordData = {
      currentPassword: request.body.currentPassword,
      newPassword: request.body.newPassword,
      userId: currentUser._id
    };

    await changePasswordService.execute(changePasswordData);

    return reply.status(200).send({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    if (error instanceof InvalidPasswordError) {
      return reply.status(400).send({
        success: false,
        error: 'Bad Request',
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

    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        message: error.message
      });
    }

    console.error('ChangePasswordHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Password change failed'
    });
  }
}