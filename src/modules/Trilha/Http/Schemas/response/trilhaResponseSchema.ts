export const trilhaResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['_id', 'title', 'description', 'videos', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          videos: {
            type: 'array',
            items: { type: 'string' }
          },
          courseId: { type: 'string', nullable: true },
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
        required: ['_id', 'title', 'description', 'videos', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          videos: {
            type: 'array',
            items: { type: 'string' }
          },
          courseId: { type: 'string', nullable: true },
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

export const trilhaListResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'title', 'description', 'videos', 'createdAt', 'updatedAt'],
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            videos: {
              type: 'array',
              items: { type: 'string' }
            },
            courseId: { type: 'string', nullable: true },
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

export const trilhaDeleteResponseSchema = {
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