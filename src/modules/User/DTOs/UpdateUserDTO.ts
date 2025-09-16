import { ObjectId } from 'mongodb';

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  demolayId?: number;
  roles?: ('user' | 'manager')[];
  permissions?: string[];
  status?: 'active' | 'inactive' | 'blocked';
  settings?: {
    theme: 'light' | 'dark';
    language: string;
  };
  updatedBy: ObjectId;
}