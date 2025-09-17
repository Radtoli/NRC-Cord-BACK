import { DataSource, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { IUserRepository } from "../model/IUserRepository";
import { User } from "../../infra/databases/Entititities";

export class UserRepository implements IUserRepository {
  private ormRepository: MongoRepository<User>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(User);
  }

  public async findById(id: string): Promise<any | null> {
    try {
      const objectId = new ObjectId(id);
      const user = await this.ormRepository.findOne({ where: { _id: objectId } });
      return user || null;
    } catch (error) {
      return null;
    }
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
    try {
      const objectId = new ObjectId(id);

      const result = await this.ormRepository.update(objectId, data);

      const updatedUser = await this.findById(id);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.ormRepository.delete(objectId);
    } catch (error) {
      throw error;
    }
  }
}