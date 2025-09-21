export const addDocumentResponseSchema = {
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          id: { type: 'string', format: 'uuid' },
        },
      },
      message: { type: 'string' },
    },
  },
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
  502: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
} as const;

export const searchDocumentResponseSchema = {
  200: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: ['string', 'number'] },
            score: { type: 'number' },
            payload: {
              type: 'object',
              properties: {
                provaId: { type: 'string' },
                tipoProva: { type: 'string' },
                numeroQuestao: { type: 'number' },
                text: { type: 'string' },
                createdAt: { type: 'string' },
                originalId: { type: 'string' },
              },
            },
          },
        },
      },
      message: { type: 'string' },
    },
  },
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
  502: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' },
    },
  },
} as const;
