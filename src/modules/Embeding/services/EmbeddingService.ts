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
    payload?: {
      provaId: string;
      tipoProva: string;
      numeroQuestao: number;
      text: string;
      createdAt: string;
    };
  }>;
}

interface QdrantDirectResult extends Array<{
  id: string | number;
  score: number;
  payload?: {
    provaId: string;
    tipoProva: string;
    numeroQuestao: number;
    text: string;
    createdAt: string;
  };
}> {}

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

      const searchResult = await this.qdrantProvider.searchDocuments(
        embeddingResponse.embedding,
        data.tipoProva,
        data.numeroQuestao,
        data.limit || 10,
      );

      // Verificar se é um erro de coleção não encontrada
      if ((searchResult as any).status === 'collection_not_found') {
        return [];
      }

      // Determinar se a resposta tem a propriedade result ou é um array direto
      let resultsArray: any[] = [];
      
      if (Array.isArray(searchResult)) {
        // Formato direto (array)
        resultsArray = searchResult;
      } else if ((searchResult as any).result && Array.isArray((searchResult as any).result)) {
        // Formato com propriedade result
        resultsArray = (searchResult as any).result;
      } else {
        console.warn('Unexpected search result format:', searchResult);
        return [];
      }

      const processedResults = resultsArray.map(item => {
        // Se não há payload, criar um payload padrão baseado nos dados disponíveis
        const payload = item.payload || {
          provaId: data.provaId,
          tipoProva: data.tipoProva,
          numeroQuestao: data.numeroQuestao,
          text: '',
          createdAt: new Date().toISOString(),
        };

        return {
          id: item.id,
          score: item.score,
          payload: payload,
        };
      });

      return processedResults;
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
