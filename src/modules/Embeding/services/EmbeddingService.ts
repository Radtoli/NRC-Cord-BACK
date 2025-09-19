import {
  AddDocumentDTO,
  SearchDocumentDTO,
  EmbeddingResponse,
  SearchResult,
} from '../DTOs/EmbeddingDTOs';
import { QdrantProvider } from '../../../shared/infra/providers/qdrantProvider';

interface QdrantSearchResult {
  status?: string;
  result?: Array<{
    id: string | number;
    score: number;
    payload: {
      provaId: string;
      tipoProva: string;
      numeroQuestao: number;
      text: string;
      createdAt: string;
    };
  }>;
}

export class AddDocumentService {
  constructor(private qdrantProvider: QdrantProvider) { }

  async execute(
    data: AddDocumentDTO,
  ): Promise<{ success: boolean; id: string }> {
    try {
      // Gerar embedding através da API do microserviço
      const embeddingResponse = await this.generateEmbedding(data.text);

      // Adicionar documento ao Qdrant
      await this.qdrantProvider.addDocument(
        data.text,
        data.provaId,
        data.tipoProva,
        data.numeroQuestao,
        embeddingResponse.embedding,
      );

      return {
        success: true,
        id: `${data.provaId}_${Date.now()}`,
      };
    } catch (error) {
      console.error('AddDocumentService Error:', error);
      throw new Error('Failed to add document to Qdrant');
    }
  }

  private async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const embeddingApiUrl =
      process.env.EMBEDDING_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${embeddingApiUrl}/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(
          `Embedding API responded with status: ${response.status}`,
        );
      }

      return (await response.json()) as EmbeddingResponse;
    } catch (error) {
      console.error('Embedding API Error:', error);
      throw new Error('Failed to generate embedding');
    }
  }
}

export class SearchDocumentService {
  constructor(private qdrantProvider: QdrantProvider) { }

  async execute(data: SearchDocumentDTO): Promise<SearchResult[]> {
    try {
      // Gerar embedding da query
      const embeddingResponse = await this.generateEmbedding(data.query);

      // Salvar a consulta como documento no Qdrant
      await this.qdrantProvider.addDocument(
        data.query,
        data.provaId,
        data.tipoProva,
        data.numeroQuestao,
        embeddingResponse.embedding,
      );

      // Buscar no Qdrant
      const searchResult = (await this.qdrantProvider.searchDocuments(
        embeddingResponse.embedding,
        data.tipoProva,
        data.numeroQuestao,
        data.limit || 10,
      )) as QdrantSearchResult;

      if (searchResult.status === 'collection_not_found') {
        return [];
      }

      // Mapear resultados para o formato esperado
      return (
        searchResult.result?.map(item => ({
          id: item.id,
          score: item.score,
          payload: item.payload,
        })) || []
      );
    } catch (error) {
      console.error('SearchDocumentService Error:', error);
      throw new Error('Failed to search documents');
    }
  }

  private async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const embeddingApiUrl =
      process.env.EMBEDDING_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${embeddingApiUrl}/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(
          `Embedding API responded with status: ${response.status}`,
        );
      }

      return (await response.json()) as EmbeddingResponse;
    } catch (error) {
      console.error('Embedding API Error:', error);
      throw new Error('Failed to generate embedding');
    }
  }
}
