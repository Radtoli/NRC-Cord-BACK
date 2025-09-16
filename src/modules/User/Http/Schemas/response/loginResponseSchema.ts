export const loginResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['user', 'token', 'expiresIn'],
        properties: {
          user: {
            type: 'object',
            required: ['_id', 'name', 'email', 'roles', 'permissions'],
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              roles: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['user', 'manager']
                }
              },
              permissions: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            additionalProperties: false
          },
          token: { type: 'string' },
          expiresIn: { type: 'string' }
        },
        additionalProperties: false
      },
      message: { type: 'string' }
    },
    additionalProperties: false
  },
  401: {
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