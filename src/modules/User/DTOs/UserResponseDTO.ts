import { ObjectId } from 'mongodb';

export interface UserResponseDTO {
  _id: ObjectId;
  name: string;
  email: string;
  demolayId: number;
  roles: ('user' | 'manager')[];
  permissions: string[];
  status: 'active' | 'inactive' | 'blocked';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    theme: 'light' | 'dark';
    language: string;
  };
  meta: {
    createdBy: ObjectId;
    updatedBy: ObjectId;
    lastCheatCheckAt?: Date;
    loginCount: number;
    amountOfCheatChecks: number;
  };
}