import { User } from "../../infra/databases/Entititities";

export interface IUserRepository {
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  findAll(): Promise<any[]>;
  create(data: Partial<User>): Promise<any>;
  update(id: string, data: Partial<User>): Promise<any>;
  delete(id: string): Promise<void>;
}