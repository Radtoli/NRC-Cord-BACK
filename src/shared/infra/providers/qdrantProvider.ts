import { qdrantDataSource } from '../databases/qdrantDataSource';

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
  ) {
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

    const point: QdrantPoint = {
      id: `${provaId}_${Date.now()}`,
      vector: embedding,
      payload: {
        provaId,
        tipoProva,
        numeroQuestao,
        text,
        createdAt: new Date().toISOString(),
      } as DocumentPayload,
    };

    return await qdrantDataSource.upsertPoints(collectionName, [point]);
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
