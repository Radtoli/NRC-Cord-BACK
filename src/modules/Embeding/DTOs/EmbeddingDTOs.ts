export interface AddDocumentDTO {
  text: string;
  provaId: string;
  tipoProva: string;
  numeroQuestao: number;
}

export interface SearchDocumentDTO {
  query: string;
  provaId: string;
  tipoProva: string;
  numeroQuestao: number;
  limit?: number;
}

export interface EmbeddingResponse {
  embedding: number[];
}

export interface SearchResult {
  id: string | number;
  score: number;
  payload: {
    provaId: string;
    tipoProva: string;
    numeroQuestao: number;
    text: string;
    createdAt: string;
  };
}
