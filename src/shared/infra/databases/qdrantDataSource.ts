import { config } from 'dotenv';

config();

class QdrantDataSource {
  private baseUrl: string | null = null;
  private isConnected = false;

  async initialize(): Promise<void> {
    if (this.isConnected) {
      console.log('Qdrant já está conectado');
      return;
    }

    const host = process.env.QDRANT_HOST || 'localhost';
    const apiKey = process.env.QDRANT_API_KEY;

    // Detecta se é um host externo (Railway, etc.)
    const isExternalHost = !host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('192.168.');

    // URL baseada no teste que funcionou
    this.baseUrl = isExternalHost ? `https://${host}` : `http://${host}:${process.env.QDRANT_PORT || 6333}`;

    try {
      console.log(`Conectando ao Qdrant em: ${this.baseUrl}`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adiciona API key se fornecida
      if (apiKey && apiKey.trim() !== '') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/collections`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000), // 30 segundos de timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      await response.json();

      this.isConnected = true;
      console.log(`✅ Qdrant conectado com sucesso`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.warn(`⚠️  Falha ao conectar com Qdrant: ${errorMessage}. Serviço continuará sem funcionalidades de embeddings.`);
      this.baseUrl = null;
      this.isConnected = false;
    }
  }

  async destroy(): Promise<void> {
    if (this.baseUrl) {
      this.baseUrl = null;
      this.isConnected = false;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.baseUrl || !this.isConnected) {
      throw new Error('Qdrant não está inicializado ou conexão falhou.');
    }

    const apiKey = process.env.QDRANT_API_KEY;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (apiKey && apiKey.trim() !== '') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  get isInitialized(): boolean {
    return this.isConnected;
  }

  // Métodos utilitários para operações comuns
  async getCollections() {
    return await this.makeRequest('/collections');
  }

  async createCollection(name: string, vectorSize: number, distance: 'Cosine' | 'Euclid' | 'Dot' = 'Cosine') {
    const body = {
      vectors: {
        size: vectorSize,
        distance: distance,
      },
    };

    return await this.makeRequest(`/collections/${name}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async collectionExists(name: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.makeRequest(`/collections/${name}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async upsertPoints(collectionName: string, points: any[]) {
    const body = {
      points: points,
    };

    return await this.makeRequest(`/collections/${collectionName}/points`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async searchPoints(collectionName: string, vector: number[], limit: number = 10, filter?: any) {
    const body: any = {
      vector: vector,
      limit: limit,
    };

    if (filter) {
      body.filter = filter;
    }

    return await this.makeRequest(`/collections/${collectionName}/points/search`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const qdrantDataSource = new QdrantDataSource();