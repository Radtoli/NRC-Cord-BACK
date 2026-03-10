import { ObjectId } from 'mongodb';

export interface CreateTrilhaDTO {
  title: string;
  description?: string;
  videos?: ObjectId[];
  courseId?: string;
}

export interface UpdateTrilhaDTO {
  title?: string;
  description?: string;
  videos?: ObjectId[];
  courseId?: string;
}

export interface TrilhaResponseDTO {
  _id: ObjectId;
  title: string;
  description?: string;
  videos: ObjectId[];
  courseId?: string;
  createdAt: Date;
  updatedAt: Date;
}