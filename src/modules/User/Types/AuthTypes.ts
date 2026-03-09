import { ObjectId } from 'mongodb';

export interface AuthenticatedUser {
  _id: ObjectId;
  email: string;
  roles: ('user' | 'manager' | 'corretor')[];
  permissions: string[];
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}