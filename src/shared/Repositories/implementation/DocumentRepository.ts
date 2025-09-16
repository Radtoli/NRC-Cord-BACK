import { DataSource, MongoRepository } from "typeorm";
import { IDocumentRepository } from "../model/IDocumentRepositorie";
import { Document } from "../../infra/databases/Entititities";

export class DocumentRepository implements IDocumentRepository {
  private ormRepository: MongoRepository<Document>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Document);
  }

  public async findById(id: string): Promise<any | null> {
    const document = await this.ormRepository.findOne({ where: { id } });
    return document || null;
  }

  public async findAll(): Promise<any[]> {
    const documents = await this.ormRepository.find();
    return documents;
  }


  public async create(data: Partial<Document>): Promise<any> {
    const document = this.ormRepository.create(data);
    await this.ormRepository.save(document);
    return document;
  }


  public async update(id: string, data: Partial<Document>): Promise<any> {
    await this.ormRepository.update(id, data);
    const updatedDocument = await this.findById(id);
    return updatedDocument;
  }


  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}