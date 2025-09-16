import { ObjectId } from 'mongodb';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  demolayId: number;
  roles?: ('user' | 'manager')[];
  permissions?: string[];
  settings?: {
    theme: 'light' | 'dark';
    language: string;
  };
  createdBy: ObjectId;
}