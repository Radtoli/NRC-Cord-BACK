import { ObjectId } from 'mongodb';

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  userId: ObjectId;
}