export const documentResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['_id', 'title', 'type', 'url', 'size', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          type: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          size: { type: 'string' },
          video: { type: 'string' },
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
        required: ['_id', 'title', 'type', 'url', 'size', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          type: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          size: { type: 'string' },
          video: { type: 'string' },
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

export const documentListResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'title', 'type', 'url', 'size', 'createdAt', 'updatedAt'],
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            type: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            size: { type: 'string' },
            video: { type: 'string' },
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

export const documentDeleteResponseSchema = {
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