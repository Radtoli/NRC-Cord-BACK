import { ObjectId } from 'mongodb';

export interface CreateTrilhaDTO {
  title: string;
  description?: string;
  videos?: ObjectId[];
}

export interface UpdateTrilhaDTO {
  title?: string;
  description?: string;
  videos?: ObjectId[];
}

export interface TrilhaResponseDTO {
  _id: ObjectId;
  title: string;
  description?: string;
  videos: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}