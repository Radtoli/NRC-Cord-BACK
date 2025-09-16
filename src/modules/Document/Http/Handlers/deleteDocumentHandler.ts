import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { DocumentIdParamType } from "../Schemas/params/documentIdParamSchema";
import { container } from "../../../../shared/infra/containers";
import { DeleteDocumentService } from "../../Services/DeleteDocumentService";
import { DocumentNotFoundError } from "../../Errors/DocumentErrors";

export async function deleteDocumentHandler(
  request: FastifyRequest<{
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

    const deleteDocumentService = container.resolve<DeleteDocumentService>('deleteDocumentService');

    const documentId = new ObjectId(request.params.id);
    await deleteDocumentService.execute(documentId);

    return reply.status(200).send({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    if (error instanceof DocumentNotFoundError) {
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        message: error.message
      });
    }

    console.error('DeleteDocumentHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Document deletion failed'
    });
  }
}