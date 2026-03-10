import { DataSource, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { ITrilhaRepository } from "../model/ITrilhaRepositorie";
import { Trilha } from "../../infra/databases/Entititities";

export class TrilhaRepository implements ITrilhaRepository {
  private ormRepository: MongoRepository<Trilha>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Trilha);
  }

  public async findById(id: string): Promise<any | null> {
    try {
      const trilha = await this.ormRepository.findOne({
        where: { _id: new ObjectId(id) } as any,
      });
      return trilha || null;
    } catch {
      return null;
    }
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
    const existing = await this.ormRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });

    if (!existing) return null;

    // Merge fields; use 'in' check so courseId: null explicitly clears the field
    if (data.title !== undefined) existing.title = data.title;
    if (data.description !== undefined) existing.description = data.description;
    if (data.videos !== undefined) existing.videos = data.videos;
    if ('courseId' in data) existing.courseId = (data.courseId as string | null | undefined) ?? undefined;

    await this.ormRepository.save(existing);
    return this.findById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.deleteOne({ _id: new ObjectId(id) });
  }
}