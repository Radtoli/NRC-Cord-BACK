import { DataSource, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { IDocumentRepository } from "../model/IDocumentRepositorie";
import { Document } from "../../infra/databases/Entititities";

export class DocumentRepository implements IDocumentRepository {
  private ormRepository: MongoRepository<Document>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Document);
  }

  public async findById(id: string): Promise<any | null> {
    try {
      const objectId = new ObjectId(id);
      const document = await this.ormRepository.findOne({ where: { _id: objectId } });
      return document || null;
    } catch (error) {
      console.error('Error finding document by ID:', error);
      return null;
    }
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
    try {
      const objectId = new ObjectId(id);
      await this.ormRepository.update(objectId, data);
      const updatedDocument = await this.findById(id);
      return updatedDocument;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }


  public async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.ormRepository.delete(objectId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}