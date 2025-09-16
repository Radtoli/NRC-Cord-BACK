export const userResponseSchema = {
  200: {
    type: 'object',
    required: ['success', 'data', 'message'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['_id', 'name', 'email', 'demolayId', 'roles', 'permissions', 'status', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          demolayId: { type: 'number' },
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
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'blocked']
          },
          lastLogin: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          settings: {
            type: 'object',
            properties: {
              theme: { type: 'string', enum: ['light', 'dark'] },
              language: { type: 'string' }
            }
          },
          meta: {
            type: 'object',
            properties: {
              createdBy: { type: 'string' },
              updatedBy: { type: 'string' },
              lastCheatCheckAt: { type: 'string', format: 'date-time' },
              loginCount: { type: 'number' },
              amountOfCheatChecks: { type: 'number' }
            }
          }
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
        required: ['_id', 'name', 'email', 'demolayId', 'roles', 'permissions', 'status', 'createdAt', 'updatedAt'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          demolayId: { type: 'number' },
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
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'blocked']
          },
          lastLogin: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          settings: {
            type: 'object',
            properties: {
              theme: { type: 'string', enum: ['light', 'dark'] },
              language: { type: 'string' }
            }
          },
          meta: {
            type: 'object',
            properties: {
              createdBy: { type: 'string' },
              updatedBy: { type: 'string' },
              lastCheatCheckAt: { type: 'string', format: 'date-time' },
              loginCount: { type: 'number' },
              amountOfCheatChecks: { type: 'number' }
            }
          }
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

export const changePasswordResponseSchema = {
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