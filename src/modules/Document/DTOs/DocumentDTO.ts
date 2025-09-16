import { ObjectId } from 'mongodb';

export interface CreateDocumentDTO {
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'xlsx';
  url: string;
  size: string;
  video: ObjectId;
}

export interface UpdateDocumentDTO {
  title?: string;
  type?: 'pdf' | 'doc' | 'ppt' | 'xlsx';
  url?: string;
  size?: string;
  video?: ObjectId;
}

export interface DocumentResponseDTO {
  _id: ObjectId;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'xlsx';
  url: string;
  size: string;
  video: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}