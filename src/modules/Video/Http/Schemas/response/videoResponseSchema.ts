export const videoResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['_id', 'title', 'description', 'youtubeId', 'duration', 'trilha', 'documents', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          youtubeId: { type: 'string' },
          duration: { type: 'string' },
          trilha: { type: 'string' },
          documents: {
            type: 'array',
            items: { type: 'string' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        additionalProperties: false
      },
      message: { type: 'string' }
    },
    additionalProperties: false
  },
  201: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['_id', 'title', 'description', 'youtubeId', 'duration', 'trilha', 'documents', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          youtubeId: { type: 'string' },
          duration: { type: 'string' },
          trilha: { type: 'string' },
          documents: {
            type: 'array',
            items: { type: 'string' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        additionalProperties: false
      },
      message: { type: 'string' }
    },
    additionalProperties: false
  },
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  401: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  403: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  404: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  }
};

export const videoListResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'title', 'description', 'youtubeId', 'duration', 'trilha', 'documents', 'createdAt', 'updatedAt'],
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            youtubeId: { type: 'string' },
            duration: { type: 'string' },
            trilha: { type: 'string' },
            documents: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          additionalProperties: false
        }
      },
      message: { type: 'string' }
    },
    additionalProperties: false
  }
};

export const videoDeleteResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'message'],
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    },
    additionalProperties: false
  }
};