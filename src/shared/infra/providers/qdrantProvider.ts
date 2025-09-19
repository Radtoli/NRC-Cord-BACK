import { qdrantDataSource } from '../databases/qdrantDataSource';
import { randomUUID } from 'crypto';

export interface QdrantPoint {
  id?: string | number;
  vector: number[];
  payload?: Record<string, unknown>;
}

export interface DocumentPayload {
  provaId: string;
  tipoProva: string;
  numeroQuestao: number;
  text: string;
  originalId?: string;
  [key: string]: unknown;
}

export class QdrantProvider {
  constructor() {
    qdrantDataSource.initialize();
  }

  async addDocument(
    text: string,
    provaId: string,
    tipoProva: string,
    numeroQuestao: number,
    embedding: number[],
  ): Promise<{ success: boolean; id: string }> {
    const collectionName = `${tipoProva}_q${numeroQuestao}`;

    if (!qdrantDataSource.isInitialized) {
      await qdrantDataSource.initialize();
    }

    if (!(await qdrantDataSource.collectionExists(collectionName))) {
      const vectorSize = embedding.length || 1536;
      await qdrantDataSource.createCollection(
        collectionName,
        vectorSize,
        'Cosine',
      );
    }

    const documentId = randomUUID();

    const point: QdrantPoint = {
      id: documentId,
      vector: embedding,
      payload: {
        provaId,
        tipoProva,
        numeroQuestao,
        text,
        createdAt: new Date().toISOString(),
        originalId: `${provaId}_${Date.now()}`,
      } as DocumentPayload,
    };

    await qdrantDataSource.upsertPoints(collectionName, [point]);

    return {
      success: true,
      id: documentId,
    };
  }

  async searchDocuments(
    queryEmbedding: number[],
    tipoProva: string,
    numeroQuestao: number,
    limit = 10,
  ) {
    const collectionName = `${tipoProva}_q${numeroQuestao}`;

    if (!qdrantDataSource.isInitialized) {
      await qdrantDataSource.initialize();
    }

    if (!(await qdrantDataSource.collectionExists(collectionName))) {
      return { result: [], status: 'collection_not_found' };
    }

    return await qdrantDataSource.searchPoints(
      collectionName,
      queryEmbedding,
      limit,
    );
  }
}
