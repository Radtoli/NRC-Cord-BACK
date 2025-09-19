export const addDocumentBodySchema = {
  type: 'object',
  required: ['text', 'provaId', 'tipoProva', 'numeroQuestao'],
  properties: {
    text: {
      type: 'string',
      minLength: 1,
      maxLength: 10000,
    },
    provaId: {
      type: 'string',
      minLength: 1,
    },
    tipoProva: {
      type: 'string',
      minLength: 1,
    },
    numeroQuestao: {
      type: 'number',
      minimum: 1,
    },
  },
} as const;

export const searchDocumentBodySchema = {
  type: 'object',
  required: ['query', 'provaId', 'tipoProva', 'numeroQuestao'],
  properties: {
    query: {
      type: 'string',
      minLength: 1,
      maxLength: 1000,
    },
    provaId: {
      type: 'string',
      minLength: 1,
    },
    tipoProva: {
      type: 'string',
      minLength: 1,
    },
    numeroQuestao: {
      type: 'number',
      minimum: 1,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 50,
      default: 10,
    },
  },
} as const;

export type AddDocumentBodyType = {
  text: string;
  provaId: string;
  tipoProva: string;
  numeroQuestao: number;
};

export type SearchDocumentBodyType = {
  query: string;
  provaId: string;
  tipoProva: string;
  numeroQuestao: number;
  limit?: number;
};
