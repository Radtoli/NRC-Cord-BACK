import { DataSource, MongoRepository } from "typeorm";
import { IUserRepository } from "../model/IUserRepository";
import { User } from "../../infra/databases/Entititities";

export class UserRepository implements IUserRepository {
  private ormRepository: MongoRepository<User>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(User);
  }

  public async findById(id: string): Promise<any | null> {
    const user = await this.ormRepository.findOne({ where: { id } });
    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user || null;
  }

  public async findByRole(role: string): Promise<User[]> {
    const users = await this.ormRepository.find({ where: { role } });
    return users;
  }

  public async findAll(): Promise<any[]> {
    const users = await this.ormRepository.find();
    return users;
  }

  public async create(data: Partial<User>): Promise<any> {
    const user = this.ormRepository.create(data);
    await this.ormRepository.save(user);
    return user;
  }

  public async update(id: string, data: Partial<User>): Promise<any> {
    await this.ormRepository.update(id, data);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}