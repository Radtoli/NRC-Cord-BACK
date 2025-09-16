import { Trilha } from "../../infra/databases/Entititities";

export interface ITrilhaRepository {
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  create(data: Partial<Trilha>): Promise<any>;
  update(id: string, data: Partial<Trilha>): Promise<any>;
  delete(id: string): Promise<void>;
}