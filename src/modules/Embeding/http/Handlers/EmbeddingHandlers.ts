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
    console.log('Request Body:', request.body);

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
    console.error('Error in addDocumentHandler:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Determinar o status code baseado no tipo de erro
    let statusCode = 500;
    if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      statusCode = 400;
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      statusCode = 401;
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      statusCode = 404;
    } else if (errorMessage.includes('Embedding API')) {
      statusCode = 502; // Bad Gateway - problema com serviço externo
    }

    return reply.status(statusCode).send({
      success: false,
      error: statusCode === 500 ? 'Internal Server Error' : 'Service Error',
      message: statusCode === 500 ? 'Failed to add document to vector database' : errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
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
    console.error('Error in searchDocumentHandler:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Determinar o status code baseado no tipo de erro
    let statusCode = 500;
    if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      statusCode = 400;
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      statusCode = 401;
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      statusCode = 404;
    } else if (errorMessage.includes('Embedding API')) {
      statusCode = 502; // Bad Gateway - problema com serviço externo
    }

    return reply.status(statusCode).send({
      success: false,
      error: statusCode === 500 ? 'Internal Server Error' : 'Service Error',
      message: statusCode === 500 ? 'Failed to search documents in vector database' : errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}
