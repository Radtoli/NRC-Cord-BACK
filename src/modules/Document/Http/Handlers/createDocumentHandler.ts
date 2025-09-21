import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { CreateDocumentBodyType } from "../Schemas/body/createDocumentBodySchema";
import { AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { CreateDocumentService } from "../../Services/CreateDocumentService";
import { InvalidDocumentDataError } from "../../Errors/DocumentErrors";

export async function createDocumentHandler(
  request: FastifyRequest<{
    Body: CreateDocumentBodyType;
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

    const createDocumentService = container.resolve<CreateDocumentService>('createDocumentService');

    const createDocumentData = {
      title: request.body.title,
      type: request.body.type as 'pdf' | 'doc' | 'ppt' | 'xlsx',
      url: request.body.url,
      size: request.body.size,
      video: request.body.video ? new ObjectId(request.body.video) : undefined
    };

    const document = await createDocumentService.execute(createDocumentData);

    return reply.status(201).send({
      success: true,
      data: document,
      message: 'Document created successfully'
    });

  } catch (error) {
    if (error instanceof InvalidDocumentDataError) {
      return reply.status(400).send({
        success: false,
        error: 'Bad Request',
        message: error.message
      });
    }

    console.error('CreateDocumentHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Document creation failed'
    });
  }
}