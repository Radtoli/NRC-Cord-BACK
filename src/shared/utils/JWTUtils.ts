import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface JWTPayload {
  userId: string;
  email: string;
}

export class JWTUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Gera um token JWT para o usuário
   */
  static generateToken(userId: ObjectId, email: string): string {
    const payload: JWTPayload = {
      userId: userId.toString(),
      email
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    } as jwt.SignOptions);
  }

  /**
   * Verifica e decodifica um token JWT
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
  }

  /**
   * Decodifica um token sem verificar (útil para debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}