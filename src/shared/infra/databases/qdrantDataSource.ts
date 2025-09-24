import { config } from 'dotenv';

config();

class QdrantDataSource {
  private baseUrl: string | null = null;
  private isConnected = false;

  async initialize(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const host = process.env.QDRANT_HOST || 'localhost';
    const apiKey = process.env.QDRANT_API_KEY;

    const isExternalHost =
      !host.includes('localhost') &&
      !host.includes('127.0.0.1') &&
      !host.includes('192.168.');

    this.baseUrl = isExternalHost
      ? `https://${host}`
      : `http://${host}:${process.env.QDRANT_PORT || 6333}`;

    console.log(`Attempting to connect to Qdrant at: ${this.baseUrl}`);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey && apiKey.trim() !== '') {
        headers['Authorization'] = `Bearer ${apiKey}`;
        console.log('Using API key for Qdrant authentication');
      } else {
        console.log('No API key provided for Qdrant');
      }

      const response = await fetch(`${this.baseUrl}/collections`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Qdrant connection failed - Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      await response.json();

      this.isConnected = true;
      console.log('Successfully connected to Qdrant');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      console.error('Failed to initialize Qdrant connection:', errorMessage);
      this.baseUrl = null;
      this.isConnected = false;
      throw error; // Re-throw to propagate the error
    }
  }

  async destroy(): Promise<void> {
    if (this.baseUrl) {
      this.baseUrl = null;
      this.isConnected = false;
    }
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<unknown> {
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

    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Making Qdrant request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Qdrant request failed - Status: ${response.status}, URL: ${url}, Response: ${errorText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
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

  async createCollection(
    name: string,
    vectorSize: number,
    distance: 'Cosine' | 'Euclid' | 'Dot' = 'Cosine',
  ) {
    const body = {
      vectors: {
        size: vectorSize,
        distance,
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
      points,
    };

    return await this.makeRequest(`/collections/${collectionName}/points`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async searchPoints(
    collectionName: string,
    vector: number[],
    limit: number = 10,
    filter?: unknown,
  ) {
    const body: { 
      vector: number[]; 
      limit: number; 
      with_payload: boolean;
      filter?: unknown;
    } = {
      vector,
      limit,
      with_payload: true, // Garantir que o payload seja retornado
    };

    if (filter) {
      body.filter = filter;
    }

    return await this.makeRequest(
      `/collections/${collectionName}/points/search`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
}

export const qdrantDataSource = new QdrantDataSource();
