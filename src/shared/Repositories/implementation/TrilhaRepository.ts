import { DataSource, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { ITrilhaRepository } from "../model/ITrilhaRepositorie";
import { Trilha } from "../../infra/databases/Entititities";

export class TrilhaRepository implements ITrilhaRepository {
  private ormRepository: MongoRepository<Trilha>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Trilha);
  }

  /** Raw MongoDB collection — bypasses TypeORM entity hydration entirely */
  private get col() {
    return (this.mongoDataSource.driver as any).queryRunner.getCollection('trilhas');
  }

  public async findById(id: string): Promise<any | null> {
    try {
      return await this.col.findOne({ _id: new ObjectId(id) }) ?? null;
    } catch {
      return null;
    }
  }

  public async findAll(): Promise<any[]> {
    return await this.col.find().toArray();
  }

  public async create(data: Partial<Trilha>): Promise<any> {
    // Use ORM only for creation so TypeORM generates _id and timestamps
    const trilha = this.ormRepository.create(data);
    await this.ormRepository.save(trilha);
    return this.findById(trilha._id.toString());
  }

  public async update(id: string, data: Partial<Trilha>): Promise<any> {
    const setFields: Record<string, unknown> = {};
    if (data.title !== undefined) setFields['title'] = data.title;
    if (data.description !== undefined) setFields['description'] = data.description;
    if (data.videos !== undefined) setFields['videos'] = data.videos;
    // 'in' check so courseId: null explicitly clears the link
    if ('courseId' in data) setFields['courseId'] = data.courseId ?? null;
    setFields['updatedAt'] = new Date();

    await this.col.updateOne(
      { _id: new ObjectId(id) },
      { $set: setFields },
    );

    return this.findById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.col.deleteOne({ _id: new ObjectId(id) });
  }
}
