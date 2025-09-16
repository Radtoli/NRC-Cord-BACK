import { Video } from "../../infra/databases/Entititities";

export interface IVIdeoRepository {
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  create(data: Partial<Video>): Promise<any>;
  update(id: string, data: Partial<Video>): Promise<any>;
  delete(id: string): Promise<void>;
}