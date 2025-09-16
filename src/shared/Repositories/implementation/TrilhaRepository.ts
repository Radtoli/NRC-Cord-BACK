import { DataSource, MongoRepository } from "typeorm";
import { ITrilhaRepository } from "../model/ITrilhaRepositorie";
import { Trilha } from "../../infra/databases/Entititities";

export class TrilhaRepository implements ITrilhaRepository {
  private ormRepository: MongoRepository<Trilha>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Trilha);
  }

  public async findById(id: string): Promise<any | null> {
    const trilha = await this.ormRepository.findOne({ where: { id } });
    return trilha || null;
  }

  public async findAll(): Promise<any[]> {
    const trilhas = await this.ormRepository.find();
    return trilhas;
  }

  public async create(data: Partial<Trilha>): Promise<any> {
    const trilha = this.ormRepository.create(data);
    await this.ormRepository.save(trilha);
    return trilha;
  }

  public async update(id: string, data: Partial<Trilha>): Promise<any> {
    await this.ormRepository.update(id, data);
    const updatedTrilha = await this.findById(id);
    return updatedTrilha;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}