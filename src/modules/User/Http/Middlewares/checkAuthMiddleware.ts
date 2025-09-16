import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { container } from '../../../../shared/infra/containers';
import { UserRepository } from '../../../../shared/Repositories/implementation/UserRepository';
import { AuthenticatedUser, AuthenticatedRequest } from '../../Types/AuthTypes';

interface JWTPayload {
  userId: string;
  email: string;
}

// Estender o tipo do FastifyRequest para incluir o usuário autenticado
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

/**
 * Middleware que verifica se o usuário está autenticado
 */
export async function checkAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Buscar o usuário no banco de dados
    const userRepository = container.resolve<UserRepository>('userRepository');
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    if (user.status !== 'active') {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User account is not active'
      });
    }

    request.user = {
      _id: user._id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid access token'
      });
    }

    console.error('Auth middleware error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Middleware que verifica se o usuário tem permissões específicas
 */
export function checkPermissionMiddleware(requiredPermissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const userPermissions = request.user.permissions;
    const userRoles = request.user.roles;

    // Verificar se o usuário tem pelo menos uma das permissões necessárias
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    // Verificar se o usuário tem role de manager (acesso total)
    const isManager = userRoles.includes('manager');

    if (!hasPermission && !isManager) {
      return reply.status(403).send({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions to perform this action'
      });
    }
  };
}

/**
 * Middleware que verifica se o usuário tem um role específico
 */
export function checkRoleMiddleware(requiredRoles: ('user' | 'manager')[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const userRoles = request.user.roles;
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return reply.status(403).send({
        success: false,
        error: 'Forbidden',
        message: `Required role: ${requiredRoles.join(' or ')}`
      });
    }
  };
}

/**
 * Middleware combinado que verifica autenticação e permissões
 */
export function requirePermissions(permissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Primeiro verificar autenticação
    await checkAuthMiddleware(request, reply);

    // Se passou na autenticação, verificar permissões
    if (!reply.sent) {
      await checkPermissionMiddleware(permissions)(request, reply);
    }
  };
}

/**
 * Middleware combinado que verifica autenticação e roles
 */
export function requireRoles(roles: ('user' | 'manager')[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Primeiro verificar autenticação
    await checkAuthMiddleware(request, reply);

    // Se passou na autenticação, verificar roles
    if (!reply.sent) {
      await checkRoleMiddleware(roles)(request, reply);
    }
  };
}
