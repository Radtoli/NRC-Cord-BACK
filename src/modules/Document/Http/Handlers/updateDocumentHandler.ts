import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { UpdateDocumentBodyType } from "../Schemas/body/updateDocumentBodySchema";
import { AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { DocumentIdParamType } from "../Schemas/params/documentIdParamSchema";
import { container } from "../../../../shared/infra/containers";
import { UpdateDocumentService } from "../../Services/UpdateDocumentService";
import { DocumentNotFoundError, InvalidDocumentDataError } from "../../Errors/DocumentErrors";

export async function updateDocumentHandler(
  request: FastifyRequest<{
    Body: UpdateDocumentBodyType;
    Headers: AuthorizationHeadersType;
    Params: DocumentIdParamType;
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

    const updateDocumentService = container.resolve<UpdateDocumentService>('updateDocumentService');

    const documentId = new ObjectId(request.params.id);
    const updateData = {
      title: request.body.title,
      type: request.body.type as 'pdf' | 'doc' | 'ppt' | 'xlsx' | undefined,
      url: request.body.url,
      size: request.body.size,
      video: request.body.video ? new ObjectId(request.body.video) : undefined
    };

    const document = await updateDocumentService.execute(documentId, updateData);

    return reply.status(200).send({
      success: true,
      data: document,
      message: 'Document updated successfully'
    });

  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        message: error.message
      });
    }

    if (error instanceof InvalidDocumentDataError) {
      return reply.status(400).send({
        success: false,
        error: 'Bad Request',
        message: error.message
      });
    }

    console.error('UpdateDocumentHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Document update failed'
    });
  }
}