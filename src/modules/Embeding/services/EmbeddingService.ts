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
      const embeddingResponse = await this.generateEmbedding(data.text);

      console.log(embeddingResponse);

      const result = await this.qdrantProvider.addDocument(
        data.text,
        data.provaId,
        data.tipoProva,
        data.numeroQuestao,
        embeddingResponse.embedding,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add document to Qdrant');
    }
  }

  private async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const embeddingApiUrl =
      process.env.EMBEDDING_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${embeddingApiUrl}/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Embedding API Error - Status: ${response.status}, Response: ${errorText}`);
        throw new Error(
          `Embedding API responded with status: ${response.status} - ${errorText}`,
        );
      }

      return (await response.json()) as EmbeddingResponse;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }
}

export class SearchDocumentService {
  constructor(private qdrantProvider: QdrantProvider) { }

  async execute(data: SearchDocumentDTO): Promise<SearchResult[]> {
    try {
      const embeddingResponse = await this.generateEmbedding(data.query);

      const searchResult = (await this.qdrantProvider.searchDocuments(
        embeddingResponse.embedding,
        data.tipoProva,
        data.numeroQuestao,
        data.limit || 10,
      )) as QdrantSearchResult;

      if (searchResult.status === 'collection_not_found') {
        return [];
      }

      return (
        searchResult.result?.map(item => ({
          id: item.id,
          score: item.score,
          payload: item.payload,
        })) || []
      );
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  private async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const embeddingApiUrl =
      process.env.EMBEDDING_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${embeddingApiUrl}/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Embedding API Error - Status: ${response.status}, Response: ${errorText}`);
        throw new Error(
          `Embedding API responded with status: ${response.status} - ${errorText}`,
        );
      }

      return (await response.json()) as EmbeddingResponse;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }
}
