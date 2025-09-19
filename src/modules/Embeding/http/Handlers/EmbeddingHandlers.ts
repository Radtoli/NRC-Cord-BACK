import { FastifyRequest, FastifyReply } from 'fastify';
import {
  AddDocumentBodyType,
  SearchDocumentBodyType,
} from '../Schemas/EmbeddingSchemas';
import { AuthorizationHeadersType } from '../../../User/Http/Schemas/Header/authorizationHeadersSchema';
import { container } from '../../../../shared/infra/containers';
import {
  AddDocumentService,
  SearchDocumentService,
} from '../../services/EmbeddingService';

export async function addDocumentHandler(
  request: FastifyRequest<{
    Body: AddDocumentBodyType;
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply,
) {
  try {
    const addDocumentService =
      container.resolve<AddDocumentService>('addDocumentService');

    const result = await addDocumentService.execute({
      text: request.body.text,
      provaId: request.body.provaId,
      tipoProva: request.body.tipoProva,
      numeroQuestao: request.body.numeroQuestao,
    });

    return reply.status(201).send({
      success: true,
      data: result,
      message: 'Document added successfully to vector database',
    });
  } catch (error) {
    console.error('AddDocumentHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to add document to vector database',
    });
  }
}

export async function searchDocumentHandler(
  request: FastifyRequest<{
    Body: SearchDocumentBodyType;
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply,
) {
  try {
    const searchDocumentService = container.resolve<SearchDocumentService>(
      'searchDocumentService',
    );

    const results = await searchDocumentService.execute({
      query: request.body.query,
      provaId: request.body.provaId,
      tipoProva: request.body.tipoProva,
      numeroQuestao: request.body.numeroQuestao,
      limit: request.body.limit || 10,
    });

    return reply.status(200).send({
      success: true,
      data: results,
      message: `Found ${results.length} similar documents`,
    });
  } catch (error) {
    console.error('SearchDocumentHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to search documents in vector database',
    });
  }
}
