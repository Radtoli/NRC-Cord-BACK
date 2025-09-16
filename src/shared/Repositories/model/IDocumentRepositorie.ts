import { Document } from "../../infra/databases/Entititities/Document";

export interface IDocumentRepository {
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  create(data: Partial<Document>): Promise<any>;
  update(id: string, data: Partial<Document>): Promise<any>;
  delete(id: string): Promise<void>;
}